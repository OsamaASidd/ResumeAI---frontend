import { HEADER_MENUS } from "../../data"

const Header = () => {
  return (
    <header className="font-medium border-b border-b-gray-200 w-full h-[140px] flex justify-between items-center px-10 font-[--font-primary]">
      <div>logo</div>

      <nav className="flex gap-10 hover:cursor-pointer font-[--font-primary]">
        {HEADER_MENUS.map((menu, index) => (
          <div key={index}>{menu}</div>
        ))}
      </nav>

      <button className="border border-blue-500 px-8 py-2 rounded-[10px] text-blue-500 font-[--font-primary]"> Share</button>
    </header>
  )
}

export default Header;
