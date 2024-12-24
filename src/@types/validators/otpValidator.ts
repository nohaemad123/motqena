import { invalidMsg } from "@/@types/validators";
import { object, string, pipe, nonEmpty } from "valibot";

export const otpValidationSchema = object({
  // email: pipe(string(invalidMsg), nonEmpty("Email is required"), email("Invalid email")),
  code: pipe(string(invalidMsg), nonEmpty("otp is required")),
});
