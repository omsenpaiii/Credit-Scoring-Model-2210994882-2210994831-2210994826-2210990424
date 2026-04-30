# AI-Powered Credit Scoring and Document OCR System for Loan Risk Assessment

Prepared for CO-OP Project at Industry (Module-2)

## Team

- Om Tomar (2210994882)
- Sahajpal Singh (2210994831)
- Ridhima Chopra (2210994826)
- Ishpreet Kaur (2210990424)

## Project Metadata

- Project type: Copyright
- Supervisor/Mentor: Lalit Sharma
- Department: Computer Science and Engineering, Chitkara University, Punjab
- Current status: Submission-ready package with runnable code, report, presentation, and IPR placeholder

## Abstract

This project presents an AI-powered loan-risk assessment workflow that combines tabular credit scoring with a document OCR extension. The credit-scoring module benchmarks Logistic Regression, Random Forest, Gradient Boosting, and Multi-Layer Perceptron models on German Credit and Lending Club sample data. The OCR module demonstrates how a PaddleOCR-based pipeline can support borrower-document intake through controlled synthetic benchmarking.

## Best Credit-Scoring Results

- German Credit: Logistic Regression, class_weight, ROC-AUC 0.831, PR-AUC 0.713, Recall 0.778, F1 0.673
- Lending Club Sample: Logistic Regression, class_weight, ROC-AUC 0.722, PR-AUC 0.360, Recall 0.682, F1 0.430

## Controlled Synthetic OCR Benchmark

- Baseline PaddleOCR: CER 8.7%, field accuracy 81.0%
- Fine-tuned PaddleOCR: CER 4.1%, field accuracy 91.5%
- Disclosure: these OCR values are deterministic controlled synthetic benchmark values used to demonstrate the domain fine-tuning workflow. They are not represented as undisclosed real-world production measurements.
