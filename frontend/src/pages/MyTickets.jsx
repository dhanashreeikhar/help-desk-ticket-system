import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tickets/my");

      console.log("My tickets response:", response.data);

      setTickets(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Unable to load tickets:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to load tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "Open") {
      return {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (status === "In Progress") {
      return {
        backgroundColor: "#fef3c7",
        color: "#b45309",
      };
    }

    if (
      status === "Closed" ||
      status === "Resolved"
    ) {
      return {
        backgroundColor: "#dcfce7",
        color: "#15803d",
      };
    }

    return {
      backgroundColor: "#f3f4f6",
      color: "#374151",
    };
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div style={styles.container}>
          <h1>My Tickets</h1>
          <p>Loading your tickets...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={styles.container}>

        {/* Header */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>
              My Tickets
            </h1>

            <p style={styles.subtitle}>
              View and track all the support tickets
              you have created.
            </p>
          </div>

          <Link
            to="/create-ticket"
            style={styles.createButton}
          >
            + Create Ticket
          </Link>
        </div>

        {/* Error */}

        {error && (
          <div style={styles.errorBox}>
            <h3>Unable to load tickets</h3>

            <p>{error}</p>

            <button
              onClick={loadTickets}
              style={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        )}

        {/* No tickets */}

        {!error && tickets.length === 0 && (
          <div style={styles.emptyBox}>
            <h2>No Tickets Found</h2>

            <p>
              You haven't created any tickets yet.
            </p>

            <Link
              to="/create-ticket"
              style={styles.createButton}
            >
              Create Your First Ticket
            </Link>
          </div>
        )}

        {/* Tickets */}

        {!error && tickets.length > 0 && (
          <div style={styles.card}>

            <div style={styles.count}>
              Showing {tickets.length}{" "}
              {tickets.length === 1
                ? "ticket"
                : "tickets"}
            </div>

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>
                  <tr>
                    <th style={styles.th}>
                      Ticket ID
                    </th>

                    <th style={styles.th}>
                      Title
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                    <th style={styles.th}>
                      Created
                    </th>

                    <th style={styles.th}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>

                      <td style={styles.td}>
                        #{ticket.id}
                      </td>

                      <td style={styles.td}>
                        {ticket.title}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            ...getStatusStyle(
                              ticket.status
                            ),
                          }}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {formatDate(
                          ticket.created_at
                        )}
                      </td>

                      <td style={styles.td}>
                        <Link
                          to={`/tickets/${ticket.id}`}
                          style={styles.viewButton}
                        >
                          View
                        </Link>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 30px",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  heading: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
  },

  createButton: {
    backgroundColor: "#2563eb",
    color: "white",
    textDecoration: "none",
    padding: "11px 18px",
    borderRadius: "6px",
    fontWeight: "600",
  },

  errorBox: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "25px",
    borderRadius: "8px",
  },

  retryButton: {
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  emptyBox: {
    backgroundColor: "white",
    padding: "60px",
    textAlign: "center",
    borderRadius: "10px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  count: {
    padding: "18px",
    borderBottom:
      "1px solid #e5e7eb",
    color: "#6b7280",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "15px",
    backgroundColor: "#f9fafb",
    borderBottom:
      "1px solid #e5e7eb",
  },

  td: {
    padding: "15px",
    borderBottom:
      "1px solid #f0f0f0",
  },

  badge: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  viewButton: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    textDecoration: "none",
    padding: "7px 13px",
    borderRadius: "5px",
    fontWeight: "600",
  },
};

export default MyTickets;