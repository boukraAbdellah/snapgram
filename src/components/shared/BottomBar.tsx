import { bottombarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Link, useLocation } from "react-router-dom"

const BottomBar = () => {
  const {pathname } = useLocation()
  return (
    <section className="  z-50 flex-between w-full sticky bottom-0 rounded-t-[20px] bg-dark-2 px-5 py-4 md:hidden">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname === link.route;
        return (
          <Link
            className={` bottombar-link p-4 group ${
              isActive && "bg-primary-500 rounded-[10px]"
            } flex-center flex-col gap-1 p-2 transition `}
            to={link.route}
            key={`bottom-${link.label.toLowerCase()}`}
          >
            <img
              src={link.imgURL}
              alt={link.label.toLowerCase()}
              className={` w-4 h-4 group-hover:invert-white ${
                isActive && "invert-white"
              }`}
            />
            <p className=" tiny-medium text-light-2"> {link.label}</p>
          </Link>
        );
      })}
    </section>
  );
}

export default BottomBar