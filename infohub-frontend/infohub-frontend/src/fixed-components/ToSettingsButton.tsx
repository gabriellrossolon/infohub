import Button from "../components/Button"
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi"; // Feather Icons


const ToSettingsButton: React.FC = ( { } ) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/dashboard");
  }

  return (
    <div>
      <Button onClick={handleRegister}>
        <FiSettings className="text-3xl text-gray-200 cursor-pointer" />
      </Button>
    </div>
  )
}

export default ToSettingsButton
