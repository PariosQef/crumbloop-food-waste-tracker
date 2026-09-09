import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const LogWaste = () => {
  const [foods, setFoods] = useState([]);

  const [formData, setFormData] = useState({
    foodItemId: "",
    weightKg: "",
    reason: "",
    station: ""
  });

  const [loadingFoods, setLoadingFoods] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const response = await api.get("/foods");
        setFoods(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load food items."
        );
      } finally {
        setLoadingFoods(false);
      }
    };

    loadFoods();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess(null);

    if (
      !formData.foodItemId ||
      !formData.weightKg ||
      !formData.reason ||
      !formData.station
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (Number(formData.weightKg) <= 0) {
      setError("Weight must be greater than zero.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/waste", {
        foodItemId: formData.foodItemId,
        weightKg: Number(formData.weightKg),
        reason: formData.reason,
        station: formData.station
      });

      setSuccess(response.data);

      setFormData({
        foodItemId: "",
        weightKg: "",
        reason: "",
        station: ""
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to record food waste."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">
            WASTE RECORDING
          </span>

          <h1>Log food waste</h1>

          <p>
            Record a food waste event. CrumbLoop will
            calculate its estimated financial and carbon
            impact automatically.
          </p>
        </div>

        <Link
          to="/"
          className="secondary-link"
        >
          Back to dashboard
        </Link>
      </header>

      <div className="form-layout">
        <section className="form-card">
          <div className="form-card-heading">
            <span className="eyebrow">
              NEW RECORD
            </span>

            <h2>Waste details</h2>

            <p>
              Enter the operational information for this
              waste event.
            </p>
          </div>

          {error && (
            <div className="form-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="form-message success">
              <strong>Waste recorded successfully.</strong>

              <span>
                {Number(success.weightKg).toFixed(1)} kg
                recorded with an estimated cost of £
                {Number(success.calculatedCost).toFixed(2)}
                {" "}and{" "}
                {Number(success.calculatedCO2e).toFixed(1)}
                {" "}kg CO₂e.
              </span>
            </div>
          )}

          <form
            className="crumb-form"
            onSubmit={handleSubmit}
          >
            <div className="form-field">
              <label htmlFor="foodItemId">
                Food item
              </label>

              <select
                id="foodItemId"
                name="foodItemId"
                value={formData.foodItemId}
                onChange={handleChange}
                disabled={loadingFoods}
                required
              >
                <option value="">
                  {loadingFoods
                    ? "Loading food items..."
                    : "Select a food item"}
                </option>

                {foods.map((food) => (
                  <option
                    key={food._id}
                    value={food._id}
                  >
                    {food.name} — {food.category}
                  </option>
                ))}
              </select>

              <small>
                Cost and CO₂e factors are stored against
                the selected food item.
              </small>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="weightKg">
                  Weight
                </label>

                <div className="input-with-unit">
                  <input
                    id="weightKg"
                    name="weightKg"
                    type="number"
                    min="0.001"
                    step="0.001"
                    placeholder="e.g. 2.5"
                    value={formData.weightKg}
                    onChange={handleChange}
                    required
                  />

                  <span>kg</span>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="reason">
                  Waste reason
                </label>

                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select reason
                  </option>

                  <option value="Preparation">
                    Preparation
                  </option>

                  <option value="Spoilage">
                    Spoilage
                  </option>

                  <option value="Overproduction">
                    Overproduction
                  </option>

                  <option value="Plate Waste">
                    Plate Waste
                  </option>

                  <option value="Expired">
                    Expired
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="station">
                Kitchen / station
              </label>

              <select
                id="station"
                name="station"
                value={formData.station}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select station
                </option>

                <option value="Main Kitchen">
                  Main Kitchen
                </option>

                <option value="Preparation Area">
                  Preparation Area
                </option>

                <option value="Service Counter">
                  Service Counter
                </option>

                <option value="Cold Storage">
                  Cold Storage
                </option>

                <option value="Bakery">
                  Bakery
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={submitting || loadingFoods}
              >
                {submitting
                  ? "Recording..."
                  : "Record food waste"}
              </button>
            </div>
          </form>
        </section>

        <aside className="form-info-card">
          <span className="eyebrow">
            HOW IT WORKS
          </span>

          <h2>Measure the impact, not just the weight.</h2>

          <p>
            CrumbLoop combines the recorded weight with
            stored food data to calculate two additional
            indicators automatically.
          </p>

          <div className="info-metric">
            <span>£</span>

            <div>
              <strong>Financial impact</strong>
              <p>
                Estimated from the food item's cost per
                kilogram.
              </p>
            </div>
          </div>

          <div className="info-metric">
            <span>CO₂</span>

            <div>
              <strong>Carbon impact</strong>
              <p>
                Estimated using the stored CO₂e factor for
                the selected food item.
              </p>
            </div>
          </div>

          <div className="info-note">
            These values are calculated by the server rather
            than entered manually, helping maintain
            consistent records.
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LogWaste;