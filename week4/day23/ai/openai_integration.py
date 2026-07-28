import openai
import os
import logging
from typing import List, Dict, Any, Optional
import json


class OpenAIIntegration:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")

        if not self.api_key:
            raise ValueError("OpenAI API key is required")

        openai.api_key = self.api_key

        self.logger = logging.getLogger(__name__)

        self.models = {
            "gpt-4": "gpt-4",
            "gpt-3.5-turbo": "gpt-3.5-turbo",
            "text-davinci-003": "text-davinci-003",
        }

    def generate_text(
        self,
        prompt: str,
        model: str = "gpt-3.5-turbo",
        max_tokens: int = 1000,
        temperature: float = 0.7,
    ) -> str:
        """Generate text using OpenAI API"""
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                max_tokens=max_tokens,
                temperature=temperature,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            self.logger.error(f"OpenAI API error: {e}")
            raise

    def generate_summary(self, text: str, max_length: int = 150) -> str:
        """Generate summary"""

        prompt = f"""
Please provide a concise summary of the following text in no more than {max_length} words.

{text}
"""

        return self.generate_text(
            prompt,
            max_tokens=max_length,
        )

    def generate_code(
        self,
        description: str,
        language: str = "python",
    ) -> str:
        """Generate code"""

        prompt = f"""
Write {language} code for the following description.

{description}

Please provide only the code without explanations.
"""

        return self.generate_text(
            prompt,
            temperature=0.3,
        )

    def generate_documentation(
        self,
        code: str,
        language: str = "python",
    ) -> str:
        """Generate documentation"""

        prompt = f"""
Generate comprehensive documentation for the following {language} code.

{code}

Include:
- Function descriptions
- Parameters
- Return values
- Usage examples
"""

        return self.generate_text(
            prompt,
            temperature=0.5,
        )

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-3.5-turbo",
    ) -> str:
        """Chat completion"""

        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=messages,
                max_tokens=1000,
                temperature=0.7,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            self.logger.error(f"Chat completion error: {e}")
            raise

    def generate_embeddings(
        self,
        text: str,
        model: str = "text-embedding-ada-002",
    ) -> List[float]:
        """Generate embeddings"""

        try:
            response = openai.Embedding.create(
                model=model,
                input=text,
            )

            return response.data[0].embedding

        except Exception as e:
            self.logger.error(f"Embedding generation error: {e}")
            raise

    def batch_generate(
        self,
        prompts: List[str],
        model: str = "gpt-3.5-turbo",
    ) -> List[str]:
        """Generate text for multiple prompts"""

        results = []

        for prompt in prompts:
            try:
                result = self.generate_text(
                    prompt,
                    model,
                )
                results.append(result)

            except Exception as e:
                self.logger.error(
                    f"Batch generation error for prompt: {prompt}"
                )
                results.append(f"Error: {str(e)}")

        return results