import FormField from "../components/FormField";
import SelectFormField from "../components/SelectFormField";
import type { UserRole } from "../types/roles";
import { USER_ROLES } from "../types/roles";
import { USER_COMPANIES } from "../types/companies";

import { useState } from "react";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRepeatedPassword, setUserRepeatedPassword] = useState("");
  const [userCompany, setUserCompany] = useState<number | "">("");
  const [userRole, setUserRole] = useState<UserRole | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !userEmail || !userPassword || !userCompany || !userRole) {
      alert("Preencha todos os campos!");
      return;
    }

    if (userPassword != userRepeatedPassword) {
      alert("As senhas não coincidem, digite novamente.");
      return;
    }

    const userData = {
      name: userName,
      email: userEmail,
      password: userPassword,
      companyId: userCompany,
      role: userRole,
    };

    console.log(userData)

    try {
      const response = await fetch("https://localhost:7103/api/v1/user", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro no registro");
        return;
      }

      console.log("Registrado com sucesso:", data);
    } catch (err) {
      console.log("Erro ao registrar:", err);
    }
  };

  return (
    <div className="h-screen bg-black/50 flex items-center justify-center">
      <div className="bg-white/10 p-4 rounded-md">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 items-center justify-center"
        >
          <h1 className="font-bold text-3xl text-white/90">Crie um Usuário</h1>
          <div className="flex flex-col gap-2">
            <FormField
              name="Nome e Sobrenome"
              type={"text"}
              placeholder="ex: João Silva"
              value={userName}
              onChangeFunc={(e) => setUserName(e.target.value)}
            />
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
            <FormField
              name="Confirme a senha"
              type={"password"}
              placeholder="ex: senha123"
              value={userRepeatedPassword}
              onChangeFunc={(e) => setUserRepeatedPassword(e.target.value)}
            />
            <SelectFormField
              name="Empresa Principal"
              value={userCompany}
              onChange={(e) => setUserCompany(Number(e.target.value))}
              options={USER_COMPANIES}
            />
            <SelectFormField
              name="Permissão"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              options={USER_ROLES}
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer bg-gray-200 rounded-md py-1 px-4 text-xl font-semibold text-gray-900 w-full
            transition-colors duration-500 hover:bg-gray-300
            "
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
