class AIService {
    constructor(baseURL = "http://localhost:5000") {
        this.baseURL = baseURL;
    }

    async generateOpenAI(prompt) {
        try {
            const response = await fetch(`${this.baseURL}/generate/openai`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt })
            });

            return await response.json();
        } catch (error) {
            console.error("OpenAI Error:", error);
            throw error;
        }
    }

    async generateHuggingFace(prompt) {
        try {
            const response = await fetch(`${this.baseURL}/generate/huggingface`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt })
            });

            return await response.json();
        } catch (error) {
            console.error("Hugging Face Error:", error);
            throw error;
        }
    }

    async generateOllama(prompt) {
        try {
            const response = await fetch(`${this.baseURL}/generate/ollama`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt })
            });

            return await response.json();
        } catch (error) {
            console.error("Ollama Error:", error);
            throw error;
        }
    }

    async summarize(text) {
        try {
            const response = await fetch(`${this.baseURL}/summarize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text })
            });

            return await response.json();
        } catch (error) {
            console.error("Summarization Error:", error);
            throw error;
        }
    }

    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return await response.json();
        } catch (error) {
            console.error("Health Check Error:", error);
            throw error;
        }
    }
}

const aiService = new AIService();

async function demo() {
    console.log("===== AI Integration Demo =====");

    try {
        const health = await aiService.healthCheck();
        console.log("Health:", health);

        const openai = await aiService.generateOpenAI(
            "Explain Artificial Intelligence in one paragraph."
        );
        console.log("OpenAI Response:", openai);

        const hf = await aiService.generateHuggingFace(
            "Write a short paragraph about Machine Learning."
        );
        console.log("Hugging Face Response:", hf);

        const ollama = await aiService.generateOllama(
            "What is Deep Learning?"
        );
        console.log("Ollama Response:", ollama);

        const summary = await aiService.summarize(
            "Artificial Intelligence is transforming industries worldwide by automating tasks, improving decision-making, and enabling innovative applications."
        );
        console.log("Summary:", summary);

    } catch (error) {
        console.error(error);
    }
}

demo();