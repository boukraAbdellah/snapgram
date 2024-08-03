// import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SigninValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  useSigninAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();

  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSigninAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      toast({ title: "Something went wrong. Please login your new account" });

      navigate("/sign-in");

      return;
    }

    const isLoggedIn = await checkAuthUser();
    console.log({isLoggedIn})

    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      toast({
        variant: "destructive",
        title: "Login failed. please try again",
      });
      return;
    }
  }
  return (
    <Form {...form}>
      <div className=" flex flex-center flex-col sm:w-420">
        <img src="/assets/images/logo.svg" alt="logo" className="" />
        <h2 className=" h3-bold md:h2-bold pt-5 sm:pt-12 ">
          Sign in to your account
        </h2>
        <p className=" text-light-3 small-medium md:base-regular mt-2">
          To use snapgram enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-5 mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className=" shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className=" shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className=" shad-button_primary">
            {isSigningIn ? (
              <div className=" flex-center">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className=" text-small-regular text-light-2 text-center mt-2">
            You don't have an account
            <Link
              to={"/sign-up"}
              className=" text-primary-500 font-semibold ml-3"
            >
              {" "}
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
