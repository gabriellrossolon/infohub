import Button from "../components/Button"
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC = ( { } ) => {
  const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <Button text="Logout" onClick={handleLogout}></Button>
    </div>
  )
}

export default LogoutButton
