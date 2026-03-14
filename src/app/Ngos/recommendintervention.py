import json
import sys
from pathlib import Path

try:
    import joblib
    import numpy as np
except ModuleNotFoundError as exc:
    print(
        json.dumps(
            {
                "error": (
                    "Missing Python dependency. Install `joblib` and `numpy` to run "
                    "the village intervention model."
                ),
                "missing_module": exc.name,
            }
        )
    )
    sys.exit(1)


MODEL_PATH = Path(__file__).with_name("village_priority_geo_model.pkl")

SAMPLE_VILLAGE = {
    "latitude": 25.31,
    "longitude": 82.98,
    "population": 6500,
    "literacy_rate": 0.62,
    "poverty_rate": 0.38,
    "sanitation_score": 0.33,
    "healthcare_access_score": 0.44,
    "toilet_coverage_ratio": 0.48,
    "drainage_score": 0.36,
    "water_contamination_level": 0.72,
    "malnutrition_rate": 0.21,
    "waste_reports_last_30_days": 22,
    "avg_waste_severity": 0.74,
    "health_cases_last_30_days": 36,
    "avg_health_severity": 0.67,
    "drives_last_6_months": 1,
    "days_since_last_drive": 240,
    "avg_drive_impact": 0.54,
}


def load_model_bundle():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

    data = joblib.load(MODEL_PATH)
    return data["model"], data["features"]


def priority_level(score):
    if score > 0.8:
        return "CRITICAL"
    if score > 0.6:
        return "HIGH"
    if score > 0.4:
        return "MEDIUM"
    return "LOW"


def recommend_intervention(village):
    actions = []

    if village["health_cases_last_30_days"] > 25:
        actions.append("Health Camp")
    if village["waste_reports_last_30_days"] > 15:
        actions.append("Waste Cleanup Drive")
    if village["water_contamination_level"] > 0.6:
        actions.append("Water Purification Program")
    if village["malnutrition_rate"] > 0.25:
        actions.append("Nutrition Program")
    if village["sanitation_score"] < 0.4:
        actions.append("Sanitation Awareness Drive")
    if not actions:
        actions.append("General Community Outreach")

    return actions


def predict_village(village, model, features):
    missing_features = [feature for feature in features if feature not in village]
    if missing_features:
        raise ValueError(
            f"Missing required feature(s): {', '.join(sorted(missing_features))}"
        )

    X = np.array([[village[feature] for feature in features]])
    score = float(model.predict(X)[0])
    score = max(0, min(score, 1))

    return {
        "priority_score": round(score, 2),
        "priority_level": priority_level(score),
        "recommended_actions": recommend_intervention(village),
    }


def read_payload():
    if len(sys.argv) > 1 and sys.argv[1] == "--sample":
        return SAMPLE_VILLAGE

    if sys.stdin.isatty():
        return SAMPLE_VILLAGE

    raw_input = sys.stdin.read().strip()
    if not raw_input:
        return SAMPLE_VILLAGE

    payload = json.loads(raw_input)
    if isinstance(payload, dict) and "village" in payload and isinstance(payload["village"], dict):
        return payload["village"]
    if isinstance(payload, dict) and payload:
        return payload

    return SAMPLE_VILLAGE


def main():
    try:
        village = read_payload()
        model, features = load_model_bundle()
        prediction = predict_village(village, model, features)
        print(json.dumps({"input": village, "report": prediction}))
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
        sys.exit(1)


if __name__ == "__main__":
    main()