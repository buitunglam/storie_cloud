import AuthForm from "@/app/components/AuthForm";
import React from "react";

const SignUp = () => {
  return (
    <div className="flex flex-1 w-[40%]">
      <AuthForm type="sign-up" />
    </div>
  );
};

export default SignUp;
