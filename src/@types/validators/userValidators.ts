import { object, optional, string, pipe, nonEmpty, array, email, minLength, forward, check, boolean } from "valibot";
import { invalidMsg, requiredMsg } from ".";

export const userValidationSchema = pipe(
  object({
    name: pipe(string(requiredMsg), nonEmpty("this field is required")),
    jobNumber: pipe(string(requiredMsg), nonEmpty("this field is required")),
    phoneNumber: pipe(
      string(requiredMsg),
      nonEmpty("this field is required"),
      minLength(10, "phone must be 10 digit"),
      check((input) => /^\d+$/.test(input), "phone must contain only numbers"),
    ),
    address: optional(string(invalidMsg)),
    email: pipe(string(requiredMsg), nonEmpty("this field is required"), email("Invalid email")),
    roles: pipe(array(string(requiredMsg)), nonEmpty("this field is required")),
    branches: pipe(array(string(requiredMsg)), nonEmpty("this field is required")),
    password: pipe(string(requiredMsg), nonEmpty("this field is required")),
    confirmPassword: pipe(string(requiredMsg), nonEmpty("this field is required")),
    isActive: optional(boolean(invalidMsg)),
  }),
  forward(
    check((input) => input.password === input.confirmPassword, "passwords do not match"),
    ["confirmPassword"],
  ),
);
