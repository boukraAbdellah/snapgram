import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const TopBar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const { user } = useUserContext();

    const navigate = useNavigate();
    useEffect(() => {
        if (isSuccess) navigate(0);
    },[isSuccess,navigate])
  return (
    <section className=" sticky top-0 z-50 md:hidden bg-dark-2 w-full">
      <div className=" flex-between py-4 px-5">
        <Link to="/" className="gap-4 flex items-center">
          <img
            src="/assets/images/logo.svg"
            alt="snapgram logo"
            width={130}
            height={325}
          />
        </Link>
      <div className="items-center flex gap-4">
        <Button
          variant={"ghost"}
          className=" shad-button_ghost"
          onClick={() => signOut()}
        >
          <img src="/assets/icons/logout.svg" alt="log out" />
        </Button>
        <Link to={`/profile/${user.id}`}>
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile img"
            className=" h-8 w-8 rounded-full"
          />
        </Link>
      </div>
      </div>
    </section>
  );
}

export default TopBar