import requests
import logging
from typing import Dict, List, Any


class OllamaIntegration:
    def __init__(
        self,
        base_url: str = "http://localhost:11434",
        model: str = "llama2"
    ):
        self.base_url = base_url
        self.model = model
        self.logger = logging.getLogger(__name__)

    def generate_text(
        self,
        prompt: str,
        temperature: float = 0.7
    ) -> str:
        """Generate text using Ollama"""

        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature
                    }
                }
            )

            response.raise_for_status()

            return response.json()["response"]

        except Exception as e:
            self.logger.error(f"Generation error: {e}")
            raise

    def chat(
        self,
        messages: List[Dict[str, str]]
    ) -> str:
        """Chat with Ollama"""

        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False
                }
            )

            response.raise_for_status()

            return response.json()["message"]["content"]

        except Exception as e:
            self.logger.error(f"Chat error: {e}")
            raise

    def list_models(self) -> List[str]:
        """List installed Ollama models"""

        try:
            response = requests.get(
                f"{self.base_url}/api/tags"
            )

            response.raise_for_status()

            data = response.json()

            return [
                model["name"]
                for model in data.get("models", [])
            ]

        except Exception as e:
            self.logger.error(f"List model error: {e}")
            raise

    def pull_model(
        self,
        model_name: str
    ) -> Dict[str, Any]:
        """Download an Ollama model"""

        try:
            response = requests.post(
                f"{self.base_url}/api/pull",
                json={
                    "name": model_name,
                    "stream": False
                }
            )

            response.raise_for_status()

            return response.json()

        except Exception as e:
            self.logger.error(f"Pull model error: {e}")
            raise

    def check_server(self) -> bool:
        """Check whether Ollama server is running"""

        try:
            response = requests.get(
                f"{self.base_url}/api/tags",
                timeout=5
            )

            return response.status_code == 200

        except Exception:
            return False


if __name__ == "__main__":

    ollama = OllamaIntegration()

    print("=" * 50)
    print("Ollama Integration Demo")
    print("=" * 50)

    try:

        if ollama.check_server():
            print("✅ Ollama server is running")

            print("\nInstalled Models:")
            print(ollama.list_models())

            print("\nGenerated Text:")
            print(
                ollama.generate_text(
                    "Explain Machine Learning in simple words."
                )
            )

            print("\nChat Response:")

            messages = [
                {
                    "role": "user",
                    "content": "What is Artificial Intelligence?"
                }
            ]

            print(ollama.chat(messages))

        else:
            print("❌ Ollama server is not running.")
            print("Start Ollama and try again.")

    except Exception as e:
        print(f"Demo failed: {e}")