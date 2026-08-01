import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/auth.service";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await register(form);

      alert("Registration Successful!");

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div
        className="card shadow-lg p-4"
        style={{ width: "450px", borderRadius: "15px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">
            Create Account
          </h2>
          <p className="text-muted">
            Join AI Productivity App
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}