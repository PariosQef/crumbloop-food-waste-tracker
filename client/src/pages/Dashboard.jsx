import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [wasteSummary, setWasteSummary] = useState(null);
  const [surplusSummary, setSurplusSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        if (
          user?.role === "ADMIN" ||
          user?.role === "MANAGEMENT"
        ) {
          const [wasteResponse, surplusResponse] =
            await Promise.all([
              api.get("/analytics/summary"),
              api.get("/surplus-analytics/summary")
            ]);

          setWasteSummary(wasteResponse.data);
          setSurplusSummary(surplusResponse.data);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">
            FOOD WASTE & SURPLUS MANAGEMENT
          </span>

          <h1>Dashboard</h1>

          <p>
            Monitor waste, financial impact, carbon impact
            and edible surplus across your operation.
          </p>
        </div>

        <div className="role-badge">
          {user?.role?.replaceAll("_", " ")}
        </div>
      </header>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {user?.role === "KITCHEN_STAFF" ? (
        <section className="staff-welcome-card">
          <span className="eyebrow">TODAY'S WORKFLOW</span>

          <h2>Welcome, {user?.name}</h2>

          <p>
            Record food waste and identify edible surplus
            as it occurs. Accurate records help CrumbLoop
            produce meaningful environmental and financial
            insights.
          </p>

          <div className="staff-actions">
            <a href="/waste/new">
              Log food waste
            </a>

            <a href="/surplus/new">
              Record edible surplus
            </a>
          </div>
        </section>
      ) : (
        <>
          <section className="metric-grid">
            <article className="metric-card">
              <div className="metric-icon">W</div>

              <span>Total food waste</span>

              <strong>
                {Number(
                  wasteSummary?.totalWasteKg || 0
                ).toFixed(1)}{" "}
                kg
              </strong>

              <small>
                Across {wasteSummary?.totalWasteEvents || 0}{" "}
                recorded events
              </small>
            </article>

            <article className="metric-card">
              <div className="metric-icon">£</div>

              <span>Estimated waste cost</span>

              <strong>
                £
                {Number(
                  wasteSummary?.totalWasteCost || 0
                ).toFixed(2)}
              </strong>

              <small>
                Financial value of recorded waste
              </small>
            </article>

            <article className="metric-card">
              <div className="metric-icon">CO₂</div>

              <span>Carbon impact</span>

              <strong>
                {Number(
                  wasteSummary?.totalCO2e || 0
                ).toFixed(1)}{" "}
                kg
              </strong>

              <small>
                Estimated kg CO₂e
              </small>
            </article>

            <article className="metric-card highlight">
              <div className="metric-icon">S</div>

              <span>Surplus donated</span>

              <strong>
                {Number(
                  surplusSummary?.donatedKg || 0
                ).toFixed(1)}{" "}
                kg
              </strong>

              <small>
                {Number(
                  surplusSummary?.donationRate || 0
                ).toFixed(0)}
                % donation rate
              </small>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">
                    WASTE
                  </span>

                  <h2>Waste overview</h2>
                </div>
              </div>

              <div className="impact-row">
                <div>
                  <span>Recorded weight</span>
                  <strong>
                    {Number(
                      wasteSummary?.totalWasteKg || 0
                    ).toFixed(1)}{" "}
                    kg
                  </strong>
                </div>

                <div>
                  <span>Financial loss</span>
                  <strong>
                    £
                    {Number(
                      wasteSummary?.totalWasteCost || 0
                    ).toFixed(2)}
                  </strong>
                </div>

                <div>
                  <span>CO₂e impact</span>
                  <strong>
                    {Number(
                      wasteSummary?.totalCO2e || 0
                    ).toFixed(1)}{" "}
                    kg
                  </strong>
                </div>
              </div>
            </article>

            <article className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">
                    SURPLUS
                  </span>

                  <h2>Redistribution overview</h2>
                </div>
              </div>

              <div className="surplus-stats">
                <div>
                  <span>Total identified</span>
                  <strong>
                    {Number(
                      surplusSummary?.totalSurplusKg || 0
                    ).toFixed(1)}{" "}
                    kg
                  </strong>
                </div>

                <div>
                  <span>Donated</span>
                  <strong>
                    {Number(
                      surplusSummary?.donatedKg || 0
                    ).toFixed(1)}{" "}
                    kg
                  </strong>
                </div>

                <div>
                  <span>Available</span>
                  <strong>
                    {Number(
                      surplusSummary?.availableKg || 0
                    ).toFixed(1)}{" "}
                    kg
                  </strong>
                </div>

                <div>
                  <span>Reserved</span>
                  <strong>
                    {Number(
                      surplusSummary?.reservedKg || 0
                    ).toFixed(1)}{" "}
                    kg
                  </strong>
                </div>

                <div>
                  <span>Expired</span>
                  <strong>
                    {Number(
                      surplusSummary?.expiredKg || 0
                    ).toFixed(1)}{" "}
                    kg
                  </strong>
                </div>
              </div>

              <div className="donation-progress">
                <div className="progress-heading">
                  <span>Donation rate</span>

                  <strong>
                    {Number(
                      surplusSummary?.donationRate || 0
                    ).toFixed(0)}
                    %
                  </strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(
                        Number(
                          surplusSummary?.donationRate || 0
                        ),
                        100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </article>
          </section>

          <section className="dashboard-panel dashboard-note">
            <div>
              <span className="eyebrow">
                CRUMBLOOP
              </span>

              <h2>From measurement to action</h2>

              <p>
                Waste records measure avoidable financial
                and environmental impact, while surplus
                records help edible food remain outside the
                waste stream through redistribution.
              </p>
            </div>

            <div className="dashboard-note-stat">
              <strong>
                {Number(
                  surplusSummary?.donatedKg || 0
                ).toFixed(1)}{" "}
                kg
              </strong>

              <span>
                edible surplus redirected
              </span>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;