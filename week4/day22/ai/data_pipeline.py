import logging
import joblib
import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
)


class DataPipeline:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.logger = logging.getLogger(__name__)

    def load_data(self, file_path: str) -> pd.DataFrame:
        """Load data from CSV, JSON or Parquet"""

        try:
            if file_path.endswith(".csv"):
                data = pd.read_csv(file_path)

            elif file_path.endswith(".json"):
                data = pd.read_json(file_path)

            elif file_path.endswith(".parquet"):
                data = pd.read_parquet(file_path)

            else:
                raise ValueError(
                    f"Unsupported file format: {file_path}"
                )

            self.logger.info(
                f"Loaded data with shape: {data.shape}"
            )

            return data

        except Exception as e:
            self.logger.error(f"Failed to load data: {e}")
            raise

    def preprocess_data(
        self,
        data: pd.DataFrame,
        target_column: str = None,
    ) -> pd.DataFrame:
        """Preprocess and clean data"""

        # Handle missing values
        data = data.dropna()

        # Remove duplicates
        data = data.drop_duplicates()

        # Encode categorical columns
        categorical_columns = data.select_dtypes(
            include=["object"]
        ).columns

        for col in categorical_columns:
            if col != target_column:
                data[col] = self.label_encoder.fit_transform(
                    data[col]
                )

        # Numerical columns
        numerical_columns = data.select_dtypes(
            include=[np.number]
        ).columns

        if (
            target_column
            and target_column in numerical_columns
        ):
            numerical_columns = numerical_columns.drop(
                target_column
            )

        # Scale numerical features
        if len(numerical_columns) > 0:
            data[numerical_columns] = self.scaler.fit_transform(
                data[numerical_columns]
            )

        self.logger.info(
            f"Preprocessed data with shape: {data.shape}"
        )

        return data

    def split_data(
        self,
        data: pd.DataFrame,
        target_column: str,
        test_size: float = 0.2,
    ):
        """Split data into train and test"""

        X = data.drop(columns=[target_column])
        y = data[target_column]

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=test_size,
            random_state=42,
            stratify=y,
        )

        self.logger.info(
            f"Train Shape: {X_train.shape}"
        )

        self.logger.info(
            f"Test Shape: {X_test.shape}"
        )

        return (
            X_train,
            X_test,
            y_train,
            y_test,
        )

    def evaluate_model(
        self,
        model,
        X_test,
        y_test,
    ):
        """Evaluate model"""

        y_pred = model.predict(X_test)

        metrics = {
            "accuracy": accuracy_score(
                y_test,
                y_pred,
            ),
            "precision": precision_score(
                y_test,
                y_pred,
                average="weighted",
            ),
            "recall": recall_score(
                y_test,
                y_pred,
                average="weighted",
            ),
            "f1_score": f1_score(
                y_test,
                y_pred,
                average="weighted",
            ),
        }

        self.logger.info(metrics)

        return metrics

    def save_pipeline(
        self,
        file_path: str,
    ):
        """Save preprocessing pipeline"""

        pipeline_data = {
            "scaler": self.scaler,
            "label_encoder": self.label_encoder,
        }

        joblib.dump(
            pipeline_data,
            file_path,
        )

        self.logger.info(
            f"Pipeline saved to {file_path}"
        )

    def load_pipeline(
        self,
        file_path: str,
    ):
        """Load preprocessing pipeline"""

        pipeline_data = joblib.load(file_path)

        self.scaler = pipeline_data["scaler"]
        self.label_encoder = pipeline_data["label_encoder"]

        self.logger.info(
            f"Pipeline loaded from {file_path}"
        )