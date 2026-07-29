from langchain.agents import initialize_agent, Tool, AgentType
from langchain.llms import OpenAI
from langchain.memory import (
    ConversationBufferWindowMemory,
    ConversationSummaryMemory
)

from typing import List, Dict, Any
import logging
import json


class ConversationAgent:

    def __init__(
        self,
        openai_api_key: str,
        max_memory_length: int = 10
    ):

        self.logger = logging.getLogger(__name__)

        self.llm = OpenAI(
            temperature=0.7,
            openai_api_key=openai_api_key
        )

        self.memory = ConversationBufferWindowMemory(
            k=max_memory_length,
            memory_key="chat_history",
            return_messages=True
        )

        self.summary_memory = ConversationSummaryMemory(
            llm=self.llm,
            memory_key="chat_history"
        )

        self.context = {}

        self.tools = self._initialize_tools()

        self.agent = self._initialize_agent()

    def _initialize_tools(self):

        return [

            Tool(
                name="context_manager",
                description="Manage conversation context",
                func=self._context_manager_tool
            ),

            Tool(
                name="emotion_analyzer",
                description="Analyze conversation emotion",
                func=self._emotion_analyzer_tool
            ),

            Tool(
                name="topic_tracker",
                description="Track conversation topics",
                func=self._topic_tracker_tool
            ),

            Tool(
                name="reminder_setter",
                description="Manage reminders",
                func=self._reminder_setter_tool
            )
        ]

    def _initialize_agent(self):

        return initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
            memory=self.memory,
            verbose=True,
            handle_parsing_errors=True
        )

    def _context_manager_tool(self, query: str):

        try:

            query = query.lower()

            if "clear" in query:

                self.clear_memory()

                return "Conversation context cleared"

            elif "summary" in query:

                return self.get_conversation_summary()

            elif "context" in query:

                return json.dumps(
                    self.context,
                    indent=2
                )

            return "Context updated"

        except Exception as e:

            return str(e)

    def _emotion_analyzer_tool(self, query: str):

        emotions = [
            "happy",
            "sad",
            "neutral",
            "excited",
            "worried"
        ]

        return f"Detected emotion: {emotions[2]}"

    def _topic_tracker_tool(self, query: str):

        topics = [
            "technology",
            "education",
            "work",
            "health",
            "travel"
        ]

        return ", ".join(topics)

    def _reminder_setter_tool(self, query: str):

        query = query.lower()

        if "remind" in query:

            return "Reminder created"

        elif "follow" in query:

            return "Follow-up created"

        return "Reminder processed"

    def chat(self, message: str):

        try:

            self._update_context(message)

            response = self.agent.run(
                input=message
            )

            self._update_context(
                response,
                is_response=True
            )

            return response

        except Exception as e:

            self.logger.error(e)

            return str(e)

    def _update_context(
        self,
        message,
        is_response=False
    ):

        if is_response:

            self.context["last_response"] = message

        else:

            self.context["last_input"] = message

            self.context["message_count"] = (
                self.context.get(
                    "message_count",
                    0
                ) + 1
            )

    def get_conversation_summary(self):

        try:

            summary = self.summary_memory.load_memory_variables({})

            return summary.get(
                "chat_history",
                "No conversation history."
            )

        except Exception as e:

            return str(e)

    def get_conversation_history(self):

        history = []

        try:

            for message in self.memory.chat_memory.messages:

                history.append({

                    "type": message.__class__.__name__,

                    "content": message.content

                })

        except Exception as e:

            self.logger.error(e)

        return history

    def clear_memory(self):

        self.memory.clear()

        self.summary_memory.clear()

        self.context = {}

    def set_context(
        self,
        key,
        value
    ):

        self.context[key] = value

    def get_context(
        self,
        key
    ):

        return self.context.get(key)


if __name__ == "__main__":

    print("=" * 50)
    print("Conversation Agent Demo")
    print("=" * 50)

    print("Conversation agent initialized successfully.")