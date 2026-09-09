import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LogWaste from "./pages/LogWaste";
import RecordSurplus from "./pages/RecordSurplus";
import SurplusDonations from "./pages/SurplusDonations";
import WasteHistory from "./pages/WasteHistory";
import FoodItems from "./pages/FoodItems";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/"
              element={<Dashboard />}
            />
            <Route
              path="/waste/new"
              element={
                <ProtectedRoute
                  roles={["KITCHEN_STAFF", "ADMIN"]}
                >
                <LogWaste />
                </ProtectedRoute>
  }
/>
           <Route
  path="/surplus/new"
  element={
    <ProtectedRoute
      roles={["KITCHEN_STAFF", "ADMIN"]}
    >
      <RecordSurplus />
    </ProtectedRoute>
  }
/>
<Route
  path="/surplus"
  element={
    <ProtectedRoute
      roles={["ADMIN", "MANAGEMENT"]}
    >
      <SurplusDonations />
    </ProtectedRoute>
  }
/>
<Route
  path="/waste"
  element={
    <ProtectedRoute
      roles={["ADMIN", "MANAGEMENT"]}
    >
      <WasteHistory />
    </ProtectedRoute>
  }
/>
<Route
  path="/foods"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <FoodItems />
    </ProtectedRoute>
  }
/>
<Route
  path="/users"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <Users />
    </ProtectedRoute>
  }
/>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;