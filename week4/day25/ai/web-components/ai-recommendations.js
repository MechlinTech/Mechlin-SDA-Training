class AIRecommendations {
    constructor(options = {}) {
        this.apiEndpoint = options.apiEndpoint || "/api/ai/recommendations";
        this.container = options.container || document.body;

        this.recommendations = [];
        this.filters = {};

        this.initialize();
    }

    initialize() {
        this.render();
        this.cacheElements();
        this.attachEvents();

        this.loadRecommendations();
    }

    render() {
        const section = document.createElement("section");

        section.className = "ai-recommendations";

        section.innerHTML = `
            <div class="recommendation-card">

                <div class="recommendation-header">
                    <h2>AI Recommendations</h2>
                    <p>Personalized suggestions powered by AI.</p>
                </div>

                <div class="recommendation-controls">

                    <input
                        id="recommendation-search"
                        type="text"
                        placeholder="Search..."
                    />

                    <select id="recommendation-category">
                        <option value="">All Categories</option>
                        <option value="technology">Technology</option>
                        <option value="business">Business</option>
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                        <option value="finance">Finance</option>
                    </select>

                    <button id="refresh-recommendations">
                        Refresh
                    </button>

                </div>

                <div
                    id="recommendation-loading"
                    style="display:none;"
                >
                    Loading recommendations...
                </div>

                <div
                    id="recommendation-list"
                    class="recommendation-list"
                ></div>

            </div>
        `;

        this.container.appendChild(section);

        this.root = section;
    }

    cacheElements() {
        this.searchInput =
            this.root.querySelector("#recommendation-search");

        this.categorySelect =
            this.root.querySelector("#recommendation-category");

        this.refreshButton =
            this.root.querySelector("#refresh-recommendations");

        this.loadingBox =
            this.root.querySelector("#recommendation-loading");

        this.listContainer =
            this.root.querySelector("#recommendation-list");
    }

    attachEvents() {

        this.refreshButton.addEventListener("click", () => {
            this.loadRecommendations();
        });

        this.searchInput.addEventListener("input", () => {
            this.applyFilters();
        });

        this.categorySelect.addEventListener("change", () => {
            this.applyFilters();
        });
    }
    async loadRecommendations() {
        this.setLoading(true);

        try {
            const response = await fetch(this.apiEndpoint, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();

            this.recommendations = Array.isArray(data)
                ? data
                : (data.recommendations || []);

            this.renderRecommendations(this.recommendations);

        } catch (error) {
            console.error("Recommendation Error:", error);

            this.listContainer.innerHTML = `
                <div class="recommendation-error">
                    Unable to load recommendations.
                </div>
            `;
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(state) {
        this.loadingBox.style.display =
            state ? "block" : "none";

        this.refreshButton.disabled = state;
    }

    renderRecommendations(items) {

        if (!items.length) {
            this.listContainer.innerHTML = `
                <div class="empty-state">
                    No recommendations found.
                </div>
            `;
            return;
        }

        this.listContainer.innerHTML = "";

        items.forEach(item => {

            const card = document.createElement("div");

            card.className = "recommendation-item";

            card.innerHTML = `
                <h3>${item.title || "Untitled"}</h3>

                <p>
                    ${item.description || ""}
                </p>

                <div class="recommendation-meta">

                    <span>
                        ${item.category || "General"}
                    </span>

                    <span>
                        Score:
                        ${item.score ?? "-"}
                    </span>

                </div>

                <button class="recommendation-action">
                    View Details
                </button>
            `;

            card.querySelector(".recommendation-action")
                .addEventListener("click", () => {
                    this.openRecommendation(item);
                });

            this.listContainer.appendChild(card);

        });
    }

    applyFilters() {

        const keyword =
            this.searchInput.value
                .trim()
                .toLowerCase();

        const category =
            this.categorySelect.value;

        const filtered =
            this.recommendations.filter(item => {

                const matchesKeyword =
                    !keyword ||
                    (item.title || "")
                        .toLowerCase()
                        .includes(keyword) ||
                    (item.description || "")
                        .toLowerCase()
                        .includes(keyword);

                const matchesCategory =
                    !category ||
                    item.category === category;

                return (
                    matchesKeyword &&
                    matchesCategory
                );
            });

        this.renderRecommendations(filtered);
    }

    openRecommendation(item) {

        alert(
            `${item.title}\n\n${item.description}`
        );
    }
    refreshRecommendations() {
        this.loadRecommendations();
    }

    addRecommendation(recommendation) {
        if (!recommendation || typeof recommendation !== "object") {
            return;
        }

        this.recommendations.unshift(recommendation);
        this.applyFilters();
    }

    removeRecommendation(index) {
        if (
            index < 0 ||
            index >= this.recommendations.length
        ) {
            return;
        }

        this.recommendations.splice(index, 1);
        this.applyFilters();
    }

    clearRecommendations() {
        this.recommendations = [];
        this.renderRecommendations([]);
    }

    getRecommendations() {
        return [...this.recommendations];
    }

    destroy() {
        if (this.root) {
            this.root.remove();
        }
    }
}

/* ------------------------------------
   Automatic Initialization
------------------------------------ */

// document.addEventListener("DOMContentLoaded", () => {

//     const container =
//         document.querySelector("#ai-recommendations") ||
//         document.body;

//     window.aiRecommendations =
//         new AIRecommendations({
//             container,
//             apiEndpoint: "/api/ai/recommendations"
//         });

// });

/* ------------------------------------
   Module Export
------------------------------------ */

if (typeof module !== "undefined" && module.exports) {
    module.exports = AIRecommendations;
}

if (typeof window !== "undefined") {
    window.AIRecommendations = AIRecommendations;
}