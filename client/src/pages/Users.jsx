import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "KITCHEN_STAFF"
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      setUsers(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
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
      !formData.email.trim() ||
      !formData.password ||
      !formData.role
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      });

      setSuccess(
        `${formData.name.trim()} was created successfully.`
      );

      setFormData(initialForm);
      setShowForm(false);

      await loadUsers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create user."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const formatRole = (role) => {
    if (!role) return "Unknown";

    return role
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading users...</p>
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

          <h1>Users</h1>

          <p>
            Manage access to CrumbLoop and assign
            appropriate permissions using role-based
            access control.
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
          {showForm ? "Cancel" : "+ Add user"}
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
        <section className="user-create-card">
          <div className="form-card-heading">
            <span className="eyebrow">
              NEW USER
            </span>

            <h2>Create CrumbLoop account</h2>

            <p>
              Assign the minimum level of access required
              for the user's responsibilities.
            </p>
          </div>

          <form
            className="crumb-form"
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Alex Smith"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="password">
                  Temporary password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength="8"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <small>
                  Passwords are hashed by the backend
                  before being stored.
                </small>
              </div>

              <div className="form-field">
                <label htmlFor="role">
                  User role
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="KITCHEN_STAFF">
                    Kitchen Staff
                  </option>

                  <option value="MANAGEMENT">
                    Management
                  </option>

                  <option value="ADMIN">
                    Administrator
                  </option>
                </select>
              </div>
            </div>

            <div className="role-explanation-grid">
              <div>
                <strong>Kitchen Staff</strong>
                <span>
                  Record waste and edible surplus.
                </span>
              </div>

              <div>
                <strong>Management</strong>
                <span>
                  Review waste, surplus and analytics.
                </span>
              </div>

              <div>
                <strong>Administrator</strong>
                <span>
                  Full system and configuration access.
                </span>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting
                  ? "Creating..."
                  : "Create user"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="records-card">
        <div className="records-toolbar">
          <div>
            <span className="eyebrow">
              ACCESS CONTROL
            </span>

            <h2>
              {users.length}{" "}
              {users.length === 1 ? "user" : "users"}
            </h2>
          </div>

          <div className="user-filters">
            <input
              className="table-search"
              type="search"
              placeholder="Search name or email..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
            >
              <option value="ALL">
                All roles
              </option>

              <option value="KITCHEN_STAFF">
                Kitchen Staff
              </option>

              <option value="MANAGEMENT">
                Management
              </option>

              <option value="ADMIN">
                Administrator
              </option>
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            No users match the selected filters.
          </div>
        ) : (
          <div className="records-table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="table-user">
                        <div className="table-avatar">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <strong>{user.name}</strong>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`role-pill role-${user.role?.toLowerCase()}`}
                      >
                        {formatRole(user.role)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          user.active
                            ? "status-badge status-active"
                            : "status-badge status-inactive"
                        }
                      >
                        {user.active
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "—"}
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

export default Users;