import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <nav className="navbar">

      <h2>Helpdesk</h2>

      <div>
        <span>
          {user?.username} ({user?.role})
        </span>

        <button onClick={logout}>
          Logout
        </button>
      </div>

    </nav>
  );
}

export default Navbar;