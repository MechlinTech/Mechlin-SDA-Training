from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import logging
from typing import Dict, Any


class HuggingFaceIntegration:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

        self.text_generator = pipeline(
            "text-generation",
            model="gpt2"
        )

        self.summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn"
        )

        self.qa_pipeline = pipeline(
            "question-answering"
        )

    def generate_text(
        self,
        prompt: str,
        max_length: int = 100,
        temperature: float = 0.7
    ) -> str:
        """Generate text using GPT-2"""

        try:
            result = self.text_generator(
                prompt,
                max_length=max_length,
                temperature=temperature,
                do_sample=True,
                num_return_sequences=1
            )

            return result[0]["generated_text"]

        except Exception as e:
            self.logger.error(f"Text generation error: {e}")
            raise

    def summarize_text(
        self,
        text: str,
        max_length: int = 150,
        min_length: int = 30
    ) -> str:
        """Summarize text"""

        try:
            summary = self.summarizer(
                text,
                max_length=max_length,
                min_length=min_length,
                do_sample=False
            )

            return summary[0]["summary_text"]

        except Exception as e:
            self.logger.error(f"Summarization error: {e}")
            raise

    def answer_question(
        self,
        question: str,
        context: str
    ) -> Dict[str, Any]:
        """Answer questions based on context"""

        try:
            answer = self.qa_pipeline(
                question=question,
                context=context
            )

            return answer

        except Exception as e:
            self.logger.error(f"Question answering error: {e}")
            raise

    def get_model_info(self) -> Dict[str, str]:
        """Return information about loaded models"""

        return {
            "text_generation": "gpt2",
            "summarization": "facebook/bart-large-cnn",
            "question_answering": "distilbert-base-cased-distilled-squad",
        }


if __name__ == "__main__":
    hf = HuggingFaceIntegration()

    print("=" * 50)
    print("Hugging Face Integration Demo")
    print("=" * 50)

    try:
        text = hf.generate_text(
            "Artificial Intelligence is",
            max_length=60
        )
        print("\nGenerated Text:")
        print(text)

        summary = hf.summarize_text(
            """
            Artificial Intelligence is transforming industries across
            healthcare, finance, education, manufacturing, and many
            other domains. Machine learning models are becoming more
            capable every year.
            """
        )

        print("\nSummary:")
        print(summary)

        qa = hf.answer_question(
            question="Which industries are being transformed?",
            context="""
            Artificial Intelligence is transforming industries across
            healthcare, finance, education, manufacturing, and many
            other domains.
            """
        )

        print("\nQuestion Answer:")
        print(qa)

    except Exception as e:
        print(f"Demo failed: {e}")