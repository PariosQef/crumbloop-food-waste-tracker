import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const initialForm = {
  name: "",
  category: "",
  costPerKg: "",
  co2ePerKg: "",
  unit: "kg"
};

const FoodItems = () => {
  const [foods, setFoods] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFoods = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/foods");

      setFoods(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load food items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.costPerKg ||
      !formData.co2ePerKg
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (Number(formData.costPerKg) < 0) {
      setError("Cost per kg cannot be negative.");
      return;
    }

    if (Number(formData.co2ePerKg) < 0) {
      setError("CO₂e per kg cannot be negative.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/foods", {
        name: formData.name.trim(),
        category: formData.category.trim(),
        costPerKg: Number(formData.costPerKg),
        co2ePerKg: Number(formData.co2ePerKg),
        unit: formData.unit
      });

      setSuccess(
        `${formData.name.trim()} was added successfully.`
      );

      setFormData(initialForm);
      setShowForm(false);

      await loadFoods();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create food item."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return foods;
    }

    return foods.filter((food) => {
      return (
        food.name?.toLowerCase().includes(query) ||
        food.category?.toLowerCase().includes(query)
      );
    });
  }, [foods, search]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading food items...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <span className="eyebrow">
            ADMINISTRATION
          </span>

          <h1>Food Items</h1>

          <p>
            Manage the food catalogue used for waste and
            surplus recording.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setShowForm((current) => !current);
            setError("");
            setSuccess("");
          }}
        >
          {showForm ? "Cancel" : "+ Add food item"}
        </button>
      </header>

      {error && (
        <div className="form-message error">
          {error}
        </div>
      )}

      {success && (
        <div className="form-message success">
          {success}
        </div>
      )}

      {showForm && (
        <section className="food-create-card">
          <div className="form-card-heading">
            <span className="eyebrow">
              NEW FOOD ITEM
            </span>

            <h2>Add to food catalogue</h2>

            <p>
              Cost and carbon factors will be used by
              CrumbLoop when calculating the impact of
              future waste records.
            </p>
          </div>

          <form
            className="crumb-form"
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">
                  Food name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Chicken breast"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="e.g. Meat"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="costPerKg">
                  Cost per kg (£)
                </label>

                <input
                  id="costPerKg"
                  name="costPerKg"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 6.50"
                  value={formData.costPerKg}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="co2ePerKg">
                  CO₂e per kg
                </label>

                <input
                  id="co2ePerKg"
                  name="co2ePerKg"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 5.40"
                  value={formData.co2ePerKg}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="unit">
                Unit
              </label>

              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                <option value="kg">kg</option>
              </select>

              <small>
                CrumbLoop currently standardises food
                measurement in kilograms.
              </small>
            </div>

            <div className="form-actions">
              <button
                className="primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Adding..."
                  : "Add food item"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="records-card">
        <div className="records-toolbar">
          <div>
            <span className="eyebrow">
              FOOD CATALOGUE
            </span>

            <h2>
              {foods.length} food{" "}
              {foods.length === 1 ? "item" : "items"}
            </h2>
          </div>

          <input
            className="table-search"
            type="search"
            placeholder="Search food or category..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        {filteredFoods.length === 0 ? (
          <div className="empty-state">
            No food items found.
          </div>
        ) : (
          <div className="records-table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Category</th>
                  <th>Cost / kg</th>
                  <th>CO₂e / kg</th>
                  <th>Unit</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredFoods.map((food) => (
                  <tr key={food._id}>
                    <td>
                      <strong>{food.name}</strong>
                    </td>

                    <td>{food.category}</td>

                    <td>
                      £
                      {Number(
                        food.costPerKg || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      {Number(
                        food.co2ePerKg || 0
                      ).toFixed(2)}{" "}
                      kg CO₂e
                    </td>

                    <td>{food.unit}</td>

                    <td>
                      <span
                        className={
                          food.active
                            ? "status-badge status-active"
                            : "status-badge status-inactive"
                        }
                      >
                        {food.active
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
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

export default FoodItems;