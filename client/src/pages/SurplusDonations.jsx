import { useEffect, useState } from "react";
import api from "../services/api";

function SurplusDonations() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [recommendation, setRecommendation] =
    useState(null);

  const [
    recommendationRecord,
    setRecommendationRecord
  ] = useState(null);

  const [
    loadingRecommendation,
    setLoadingRecommendation
  ] = useState(false);

  // =========================================
  // LOAD SURPLUS RECORDS
  // =========================================

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/surplus");

      setRecords(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load surplus records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // =========================================
  // MANUAL RESERVATION
  // =========================================

  const handleReserve = async (record) => {
    const organisation = window.prompt(
      "Enter the donation organisation:"
    );

    if (!organisation?.trim()) {
      return;
    }

    try {
      setUpdatingId(record._id);
      setError("");

      await api.patch(
        `/surplus/${record._id}/status`,
        {
          status: "RESERVED",
          donationOrganisation:
            organisation.trim()
        }
      );

      await loadRecords();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to reserve this surplus."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // MARK AS DONATED
  // =========================================

  const handleDonate = async (record) => {
    try {
      setUpdatingId(record._id);
      setError("");

      await api.patch(
        `/surplus/${record._id}/status`,
        {
          status: "DONATED"
        }
      );

      await loadRecords();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to mark this surplus as donated."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // GET AI DONATION RECOMMENDATION
  // =========================================

  const getRecommendation = async (record) => {
    try {
      setLoadingRecommendation(true);
      setRecommendationRecord(record);
      setError("");

      const response = await api.get(
        `/recommendations/surplus/${record._id}`
      );

      setRecommendation(response.data);
    } catch (err) {
      console.error(err);

      setRecommendation(null);

      setError(
        err.response?.data?.message ||
          "Unable to generate AI donation recommendation."
      );
    } finally {
      setLoadingRecommendation(false);
    }
  };

  // =========================================
  // ACCEPT AI RECOMMENDATION
  // =========================================

  const acceptRecommendation = async () => {
    if (
      !recommendationRecord ||
      !recommendation?.recommendedPartner
    ) {
      return;
    }

    try {
      setUpdatingId(recommendationRecord._id);
      setError("");

      await api.patch(
        `/surplus/${recommendationRecord._id}/status`,
        {
          status: "RESERVED",

          donationOrganisation:
            recommendation.recommendedPartner.name
        }
      );

      setRecommendation(null);
      setRecommendationRecord(null);

      await loadRecords();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to reserve this donation."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // CLOSE RECOMMENDATION
  // =========================================

  const closeRecommendation = () => {
    setRecommendation(null);
    setRecommendationRecord(null);
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString();
  };

  // =========================================
  // STATUS CLASS
  // =========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "status-available";

      case "RESERVED":
        return "status-reserved";

      case "DONATED":
        return "status-donated";

      case "EXPIRED":
        return "status-expired";

      default:
        return "";
    }
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="page-container">
      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <span className="eyebrow">
            SURPLUS MANAGEMENT
          </span>

          <h1>Surplus & Donations</h1>

          <p>
            Review edible surplus and manage food
            redistribution with AI-assisted donation
            recommendations.
          </p>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* =====================================
          AI RECOMMENDATION CARD
      ====================================== */}

      {recommendation && (
        <section className="recommendation-card">
          <div className="recommendation-header">
            <div>
              <span className="eyebrow">
                AI DONATION RECOMMENDATION
              </span>

              <h2>
                Recommended donation destination
              </h2>

              {recommendation.aiModel && (
                <p className="recommendation-model-info">
                  Logistic regression · predicted
                  donation success
                </p>
              )}
            </div>

            <button
              type="button"
              className="recommendation-close"
              onClick={closeRecommendation}
              aria-label="Close recommendation"
            >
              ×
            </button>
          </div>

          {recommendation.recommendedPartner ? (
            <>
              {/* BEST AI MATCH */}

              <div className="recommendation-main">
                <div>
                  <span className="recommendation-label">
                    AI RECOMMENDED PARTNER
                  </span>

                  <h3>
                    {
                      recommendation
                        .recommendedPartner.name
                    }
                  </h3>

                  <p>
                    {recommendation.recommendedPartner
                      .organisationType
                      ?.replaceAll("_", " ")}
                  </p>
                </div>

                <div className="recommendation-score">
                  <strong>
                    {
                      recommendation
                        .recommendedPartner
                        .aiSuccessProbability
                    }
                    %
                  </strong>

                  <span>
                    AI predicted success
                  </span>
                </div>
              </div>

              {/* DETAILS */}

              <div className="recommendation-details">
                <div>
                  <span>Distance</span>

                  <strong>
                    {
                      recommendation
                        .recommendedPartner
                        .distanceKm
                    }{" "}
                    km
                  </strong>
                </div>

                <div>
                  <span>Estimated pickup</span>

                  <strong>
                    {
                      recommendation
                        .recommendedPartner
                        .estimatedPickupMinutes
                    }{" "}
                    min
                  </strong>
                </div>

                <div>
                  <span>Surplus</span>

                  <strong>
                    {recommendation.surplus.weightKg} kg
                  </strong>
                </div>
              </div>

              {/* REASONS */}

              <div className="recommendation-reasons">
                <h4>
                  Why CrumbLoop recommends this
                  partner
                </h4>

                {recommendation.recommendedPartner
                  .reasons?.length > 0 ? (
                  recommendation.recommendedPartner.reasons.map(
                    (reason) => (
                      <div
                        key={reason}
                        className="recommendation-reason"
                      >
                        <span>✓</span>

                        {reason}
                      </div>
                    )
                  )
                ) : (
                  <p>
                    No recommendation explanation is
                    available.
                  </p>
                )}
              </div>

              {/* ALTERNATIVES */}

              {recommendation.alternatives?.length >
                0 && (
                <div className="recommendation-alternatives">
                  <h4>
                    Alternative AI-ranked destinations
                  </h4>

                  {recommendation.alternatives.map(
                    (alternative) => (
                      <div
                        key={alternative.id}
                        className="alternative-partner"
                      >
                        <div>
                          <strong>
                            {alternative.name}
                          </strong>

                          <span>
                            {alternative.distanceKm} km
                            {" · "}
                            {
                              alternative
                                .estimatedPickupMinutes
                            }{" "}
                            min
                          </span>
                        </div>

                        <strong>
                          {
                            alternative
                              .aiSuccessProbability
                          }
                          %
                        </strong>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* ACTIONS */}

              <div className="recommendation-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={acceptRecommendation}
                  disabled={
                    updatingId ===
                    recommendationRecord?._id
                  }
                >
                  {updatingId ===
                  recommendationRecord?._id
                    ? "Reserving..."
                    : "Accept AI recommendation"}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeRecommendation}
                  disabled={
                    updatingId ===
                    recommendationRecord?._id
                  }
                >
                  Keep reviewing
                </button>
              </div>

              <p className="recommendation-disclaimer">
                CrumbLoop uses a logistic regression
                model to rank eligible donation
                partners by predicted donation
                success. The recommendation provides
                decision support only. The manager
                remains responsible for the final
                donation destination.
              </p>
            </>
          ) : (
            <div className="empty-state">
              <h3>
                No suitable donation partner found
              </h3>

              <p>
                There are currently no active
                donation partners that meet the
                category, capacity and collection
                deadline requirements for this
                surplus.
              </p>

              <button
                type="button"
                className="secondary-button"
                onClick={closeRecommendation}
              >
                Close
              </button>
            </div>
          )}
        </section>
      )}

      {/* =====================================
          SURPLUS TABLE
      ====================================== */}

      <div className="content-card">
        <div className="card-header">
          <div>
            <h2>Surplus records</h2>

            <p>
              Available, reserved and completed food
              donations.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadRecords}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            Loading surplus records...
          </div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <h3>No surplus records yet</h3>

            <p>
              Surplus food recorded in CrumbLoop
              will appear here.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Food item</th>
                  <th>Weight</th>
                  <th>Station</th>
                  <th>Available until</th>
                  <th>Status</th>
                  <th>Donation organisation</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <div className="table-primary">
                        {record.foodItem?.name ||
                          "Unknown food"}
                      </div>

                      <div className="table-secondary">
                        {record.foodItem?.category ||
                          "—"}
                      </div>
                    </td>

                    <td>
                      <strong>
                        {record.weightKg} kg
                      </strong>
                    </td>

                    <td>
                      {record.station || "—"}
                    </td>

                    <td>
                      {formatDate(
                        record.availableUntil
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td>
                      {record.donationOrganisation ||
                        "—"}
                    </td>

                    <td>
                      {record.status ===
                        "AVAILABLE" && (
                        <div className="table-actions">
                          <button
                            type="button"
                            className="recommend-button"
                            disabled={
                              loadingRecommendation ||
                              updatingId === record._id
                            }
                            onClick={() =>
                              getRecommendation(
                                record
                              )
                            }
                          >
                            {loadingRecommendation &&
                            recommendationRecord?._id ===
                              record._id
                              ? "Analysing..."
                              : "AI recommend destination"}
                          </button>

                          <button
                            type="button"
                            className="table-secondary-button"
                            disabled={
                              updatingId === record._id
                            }
                            onClick={() =>
                              handleReserve(record)
                            }
                          >
                            Choose manually
                          </button>
                        </div>
                      )}

                      {record.status ===
                        "RESERVED" && (
                        <button
                          type="button"
                          className="primary-button"
                          disabled={
                            updatingId === record._id
                          }
                          onClick={() =>
                            handleDonate(record)
                          }
                        >
                          {updatingId === record._id
                            ? "Updating..."
                            : "Mark donated"}
                        </button>
                      )}

                      {record.status ===
                        "DONATED" && (
                        <span className="table-secondary">
                          Completed
                        </span>
                      )}

                      {record.status ===
                        "EXPIRED" && (
                        <span className="table-secondary">
                          No action
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SurplusDonations;