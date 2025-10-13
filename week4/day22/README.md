# Day 22: AI/ML Fundamentals

## 🎯 Learning Objectives

- Master AI/ML fundamentals and model inference
- Implement data pipelines and preprocessing
- Create machine learning models for real-world applications
- Build AI-powered features for web and mobile apps
- Understand AI ethics and responsible AI development

## 📚 Theory & Concepts

### AI/ML Fundamentals
- **Machine Learning**: Supervised, unsupervised, and reinforcement learning
- **Deep Learning**: Neural networks and deep learning models
- **Model Inference**: Running trained models in production
- **Data Pipelines**: Data collection, preprocessing, and feature engineering
- **Model Evaluation**: Metrics, validation, and performance assessment

### AI Applications
- **Natural Language Processing**: Text analysis and generation
- **Computer Vision**: Image recognition and processing
- **Recommendation Systems**: Personalized content recommendations
- **Predictive Analytics**: Forecasting and prediction
- **AI Agents**: Intelligent automation and decision-making

### Best Practices
- **Data Quality**: Ensuring high-quality training data
- **Model Selection**: Choosing appropriate algorithms
- **Ethics**: Responsible AI development and deployment
- **Performance**: Optimizing model performance
- **Monitoring**: Model performance and drift detection

## 🛠️ Hands-on Tasks

### Task 1: Create AI/ML Data Pipeline
Implement comprehensive data processing pipeline:

```python
# ai/data_pipeline.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import logging

class DataPipeline:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.logger = logging.getLogger(__name__)
    
    def load_data(self, file_path: str) -> pd.DataFrame:
        """Load data from various sources"""
        try:
            if file_path.endswith('.csv'):
                data = pd.read_csv(file_path)
            elif file_path.endswith('.json'):
                data = pd.read_json(file_path)
            elif file_path.endswith('.parquet'):
                data = pd.read_parquet(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_path}")
            
            self.logger.info(f"Loaded data with shape: {data.shape}")
            return data
        except Exception as e:
            self.logger.error(f"Failed to load data: {e}")
            raise
    
    def preprocess_data(self, data: pd.DataFrame, target_column: str = None) -> pd.DataFrame:
        """Preprocess and clean data"""
        # Handle missing values
        data = data.dropna()
        
        # Remove duplicates
        data = data.drop_duplicates()
        
        # Handle categorical variables
        categorical_columns = data.select_dtypes(include=['object']).columns
        for col in categorical_columns:
            if col != target_column:
                data[col] = self.label_encoder.fit_transform(data[col])
        
        # Handle numerical variables
        numerical_columns = data.select_dtypes(include=[np.number]).columns
        if target_column and target_column in numerical_columns:
            numerical_columns = numerical_columns.drop(target_column)
        
        # Scale numerical features
        if len(numerical_columns) > 0:
            data[numerical_columns] = self.scaler.fit_transform(data[numerical_columns])
        
        self.logger.info(f"Preprocessed data with shape: {data.shape}")
        return data
    
    def split_data(self, data: pd.DataFrame, target_column: str, test_size: float = 0.2):
        """Split data into training and testing sets"""
        X = data.drop(columns=[target_column])
        y = data[target_column]
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )
        
        self.logger.info(f"Data split - Train: {X_train.shape}, Test: {X_test.shape}")
        return X_train, X_test, y_train, y_test
    
    def evaluate_model(self, model, X_test, y_test):
        """Evaluate model performance"""
        y_pred = model.predict(X_test)
        
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred, average='weighted'),
            'recall': recall_score(y_test, y_pred, average='weighted'),
            'f1_score': f1_score(y_test, y_pred, average='weighted')
        }
        
        self.logger.info(f"Model evaluation metrics: {metrics}")
        return metrics
    
    def save_pipeline(self, file_path: str):
        """Save the preprocessing pipeline"""
        pipeline_data = {
            'scaler': self.scaler,
            'label_encoder': self.label_encoder
        }
        joblib.dump(pipeline_data, file_path)
        self.logger.info(f"Pipeline saved to: {file_path}")
    
    def load_pipeline(self, file_path: str):
        """Load the preprocessing pipeline"""
        pipeline_data = joblib.load(file_path)
        self.scaler = pipeline_data['scaler']
        self.label_encoder = pipeline_data['label_encoder']
        self.logger.info(f"Pipeline loaded from: {file_path}")
```

### Task 2: Create Machine Learning Models
Implement various ML models:

```python
# ai/models.py
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
import xgboost as xgb
import joblib
import logging

class MLModelFactory:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def create_classifier(self, model_type: str, **kwargs):
        """Create a classifier based on the specified type"""
        models = {
            'random_forest': RandomForestClassifier(
                n_estimators=kwargs.get('n_estimators', 100),
                max_depth=kwargs.get('max_depth', None),
                random_state=42
            ),
            'gradient_boosting': GradientBoostingClassifier(
                n_estimators=kwargs.get('n_estimators', 100),
                learning_rate=kwargs.get('learning_rate', 0.1),
                random_state=42
            ),
            'logistic_regression': LogisticRegression(
                random_state=42,
                max_iter=kwargs.get('max_iter', 1000)
            ),
            'svm': SVC(
                kernel=kwargs.get('kernel', 'rbf'),
                random_state=42
            ),
            'neural_network': MLPClassifier(
                hidden_layer_sizes=kwargs.get('hidden_layer_sizes', (100,)),
                random_state=42,
                max_iter=kwargs.get('max_iter', 1000)
            ),
            'xgboost': xgb.XGBClassifier(
                n_estimators=kwargs.get('n_estimators', 100),
                learning_rate=kwargs.get('learning_rate', 0.1),
                random_state=42
            )
        }
        
        if model_type not in models:
            raise ValueError(f"Unsupported model type: {model_type}")
        
        return models[model_type]
    
    def train_model(self, model, X_train, y_train):
        """Train the model"""
        self.logger.info(f"Training model: {type(model).__name__}")
        model.fit(X_train, y_train)
        self.logger.info("Model training completed")
        return model
    
    def save_model(self, model, file_path: str):
        """Save the trained model"""
        joblib.dump(model, file_path)
        self.logger.info(f"Model saved to: {file_path}")
    
    def load_model(self, file_path: str):
        """Load a trained model"""
        model = joblib.load(file_path)
        self.logger.info(f"Model loaded from: {file_path}")
        return model
```

### Task 3: Create AI Service
Implement AI service for web and mobile integration:

```python
# ai/ai_service.py
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
        """Setup API routes"""
        @self.app.route('/predict', methods=['POST'])
        def predict():
            try:
                data = request.get_json()
                prediction = self.make_prediction(data)
                return jsonify({
                    'success': True,
                    'prediction': prediction,
                    'confidence': self.get_confidence(data)
                })
            except Exception as e:
                self.logger.error(f"Prediction error: {e}")
                return jsonify({
                    'success': False,
                    'error': str(e)
                }), 400
        
        @self.app.route('/batch_predict', methods=['POST'])
        def batch_predict():
            try:
                data = request.get_json()
                predictions = self.make_batch_predictions(data)
                return jsonify({
                    'success': True,
                    'predictions': predictions
                })
            except Exception as e:
                self.logger.error(f"Batch prediction error: {e}")
                return jsonify({
                    'success': False,
                    'error': str(e)
                }), 400
        
        @self.app.route('/health', methods=['GET'])
        def health():
            return jsonify({
                'status': 'healthy',
                'model_loaded': self.model is not None,
                'pipeline_loaded': self.pipeline is not None
            })
    
    def preprocess_input(self, data: Dict[str, Any]) -> np.ndarray:
        """Preprocess input data for prediction"""
        # Convert to DataFrame
        df = pd.DataFrame([data])
        
        # Apply preprocessing pipeline
        df = self.pipeline['scaler'].transform(df)
        
        return df
    
    def make_prediction(self, data: Dict[str, Any]) -> Any:
        """Make a single prediction"""
        processed_data = self.preprocess_input(data)
        prediction = self.model.predict(processed_data)
        return prediction[0]
    
    def make_batch_predictions(self, data: List[Dict[str, Any]]) -> List[Any]:
        """Make batch predictions"""
        processed_data = self.preprocess_input(data[0])
        predictions = self.model.predict(processed_data)
        return predictions.tolist()
    
    def get_confidence(self, data: Dict[str, Any]) -> float:
        """Get prediction confidence"""
        processed_data = self.preprocess_input(data)
        if hasattr(self.model, 'predict_proba'):
            probabilities = self.model.predict_proba(processed_data)
            return float(np.max(probabilities))
        return 1.0
    
    def run(self, host: str = '0.0.0.0', port: int = 5000):
        """Run the AI service"""
        self.logger.info(f"Starting AI service on {host}:{port}")
        self.app.run(host=host, port=port, debug=False)
```

### Task 4: Create AI Integration for Web
Implement AI features for web applications:

```javascript
// ai/web-integration.js
class AIWebIntegration {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.model = null;
    this.isLoaded = false;
  }

  async loadModel() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ai/model/load`);
      if (response.ok) {
        this.isLoaded = true;
        console.log('AI model loaded successfully');
      }
    } catch (error) {
      console.error('Failed to load AI model:', error);
    }
  }

  async predict(data) {
    if (!this.isLoaded) {
      await this.loadModel();
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/ai/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Prediction failed:', error);
      throw error;
    }
  }

  async batchPredict(dataArray) {
    if (!this.isLoaded) {
      await this.loadModel();
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/ai/batch-predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataArray),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Batch prediction failed:', error);
      throw error;
    }
  }

  async getModelInfo() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ai/model/info`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get model info:', error);
    }
  }
}

// Usage example
const aiIntegration = new AIWebIntegration('http://localhost:5000');

// Make a prediction
aiIntegration.predict({
  feature1: 1.5,
  feature2: 2.3,
  feature3: 0.8
}).then(result => {
  console.log('Prediction:', result);
}).catch(error => {
  console.error('Error:', error);
});
```

### Task 5: Create AI Integration for Mobile
Implement AI features for mobile applications:

```typescript
// ai/mobile-integration.ts
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AIPrediction {
  success: boolean;
  prediction: any;
  confidence: number;
  error?: string;
}

interface AIModelInfo {
  name: string;
  version: string;
  accuracy: number;
  lastUpdated: string;
}

class AIMobileIntegration {
  private apiBaseUrl: string;
  private modelCache: Map<string, any> = new Map();
  private isOnline: boolean = true;

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;
    this.initializeNetworkListener();
  }

  private initializeNetworkListener() {
    // Initialize network listener for offline support
    // This would typically use a network library
  }

  async predict(data: any): Promise<AIPrediction> {
    try {
      // Check if we have cached prediction
      const cacheKey = this.generateCacheKey(data);
      const cachedResult = await this.getCachedPrediction(cacheKey);
      
      if (cachedResult && !this.isOnline) {
        return cachedResult;
      }

      const response = await fetch(`${this.apiBaseUrl}/ai/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache the result for offline use
      await this.cachePrediction(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('AI prediction failed:', error);
      
      // Try to get cached result if online prediction fails
      const cacheKey = this.generateCacheKey(data);
      const cachedResult = await this.getCachedPrediction(cacheKey);
      
      if (cachedResult) {
        return cachedResult;
      }
      
      return {
        success: false,
        prediction: null,
        confidence: 0,
        error: error.message,
      };
    }
  }

  async batchPredict(dataArray: any[]): Promise<AIPrediction[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ai/batch-predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataArray),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.predictions;
    } catch (error) {
      console.error('AI batch prediction failed:', error);
      return [];
    }
  }

  async getModelInfo(): Promise<AIModelInfo | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ai/model/info`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get model info:', error);
    }
    return null;
  }

  private generateCacheKey(data: any): string {
    return JSON.stringify(data);
  }

  private async getCachedPrediction(cacheKey: string): Promise<AIPrediction | null> {
    try {
      const cached = await AsyncStorage.getItem(`ai_prediction_${cacheKey}`);
      if (cached) {
        const result = JSON.parse(cached);
        // Check if cache is still valid (e.g., not older than 1 hour)
        const cacheAge = Date.now() - result.timestamp;
        if (cacheAge < 3600000) { // 1 hour
          return result;
        }
      }
    } catch (error) {
      console.error('Failed to get cached prediction:', error);
    }
    return null;
  }

  private async cachePrediction(cacheKey: string, result: AIPrediction): Promise<void> {
    try {
      const cacheData = {
        ...result,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(`ai_prediction_${cacheKey}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache prediction:', error);
    }
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const aiKeys = keys.filter(key => key.startsWith('ai_prediction_'));
      await AsyncStorage.multiRemove(aiKeys);
    } catch (error) {
      console.error('Failed to clear AI cache:', error);
    }
  }
}

export default AIMobileIntegration;
```

## 📝 Documentation Tasks

### Create AI/ML Guide
Create `week4/day22/docs/ai-ml-guide.md`:

```markdown
# AI/ML Guide

## Machine Learning Fundamentals
- **Data Pipelines**: Data collection, preprocessing, and feature engineering
- **Model Training**: Supervised, unsupervised, and reinforcement learning
- **Model Evaluation**: Metrics, validation, and performance assessment
- **Model Deployment**: Production model serving and monitoring
- **AI Ethics**: Responsible AI development and deployment

## Best Practices
- **Data Quality**: Ensuring high-quality training data
- **Model Selection**: Choosing appropriate algorithms
- **Performance**: Optimizing model performance
- **Monitoring**: Model performance and drift detection
- **Security**: AI model security and privacy
```

## 🧪 Testing & Validation

### AI/ML Testing
- [ ] Data pipeline works correctly
- [ ] Models train successfully
- [ ] Predictions are accurate
- [ ] API integration works
- [ ] Mobile integration works

### Performance Testing
- [ ] Model inference is fast
- [ ] API response times are acceptable
- [ ] Mobile predictions work offline
- [ ] Batch processing is efficient
- [ ] Model accuracy is acceptable

## 📊 Success Criteria

By the end of Day 22, you should have:

✅ **AI/ML Mastery**: Machine learning fundamentals  
✅ **Data Pipelines**: Data processing and preprocessing  
✅ **Model Training**: Training and evaluation  
✅ **API Integration**: AI service integration  
✅ **Mobile Integration**: AI features in mobile apps  

## 🔄 Next Steps

1. **Commit your work**: `git add . && git commit -m "Complete Day 22: AI/ML Fundamentals"`
2. **Create PR**: Submit pull request for code review
3. **Prepare for Day 23**: Review Generative AI concepts
4. **Update progress**: Document your learning in the daily summary

## 📚 Additional Resources

- [Scikit-learn Documentation](https://scikit-learn.org/)
- [TensorFlow](https://www.tensorflow.org/)
- [PyTorch](https://pytorch.org/)
- [AI Ethics](https://www.partnershiponai.org/)

---

**Ready for Day 23? Check out [Day 23: Generative AI & LLM](../day23/README.md)!** 🚀
