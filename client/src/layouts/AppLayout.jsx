import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">C</div>

          <div>
            <h2>CrumbLoop</h2>
            <p>Every crumb matters.</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          {(user?.role === "KITCHEN_STAFF" ||
            user?.role === "ADMIN") && (
            <>
              <NavLink
                to="/waste/new"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Log Waste
              </NavLink>

              <NavLink
                to="/surplus/new"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Record Surplus
              </NavLink>
            </>
          )}

          {(user?.role === "ADMIN" ||
            user?.role === "MANAGEMENT") && (
            <>
              <NavLink
                to="/waste"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Waste History
              </NavLink>

              <NavLink
                to="/surplus"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Surplus & Donations
              </NavLink>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <div className="nav-section-label">
                Administration
              </div>

              <NavLink
                to="/foods"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Food Items
              </NavLink>

              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Users
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.name}</strong>
            <span>
              {user?.role?.replaceAll("_", " ")}
            </span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;