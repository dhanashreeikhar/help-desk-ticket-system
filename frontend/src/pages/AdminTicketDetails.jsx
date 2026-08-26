import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/navbar";

function AdminTicketDetails() {

  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);

  const loadTicket = async () => {

    const response =
      await api.get(`/admin/tickets/${id}`);

    setTicket(response.data);
  };

  const loadUsers = async () => {

    const response =
      await api.get("/admin/support-users");

    setUsers(response.data);
  };

  useEffect(() => {
    loadTicket();
    loadUsers();
  }, [id]);


  const assignTicket = async (userId) => {

    try {

      await api.patch(
        `/admin/tickets/${id}/assign`,
        {
          assigned_to: Number(userId),
        }
      );

      loadTicket();

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Unable to assign ticket"
      );

    }
  };


  const changeStatus = async (status) => {

    try {

      await api.patch(
        `/admin/tickets/${id}/status`,
        {
          status,
        }
      );

      loadTicket();

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Unable to change status"
      );

    }
  };


  if (!ticket) {
    return <p>Loading...</p>;
  }


  return (
    <>
      <Navbar />

      <div className="container">

        <h1>
          Ticket #{ticket.id}
        </h1>

        <h2>
          {ticket.title}
        </h2>

        <p>
          {ticket.description}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {ticket.status}
        </p>

        <p>
          <strong>Creator ID:</strong>{" "}
          {ticket.creator_id}
        </p>

        <p>
          <strong>Assigned To:</strong>{" "}
          {ticket.assigned_to || "Not assigned"}
        </p>


        <h3>Change Status</h3>

        {ticket.status === "Open" && (
          <button
            onClick={() =>
              changeStatus("In Progress")
            }
          >
            Mark In Progress
          </button>
        )}

        {ticket.status === "In Progress" && (
          <button
            onClick={() =>
              changeStatus("Closed")
            }
          >
            Mark Closed
          </button>
        )}


        <h3>Assign Ticket</h3>

        <select
          value={ticket.assigned_to || ""}
          onChange={(e) =>
            assignTicket(e.target.value)
          }
        >

          <option value="">
            Select Support User
          </option>

          {users.map((user) => (

            <option
              key={user.id}
              value={user.id}
            >
              {user.username}
            </option>

          ))}

        </select>

      </div>
    </>
  );
}

export default AdminTicketDetails;