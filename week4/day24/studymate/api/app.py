from flask import Flask, jsonify, request

from ..agents.studymate_agent import StudyMateAgent


app = Flask(__name__)
agent = StudyMateAgent()


@app.get("/health")
def health():
    return jsonify({"status": "healthy", "service": "studymate-agent"})


@app.post("/chat")
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")

    if not isinstance(message, str) or not message.strip():
        return jsonify({"error": "message is required"}), 400

    return jsonify({"response": agent.chat(message)})


@app.get("/memory")
def memory():
    return jsonify({"messages": agent.memory.history(), "count": agent.memory.size()})


@app.post("/memory/clear")
def clear_memory():
    agent.memory.clear()
    return jsonify({"status": "cleared"})


@app.get("/tools")
def tools():
    return jsonify({"tools": agent.tools.list_tools()})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
