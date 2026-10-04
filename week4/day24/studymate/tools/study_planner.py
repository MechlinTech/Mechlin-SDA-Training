def create_study_plan(subject: str, days: int, level: str = "beginner") -> str:
    """Create a structured study plan for a subject."""
    if not subject.strip():
        return "Study plan error: subject is required"
    if days < 1 or days > 30:
        return "Study plan error: days must be between 1 and 30"

    phases = [
        "Learn the fundamentals",
        "Practice core concepts",
        "Solve practical problems",
        "Review and test knowledge",
    ]
    selected = [phases[index % len(phases)] for index in range(days)]

    lines = [f"Study plan for {subject} ({level}, {days} days):"]
    for day, phase in enumerate(selected, start=1):
        lines.append(f"Day {day}: {phase} - focus on {subject} concepts and practice.")
    return "\n".join(lines)
