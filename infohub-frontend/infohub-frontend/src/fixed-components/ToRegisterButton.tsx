import Button from "../components/Button"
import { useNavigate } from "react-router-dom";

const ToRegisterButton: React.FC = ( { } ) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  }

  return (
    <div>
      <Button text="Registrar" onClick={handleRegister}></Button>
    </div>
  )
}

export default ToRegisterButton
