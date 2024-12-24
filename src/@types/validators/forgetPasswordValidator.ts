import { invalidMsg } from "@/@types/validators";
import { object, string, email, pipe, nonEmpty } from "valibot";

export const forgetPasswordValidationSchema = object({
  email: pipe(string(invalidMsg), nonEmpty("Email is required"), email("Invalid email")),
});
