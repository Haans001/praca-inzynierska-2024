"use client";

import React from "react";
import { SignupStep, useSignupStep } from "../hooks/use-signup-step";
import { CredentialsStep } from "./signup-form/credentials-step";
import { EmailCodeStep } from "./signup-form/email-code-step";

const SignupForm: React.FC = () => {
  const { step } = useSignupStep();
  return step == SignupStep.EmailCode ? <EmailCodeStep /> : <CredentialsStep />;
};

export default SignupForm;
