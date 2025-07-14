import LogoutButton from "../../fixed-components/LogoutButton";
import ToDashboardButton from "../../fixed-components/ToDashboardButton";
import ToRegisterButton from "../../fixed-components/ToRegisterButton";
import ToSettingsButton from "../../fixed-components/ToSettingsButton";

interface OptionsSideBarProps {
  onClick: () => void;
}

const OptionsSideBar: React.FC<OptionsSideBarProps> = ({ onClick }) => {
  return (
    <div className="bg-black/70 flex flex-col items-center justify-between p-1">
      <div className="flex flex-col items-center justify-center gap-2">
        <ToDashboardButton
          onClick={onClick}
        ></ToDashboardButton>
        <ToRegisterButton></ToRegisterButton>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <ToSettingsButton></ToSettingsButton>
        <LogoutButton></LogoutButton>
      </div>
    </div>
  );
};

export default OptionsSideBar;
