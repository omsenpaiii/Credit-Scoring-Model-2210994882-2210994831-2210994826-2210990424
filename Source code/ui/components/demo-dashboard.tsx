"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  FileScan,
  Gauge,
  Github,
  LineChart,
  Loader2,
  Rocket,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  benchmarkRuns,
  confusionMatrices,
  featureOptions,
  metricCards,
  ocrMetrics,
  ocrSamples
} from "@/lib/project-data";

type ScoreResponse = {
  risk_probability: number;
  risk_band: "Low" | "Moderate" | "High";
  decision_summary: string;
  top_contributions: Array<{ feature: string; contribution: number }>;
};

type FormState = {
  duration_months: number;
  credit_amount: number;
  installment_rate: number;
  age_years: number;
  checking_status: string;
  credit_history: string;
  purpose: string;
  savings_status: string;
  employment_since: string;
  housing: string;
};

const initialForm: FormState = {
  duration_months: 24,
  credit_amount: 2600,
  installment_rate: 3,
  age_years: 35,
  checking_status: "A12",
  credit_history: "A32",
  purpose: "A43",
  savings_status: "A61",
  employment_since: "A73",
  housing: "A152"
};

const highRiskPreset: FormState = {
  duration_months: 48,
  credit_amount: 7800,
  installment_rate: 4,
  age_years: 23,
  checking_status: "A11",
  credit_history: "A30",
  purpose: "A40",
  savings_status: "A61",
  employment_since: "A72",
  housing: "A151"
};

const lowRiskPreset: FormState = {
  duration_months: 10,
  credit_amount: 1400,
  installment_rate: 2,
  age_years: 49,
  checking_status: "A14",
  credit_history: "A34",
  purpose: "A43",
  savings_status: "A65",
  employment_since: "A75",
  housing: "A152"
};

const workflow = [
  { icon: FileScan, label: "Borrower intake", detail: "Tabular profile plus OCR-ready document flow" },
  { icon: BrainCircuit, label: "Feature pipeline", detail: "Median imputation, scaling, one-hot encoding" },
  { icon: Activity, label: "Risk models", detail: "Logistic regression, forests, boosting, MLP" },
  { icon: ShieldCheck, label: "Decision support", detail: "Risk probability with benchmark context" }
];

export function DemoDashboard() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const sortedRuns = useMemo(
    () => [...benchmarkRuns].sort((a, b) => b.rocAuc - a.rocAuc),
    []
  );
  const chartRows = useMemo(
    () =>
      sortedRuns.map((run) => ({
        name: run.runId.replaceAll("_", " ").replace("class weight", "cw"),
        roc: Number((run.rocAuc * 100).toFixed(1)),
        pr: Number((run.prAuc * 100).toFixed(1)),
        f1: Number((run.f1 * 100).toFixed(1)),
        dataset: run.dataset
      })),
    [sortedRuns]
  );

  async function score(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const payload = (await response.json()) as ScoreResponse;
      setResult(payload);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  const riskTone =
    result?.risk_band === "High"
      ? "text-rose-700 bg-rose-100 border-rose-200"
      : result?.risk_band === "Moderate"
        ? "text-amber-700 bg-amber-100 border-amber-200"
        : "text-teal-700 bg-teal-100 border-teal-200";

  return (
    <main className="relative overflow-hidden">
      <div className="grid-pattern pointer-events-none absolute inset-x-0 top-0 h-[620px]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        <nav className="z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#111827] text-white shadow-glow">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f766e]">Chitkara University</p>
              <p className="text-sm text-zinc-600">Credit Scoring + OCR</p>
            </div>
          </div>
          <a
            href="https://github.com/omsenpaiii/CreditScoringModel"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="z-10"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800">
              <Sparkles className="h-4 w-4" />
              Live model demo with saved benchmark evidence
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] text-zinc-950 sm:text-6xl lg:text-7xl">
              AI-Powered Credit Scoring and Document OCR System
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
              A polished decision-support interface for loan risk assessment: benchmarked credit models,
              OCR intake quality, and a real-time German Credit scoring endpoint trained from the project data.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#live-demo"
                className="inline-flex items-center gap-2 rounded-lg bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-panel transition hover:-translate-y-0.5"
              >
                Try live scorer
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#benchmarks"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white/80 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:bg-white"
              >
                View results
                <LineChart className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="glass-panel z-10 rounded-lg p-4"
          >
            <div className="relative min-h-[430px] overflow-hidden rounded-lg bg-[#111827] p-5 text-white">
              <div className="absolute inset-x-8 top-0 h-16 rounded-b-full bg-teal-300/20 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-100">Risk operation cockpit</p>
                  <p className="text-2xl font-bold">Model validation snapshot</p>
                </div>
                <BadgeCheck className="h-7 w-7 text-teal-300" />
              </div>
              <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
                {metricCards.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.08 }}
                    className="rounded-lg border border-white/10 bg-white/8 p-4"
                  >
                    <div
                      className="metric-ring relative mb-4 grid h-20 w-20 place-items-center rounded-full"
                      style={{ "--value": metric.value, "--ring-color": metric.accent } as React.CSSProperties}
                    >
                      <span className="relative z-10 text-lg font-black">{metric.display}</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-200">{metric.label}</p>
                  </motion.div>
                ))}
              </div>
              <div className="relative mt-5 rounded-lg border border-white/10 bg-white/8 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-zinc-200">Credit benchmark ROC-AUC</p>
                  <Rocket className="h-4 w-4 text-amber-300" />
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartRows.slice(0, 5)}>
                      <XAxis dataKey="name" hide />
                      <YAxis hide domain={[50, 90]} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.06)" }} />
                      <Bar dataKey="roc" radius={[6, 6, 0, 0]}>
                        {chartRows.slice(0, 5).map((row) => (
                          <Cell key={row.name} fill={row.dataset === "german_credit" ? "#14b8a6" : "#fb7185"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-4">
          {workflow.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <item.icon className="mb-5 h-7 w-7 text-[#0f766e]" />
              <h2 className="text-lg font-bold text-zinc-950">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="live-demo" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e85d75]">Live scoring</p>
          <h2 className="mt-3 text-4xl font-black text-zinc-950">German Credit risk demo</h2>
          <p className="mt-3 text-zinc-700">
            The API trains the project’s logistic-regression pipeline on cold start, then scores the profile below with
            the same preprocessing pattern used in the benchmark.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={score} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
            <div className="mb-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setForm(lowRiskPreset)}
                className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
              >
                Low-risk preset
              </button>
              <button
                type="button"
                onClick={() => setForm(highRiskPreset)}
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
              >
                High-risk preset
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Duration" suffix="months" value={form.duration_months} min={4} max={72} onChange={(value) => setForm({ ...form, duration_months: value })} />
              <NumberField label="Credit amount" suffix="DM" value={form.credit_amount} min={250} max={20000} onChange={(value) => setForm({ ...form, credit_amount: value })} />
              <NumberField label="Installment rate" suffix="/ 4" value={form.installment_rate} min={1} max={4} onChange={(value) => setForm({ ...form, installment_rate: value })} />
              <NumberField label="Age" suffix="years" value={form.age_years} min={18} max={80} onChange={(value) => setForm({ ...form, age_years: value })} />
              <SelectField label="Checking status" value={form.checking_status} options={featureOptions.checking_status} onChange={(value) => setForm({ ...form, checking_status: value })} />
              <SelectField label="Credit history" value={form.credit_history} options={featureOptions.credit_history} onChange={(value) => setForm({ ...form, credit_history: value })} />
              <SelectField label="Purpose" value={form.purpose} options={featureOptions.purpose} onChange={(value) => setForm({ ...form, purpose: value })} />
              <SelectField label="Savings" value={form.savings_status} options={featureOptions.savings_status} onChange={(value) => setForm({ ...form, savings_status: value })} />
              <SelectField label="Employment" value={form.employment_since} options={featureOptions.employment_since} onChange={(value) => setForm({ ...form, employment_since: value })} />
              <SelectField label="Housing" value={form.housing} options={featureOptions.housing} onChange={(value) => setForm({ ...form, housing: value })} />
            </div>

            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={status === "loading"}
            >
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
              Score borrower profile
            </button>
            {status === "error" ? (
              <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                The scoring service did not respond. Rebuild or redeploy the Python function and try again.
              </p>
            ) : null}
          </form>

          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
            <div className="relative overflow-hidden rounded-lg bg-[#fffaf0] p-5">
              <div className="animated-scan absolute left-0 right-0 top-0 h-1 bg-[#0f766e]" />
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-500">Decision output</p>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-6xl font-black text-zinc-950">
                    {result ? `${Math.round(result.risk_probability * 100)}%` : "--"}
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">Predicted bad-credit risk</p>
                </div>
                <div className={`rounded-lg border px-3 py-2 text-sm font-bold ${riskTone}`}>
                  {result?.risk_band ?? "Awaiting score"}
                </div>
              </div>
              <p className="mt-5 min-h-12 text-sm leading-6 text-zinc-700">
                {result?.decision_summary ?? "Submit a borrower profile to receive a model-backed risk probability."}
              </p>
            </div>

            <div className="mt-5">
              <h3 className="text-base font-bold text-zinc-950">Top signal contributions</h3>
              <div className="mt-3 space-y-2">
                {(result?.top_contributions ?? []).map((item) => (
                  <div key={item.feature} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2">
                    <span className="max-w-[70%] truncate text-sm font-medium text-zinc-700">{item.feature}</span>
                    <span className={item.contribution >= 0 ? "text-sm font-bold text-rose-700" : "text-sm font-bold text-teal-700"}>
                      {item.contribution >= 0 ? "+" : ""}
                      {item.contribution.toFixed(3)}
                    </span>
                  </div>
                ))}
                {!result ? <p className="rounded-lg bg-zinc-50 px-3 py-4 text-sm text-zinc-500">Signals will appear after scoring.</p> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benchmarks" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f766e]">Benchmarks</p>
            <h2 className="mt-3 text-4xl font-black text-zinc-950">Model results that are easy to defend</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-600">
            Results come from the saved benchmark artifacts in the project: German Credit and Lending Club sample runs
            across four model families.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-panel">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-zinc-950 text-white">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Run</th>
                  <th className="px-4 py-3">ROC-AUC</th>
                  <th className="px-4 py-3">Recall</th>
                </tr>
              </thead>
              <tbody>
                {sortedRuns.map((run, index) => (
                  <tr key={run.runId} className="border-t border-zinc-100">
                    <td className="px-4 py-3 font-bold text-zinc-500">#{index + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-zinc-950">{run.model}</p>
                      <p className="text-xs text-zinc-500">{run.dataset.replaceAll("_", " ")} · {run.strategy}</p>
                    </td>
                    <td className="px-4 py-3 font-black text-[#0f766e]">{run.rocAuc.toFixed(3)}</td>
                    <td className="px-4 py-3 font-bold text-[#e85d75]">{run.recall.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={chartRows} margin={{ top: 12, right: 20, bottom: 22, left: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={false} height={18} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="roc" name="ROC-AUC" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="pr" name="PR-AUC" stroke="#e85d75" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="f1" name="F1" stroke="#d97706" strokeWidth={3} dot={{ r: 4 }} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <ConfusionMatrix title={confusionMatrices.german.title} matrix={confusionMatrices.german.matrix} />
          <ConfusionMatrix title={confusionMatrices.lending.title} matrix={confusionMatrices.lending.matrix} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg bg-[#111827] p-6 text-white shadow-panel">
            <FileScan className="mb-5 h-9 w-9 text-amber-300" />
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-200">Document OCR</p>
            <h2 className="mt-3 text-4xl font-black">Borrower document intake</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              The OCR workflow prepares SROIE/FUNSD crops, evaluates PaddleOCR baseline behavior, and surfaces extraction
              quality alongside the credit-risk model.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <SmallStat label="Train" value={ocrMetrics.preparedCounts.train.toLocaleString()} />
              <SmallStat label="Val" value={ocrMetrics.preparedCounts.val.toLocaleString()} />
              <SmallStat label="Test" value={ocrMetrics.preparedCounts.test.toLocaleString()} />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
            <div className="grid gap-4 sm:grid-cols-3">
              <SmallStat light label="Word accuracy" value={`${(ocrMetrics.wordAccuracy * 100).toFixed(1)}%`} />
              <SmallStat light label="Exact match" value={`${(ocrMetrics.exactMatchAccuracy * 100).toFixed(1)}%`} />
              <SmallStat light label="CER" value={`${(ocrMetrics.characterErrorRate * 100).toFixed(1)}%`} />
            </div>
            <div className="mt-5 space-y-3">
              {ocrSamples.map((sample) => (
                <div key={sample.truth} className="rounded-lg border border-zinc-100 bg-zinc-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Confidence {(sample.confidence * 100).toFixed(1)}%</p>
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-teal-700">OCR sample</span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-500">Ground truth</p>
                  <p className="font-semibold text-zinc-950">{sample.truth}</p>
                  <p className="mt-3 text-sm text-zinc-500">Prediction</p>
                  <p className="font-semibold text-zinc-950">{sample.prediction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-lg font-black text-zinc-950">AI-Powered Credit Scoring and Document OCR System</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Authors: Om Tomar, Sahajpal Singh, Ridhima Chopra, Ishpreet Kaur. Supervisor/Mentor: Lalit Sharma.
            Department of Computer Science and Engineering, Chitkara University.
          </p>
        </div>
      </footer>
    </main>
  );
}

function NumberField({
  label,
  suffix,
  value,
  min,
  max,
  onChange
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-zinc-700">{label}</span>
      <div className="flex overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 focus-within:border-teal-500">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-semibold text-zinc-950 outline-none"
        />
        <span className="grid min-w-20 place-items-center bg-white px-3 text-xs font-semibold text-zinc-500">{suffix}</span>
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-zinc-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm font-semibold text-zinc-950 outline-none transition focus:border-teal-500"
      >
        {options.map(([code, labelText]) => (
          <option key={code} value={code}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

function ConfusionMatrix({ title, matrix }: { title: string; matrix: number[][] }) {
  const labels = ["True safe", "False risk", "Missed risk", "True risk"];
  const values = matrix.flat();
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-black text-zinc-950">{title} confusion matrix</h3>
      <div className="grid grid-cols-2 gap-3">
        {values.map((value, index) => (
          <div key={labels[index]} className="rounded-lg bg-zinc-50 p-4">
            <p className="text-sm font-semibold text-zinc-500">{labels[index]}</p>
            <p className="mt-2 text-3xl font-black text-zinc-950">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmallStat({ label, value, light = false }: { label: string; value: string; light?: boolean }) {
  return (
    <div className={light ? "rounded-lg bg-zinc-50 p-4" : "rounded-lg bg-white/10 p-4"}>
      <p className={light ? "text-xs font-bold uppercase tracking-[0.14em] text-zinc-500" : "text-xs font-bold uppercase tracking-[0.14em] text-zinc-300"}>
        {label}
      </p>
      <p className={light ? "mt-2 text-2xl font-black text-zinc-950" : "mt-2 text-2xl font-black text-white"}>{value}</p>
    </div>
  );
}
