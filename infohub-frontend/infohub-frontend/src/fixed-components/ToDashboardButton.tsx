import Button from "../components/Button"
import { useNavigate } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";

const ToDashboardButton: React.FC = ( { } ) => {
  const navigate = useNavigate();

  const handleDashboard = () => {
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
