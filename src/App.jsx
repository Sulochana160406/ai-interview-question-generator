import { useState } from "react";
import { GROQ_API_KEY } from "./config";

function App() {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Fresher / Entry-level");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = GROQ_API_KEY;
  console.log("KEY:", API_KEY);

  const generateQuestions = async () => {
    if (!role.trim()) return alert("Please enter a job role!");
    if (role.trim().length < 3) return alert("Please enter a valid job role!");
    if (/^[^a-zA-Z]+$/.test(role.trim())) return alert("Please enter a valid job role name!");
    setLoading(true);
    setQuestions([]);

    const prompt = `Generate ${count} interview questions for a ${level} ${role}.
Return ONLY a JSON array. No markdown. Keep answers to 1-2 sentences only.
Each object: {"question":"...","type":"HR or Technical or Behavioral","answer":"1-2 sentence answer","tip":"short tip"}`;

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 4000,
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );
      const data = await res.json();
      const text = data.choices[0].message.content;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQuestions(parsed);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const badgeColors = {
    HR: { background: "#e0f2fe", color: "#0369a1" },
    Technical: { background: "#dcfce7", color: "#166534" },
    Behavioral: { background: "#fce7f3", color: "#9d174d" },
    Situational: { background: "#fef9c3", color: "#854d0e" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Segoe UI', sans-serif", padding: "1rem" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem", padding: "2.5rem 1rem", background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)", borderRadius: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", borderRadius: "99px", padding: "6px 18px", marginBottom: "16px" }}>
            <span style={{ color: "#a78bfa", fontSize: "13px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>✦ AI Powered Tool</span>
          </div>
          <h1 style={{ fontSize: "2.6rem", fontWeight: "800", color: "#ffffff", margin: "0 0 12px", lineHeight: "1.2", letterSpacing: "-1px" }}>
            AI Interview Question
            <span style={{ display: "block", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Generator
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", margin: "0 0 20px", lineHeight: "1.6" }}>
            Enter any job role → get custom interview questions + model answers instantly!
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
              <span>⚡</span><span>Instant generation</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
              <span>🎯</span><span>Role specific questions</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
              <span>💡</span><span>Model answers included</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "1.8rem", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", marginBottom: "1.5rem" }}>

          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>Job Role</label>
          <input
            type="text"
            placeholder="e.g. Software Engineer, Data Analyst..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", fontSize: "15px", border: "1.5px solid #e0e0e0", borderRadius: "10px", outline: "none", marginBottom: "1rem", boxSizing: "border-box", color: "#333" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1.2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>Experience Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", fontSize: "14px", border: "1.5px solid #e0e0e0", borderRadius: "10px", outline: "none", color: "#333", background: "#fff" }}
              >
                <option>Fresher / Entry-level</option>
                <option>Mid-level (2–4 yrs)</option>
                <option>Senior (5+ yrs)</option>
                <option>Manager / Lead</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px" }}>No. of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="e.g. 5"
                style={{ width: "100%", padding: "12px 14px", fontSize: "14px", border: "1.5px solid #e0e0e0", borderRadius: "10px", outline: "none", color: "#333", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <button
            onClick={generateQuestions}
            disabled={loading}
            style={{ width: "100%", padding: "14px", fontSize: "15px", fontWeight: "700", background: loading ? "#aaa" : "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Generating..." : "Generate Questions ✨"}
          </button>
        </div>

        {/* Results */}
        {questions.length > 0 && (
          <div>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "#444", marginBottom: "1rem" }}>
              {questions.length} questions generated for <strong>{role}</strong>
            </p>
            {questions.map((q, i) => (
              <QuestionCard key={i} q={q} index={i} badge={badgeColors[q.type] || { background: "#f3f4f6", color: "#374151" }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionCard({ q, index, badge }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: "#fff", borderRadius: "14px", padding: "1.4rem", marginBottom: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderLeft: "4px solid #667eea" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#888" }}>Q{index + 1}</span>
        <span style={{ ...badge, padding: "3px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "600" }}>{q.type}</span>
      </div>
      <p style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a2e", marginBottom: "12px", lineHeight: "1.5" }}>{q.question}</p>

      <button
        onClick={() => setOpen(!open)}
        style={{ background: "none", border: "1.5px solid #667eea", color: "#667eea", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginBottom: open ? "12px" : "8px" }}
      >
        {open ? "▲ Hide Answer" : "▼ Show Model Answer"}
      </button>

      {open && (
        <div style={{ background: "#f8f8f8", borderRadius: "10px", padding: "1rem", marginBottom: "10px" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "#555", marginBottom: "6px", textTransform: "uppercase" }}>Model Answer</p>
          <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.7", margin: 0 }}>{q.answer}</p>
        </div>
      )}

      <div style={{ background: "#fffbeb", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#92400e", borderLeft: "3px solid #f59e0b" }}>
        <strong>Tip:</strong> {q.tip}
      </div>
    </div>
  );
}

export default App;