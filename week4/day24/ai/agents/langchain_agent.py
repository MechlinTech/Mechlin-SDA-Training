from langchain.agents import initialize_agent, Tool, AgentType
from langchain.llms import OpenAII
from langchain.memory import ConversationBufferMemory
from langchain.tools import BaseTool

from typing import List, Dict, Any
import logging


class CustomTool(BaseTool):
    name = "custom_tool"
    description = "A custom tool for specific tasks"

    def _run(self, query: str) -> str:
        return f"Custom tool result for: {query}"

    async def _arun(self, query: str) -> str:
        return self._run(query)


class LangChainAgent:

    def __init__(self, openai_api_key: str):

        self.logger = logging.getLogger(__name__)

        self.llm = OpenAI(
            temperature=0.7,
            openai_api_key=openai_api_key
        )

        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )

        self.tools = self._initialize_tools()

        self.agent = self._initialize_agent()

    def _initialize_tools(self) -> List[Tool]:

        return [

            Tool(
                name="calculator",
                description="Useful for mathematical calculations",
                func=self._calculator_tool
            ),

            Tool(
                name="web_search",
                description="Search the web for current information",
                func=self._web_search_tool
            ),

            Tool(
                name="file_operations",
                description="Read write and manage files",
                func=self._file_operations_tool
            ),

            Tool(
                name="database_query",
                description="Query database for information",
                func=self._database_query_tool
            ),

            CustomTool()
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

    def _calculator_tool(self, query: str) -> str:

        try:

            result = eval(query)

            return f"Calculation result: {result}"

        except Exception as e:

            return f"Calculation error: {e}"

    def _web_search_tool(self, query: str) -> str:

        return f"Web search results for: {query}"

    def _file_operations_tool(self, query: str) -> str:

        try:

            query = query.lower()

            if "read" in query:
                return "File read successfully"

            elif "write" in query:
                return "File written successfully"

            else:
                return "File operation completed"

        except Exception as e:

            return f"File operation error: {e}"

    def _database_query_tool(self, query: str) -> str:

        try:

            return f"Database query result for: {query}"

        except Exception as e:

            return f"Database query error: {e}"

    def chat(self, message: str) -> str:

        try:

            response = self.agent.run(
                input=message
            )

            return response

        except Exception as e:

            self.logger.error(e)

            return f"Error: {e}"

    def get_memory(self) -> Dict[str, Any]:

        return {
            "chat_history": self.memory.chat_memory.messages,
            "memory_variables": self.memory.memory_variables
        }

    def clear_memory(self):

        self.memory.clear()

    def add_tool(self, tool: Tool):

        self.tools.append(tool)

        self.agent = self._initialize_agent()

    def remove_tool(self, tool_name: str):

        self.tools = [
            tool
            for tool in self.tools
            if tool.name != tool_name
        ]

        self.agent = self._initialize_agent()


if __name__ == "__main__":

    print("=" * 50)
    print("LangChain Agent Demo")
    print("=" * 50)

    print("This file demonstrates a LangChain agent with:")
    print("- Conversation memory")
    print("- Custom tools")
    print("- Calculator tool")
    print("- Web search placeholder")
    print("- File operations placeholder")
    print("- Database query placeholder")