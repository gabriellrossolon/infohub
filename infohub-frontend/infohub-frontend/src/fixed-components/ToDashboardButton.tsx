import Button from "../components/Button"
import { useNavigate } from "react-router-dom";

const ToDashboardButton: React.FC = ( { } ) => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  }

  return (
    <div>
      <Button text="Dashboard" onClick={handleDashboard}></Button>
    </div>
  )
}

export default ToDashboardButton
