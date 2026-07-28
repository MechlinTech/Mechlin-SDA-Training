from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
import logging
from typing import Dict, Any, List


class AIService:
    def __init__(self, model_path: str, pipeline_path: str):
        self.app = Flask(__name__)
        self.model = joblib.load(model_path)
        self.pipeline = joblib.load(pipeline_path)
        self.logger = logging.getLogger(__name__)

        self.setup_routes()

    def setup_routes(self):
        @self.app.route("/predict", methods=["POST"])
        def predict():
            try:
                data = request.get_json()

                prediction = self.make_prediction(data)

                return jsonify(
                    {
                        "success": True,
                        "prediction": prediction,
                        "confidence": self.get_confidence(data),
                    }
                )

            except Exception as e:
                self.logger.error(e)

                return (
                    jsonify(
                        {
                            "success": False,
                            "error": str(e),
                        }
                    ),
                    400,
                )

        @self.app.route("/batch_predict", methods=["POST"])
        def batch_predict():
            try:
                data = request.get_json()

                predictions = self.make_batch_predictions(data)

                return jsonify(
                    {
                        "success": True,
                        "predictions": predictions,
                    }
                )

            except Exception as e:
                self.logger.error(e)

                return (
                    jsonify(
                        {
                            "success": False,
                            "error": str(e),
                        }
                    ),
                    400,
                )

        @self.app.route("/health", methods=["GET"])
        def health():
            return jsonify(
                {
                    "status": "healthy",
                    "model_loaded": self.model is not None,
                    "pipeline_loaded": self.pipeline is not None,
                }
            )

    def preprocess_input(
        self,
        data: Dict[str, Any],
    ) -> np.ndarray:

        df = pd.DataFrame([data])

        df = self.pipeline["scaler"].transform(df)

        return df

    def make_prediction(
        self,
        data: Dict[str, Any],
    ):

        processed_data = self.preprocess_input(data)

        prediction = self.model.predict(processed_data)

        return prediction[0]

    def make_batch_predictions(
        self,
        data: List[Dict[str, Any]],
    ):

        processed_data = self.preprocess_input(data[0])

        predictions = self.model.predict(processed_data)

        return predictions.tolist()

    def get_confidence(
        self,
        data: Dict[str, Any],
    ) -> float:

        processed_data = self.preprocess_input(data)

        if hasattr(self.model, "predict_proba"):
            probability = self.model.predict_proba(
                processed_data
            )

            return float(np.max(probability))

        return 1.0

    def run(
        self,
        host="0.0.0.0",
        port=5000,
    ):

        self.logger.info(
            f"Starting AI Service on {host}:{port}"
        )

        self.app.run(
            host=host,
            port=port,
            debug=False,
        )


if __name__ == "__main__":
    service = AIService(
        "models/model.pkl",
        "models/pipeline.pkl",
    )

    service.run()