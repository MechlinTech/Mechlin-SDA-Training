import re

from ..memory.conversation import ConversationMemory
from ..tools.registry import ToolRegistry


class StudyMateAgent:
    """Rule-based study agent with memory and safe tool execution."""

    def __init__(self):
        self.memory = ConversationMemory()
        self.tools = ToolRegistry()

    def chat(self, message: str) -> str:
        message = message.strip()
        if not message:
            return "Please provide a message."

        self.memory.add("user", message)
        response = self._process(message)
        self.memory.add("assistant", response)
        return response

    def _process(self, message: str) -> str:
        text = message.lower()

        calculation = re.search(r"(?:calculate|what is|compute)\s+([0-9+*/().% -]+)", text)
        if calculation:
            return self.tools.execute("calculator", expression=calculation.group(1).strip())

        plan = re.search(r"(?:study plan|plan)\s+(?:for\s+)?([a-z0-9 +#.-]+?)(?:\s+for\s+(\d+)\s+days?)?(?:\s+at\s+(beginner|intermediate|advanced)\s+level)?$", text)
        if plan:
            subject = plan.group(1).strip()
            days = int(plan.group(2) or 7)
            level = plan.group(3) or "beginner"
            return self.tools.execute("study_planner", subject=subject, days=days, level=level)

        topic = re.search(r"(?:track|add)\s+topic\s+(.+)", message, re.IGNORECASE)
        if topic:
            return self.tools.execute("topic_tracker", action="add", topic=topic.group(1))

        if "list topics" in text or "my topics" in text:
            return self.tools.execute("topic_tracker", action="list")

        if "clear topics" in text:
            return self.tools.execute("topic_tracker", action="clear")

        if "history" in text or "what did we discuss" in text:
            messages = self.memory.recent_messages()[:-1]
            if not messages:
                return "No conversation history yet."
            return "\n".join(f"{item['role']}: {item['content']}" for item in messages)

        return (
            "I am StudyMate. I can help with calculations, study plans, "
            "topic tracking, and conversation history."
        )
