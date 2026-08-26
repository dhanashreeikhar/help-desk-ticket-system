import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/navbar";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await api.post("/tickets", {
        title,
        description,
      });

      navigate("/support");

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Unable to create ticket"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">

        <h1>Create Ticket</h1>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Title</label>

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter ticket title"
          />

          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Describe your problem"
            rows="6"
          />

          <button type="submit">
            Create Ticket
          </button>

        </form>

      </div>
    </>
  );
}

export default CreateTicket;