from .calculator import calculate
from .study_planner import create_study_plan
from .topic_tracker import TopicTracker


class ToolRegistry:
    """Registry of tools available to the StudyMate agent."""

    def __init__(self):
        self.topic_tracker = TopicTracker()
        self._tools = {
            "calculator": self._calculator,
            "study_planner": self._study_planner,
            "topic_tracker": self._topic_tracker,
        }

    def list_tools(self) -> list[str]:
        return list(self._tools.keys())

    def execute(self, name: str, **kwargs) -> str:
        tool = self._tools.get(name)
        if tool is None:
            return f"Tool error: unknown tool {name}"
        return tool(**kwargs)

    def _calculator(self, expression: str) -> str:
        return calculate(expression)

    def _study_planner(self, subject: str, days: int, level: str = "beginner") -> str:
        return create_study_plan(subject, days, level)

    def _topic_tracker(self, action: str, topic: str = "") -> str:
        if action == "add":
            return self.topic_tracker.add(topic)
        if action == "list":
            topics = self.topic_tracker.list_topics()
            return ", ".join(topics) if topics else "No topics tracked"
        if action == "clear":
            return self.topic_tracker.clear()
        return "Topic error: action must be add, list, or clear"
