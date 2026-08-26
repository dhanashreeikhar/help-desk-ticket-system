import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/navbar";

function TicketDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [error, setError] = useState("");

  const loadTicket = async () => {
    try {
      const response = await api.get(
        `/tickets/${id}`
      );

      setTicket(response.data);
      setTitle(response.data.title);
      setDescription(response.data.description);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Unable to load ticket"
      );
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const updateTicket = async () => {
    try {
      await api.put(`/tickets/${id}`, {
        title,
        description,
      });

      alert("Ticket updated");

      loadTicket();

    } catch (error) {
      alert(
        error.response?.data?.detail ||
        "Unable to update ticket"
      );
    }
  };

  const deleteTicket = async () => {
    try {
      await api.delete(`/tickets/${id}`);

      navigate("/support");

    } catch (error) {
      alert(
        error.response?.data?.detail ||
        "Unable to delete ticket"
      );
    }
  };

  if (error) {
    return (
      <>
        <Navbar />

        <div className="container">
          <div className="error">
            {error}
          </div>
        </div>
      </>
    );
  }

  if (!ticket) {
    return <p>Loading...</p>;
  }

  const isOpen = ticket.status === "Open";

  return (
    <>
      <Navbar />

      <div className="container">

        <h1>Ticket #{ticket.id}</h1>

        <p>
          <strong>Status:</strong>{" "}
          {ticket.status}
        </p>

        <p>
          <strong>Created By:</strong>{" "}
          {ticket.creator_id}
        </p>

        <label>Title</label>

        <input
          value={title}
          disabled={!isOpen}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <label>Description</label>

        <textarea
          value={description}
          disabled={!isOpen}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        {isOpen && (
          <>
            <button onClick={updateTicket}>
              Update Ticket
            </button>

            <button
              className="danger"
              onClick={deleteTicket}
            >
              Cancel/Delete Ticket
            </button>
          </>
        )}

        {!isOpen && (
          <p>
            This ticket cannot be edited because
            it is no longer Open.
          </p>
        )}

      </div>
    </>
  );
}

export default TicketDetails;