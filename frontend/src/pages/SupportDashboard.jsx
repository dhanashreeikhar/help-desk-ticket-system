import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/navbar";

function SupportDashboard() {
  const [tickets, setTickets] = useState([]);

  const loadTickets = async () => {
    try {
      const response = await api.get("/tickets/my");
      setTickets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container">

        <div className="page-header">
          <h1>My Tickets</h1>

          <Link to="/create-ticket">
            <button>
              Create Ticket
            </button>
          </Link>
        </div>

        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
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
                    {ticket.status}
                  </td>

                  <td>
                    <Link
                      to={`/tickets/${ticket.id}`}
                    >
                      View
                    </Link>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>
    </>
  );
}

export default SupportDashboard;