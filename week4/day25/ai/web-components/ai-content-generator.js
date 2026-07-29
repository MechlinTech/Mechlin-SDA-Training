class AIContentGenerator {
    constructor(options = {}) {
        this.apiEndpoint = options.apiEndpoint || "/api/ai/generate";
        this.container = options.container || document.body;

        this.generatedContent = "";
        this.lastPayload = null;
        this.isGenerating = false;

        this.initialize();
    }

    initialize() {
        this.render();
        this.cacheElements();
        this.attachEvents();
    }

    render() {
        const wrapper = document.createElement("section");
        wrapper.className = "ai-content-generator";

        wrapper.innerHTML = `
            <div class="generator-card">

                <div class="generator-header">
                    <h2>AI Content Generator</h2>
                    <p>Create high-quality AI generated content.</p>
                </div>

                <div class="generator-form">

                    <div class="form-group">
                        <label>Content Type</label>
                        <select id="cg-type">
                            <option value="article">Article</option>
                            <option value="blog">Blog</option>
                            <option value="email">Email</option>
                            <option value="social">Social Media</option>
                            <option value="summary">Summary</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Topic</label>
                        <input
                            id="cg-topic"
                            type="text"
                            placeholder="Enter topic..."
                        />
                    </div>

                    <div class="form-group">
                        <label>Tone</label>
                        <select id="cg-tone">
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="casual">Casual</option>
                            <option value="formal">Formal</option>
                            <option value="creative">Creative</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Length</label>
                        <select id="cg-length">
                            <option value="short">Short</option>
                            <option value="medium" selected>Medium</option>
                            <option value="long">Long</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Keywords</label>
                        <input
                            id="cg-keywords"
                            type="text"
                            placeholder="AI, Technology, Innovation"
                        />
                    </div>

                    <button id="cg-generate">
                        Generate Content
                    </button>

                </div>

                <div
                    id="cg-loading"
                    class="generator-loading"
                    style="display:none;"
                >
                    Generating content...
                </div>

                <div
                    id="cg-result"
                    class="generator-result"
                    style="display:none;"
                >
                    <h3>Generated Content</h3>

                    <pre id="cg-output"></pre>

                    <div class="result-actions">
                        <button id="cg-copy">
                            Copy
                        </button>

                        <button id="cg-regenerate">
                            Regenerate
                        </button>

                        <button id="cg-clear">
                            Clear
                        </button>
                    </div>
                </div>

            </div>
        `;

        this.container.appendChild(wrapper);
        this.root = wrapper;
    }

    cacheElements() {
        this.typeInput = this.root.querySelector("#cg-type");
        this.topicInput = this.root.querySelector("#cg-topic");
        this.toneInput = this.root.querySelector("#cg-tone");
        this.lengthInput = this.root.querySelector("#cg-length");
        this.keywordInput = this.root.querySelector("#cg-keywords");

        this.generateButton = this.root.querySelector("#cg-generate");

        this.loadingBox = this.root.querySelector("#cg-loading");
        this.resultBox = this.root.querySelector("#cg-result");
        this.outputBox = this.root.querySelector("#cg-output");

        this.copyButton = this.root.querySelector("#cg-copy");
        this.regenerateButton = this.root.querySelector("#cg-regenerate");
        this.clearButton = this.root.querySelector("#cg-clear");
    }

    attachEvents() {
        this.generateButton.addEventListener("click", () => {
            this.generateContent();
        });

        this.copyButton.addEventListener("click", () => {
            this.copyContent();
        });

        this.regenerateButton.addEventListener("click", () => {
            this.regenerateContent();
        });

        this.clearButton.addEventListener("click", () => {
            this.clearContent();
        });

        this.topicInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.generateContent();
            }
        });
    }
    async generateContent() {
        if (this.isGenerating) return;

        const topic = this.topicInput.value.trim();

        if (!topic) {
            alert("Please enter a topic.");
            this.topicInput.focus();
            return;
        }

        const payload = {
            type: this.typeInput.value,
            topic,
            tone: this.toneInput.value,
            length: this.lengthInput.value,
            keywords: this.keywordInput.value
                .split(",")
                .map(item => item.trim())
                .filter(Boolean)
        };

        this.lastPayload = payload;

        this.setLoading(true);

        try {
            const response = await fetch(this.apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();

            const content =
                data.content ||
                data.result ||
                data.text ||
                "No content was returned by the server.";

            this.generatedContent = content;

            this.showContent(content);

        } catch (error) {
            console.error(error);

            this.showError(
                error.message ||
                "Unable to generate content."
            );

        } finally {
            this.setLoading(false);
        }
    }

    setLoading(state) {
        this.isGenerating = state;

        this.loadingBox.style.display =
            state ? "block" : "none";

        this.generateButton.disabled = state;

        this.generateButton.textContent =
            state
                ? "Generating..."
                : "Generate Content";
    }

    showContent(content) {
        this.outputBox.textContent = content;
        this.resultBox.style.display = "block";
    }

    showError(message) {
        this.resultBox.style.display = "block";

        this.outputBox.textContent =
            `Error: ${message}`;
    }

    getCurrentConfiguration() {
        return {
            type: this.typeInput.value,
            topic: this.topicInput.value.trim(),
            tone: this.toneInput.value,
            length: this.lengthInput.value,
            keywords: this.keywordInput.value
        };
    }

    async regenerateContent() {
        if (!this.lastPayload) {
            alert("Generate content first.");
            return;
        }

        this.topicInput.value = this.lastPayload.topic;
        this.typeInput.value = this.lastPayload.type;
        this.toneInput.value = this.lastPayload.tone;
        this.lengthInput.value = this.lastPayload.length;
        this.keywordInput.value =
            this.lastPayload.keywords.join(", ");

        await this.generateContent();
    }

    clearContent() {
        this.generatedContent = "";
        this.lastPayload = null;

        this.outputBox.textContent = "";

        this.resultBox.style.display = "none";

        this.topicInput.value = "";
        this.keywordInput.value = "";

        this.topicInput.focus();
    }
    async copyContent() {
        if (!this.generatedContent) {
            alert("No content available to copy.");
            return;
        }

        try {
            await navigator.clipboard.writeText(this.generatedContent);

            const originalText = this.copyButton.textContent;
            this.copyButton.textContent = "Copied!";

            setTimeout(() => {
                this.copyButton.textContent = originalText;
            }, 1500);

        } catch (error) {
            console.error("Copy failed:", error);
            alert("Unable to copy content.");
        }
    }

    exportContent(filename = "generated-content.txt") {
        if (!this.generatedContent) {
            alert("Nothing to export.");
            return;
        }

        const blob = new Blob(
            [this.generatedContent],
            { type: "text/plain;charset=utf-8" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

    resetForm() {
        this.typeInput.value = "article";
        this.topicInput.value = "";
        this.toneInput.value = "professional";
        this.lengthInput.value = "medium";
        this.keywordInput.value = "";

        this.generatedContent = "";
        this.lastPayload = null;

        this.outputBox.textContent = "";
        this.resultBox.style.display = "none";

        this.topicInput.focus();
    }

    destroy() {
        this.root.remove();
    }
}

/* -----------------------------
   Automatic Initialization
------------------------------ */

// document.addEventListener("DOMContentLoaded", () => {
//     const container =
//         document.querySelector("#ai-content-generator") ||
//         document.body;

//     window.aiContentGenerator = new AIContentGenerator({
//         container,
//         apiEndpoint: "/api/ai/generate"
//     });
// });

/* -----------------------------
   Module Support
------------------------------ */

if (typeof module !== "undefined" && module.exports) {
    module.exports = AIContentGenerator;
}

if (typeof window !== "undefined") {
    window.AIContentGenerator = AIContentGenerator;
}