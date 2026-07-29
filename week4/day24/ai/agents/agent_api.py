from flask import Flask, request, jsonify
import logging

from langchain_agent import LangChainAgent
from conversation_agent import ConversationAgent


class AIAgentAPI:

    def __init__(self, openai_api_key: str):

        self.app = Flask(__name__)

        self.logger = logging.getLogger(__name__)

        self.langchain_agent = LangChainAgent(
            openai_api_key
        )

        self.conversation_agent = ConversationAgent(
            openai_api_key
        )

        self.setup_routes()

    def setup_routes(self):

        @self.app.route("/chat", methods=["POST"])
        def chat():

            try:

                data = request.get_json()

                message = data.get("message")

                agent_type = data.get(
                    "agent_type",
                    "langchain"
                )

                if not message:

                    return jsonify({
                        "error": "Message is required"
                    }), 400

                if agent_type == "langchain":

                    response = self.langchain_agent.chat(
                        message
                    )

                elif agent_type == "conversation":

                    response = self.conversation_agent.chat(
                        message
                    )

                else:

                    return jsonify({
                        "error": "Invalid agent type"
                    }), 400

                return jsonify({

                    "success": True,

                    "response": response,

                    "agent_type": agent_type

                })

            except Exception as e:

                self.logger.error(e)

                return jsonify({

                    "success": False,

                    "error": str(e)

                }), 500

        @self.app.route("/memory", methods=["GET"])
        def memory():

            try:

                agent_type = request.args.get(
                    "agent_type",
                    "langchain"
                )

                if agent_type == "langchain":

                    memory = self.langchain_agent.get_memory()

                else:

                    memory = self.conversation_agent.get_conversation_history()

                return jsonify({

                    "success": True,

                    "memory": memory

                })

            except Exception as e:

                return jsonify({

                    "error": str(e)

                }), 500

        @self.app.route("/memory/clear", methods=["POST"])
        def clear_memory():

            try:

                data = request.get_json()

                agent_type = data.get(
                    "agent_type",
                    "langchain"
                )

                if agent_type == "langchain":

                    self.langchain_agent.clear_memory()

                else:

                    self.conversation_agent.clear_memory()

                return jsonify({

                    "success": True,

                    "message": "Memory cleared"

                })

            except Exception as e:

                return jsonify({

                    "error": str(e)

                }), 500

        @self.app.route("/tools", methods=["GET"])
        def tools():

            try:

                agent_type = request.args.get(
                    "agent_type",
                    "langchain"
                )

                if agent_type == "langchain":

                    tool_names = [

                        tool.name

                        for tool in self.langchain_agent.tools

                    ]

                else:

                    tool_names = [

                        tool.name

                        for tool in self.conversation_agent.tools

                    ]

                return jsonify({

                    "success": True,

                    "tools": tool_names

                })

            except Exception as e:

                return jsonify({

                    "error": str(e)

                }), 500

        @self.app.route("/health", methods=["GET"])
        def health():

            return jsonify({

                "status": "healthy",

                "langchain": True,

                "conversation": True

            })

    def run(

        self,

        host="0.0.0.0",

        port=5000

    ):

        self.app.run(

            host=host,

            port=port,

            debug=True

        )


if __name__ == "__main__":

    api = AIAgentAPI(

        openai_api_key="YOUR_OPENAI_API_KEY"

    )

    api.run()