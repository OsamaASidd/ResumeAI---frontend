import { SIDEBAR_MENUS } from "../../data";
import line_icon from "../../assets/lines.svg";
import user_icon from "../../assets/user.svg";

const Sidebar = () => {
  return (
    <div className="w-64 text-black border border-gray-100 h-screen">
      {/* Toggle icon top-right */}
      <div className="flex justify-end p-4">
        <img src={line_icon} alt="icon" className="w-7 h-7" />
      </div>

      {/* Menu items */}
      <div className="flex flex-col gap-8 p-8">
        {SIDEBAR_MENUS.map((menu, index) => (
          <div
            key={index}
            className="flex items-center gap-5 cursor-pointer hover:opacity-80"
          >
            <img src={user_icon} alt="icon" className="w-6 h-6" />
            <span>{menu.routeName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
