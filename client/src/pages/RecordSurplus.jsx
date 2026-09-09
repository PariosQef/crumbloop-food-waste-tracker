import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const RecordSurplus = () => {
  const [foods, setFoods] = useState([]);

  const [formData, setFormData] = useState({
    foodItemId: "",
    weightKg: "",
    station: "",
    availableUntil: "",
    storageInstructions: ""
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
      !formData.station ||
      !formData.availableUntil ||
      !formData.storageInstructions
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (Number(formData.weightKg) <= 0) {
      setError("Weight must be greater than zero.");
      return;
    }

    const deadline = new Date(formData.availableUntil);

    if (deadline <= new Date()) {
      setError(
        "The availability deadline must be in the future."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/surplus", {
        foodItemId: formData.foodItemId,
        weightKg: Number(formData.weightKg),
        station: formData.station,
        availableUntil: formData.availableUntil,
        storageInstructions: formData.storageInstructions
      });

      setSuccess(response.data);

      setFormData({
        foodItemId: "",
        weightKg: "",
        station: "",
        availableUntil: "",
        storageInstructions: ""
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to record edible surplus."
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
            SURPLUS REDISTRIBUTION
          </span>

          <h1>Record edible surplus</h1>

          <p>
            Identify edible food that can be redirected
            before it becomes waste.
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
              NEW SURPLUS RECORD
            </span>

            <h2>Surplus details</h2>

            <p>
              Record the food, quantity and safe
              availability window for redistribution.
            </p>
          </div>

          {error && (
            <div className="form-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="form-message success">
              <strong>
                Edible surplus recorded successfully.
              </strong>

              <span>
                {Number(success.weightKg).toFixed(1)} kg
                has entered the redistribution workflow
                with status {success.status}.
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
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="weightKg">
                  Surplus weight
                </label>

                <div className="input-with-unit">
                  <input
                    id="weightKg"
                    name="weightKg"
                    type="number"
                    min="0.001"
                    step="0.001"
                    placeholder="e.g. 4"
                    value={formData.weightKg}
                    onChange={handleChange}
                    required
                  />

                  <span>kg</span>
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
            </div>

            <div className="form-field">
              <label htmlFor="availableUntil">
                Available until
              </label>

              <input
                id="availableUntil"
                name="availableUntil"
                type="datetime-local"
                value={formData.availableUntil}
                onChange={handleChange}
                required
              />

              <small>
                Enter the date and time by which this food
                should be redistributed.
              </small>
            </div>

            <div className="form-field">
              <label htmlFor="storageInstructions">
                Storage instructions
              </label>

              <textarea
                id="storageInstructions"
                name="storageInstructions"
                rows="4"
                placeholder="e.g. Keep refrigerated below 5°C"
                value={formData.storageInstructions}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={submitting || loadingFoods}
              >
                {submitting
                  ? "Recording..."
                  : "Record edible surplus"}
              </button>
            </div>
          </form>
        </section>

        <aside className="form-info-card">
          <span className="eyebrow">
            FOOD REDISTRIBUTION
          </span>

          <h2>Keep edible food out of the waste stream.</h2>

          <p>
            Surplus is recorded separately from waste so
            food that can still be used does not inflate
            CrumbLoop's waste figures.
          </p>

          <div className="workflow-list">
            <div>
              <span>1</span>
              <p>
                <strong>Available</strong>
                Food is identified as suitable for
                redistribution.
              </p>
            </div>

            <div>
              <span>2</span>
              <p>
                <strong>Reserved</strong>
                A donation organisation reserves the
                surplus.
              </p>
            </div>

            <div>
              <span>3</span>
              <p>
                <strong>Donated</strong>
                Collection is completed and the food is
                recorded as redirected.
              </p>
            </div>
          </div>

          <div className="info-note">
            If redistribution cannot be completed within
            the availability window, the record can later
            be marked as expired.
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RecordSurplus;