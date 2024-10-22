"use client";

import React from "react";
import { SignupStep, useSignupStep } from "../../hooks/use-signup-step";
import { AuthErrorSnackbar } from "../auth-error-snackbar";
import { CredentialsStep } from "./credentials-step";
import { EmailCodeStep } from "./email-code-step";

const SignupForm: React.FC = () => {
  const { step } = useSignupStep();
  return (
    <>
      {step == SignupStep.EmailCode ? <EmailCodeStep /> : <CredentialsStep />}
      <AuthErrorSnackbar />
    </>
  );
};

export default SignupForm;
