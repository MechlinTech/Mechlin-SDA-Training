import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analytics.service";

export default function Analytics() {
  const [data, setData] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getAnalytics({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data.analytics || res.data.data || {});
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success">
          <i className="bi bi-bar-chart-fill me-2"></i>
          Analytics Dashboard
        </h2>
      </div>

      <div className="row g-4">

        <div className="col-md-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <i className="bi bi-list-task display-5 text-primary"></i>
              <h6 className="mt-3 text-muted">Total Tasks</h6>
              <h2>{data.total || 0}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <i className="bi bi-check-circle display-5 text-success"></i>
              <h6 className="mt-3 text-muted">Completed</h6>
              <h2>{data.completed || 0}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <i className="bi bi-hourglass-split display-5 text-warning"></i>
              <h6 className="mt-3 text-muted">Pending</h6>
              <h2>{data.pending || 0}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <i className="bi bi-graph-up-arrow display-5 text-danger"></i>
              <h6 className="mt-3 text-muted">Completion</h6>
              <h2>{data.completionRate || 0}%</h2>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}