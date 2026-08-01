import { useState } from "react";
import { chat } from "../services/ai.service";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const askAI = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const res = await chat(message, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResponse(res.data.response);
    } catch (err) {
      console.log(err);
      alert("Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">

      <div className="card shadow-lg border-0">

        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="bi bi-robot me-2"></i>
            AI Productivity Assistant
          </h3>
        </div>

        <div className="card-body">

          <label className="form-label fw-bold">
            Ask anything
          </label>

          <textarea
            rows="6"
            className="form-control"
            placeholder="Example: Explain JWT in simple words..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            className="btn btn-primary mt-3"
            onClick={askAI}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                ></span>
                Thinking...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                Ask AI
              </>
            )}
          </button>

          <hr />

          <h5 className="mb-3">
            AI Response
          </h5>

          <div
            className="border rounded p-3 bg-light"
            style={{
              minHeight: "220px",
              whiteSpace: "pre-wrap",
            }}
          >
            {response || "AI response will appear here..."}
          </div>

        </div>

      </div>

    </div>
  );
}