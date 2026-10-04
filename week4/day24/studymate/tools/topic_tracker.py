class TopicTracker:
    """Track study topics for an agent session."""

    def __init__(self):
        self._topics = []

    def add(self, topic: str) -> str:
        topic = topic.strip()
        if not topic:
            return "Topic error: topic is required"
        if topic not in self._topics:
            self._topics.append(topic)
            return f"Added topic: {topic}"
        return f"Topic already tracked: {topic}"

    def list_topics(self) -> list[str]:
        return list(self._topics)

    def clear(self) -> str:
        self._topics.clear()
        return "All tracked topics cleared"
