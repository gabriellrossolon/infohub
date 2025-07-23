import LogoutButton from "../fixed-components/LogoutButton";
import ToDashboardButton from "../fixed-components/ToDashboardButton";
import ToRegisterButton from "../fixed-components/ToRegisterButton";
import ToSettingsButton from "../fixed-components/ToSettingsButton";
import { useUserRole } from "../../hooks/useUserRole";

interface OptionsSideBarProps {
  onClick?: () => void;
}

const OptionsSideBar: React.FC<OptionsSideBarProps> = ({ onClick }) => {
  const userRole = useUserRole();

  return (
    <div className="bg-black/70 flex flex-col items-center justify-between p-1 h-full">
      <div className="flex flex-col items-center justify-center gap-2">
        <ToDashboardButton onClick={onClick} />
        {(userRole === "admin" || userRole === "manager") && (
          <ToRegisterButton />
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <ToSettingsButton />
        <LogoutButton />
      </div>
    </div>
  );
};

export default OptionsSideBar;
