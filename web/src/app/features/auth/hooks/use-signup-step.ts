import { parseAsStringLiteral, useQueryState } from "nuqs";

export enum SignupStep {
  Credentials = "credentials",
  EmailCode = "emailCode",
}

export enum Params {
  Step = "step",
}

export const useSignupStep = () => {
  const [step, setStep] = useQueryState(
    Params.Step,
    parseAsStringLiteral([
      SignupStep.Credentials,
      SignupStep.EmailCode,
    ]).withDefault(SignupStep.Credentials),
  );

  return { step, setStep };
};
