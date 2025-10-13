# Day 23: Generative AI & LLM

## 🎯 Learning Objectives

- Master Generative AI and Large Language Models (LLMs)
- Implement OpenAI, Hugging Face, and Ollama integrations
- Build text generation and summarization APIs
- Create AI-powered content generation tools
- Understand LLM fine-tuning and optimization

## 📚 Theory & Concepts

### Generative AI Fundamentals
- **Large Language Models**: GPT, BERT, and transformer architectures
- **Text Generation**: Natural language generation and completion
- **Fine-tuning**: Customizing models for specific tasks
- **Prompt Engineering**: Effective prompt design and optimization
- **Model Selection**: Choosing the right LLM for your use case

### LLM Integration
- **OpenAI API**: GPT models and text generation
- **Hugging Face**: Open-source models and transformers
- **Ollama**: Local LLM deployment and management
- **API Design**: RESTful AI service architecture
- **Performance**: Optimizing LLM inference and costs

### Best Practices
- **Prompt Design**: Effective prompt engineering
- **Cost Optimization**: Managing API costs and usage
- **Security**: Secure LLM integration and data handling
- **Monitoring**: LLM performance and usage tracking
- **Ethics**: Responsible AI content generation

## 🛠️ Hands-on Tasks

### Task 1: Create OpenAI Integration
Implement comprehensive OpenAI API integration:

```python
# ai/openai_integration.py
import openai
import os
import logging
from typing import List, Dict, Any, Optional
import json

class OpenAIIntegration:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key is required")
        
        openai.api_key = self.api_key
        self.logger = logging.getLogger(__name__)
        self.models = {
            'gpt-4': 'gpt-4',
            'gpt-3.5-turbo': 'gpt-3.5-turbo',
            'text-davinci-003': 'text-davinci-003'
        }
    
    def generate_text(self, prompt: str, model: str = 'gpt-3.5-turbo', 
                     max_tokens: int = 1000, temperature: float = 0.7) -> str:
        """Generate text using OpenAI API"""
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            self.logger.error(f"OpenAI API error: {e}")
            raise
    
    def generate_summary(self, text: str, max_length: int = 150) -> str:
        """Generate a summary of the given text"""
        prompt = f"""
        Please provide a concise summary of the following text in no more than {max_length} words:
        
        {text}
        """
        
        return self.generate_text(prompt, max_tokens=max_length)
    
    def generate_code(self, description: str, language: str = 'python') -> str:
        """Generate code based on description"""
        prompt = f"""
        Write {language} code for the following description:
        
        {description}
        
        Please provide only the code without explanations.
        """
        
        return self.generate_text(prompt, temperature=0.3)
    
    def generate_documentation(self, code: str, language: str = 'python') -> str:
        """Generate documentation for code"""
        prompt = f"""
        Generate comprehensive documentation for the following {language} code:
        
        {code}
        
        Include function descriptions, parameters, return values, and usage examples.
        """
        
        return self.generate_text(prompt, temperature=0.5)
    
    def chat_completion(self, messages: List[Dict[str, str]], 
                       model: str = 'gpt-3.5-turbo') -> str:
        """Chat completion with conversation history"""
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            self.logger.error(f"Chat completion error: {e}")
            raise
    
    def generate_embeddings(self, text: str, model: str = 'text-embedding-ada-002') -> List[float]:
        """Generate embeddings for text"""
        try:
            response = openai.Embedding.create(
                model=model,
                input=text
            )
            
            return response.data[0].embedding
        except Exception as e:
            self.logger.error(f"Embedding generation error: {e}")
            raise
    
    def batch_generate(self, prompts: List[str], model: str = 'gpt-3.5-turbo') -> List[str]:
        """Generate text for multiple prompts"""
        results = []
        for prompt in prompts:
            try:
                result = self.generate_text(prompt, model)
                results.append(result)
            except Exception as e:
                self.logger.error(f"Batch generation error for prompt: {prompt}")
                results.append(f"Error: {str(e)}")
        
        return results
```

### Task 2: Create Hugging Face Integration
Implement Hugging Face transformers integration:

```python
# ai/huggingface_integration.py
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import torch
import logging
from typing import List, Dict, Any

class HuggingFaceIntegration:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.models = {}
        self.tokenizers = {}
    
    def load_text_generation_model(self, model_name: str = "gpt2"):
        """Load a text generation model"""
        try:
            self.logger.info(f"Loading text generation model: {model_name}")
            self.models['text_generation'] = pipeline(
                "text-generation",
                model=model_name,
                device=0 if torch.cuda.is_available() else -1
            )
            self.logger.info("Text generation model loaded successfully")
        except Exception as e:
            self.logger.error(f"Failed to load text generation model: {e}")
            raise
    
    def load_summarization_model(self, model_name: str = "facebook/bart-large-cnn"):
        """Load a summarization model"""
        try:
            self.logger.info(f"Loading summarization model: {model_name}")
            self.models['summarization'] = pipeline(
                "summarization",
                model=model_name,
                device=0 if torch.cuda.is_available() else -1
            )
            self.logger.info("Summarization model loaded successfully")
        except Exception as e:
            self.logger.error(f"Failed to load summarization model: {e}")
            raise
    
    def load_question_answering_model(self, model_name: str = "distilbert-base-cased-distilled-squad"):
        """Load a question answering model"""
        try:
            self.logger.info(f"Loading QA model: {model_name}")
            self.models['question_answering'] = pipeline(
                "question-answering",
                model=model_name,
                device=0 if torch.cuda.is_available() else -1
            )
            self.logger.info("QA model loaded successfully")
        except Exception as e:
            self.logger.error(f"Failed to load QA model: {e}")
            raise
    
    def generate_text(self, prompt: str, max_length: int = 100, 
                     temperature: float = 0.7) -> str:
        """Generate text using the loaded model"""
        if 'text_generation' not in self.models:
            self.load_text_generation_model()
        
        try:
            result = self.models['text_generation'](
                prompt,
                max_length=max_length,
                temperature=temperature,
                do_sample=True,
                pad_token_id=50256
            )
            return result[0]['generated_text']
        except Exception as e:
            self.logger.error(f"Text generation error: {e}")
            raise
    
    def summarize_text(self, text: str, max_length: int = 150, 
                      min_length: int = 50) -> str:
        """Summarize text using the loaded model"""
        if 'summarization' not in self.models:
            self.load_summarization_model()
        
        try:
            result = self.models['summarization'](
                text,
                max_length=max_length,
                min_length=min_length,
                do_sample=False
            )
            return result[0]['summary_text']
        except Exception as e:
            self.logger.error(f"Summarization error: {e}")
            raise
    
    def answer_question(self, question: str, context: str) -> Dict[str, Any]:
        """Answer a question based on context"""
        if 'question_answering' not in self.models:
            self.load_question_answering_model()
        
        try:
            result = self.models['question_answering'](
                question=question,
                context=context
            )
            return result
        except Exception as e:
            self.logger.error(f"Question answering error: {e}")
            raise
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models"""
        info = {
            'device': self.device,
            'loaded_models': list(self.models.keys()),
            'cuda_available': torch.cuda.is_available()
        }
        return info
```

### Task 3: Create Ollama Integration
Implement local LLM deployment with Ollama:

```python
# ai/ollama_integration.py
import requests
import json
import logging
from typing import List, Dict, Any, Optional

class OllamaIntegration:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.logger = logging.getLogger(__name__)
        self.available_models = []
        self.load_available_models()
    
    def load_available_models(self):
        """Load list of available models"""
        try:
            response = requests.get(f"{self.base_url}/api/tags")
            if response.status_code == 200:
                data = response.json()
                self.available_models = [model['name'] for model in data.get('models', [])]
                self.logger.info(f"Loaded {len(self.available_models)} models")
            else:
                self.logger.error(f"Failed to load models: {response.status_code}")
        except Exception as e:
            self.logger.error(f"Error loading models: {e}")
    
    def pull_model(self, model_name: str) -> bool:
        """Pull a model from Ollama registry"""
        try:
            self.logger.info(f"Pulling model: {model_name}")
            response = requests.post(
                f"{self.base_url}/api/pull",
                json={"name": model_name},
                stream=True
            )
            
            if response.status_code == 200:
                self.logger.info(f"Model {model_name} pulled successfully")
                return True
            else:
                self.logger.error(f"Failed to pull model: {response.status_code}")
                return False
        except Exception as e:
            self.logger.error(f"Error pulling model: {e}")
            return False
    
    def generate_text(self, prompt: str, model: str = "llama2", 
                     options: Dict[str, Any] = None) -> str:
        """Generate text using Ollama"""
        if model not in self.available_models:
            self.logger.warning(f"Model {model} not found, attempting to pull...")
            if not self.pull_model(model):
                raise ValueError(f"Model {model} not available")
        
        try:
            payload = {
                "model": model,
                "prompt": prompt,
                "stream": False
            }
            
            if options:
                payload["options"] = options
            
            response = requests.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('response', '')
            else:
                raise Exception(f"API error: {response.status_code}")
                
        except Exception as e:
            self.logger.error(f"Text generation error: {e}")
            raise
    
    def chat_completion(self, messages: List[Dict[str, str]], 
                       model: str = "llama2") -> str:
        """Chat completion with conversation history"""
        try:
            payload = {
                "model": model,
                "messages": messages,
                "stream": False
            }
            
            response = requests.post(
                f"{self.base_url}/api/chat",
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('message', {}).get('content', '')
            else:
                raise Exception(f"API error: {response.status_code}")
                
        except Exception as e:
            self.logger.error(f"Chat completion error: {e}")
            raise
    
    def get_model_info(self, model: str) -> Dict[str, Any]:
        """Get information about a specific model"""
        try:
            response = requests.post(
                f"{self.base_url}/api/show",
                json={"name": model}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"API error: {response.status_code}")
                
        except Exception as e:
            self.logger.error(f"Error getting model info: {e}")
            raise
    
    def list_models(self) -> List[str]:
        """List all available models"""
        return self.available_models.copy()
    
    def delete_model(self, model: str) -> bool:
        """Delete a model"""
        try:
            response = requests.delete(
                f"{self.base_url}/api/delete",
                json={"name": model}
            )
            
            if response.status_code == 200:
                self.logger.info(f"Model {model} deleted successfully")
                return True
            else:
                self.logger.error(f"Failed to delete model: {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error deleting model: {e}")
            return False
```

### Task 4: Create AI Content Generation API
Implement comprehensive AI content generation service:

```python
# ai/content_generation_api.py
from flask import Flask, request, jsonify
import logging
from typing import Dict, Any, List
import json

class AIContentGenerationAPI:
    def __init__(self, openai_key: str = None, ollama_url: str = None):
        self.app = Flask(__name__)
        self.logger = logging.getLogger(__name__)
        
        # Initialize AI services
        self.openai_service = None
        self.ollama_service = None
        self.huggingface_service = None
        
        if openai_key:
            from .openai_integration import OpenAIIntegration
            self.openai_service = OpenAIIntegration(openai_key)
        
        if ollama_url:
            from .ollama_integration import OllamaIntegration
            self.ollama_service = OllamaIntegration(ollama_url)
        
        from .huggingface_integration import HuggingFaceIntegration
        self.huggingface_service = HuggingFaceIntegration()
        
        self.setup_routes()
    
    def setup_routes(self):
        """Setup API routes"""
        @self.app.route('/generate/text', methods=['POST'])
        def generate_text():
            try:
                data = request.get_json()
                prompt = data.get('prompt')
                model = data.get('model', 'gpt-3.5-turbo')
                max_tokens = data.get('max_tokens', 1000)
                temperature = data.get('temperature', 0.7)
                
                if not prompt:
                    return jsonify({'error': 'Prompt is required'}), 400
                
                # Choose service based on model
                if model.startswith('gpt-'):
                    if not self.openai_service:
                        return jsonify({'error': 'OpenAI service not available'}), 500
                    result = self.openai_service.generate_text(
                        prompt, model, max_tokens, temperature
                    )
                elif model.startswith('llama'):
                    if not self.ollama_service:
                        return jsonify({'error': 'Ollama service not available'}), 500
                    result = self.ollama_service.generate_text(prompt, model)
                else:
                    result = self.huggingface_service.generate_text(prompt)
                
                return jsonify({
                    'success': True,
                    'result': result,
                    'model': model
                })
                
            except Exception as e:
                self.logger.error(f"Text generation error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/generate/summary', methods=['POST'])
        def generate_summary():
            try:
                data = request.get_json()
                text = data.get('text')
                max_length = data.get('max_length', 150)
                
                if not text:
                    return jsonify({'error': 'Text is required'}), 400
                
                # Use Hugging Face for summarization
                result = self.huggingface_service.summarize_text(text, max_length)
                
                return jsonify({
                    'success': True,
                    'summary': result,
                    'original_length': len(text),
                    'summary_length': len(result)
                })
                
            except Exception as e:
                self.logger.error(f"Summarization error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/generate/code', methods=['POST'])
        def generate_code():
            try:
                data = request.get_json()
                description = data.get('description')
                language = data.get('language', 'python')
                
                if not description:
                    return jsonify({'error': 'Description is required'}), 400
                
                if not self.openai_service:
                    return jsonify({'error': 'OpenAI service not available'}), 500
                
                result = self.openai_service.generate_code(description, language)
                
                return jsonify({
                    'success': True,
                    'code': result,
                    'language': language
                })
                
            except Exception as e:
                self.logger.error(f"Code generation error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/chat', methods=['POST'])
        def chat():
            try:
                data = request.get_json()
                messages = data.get('messages', [])
                model = data.get('model', 'gpt-3.5-turbo')
                
                if not messages:
                    return jsonify({'error': 'Messages are required'}), 400
                
                # Choose service based on model
                if model.startswith('gpt-'):
                    if not self.openai_service:
                        return jsonify({'error': 'OpenAI service not available'}), 500
                    result = self.openai_service.chat_completion(messages, model)
                elif model.startswith('llama'):
                    if not self.ollama_service:
                        return jsonify({'error': 'Ollama service not available'}), 500
                    result = self.ollama_service.chat_completion(messages, model)
                else:
                    return jsonify({'error': 'Unsupported model'}), 400
                
                return jsonify({
                    'success': True,
                    'response': result,
                    'model': model
                })
                
            except Exception as e:
                self.logger.error(f"Chat error: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/models', methods=['GET'])
        def list_models():
            """List available models"""
            models = {
                'openai': [],
                'ollama': [],
                'huggingface': ['gpt2', 'facebook/bart-large-cnn']
            }
            
            if self.openai_service:
                models['openai'] = list(self.openai_service.models.keys())
            
            if self.ollama_service:
                models['ollama'] = self.ollama_service.list_models()
            
            return jsonify({
                'success': True,
                'models': models
            })
        
        @self.app.route('/health', methods=['GET'])
        def health():
            """Health check endpoint"""
            return jsonify({
                'status': 'healthy',
                'services': {
                    'openai': self.openai_service is not None,
                    'ollama': self.ollama_service is not None,
                    'huggingface': self.huggingface_service is not None
                }
            })
    
    def run(self, host: str = '0.0.0.0', port: int = 5000):
        """Run the API server"""
        self.logger.info(f"Starting AI Content Generation API on {host}:{port}")
        self.app.run(host=host, port=port, debug=False)
```

### Task 5: Create AI Integration for Web and Mobile
Implement AI features for web and mobile applications:

```javascript
// ai/web-ai-integration.js
class WebAIIntegration {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.conversationHistory = [];
  }

  async generateText(prompt, options = {}) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/generate/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: options.model || 'gpt-3.5-turbo',
          max_tokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Text generation failed:', error);
      throw error;
    }
  }

  async generateSummary(text, maxLength = 150) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/generate/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          max_length: maxLength,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.summary;
    } catch (error) {
      console.error('Summarization failed:', error);
      throw error;
    }
  }

  async generateCode(description, language = 'python') {
    try {
      const response = await fetch(`${this.apiBaseUrl}/generate/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.code;
    } catch (error) {
      console.error('Code generation failed:', error);
      throw error;
    }
  }

  async chat(message, model = 'gpt-3.5-turbo') {
    this.conversationHistory.push({ role: 'user', content: message });

    try {
      const response = await fetch(`${this.apiBaseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: this.conversationHistory,
          model,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.conversationHistory.push({ role: 'assistant', content: result.response });
      return result.response;
    } catch (error) {
      console.error('Chat failed:', error);
      throw error;
    }
  }

  clearConversation() {
    this.conversationHistory = [];
  }

  getConversationHistory() {
    return this.conversationHistory;
  }
}

// Usage example
const aiIntegration = new WebAIIntegration('http://localhost:5000');

// Generate text
aiIntegration.generateText('Write a short story about a robot learning to paint')
  .then(result => console.log('Generated text:', result))
  .catch(error => console.error('Error:', error));

// Generate summary
aiIntegration.generateSummary('Long text here...')
  .then(summary => console.log('Summary:', summary))
  .catch(error => console.error('Error:', error));

// Generate code
aiIntegration.generateCode('Create a function to calculate fibonacci numbers', 'python')
  .then(code => console.log('Generated code:', code))
  .catch(error => console.error('Error:', error));

// Chat
aiIntegration.chat('Hello, how are you?')
  .then(response => console.log('AI response:', response))
  .catch(error => console.error('Error:', error));
```

## 📝 Documentation Tasks

### Create Generative AI Guide
Create `week4/day23/docs/generative-ai-guide.md`:

```markdown
# Generative AI Guide

## Large Language Models
- **OpenAI**: GPT models and text generation
- **Hugging Face**: Open-source models and transformers
- **Ollama**: Local LLM deployment and management
- **Prompt Engineering**: Effective prompt design
- **Model Selection**: Choosing the right LLM

## Best Practices
- **Prompt Design**: Effective prompt engineering
- **Cost Optimization**: Managing API costs and usage
- **Security**: Secure LLM integration
- **Performance**: Optimizing LLM inference
- **Ethics**: Responsible AI content generation
```

## 🧪 Testing & Validation

### Generative AI Testing
- [ ] Text generation works correctly
- [ ] Summarization works
- [ ] Code generation works
- [ ] Chat functionality works
- [ ] API integration works

### Performance Testing
- [ ] Response times are acceptable
- [ ] Model loading is fast
- [ ] Batch processing works
- [ ] Error handling is robust
- [ ] Cost optimization works

## 📊 Success Criteria

By the end of Day 23, you should have:

✅ **Generative AI Mastery**: LLM integration and usage  
✅ **OpenAI Integration**: GPT models and text generation  
✅ **Hugging Face**: Open-source models and transformers  
✅ **Ollama**: Local LLM deployment  
✅ **API Design**: AI service architecture  

## 🔄 Next Steps

1. **Commit your work**: `git add . && git commit -m "Complete Day 23: Generative AI & LLM"`
2. **Create PR**: Submit pull request for code review
3. **Prepare for Day 24**: Review AI Agents concepts
4. **Update progress**: Document your learning in the daily summary

## 📚 Additional Resources

- [OpenAI API](https://platform.openai.com/docs)
- [Hugging Face](https://huggingface.co/docs)
- [Ollama](https://ollama.ai/)
- [Prompt Engineering](https://www.promptingguide.ai/)

---

**Ready for Day 24? Check out [Day 24: AI Agents](../day24/README.md)!** 🚀
