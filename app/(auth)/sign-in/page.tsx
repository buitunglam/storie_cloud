import AuthForm from "@/app/components/AuthForm";
import React from "react";

const SignIn = () => {
  return (
    <div className="flex flex-1 w-[40%]">
      <AuthForm type="sign-in" />
    </div>
  );
};

export default SignIn;
