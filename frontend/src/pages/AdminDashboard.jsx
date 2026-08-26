import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api";
import Navbar from "../components/navbar";

function AdminDashboard() {

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    closed: 0,
  });

  const [tickets, setTickets] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const loadDashboard = async () => {
    try {
      const response =
        await api.get("/admin/dashboard");

      setStats(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  const loadTickets = async () => {
    try {

      const params = {};

      if (search) {
        params.search = search;
      }

      if (status) {
        params.status = status;
      }

      const response = await api.get(
        "/admin/tickets",
        { params }
      );

      setTickets(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadTickets();
  }, []);

  const handleSearch = () => {
    loadTickets();
  };

  const changeStatus = async (
    ticketId,
    newStatus
  ) => {

    try {

      await api.patch(
        `/admin/tickets/${ticketId}/status`,
        {
          status: newStatus,
        }
      );

      loadTickets();
      loadDashboard();

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Unable to change status"
      );

    }
  };

  const deleteTicket = async (ticketId) => {

    try {

      await api.delete(
        `/admin/tickets/${ticketId}`
      );

      loadTickets();
      loadDashboard();

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Unable to delete ticket"
      );

    }
  };

  return (
    <>
      <Navbar />

      <div className="container">

        <h1>Admin Dashboard</h1>

        <div className="stats">

          <div className="stat-card">
            <h3>Total</h3>
            <p>{stats.total}</p>
          </div>

          <div className="stat-card">
            <h3>Open</h3>
            <p>{stats.open}</p>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <p>{stats.in_progress}</p>
          </div>

          <div className="stat-card">
            <h3>Closed</h3>
            <p>{stats.closed}</p>
          </div>

        </div>


        <div className="filters">

          <input
            placeholder="Search title or user"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >

            <option value="">
              All Statuses
            </option>

            <option value="Open">
              Open
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Closed">
              Closed
            </option>

          </select>

          <button onClick={handleSearch}>
            Search
          </button>

        </div>


        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Creator</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {tickets.map((ticket) => (

              <tr key={ticket.id}>

                <td>
                  {ticket.id}
                </td>

                <td>
                  {ticket.title}
                </td>

                <td>
                  {ticket.creator_id}
                </td>

                <td>
                  {ticket.status}
                </td>

                <td>

                  <Link
  to={`/admin/tickets/${ticket.id}`}
>
  View
</Link>

                  {ticket.status === "Open" && (
                    <button
                      onClick={() =>
                        changeStatus(
                          ticket.id,
                          "In Progress"
                        )
                      }
                    >
                      Start
                    </button>
                  )}

                  {ticket.status === "In Progress" && (
                    <button
                      onClick={() =>
                        changeStatus(
                          ticket.id,
                          "Closed"
                        )
                      }
                    >
                      Close
                    </button>
                  )}

                  <button
                    className="danger"
                    onClick={() =>
                      deleteTicket(ticket.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}

export default AdminDashboard;