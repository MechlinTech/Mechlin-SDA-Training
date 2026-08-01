import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">
          AI Productivity Dashboard
        </h1>

        <p className="text-muted">
          Manage your tasks, analytics and AI assistant in one place.
        </p>
      </div>

      <div className="row g-4">

        <div className="col-lg-4">

          <div className="card shadow-lg border-0 h-100">

            <div className="card-body text-center">

              <i className="bi bi-list-task display-2 text-primary"></i>

              <h3 className="mt-3">
                Tasks
              </h3>

              <p className="text-muted">
                Create, update and manage your daily tasks.
              </p>

              <Link
                to="/tasks"
                className="btn btn-primary"
              >
                Open Tasks
              </Link>

            </div>

          </div>

        </div>

        <div className="col-lg-4">

          <div className="card shadow-lg border-0 h-100">

            <div className="card-body text-center">

              <i className="bi bi-bar-chart-line-fill display-2 text-success"></i>

              <h3 className="mt-3">
                Analytics
              </h3>

              <p className="text-muted">
                View your productivity statistics.
              </p>

              <Link
                to="/analytics"
                className="btn btn-success"
              >
                View Analytics
              </Link>

            </div>

          </div>

        </div>

        <div className="col-lg-4">

          <div className="card shadow-lg border-0 h-100">

            <div className="card-body text-center">

              <i className="bi bi-robot display-2 text-warning"></i>

              <h3 className="mt-3">
                AI Assistant
              </h3>

              <p className="text-muted">
                Ask Gemini AI anything to boost productivity.
              </p>

              <Link
                to="/ai-chat"
                className="btn btn-warning"
              >
                Chat with AI
              </Link>

            </div>

          </div>

        </div>

      </div>

      <div className="text-center mt-5">

        <button
          className="btn btn-danger btn-lg"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>

          Logout

        </button>

      </div>

    </div>
  );
}