import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";

interface ToDashboardButtonProps{
   onClick?: () => void;
}

const ToDashboardButton: React.FC<ToDashboardButtonProps> = ( { onClick } ) => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    if (onClick) onClick();
    navigate("/dashboard");
  }

  return (
    <div>
      <Button onClick={handleDashboard}>
        <FiMessageSquare className="text-3xl text-gray-200 cursor-pointer"></FiMessageSquare>
      </Button>
    </div>
  )
}

export default ToDashboardButton
