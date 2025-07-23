import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";

const ToRegisterButton: React.FC = ( { } ) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  }

  return (
    <div>
      <Button onClick={handleRegister}>
        <FiUserPlus className="text-3xl text-gray-200 cursor-pointer" />
      </Button>
    </div>
  )
}

export default ToRegisterButton
