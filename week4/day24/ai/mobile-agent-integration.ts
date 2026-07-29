import AsyncStorage from "@react-native-async-storage/async-storage";

interface AgentMessage {
    user: string;
    agent: string;
    timestamp: string;
    agentType: string;
}

interface AgentMemory {
    chat_history: any[];
    memory_variables: any;
}

class MobileAIAgentIntegration {

    private apiBaseUrl: string;

    private conversationHistory: AgentMessage[] = [];

    private agentType: string = "langchain";

    constructor(apiBaseUrl: string) {

        this.apiBaseUrl = apiBaseUrl;

        this.loadConversationHistory();

    }

    async loadConversationHistory() {

        try {

            const history = await AsyncStorage.getItem(
                "agent_conversation_history"
            );

            if (history) {

                this.conversationHistory = JSON.parse(history);

            }

        }

        catch (error) {

            console.error(error);

        }

    }

    async saveConversationHistory() {

        try {

            await AsyncStorage.setItem(

                "agent_conversation_history",

                JSON.stringify(this.conversationHistory)

            );

        }

        catch (error) {

            console.error(error);

        }

    }

    async chat(

        message: string,

        agentType: string = "langchain"

    ): Promise<string> {

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

            const conversation: AgentMessage = {

                user: message,

                agent: result.response,

                timestamp: new Date().toISOString(),

                agentType

            };

            this.conversationHistory.push(

                conversation

            );

            await this.saveConversationHistory();

            return result.response;

        }

        catch (error) {

            console.error(error);

            throw error;

        }

    }

    async getMemory(

        agentType: string = "langchain"

    ): Promise<AgentMemory | null> {

        try {

            const response = await fetch(

                `${this.apiBaseUrl}/memory?agent_type=${agentType}`

            );

            if (response.ok) {

                const result = await response.json();

                return result.memory;

            }

        }

        catch (error) {

            console.error(error);

        }

        return null;

    }

    async clearMemory(

        agentType: string = "langchain"

    ): Promise<boolean> {

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

                await this.saveConversationHistory();

                return true;

            }

        }

        catch (error) {

            console.error(error);

        }

        return false;

    }

    async listTools(

        agentType: string = "langchain"

    ): Promise<string[]> {

        try {

            const response = await fetch(

                `${this.apiBaseUrl}/tools?agent_type=${agentType}`

            );

            if (response.ok) {

                const result = await response.json();

                return result.tools;

            }

        }

        catch (error) {

            console.error(error);

        }

        return [];

    }

    getConversationHistory(): AgentMessage[] {

        return this.conversationHistory;

    }

    setAgentType(agentType: string): void {

        this.agentType = agentType;

    }

    getAgentType(): string {

        return this.agentType;

    }

}

export default MobileAIAgentIntegration;