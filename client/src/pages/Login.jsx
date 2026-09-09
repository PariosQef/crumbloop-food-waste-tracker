import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(email, password);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <div>
          <span className="brand-label">
            FOOD WASTE & SURPLUS MANAGEMENT
          </span>

          <h1>CrumbLoop</h1>

          <p className="login-tagline">
            Every crumb matters.
          </p>

          <p className="login-description">
            Track food waste, understand its financial
            and environmental impact, and redirect
            edible surplus before it becomes waste.
          </p>
        </div>
      </div>

      <div className="login-panel">
        <form
          className="login-card"
          onSubmit={handleSubmit}
        >
          <div className="login-heading">
            <div className="login-logo">C</div>

            <h2>Welcome back</h2>

            <p>
              Sign in to your CrumbLoop workspace.
            </p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <label htmlFor="email">
            Email address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            placeholder="name@organisation.com"
            autoComplete="email"
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            autoComplete="current-password"
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Signing in..."
              : "Sign in"}
          </button>

          <p className="login-security">
            Secure role-based access
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;