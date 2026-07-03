from pathlib import Path

import matplotlib.pyplot as plt
import seaborn as sns

from app.ml.train import train_and_save


def save_evaluation_plots(metrics: dict, output_dir: Path):
    output_dir.mkdir(parents=True, exist_ok=True)
    models = metrics["models"]
    names = list(models.keys())
    f1_scores = [models[n]["f1"] for n in names]

    plt.figure(figsize=(8, 5))
    sns.barplot(x=names, y=f1_scores)
    plt.title("Model F1 Score Comparison")
    plt.ylabel("F1 Score")
    plt.tight_layout()
    plt.savefig(output_dir / "model_f1_comparison.png")
    plt.close()

    best = metrics["best_model"]
    cm = models[best]["confusion_matrix"]
    plt.figure(figsize=(5, 4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
    plt.title(f"Confusion Matrix - {best}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    plt.savefig(output_dir / "confusion_matrix.png")
    plt.close()


if __name__ == "__main__":
    metrics = train_and_save()
    save_evaluation_plots(metrics, Path(__file__).resolve().parents[2] / "models")
