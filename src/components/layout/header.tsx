import { HEADER_MENUS } from "../../data";
import share_icon from "../../assets/share.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/use-auth";

const Header = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const handleLoginClick = () => {
    if (isSignedIn) {
      navigate("/profile");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <header className="font-primary border-b border-b-gray-200 w-full h-[120px] flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-8 md:px-10 py-4 gap-4 sm:gap-0">
      <div className="text-lg font-semibold">Logo</div>

      <nav className="flex flex-wrap justify-center gap-6 sm:gap-10">
        {HEADER_MENUS.map((menu, index) => (
          <div
            key={index}
            onClick={() => navigate(menu.path)}
            className="hover:underline cursor-pointer text-sm sm:text-base"
          >
            {menu.routeName}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={handleLoginClick}
          className="flex items-center gap-2 border border-blue-500 px-4 sm:px-6 py-2 rounded-[10px] text-blue-500 text-sm sm:text-base"
        >
          <span>{isSignedIn ? "Profile" : "Log in"}</span>
        </button>
        
        <button className="flex items-center gap-2 border border-blue-500 px-4 sm:px-6 py-2 rounded-[10px] text-blue-500 text-sm sm:text-base">
          <span>Share</span>
          <img src={share_icon} alt="icon" className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;