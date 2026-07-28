from flask import Flask, request, jsonify
import logging

from openai_integration import OpenAIIntegration
from huggingface_integration import HuggingFaceIntegration
from ollama_integration import OllamaIntegration

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    openai_ai = OpenAIIntegration()
except Exception:
    openai_ai = None

try:
    huggingface_ai = HuggingFaceIntegration()
except Exception:
    huggingface_ai = None

try:
    ollama_ai = OllamaIntegration()
except Exception:
    ollama_ai = None


@app.route("/")
def home():
    return jsonify({
        "message": "Content Generation API",
        "status": "Running"
    })


@app.route("/generate/openai", methods=["POST"])
def generate_openai():
    if not openai_ai:
        return jsonify({"error": "OpenAI service unavailable"}), 500

    data = request.json
    prompt = data.get("prompt", "")

    try:
        result = openai_ai.generate_text(prompt)
        return jsonify({"response": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/generate/huggingface", methods=["POST"])
def generate_huggingface():
    if not huggingface_ai:
        return jsonify({"error": "Hugging Face service unavailable"}), 500

    data = request.json
    prompt = data.get("prompt", "")

    try:
        result = huggingface_ai.generate_text(prompt)
        return jsonify({"response": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/generate/ollama", methods=["POST"])
def generate_ollama():
    if not ollama_ai:
        return jsonify({"error": "Ollama service unavailable"}), 500

    data = request.json
    prompt = data.get("prompt", "")

    try:
        result = ollama_ai.generate_text(prompt)
        return jsonify({"response": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/summarize", methods=["POST"])
def summarize():
    if not huggingface_ai:
        return jsonify({"error": "Hugging Face service unavailable"}), 500

    data = request.json
    text = data.get("text", "")

    try:
        result = huggingface_ai.summarize_text(text)
        return jsonify({"summary": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "services": {
            "openai": openai_ai is not None,
            "huggingface": huggingface_ai is not None,
            "ollama": ollama_ai is not None
        }
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )