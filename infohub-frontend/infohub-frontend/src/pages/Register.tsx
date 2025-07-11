import { useEffect, useState } from "react";
import FormField from "../components/FormField";
import SelectFormField from "../components/SelectFormField";
import type { UserRole } from "../types/roles";
import LogoutButton from "../fixed-components/LogoutButton";
import ToDashboardButton from "../fixed-components/ToDashboardButton";
import { isTokenValid, getTokenData } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { getMyCompanies } from "../services/getMyCompanies";
import { getCompanies } from "../services/getCompanies";

interface UserCompany {
  id: number;
  label: string;
}

const Register: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRepeatedPassword, setUserRepeatedPassword] = useState("");
  const [userCompany, setUserCompany] = useState<number | "">("");
  const [userRole, setUserRole] = useState<UserRole | "">("");

  const [availableCompanies, setAvailableCompanies] = useState<UserCompany[]>(
    []
  );
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !isTokenValid(token)) return;

    const data = getTokenData(token);
    const role = data?.role;
    const companyId = Number(data?.companyId);

    if (!role) return;

    const fetchAllCompanies = async () => {
      try {
        const companiesData = await getCompanies(token);

        const formattedCompanies = companiesData.map((company: any) => ({
          id: company.id,
          label: company.name,
        }));

        setAvailableCompanies(formattedCompanies);
      } catch (err) {
        console.error("Erro ao buscar empresas:", err);
        alert("Erro ao carregar empresas.");
      }
    };

    const fetchMyCompany = async () => {
      try {
        const companyData = await getMyCompanies(token, companyId);
        setAvailableCompanies([{ id: companyId, label: companyData.name }]);
      } catch (err) {
        console.error("Erro ao buscar empresa:", err);
        setAvailableCompanies([
          { id: companyId, label: "Empresa Desconhecida" },
        ]);
      }
    };

    if (role === "admin") {
      setAvailableRoles(["user", "manager", "admin"]);
      fetchAllCompanies();
    } else if (role === "manager") {
      setAvailableRoles(["user", "manager"]);
      setUserCompany(companyId);
      fetchMyCompany();
    } else {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!userName || !userEmail || !userPassword || !userCompany || !userRole) {
      alert("Preencha todos os campos!");
      return;
    }

    if (userPassword !== userRepeatedPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    const userData = {
      name: userName,
      email: userEmail,
      password: userPassword,
      companyId: userCompany,
      role: userRole,
    };

    try {
      const response = await fetch("https://localhost:7103/api/v1/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      let data = null;
      let errorMessage = "Erro no registro";

      try {
        data = await response.json();
        errorMessage = data?.message || errorMessage;
      } catch {
        const text = await response.text();
        if (text) errorMessage = text;
      }

      if (!response.ok) {
        alert(errorMessage);
        return;
      }

      alert("Usuário registrado com sucesso!");
      console.log("Registrado:", data);
    } catch (err) {
      console.log("Erro ao registrar:", err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="h-screen bg-black/50 flex items-center justify-center">
      <div className="bg-white/10 p-4 rounded-md">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 items-center justify-center"
        >
          <h1 className="font-bold text-3xl text-white/90">Criar Usuário</h1>
          <div className="flex flex-col gap-2">
            <FormField
              name="Nome e Sobrenome"
              type="text"
              placeholder="ex: João Silva"
              value={userName}
              onChangeFunc={(e) => setUserName(e.target.value)}
            />
            <FormField
              name="Email"
              type="email"
              placeholder="ex: usuario@email.com.br"
              value={userEmail}
              onChangeFunc={(e) => setUserEmail(e.target.value)}
            />
            <FormField
              name="Senha"
              type="password"
              placeholder="ex: senha123"
              value={userPassword}
              onChangeFunc={(e) => setUserPassword(e.target.value)}
            />
            <FormField
              name="Confirme a senha"
              type="password"
              placeholder="ex: senha123"
              value={userRepeatedPassword}
              onChangeFunc={(e) => setUserRepeatedPassword(e.target.value)}
            />

            <SelectFormField
              name="Empresa Principal"
              value={userCompany}
              onChange={(e) => setUserCompany(Number(e.target.value))}
              options={availableCompanies}
            />

            <SelectFormField
              name="Permissão"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              options={availableRoles}
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer bg-gray-200 rounded-md py-1 px-4 text-xl font-semibold text-gray-900 w-full
              transition-colors duration-500 hover:bg-gray-300 mb-2"
          >
            Registrar
          </button>
        </form>
        <div className="flex items-center justify-between">
          <LogoutButton />
          <ToDashboardButton />
        </div>
      </div>
    </div>
  );
};

export default Register;
