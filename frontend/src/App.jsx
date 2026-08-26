import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/login";
import SupportDashboard from "./pages/SupportDashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTicketDetails from "./pages/AdminTicketDetails";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* Support Dashboard */}

        <Route
          path="/support"
          element={
            <ProtectedRoute role="support">
              <SupportDashboard />
            </ProtectedRoute>
          }
        />


        {/* Create Ticket */}

        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute role="support">
              <CreateTicket />
            </ProtectedRoute>
          }
        />


        {/* Support Ticket Details */}

        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute role="support">
              <TicketDetails />
            </ProtectedRoute>
          }
        />


        {/* Admin Dashboard */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* Admin Ticket Details */}

        <Route
          path="/admin/tickets/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminTicketDetails />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;