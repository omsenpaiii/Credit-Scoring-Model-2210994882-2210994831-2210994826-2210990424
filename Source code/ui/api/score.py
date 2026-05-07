from __future__ import annotations

import json
from functools import lru_cache
from http.server import BaseHTTPRequestHandler
from pathlib import Path
from typing import Any

import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


COLUMNS = [
    "checking_status",
    "duration_months",
    "credit_history",
    "purpose",
    "credit_amount",
    "savings_status",
    "employment_since",
    "installment_rate",
    "personal_status_sex",
    "other_debtors",
    "present_residence_since",
    "property_type",
    "age_years",
    "other_installment_plans",
    "housing",
    "existing_credits",
    "job",
    "num_liable_people",
    "telephone",
    "foreign_worker",
    "target",
]

NUMERIC_FIELDS = {
    "duration_months",
    "credit_amount",
    "installment_rate",
    "present_residence_since",
    "age_years",
    "existing_credits",
    "num_liable_people",
}

PUBLIC_FIELDS = {
    "checking_status",
    "duration_months",
    "credit_history",
    "purpose",
    "credit_amount",
    "savings_status",
    "employment_since",
    "installment_rate",
    "age_years",
    "housing",
}


def _data_path() -> Path:
    candidates = [
        Path("data/german_credit.data"),
        Path(__file__).resolve().parents[1] / "data" / "german_credit.data",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    raise FileNotFoundError("Could not locate data/german_credit.data")


def _load_rows() -> tuple[list[dict[str, Any]], np.ndarray]:
    rows: list[dict[str, Any]] = []
    target: list[int] = []
    with _data_path().open("r", encoding="utf-8") as handle:
        for line in handle:
            values = line.strip().split()
            if not values:
                continue
            row: dict[str, Any] = {}
            for column, value in zip(COLUMNS, values):
                if column == "target":
                    target.append(1 if value == "2" else 0)
                elif column in NUMERIC_FIELDS:
                    row[column] = float(value)
                else:
                    row[column] = value
            rows.append(row)
    return rows, np.asarray(target, dtype=int)


def _matrix(rows: list[dict[str, Any]], feature_names: list[str]) -> list[list[Any]]:
    return [[row[name] for name in feature_names] for row in rows]


def _defaults(rows: list[dict[str, Any]], feature_names: list[str]) -> dict[str, Any]:
    defaults: dict[str, Any] = {}
    for name in feature_names:
        values = [row[name] for row in rows]
        if name in NUMERIC_FIELDS:
            defaults[name] = float(np.median(values))
        else:
            counts: dict[str, int] = {}
            for value in values:
                counts[str(value)] = counts.get(str(value), 0) + 1
            defaults[name] = max(counts.items(), key=lambda item: item[1])[0]
    return defaults


@lru_cache(maxsize=1)
def _trained_model():
    rows, y = _load_rows()
    feature_names = [column for column in COLUMNS if column != "target"]
    numeric_indices = [index for index, name in enumerate(feature_names) if name in NUMERIC_FIELDS]
    categorical_indices = [index for index, name in enumerate(feature_names) if name not in NUMERIC_FIELDS]

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "num",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="median")),
                        ("scaler", StandardScaler()),
                    ]
                ),
                numeric_indices,
            ),
            (
                "cat",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="most_frequent")),
                        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
                    ]
                ),
                categorical_indices,
            ),
        ]
    )
    model = LogisticRegression(max_iter=1500, solver="lbfgs", class_weight="balanced", random_state=42)
    pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])
    pipeline.fit(_matrix(rows, feature_names), y)
    return pipeline, feature_names, _defaults(rows, feature_names)


def _profile(payload: dict[str, Any], feature_names: list[str], defaults: dict[str, Any]) -> dict[str, Any]:
    profile = dict(defaults)
    for key, value in payload.items():
        if key not in PUBLIC_FIELDS:
            continue
        if key in NUMERIC_FIELDS:
            profile[key] = float(value)
        else:
            profile[key] = str(value)
    return {name: profile[name] for name in feature_names}


def _feature_contributions(pipeline: Pipeline, row: list[Any]) -> list[dict[str, Any]]:
    preprocessor = pipeline.named_steps["preprocessor"]
    model = pipeline.named_steps["model"]
    transformed = preprocessor.transform([row])[0]
    coefficients = model.coef_[0]
    names = preprocessor.get_feature_names_out()
    contributions = transformed * coefficients
    order = np.argsort(np.abs(contributions))[::-1][:6]
    result = []
    for index in order:
        name = str(names[index]).replace("num__", "").replace("cat__", "").replace("_", " ")
        result.append({"feature": name, "contribution": float(contributions[index])})
    return result


def _score(payload: dict[str, Any]) -> dict[str, Any]:
    pipeline, feature_names, defaults = _trained_model()
    profile = _profile(payload, feature_names, defaults)
    row = [profile[name] for name in feature_names]
    probability = float(pipeline.predict_proba([row])[0][1])
    if probability >= 0.65:
        band = "High"
        summary = "High-risk profile. Manual review and stronger affordability evidence are recommended."
    elif probability >= 0.35:
        band = "Moderate"
        summary = "Moderate risk. The model sees mixed signals, so review income stability and repayment context."
    else:
        band = "Low"
        summary = "Lower-risk profile. The selected attributes are closer to historically safer borrowers."
    return {
        "risk_probability": probability,
        "risk_band": band,
        "decision_summary": summary,
        "top_contributions": _feature_contributions(pipeline, row),
    }


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self._send_json(200, {"ok": True})

    def do_POST(self) -> None:
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length).decode("utf-8") if length else "{}"
            payload = json.loads(raw)
            if not isinstance(payload, dict):
                raise ValueError("Expected a JSON object")
            self._send_json(200, _score(payload))
        except Exception as exc:
            self._send_json(400, {"error": str(exc)})
