from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class Message:
    role: str
    content: str
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ConversationMemory:
    """Bounded in-memory conversation history."""

    def __init__(self, max_messages: int = 20):
        if max_messages < 2:
            raise ValueError("max_messages must be at least 2")
        self.max_messages = max_messages
        self._messages: list[Message] = []

    def add(self, role: str, content: str) -> None:
        if role not in {"user", "assistant", "system"}:
            raise ValueError("Unsupported message role")
        if not content.strip():
            raise ValueError("Message content cannot be empty")
        self._messages.append(Message(role=role, content=content))
        self._messages = self._messages[-self.max_messages:]

    def history(self) -> list[dict[str, str]]:
        return [
            {"role": message.role, "content": message.content, "timestamp": message.timestamp}
            for message in self._messages
        ]

    def recent_messages(self, limit: int = 6) -> list[dict[str, str]]:
        if limit < 1:
            return []
        return self.history()[-limit:]

    def clear(self) -> None:
        self._messages.clear()

    def size(self) -> int:
        return len(self._messages)
