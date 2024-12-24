import { object, string, pipe, nonEmpty, nullish, boolean, optional } from "valibot";
import { invalidMsg, numberValidator } from ".";

export const shiftValidationSchema = object({
  name: pipe(string(invalidMsg), nonEmpty("Shift name is required")),
  code: nullish(numberValidator),
  isActive: optional(boolean(invalidMsg)),
  time: numberValidator,
});
