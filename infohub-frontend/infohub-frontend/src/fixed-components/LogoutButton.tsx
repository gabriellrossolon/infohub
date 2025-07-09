import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // Feather Icons

const LogoutButton: React.FC = ({}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <Button onClick={handleLogout}>
        <FiLogOut className="text-3xl text-red-500 cursor-pointer" />
      </Button>
    </div>
  );
};

export default LogoutButton;
