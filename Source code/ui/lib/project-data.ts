export type BenchmarkRun = {
  runId: string;
  dataset: "german_credit" | "lending_club_sample";
  model: string;
  strategy: string;
  trainSeconds: number;
  rocAuc: number;
  prAuc: number;
  precision: number;
  recall: number;
  f1: number;
  accuracy: number;
};

export const benchmarkRuns: BenchmarkRun[] = [
  {
    runId: "german_logreg_class_weight",
    dataset: "german_credit",
    model: "Logistic Regression",
    strategy: "Class weight",
    trainSeconds: 0.0414,
    rocAuc: 0.8311,
    prAuc: 0.7127,
    precision: 0.5932,
    recall: 0.7778,
    f1: 0.6731,
    accuracy: 0.7733
  },
  {
    runId: "german_rf_oversample",
    dataset: "german_credit",
    model: "Random Forest",
    strategy: "Oversample",
    trainSeconds: 0.2102,
    rocAuc: 0.8025,
    prAuc: 0.6543,
    precision: 0.697,
    recall: 0.5111,
    f1: 0.5897,
    accuracy: 0.7867
  },
  {
    runId: "german_gb_none",
    dataset: "german_credit",
    model: "Gradient Boosting",
    strategy: "None",
    trainSeconds: 0.9014,
    rocAuc: 0.7896,
    prAuc: 0.6674,
    precision: 0.7407,
    recall: 0.4444,
    f1: 0.5556,
    accuracy: 0.7867
  },
  {
    runId: "german_mlp_oversample",
    dataset: "german_credit",
    model: "MLP",
    strategy: "Oversample",
    trainSeconds: 0.2292,
    rocAuc: 0.8235,
    prAuc: 0.6859,
    precision: 0.65,
    recall: 0.5778,
    f1: 0.6118,
    accuracy: 0.78
  },
  {
    runId: "lending_logreg_class_weight",
    dataset: "lending_club_sample",
    model: "Logistic Regression",
    strategy: "Class weight",
    trainSeconds: 0.0217,
    rocAuc: 0.7217,
    prAuc: 0.3604,
    precision: 0.3138,
    recall: 0.6818,
    f1: 0.4298,
    accuracy: 0.6683
  },
  {
    runId: "lending_rf_oversample",
    dataset: "lending_club_sample",
    model: "Random Forest",
    strategy: "Oversample",
    trainSeconds: 0.3332,
    rocAuc: 0.7187,
    prAuc: 0.3831,
    precision: 0.4348,
    recall: 0.2727,
    f1: 0.3352,
    accuracy: 0.8017
  },
  {
    runId: "lending_gb_none",
    dataset: "lending_club_sample",
    model: "Gradient Boosting",
    strategy: "None",
    trainSeconds: 1.3046,
    rocAuc: 0.6901,
    prAuc: 0.3342,
    precision: 0.5,
    recall: 0.1273,
    f1: 0.2029,
    accuracy: 0.8167
  },
  {
    runId: "lending_mlp_oversample",
    dataset: "lending_club_sample",
    model: "MLP",
    strategy: "Oversample",
    trainSeconds: 1.1608,
    rocAuc: 0.5911,
    prAuc: 0.2604,
    precision: 0.2432,
    recall: 0.2455,
    f1: 0.2443,
    accuracy: 0.7217
  }
];

export const confusionMatrices = {
  german: {
    title: "German Credit",
    matrix: [
      [81, 24],
      [10, 35]
    ]
  },
  lending: {
    title: "Lending Club Sample",
    matrix: [
      [326, 164],
      [35, 75]
    ]
  }
};

export const ocrMetrics = {
  sampleCount: 25,
  characterErrorRate: 0.1104,
  wordAccuracy: 0.6909,
  exactMatchAccuracy: 0.44,
  preparedCounts: {
    train: 1200,
    val: 300,
    test: 300
  }
};

export const ocrSamples = [
  {
    truth: "TRIPLE SIX POINT ENTERPRISE 666",
    prediction: "Triple Six Point Enterprise 666",
    confidence: 0.996
  },
  {
    truth: "DATE: 22-03-2018 04:01:20 PM",
    prediction: "Date: 22-03-2018 04:01:20 PM",
    confidence: 0.985
  },
  {
    truth: "PAYMENT TYPE: CASH",
    prediction: "Payment Type: Cash",
    confidence: 0.997
  }
];

export const metricCards = [
  { label: "Best German ROC-AUC", value: 83.1, display: "0.831", accent: "#0f766e" },
  { label: "Best Lending ROC-AUC", value: 72.2, display: "0.722", accent: "#e85d75" },
  { label: "OCR Word Accuracy", value: 69.1, display: "69.1%", accent: "#d97706" },
  { label: "Prepared OCR Crops", value: 100, display: "1,800", accent: "#6d5bd0" }
];

export const featureOptions = {
  checking_status: [
    ["A11", "< 0 DM"],
    ["A12", "0 to 200 DM"],
    ["A13", ">= 200 DM"],
    ["A14", "No checking account"]
  ],
  credit_history: [
    ["A30", "No credits / all paid"],
    ["A31", "All credits paid"],
    ["A32", "Existing paid till now"],
    ["A33", "Delay in past"],
    ["A34", "Critical account"]
  ],
  purpose: [
    ["A40", "Car"],
    ["A41", "Used car"],
    ["A42", "Furniture/equipment"],
    ["A43", "Radio/TV"],
    ["A46", "Education"],
    ["A49", "Business"]
  ],
  savings_status: [
    ["A61", "< 100 DM"],
    ["A62", "100 to 500 DM"],
    ["A63", "500 to 1000 DM"],
    ["A64", ">= 1000 DM"],
    ["A65", "Unknown / no savings"]
  ],
  employment_since: [
    ["A71", "Unemployed"],
    ["A72", "< 1 year"],
    ["A73", "1 to 4 years"],
    ["A74", "4 to 7 years"],
    ["A75", ">= 7 years"]
  ],
  housing: [
    ["A151", "Rent"],
    ["A152", "Own"],
    ["A153", "Free"]
  ]
} as const;
