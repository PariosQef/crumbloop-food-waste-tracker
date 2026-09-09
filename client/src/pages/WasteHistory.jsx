import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const WasteHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [foodFilter, setFoodFilter] = useState("ALL");
  const [reasonFilter, setReasonFilter] = useState("ALL");

  useEffect(() => {
    const loadWasteRecords = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/waste");

        setRecords(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load waste history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWasteRecords();
  }, []);

  const foodNames = useMemo(() => {
    return [
      ...new Set(
        records
          .map((record) => record.foodItem?.name)
          .filter(Boolean)
      )
    ].sort();
  }, [records]);

  const reasons = useMemo(() => {
    return [
      ...new Set(
        records
          .map((record) => record.reason)
          .filter(Boolean)
      )
    ].sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesFood =
        foodFilter === "ALL" ||
        record.foodItem?.name === foodFilter;

      const matchesReason =
        reasonFilter === "ALL" ||
        record.reason === reasonFilter;

      return matchesFood && matchesReason;
    });
  }, [records, foodFilter, reasonFilter]);

  const summary = useMemo(() => {
    return filteredRecords.reduce(
      (totals, record) => {
        totals.weight += Number(record.weightKg || 0);
        totals.cost += Number(record.calculatedCost || 0);
        totals.co2e += Number(record.calculatedCO2e || 0);

        return totals;
      },
      {
        weight: 0,
        cost: 0,
        co2e: 0
      }
    );
  }, [filteredRecords]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading waste history...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">
            WASTE MONITORING
          </span>

          <h1>Waste History</h1>

          <p>
            Review recorded food waste events and explore
            their financial and environmental impact.
          </p>
        </div>
      </header>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <section className="history-summary-grid">
        <article className="history-summary-card">
          <span>Records</span>
          <strong>{filteredRecords.length}</strong>
        </article>

        <article className="history-summary-card">
          <span>Waste weight</span>
          <strong>
            {summary.weight.toFixed(1)} kg
          </strong>
        </article>

        <article className="history-summary-card">
          <span>Estimated cost</span>
          <strong>
            £{summary.cost.toFixed(2)}
          </strong>
        </article>

        <article className="history-summary-card">
          <span>Carbon impact</span>
          <strong>
            {summary.co2e.toFixed(1)} kg CO₂e
          </strong>
        </article>
      </section>

      <section className="records-card">
        <div className="records-toolbar">
          <div>
            <span className="eyebrow">
              RECORDED EVENTS
            </span>

            <h2>Food waste records</h2>
          </div>

          <div className="history-filters">
            <select
              value={foodFilter}
              onChange={(event) =>
                setFoodFilter(event.target.value)
              }
            >
              <option value="ALL">
                All food items
              </option>

              {foodNames.map((foodName) => (
                <option
                  key={foodName}
                  value={foodName}
                >
                  {foodName}
                </option>
              ))}
            </select>

            <select
              value={reasonFilter}
              onChange={(event) =>
                setReasonFilter(event.target.value)
              }
            >
              <option value="ALL">
                All reasons
              </option>

              {reasons.map((reason) => (
                <option
                  key={reason}
                  value={reason}
                >
                  {reason}
                </option>
              ))}
            </select>

            {(foodFilter !== "ALL" ||
              reasonFilter !== "ALL") && (
              <button
                className="clear-filter-button"
                onClick={() => {
                  setFoodFilter("ALL");
                  setReasonFilter("ALL");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            No waste records match the selected filters.
          </div>
        ) : (
          <div className="records-table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Food item</th>
                  <th>Weight</th>
                  <th>Reason</th>
                  <th>Station</th>
                  <th>Cost</th>
                  <th>CO₂e</th>
                  <th>Recorded</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <strong>
                        {record.foodItem?.name || "Unknown"}
                      </strong>

                      <span className="table-subtext">
                        {record.foodItem?.category || ""}
                      </span>
                    </td>

                    <td>
                      {Number(record.weightKg).toFixed(1)} kg
                    </td>

                    <td>
                      <span className="reason-badge">
                        {record.reason}
                      </span>
                    </td>

                    <td>{record.station}</td>

                    <td>
                      £
                      {Number(
                        record.calculatedCost || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      {Number(
                        record.calculatedCO2e || 0
                      ).toFixed(1)}{" "}
                      kg
                    </td>

                    <td>
                      {new Date(
                        record.createdAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default WasteHistory;