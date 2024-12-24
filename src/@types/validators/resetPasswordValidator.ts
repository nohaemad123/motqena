import { invalidMsg } from "@/@types/validators";
import { object, string, pipe, nonEmpty, check, forward } from "valibot";

export const resetPasswordValidationSchema = pipe(
  object({
    password: pipe(string(invalidMsg), nonEmpty("Password is required")),
    confirmPassword: pipe(string(invalidMsg), nonEmpty("Confirm Password is required")),
  }),
  forward(
    check((input) => input.password === input.confirmPassword, "passwords do not match"),
    ["confirmPassword"],
  ),
);
