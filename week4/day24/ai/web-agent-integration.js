class WebAIAgentIntegration {

    constructor(apiBaseUrl) {

        this.apiBaseUrl = apiBaseUrl;

        this.conversationHistory = [];

        this.agentType = "langchain";
    }

    async chat(message, agentType = "langchain") {

        try {

            const response = await fetch(

                `${this.apiBaseUrl}/chat`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        message,

                        agent_type: agentType

                    })

                }

            );

            if (!response.ok) {

                throw new Error(

                    `HTTP Error ${response.status}`

                );

            }

            const result = await response.json();

            this.conversationHistory.push({

                user: message,

                agent: result.response,

                timestamp: new Date().toISOString(),

                agentType

            });

            return result.response;

        } catch (error) {

            console.error(error);

            throw error;

        }

    }

    async getMemory(agentType = "langchain") {

        try {

            const response = await fetch(

                `${this.apiBaseUrl}/memory?agent_type=${agentType}`

            );

            if (response.ok) {

                const result = await response.json();

                return result.memory;

            }

        } catch (error) {

            console.error(error);

        }

        return null;

    }

    async clearMemory(agentType = "langchain") {

        try {

            const response = await fetch(

                `${this.apiBaseUrl}/memory/clear`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        agent_type: agentType

                    })

                }

            );

            if (response.ok) {

                this.conversationHistory = [];

                return true;

            }

        } catch (error) {

            console.error(error);

        }

        return false;

    }

    async listTools(agentType = "langchain") {

        try {

            const response = await fetch(

                `${this.apiBaseUrl}/tools?agent_type=${agentType}`

            );

            if (response.ok) {

                const result = await response.json();

                return result.tools;

            }

        } catch (error) {

            console.error(error);

        }

        return [];

    }

    getConversationHistory() {

        return this.conversationHistory;

    }

    setAgentType(agentType) {

        this.agentType = agentType;

    }

    getAgentType() {

        return this.agentType;

    }

}

const aiAgent = new WebAIAgentIntegration(

    "http://localhost:5000"

);

async function demo() {

    try {

        console.log(

            await aiAgent.chat(

                "Hello AI Agent"

            )

        );

        console.log(

            await aiAgent.listTools()

        );

        console.log(

            await aiAgent.getMemory()

        );

    }

    catch (error) {

        console.error(error);

    }

}

demo();