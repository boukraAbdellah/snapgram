import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const inAuthenticated = false;
  return (
    <>
      {
        inAuthenticated ? (
          <Navigate to={'/'} />
        ) : (
            <>
              <section className="flex flex-1 justify-center items-center h-screen flex-col py-10">
                <Outlet />
              </section>
              <img src="\assets\images\side-img.svg" alt="side image"
              className=" w-1/2 hidden lg:block object-cover bg-no-repeat"/>
            </>
        )
      }
    </>
  )
}

export default AuthLayout