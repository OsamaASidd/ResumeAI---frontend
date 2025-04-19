import { SIDEBAR_MENUS } from "../../data";
import line_icon from "../../assets/lines.svg";
import user_icon from "../../assets/user.svg";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`transition-all duration-300 h-full bg-white border-r border-gray-200 
      ${isOpen ? 'w-64' : 'w-16'} 
      hidden sm:block
    `}>
      <div className="flex justify-end p-4 hover:cursor-pointer" onClick={toggleSidebar}>
        <img src={line_icon} alt="icon" className="w-6 h-6" />
      </div>

      <div className={`flex flex-col gap-6 p-4 transition-opacity duration-300 
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {SIDEBAR_MENUS.map((menu, index) => (
          <div
            key={index}
            className="font-primary flex items-center gap-4 cursor-pointer hover:opacity-80"
          >
            <img src={user_icon} alt="icon" className="w-6 h-6" />
            {isOpen && <span className="whitespace-nowrap">{menu.routeName}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};


export default Sidebar;
