/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
export const LeftSideBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);
  return (
    <section className=" hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] bg-dark-2">
      <div className=" flex flex-col gap-11">
        <Link to="/" className="gap-3 flex items-center">
          <img
            src="/assets/images/logo.svg"
            alt="snapgram logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className=" flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile image"
            className=" w-14 h-14 rounded-full"
          />
          <div className=" flex flex-col">
            <p className=" body-bold">{user.name}</p>
            <p className=" small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>
        <ul className=" flex flex-col gap-6 justify-start">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                className={` leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
                key={`side-${link.label.toLowerCase()}`}
              >
                <NavLink
                  to={link.route}
                  className=" flex p-2 2xl:p-4 items-center gap-5"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label.toLowerCase()}
                    className={` w-5 h-5 group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  <p className=" font-medium">{link.label}</p>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant={"ghost"}
        className=" shad-button_ghost"
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" alt="log out" />
        <p className=" base-medium">logout</p>
      </Button>
    </section>
  );
};
