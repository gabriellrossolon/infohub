import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { isTokenValid } from "../utils/auth";
import ErrorWarn from "../components/fixed-components/ErrorWarn";
import LoadingWarn from "../components/fixed-components/LoadingWarn";
interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const navigate = useNavigate();

  // UI e erros
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenValid(token)) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail || !userPassword) {
      alert("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://localhost:7103/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro no Login");
        setLoading(false);
        // alert(error);
        return;
      }
      localStorage.setItem("token", data.token);

      console.log("Login efetuado com sucesso!", data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      alert("Erro ao fazer Login, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black/50 flex items-center justify-center ">
      <div className="bg-white/10 p-4 rounded-md backdrop-blur">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 items-center justify-center"
        >
          <h1 className="font-bold text-3xl text-white/90">Login</h1>
          <div className="flex flex-col gap-2">
            <FormField
              name="Email"
              type={"email"}
              placeholder="ex: usuario@email.com.br"
              value={userEmail}
              onChangeFunc={(e) => setUserEmail(e.target.value)}
            />
            <FormField
              name="Senha"
              type={"password"}
              placeholder="ex: senha123"
              value={userPassword}
              onChangeFunc={(e) => setUserPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer bg-gray-200 rounded-md py-1 px-4 text-xl font-semibold text-gray-900 w-full
            transition-colors duration-500 hover:bg-gray-300
            "
          >
            Logar
          </button>
        </form>
      </div>
      {error && <ErrorWarn text={error} setError={setError} />}
      {loading && <LoadingWarn/>}
    </div>
  );
};

export default Login;
