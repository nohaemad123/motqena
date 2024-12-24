import { object, optional, string, nullish } from "valibot";
import { invalidMsg, numberValidator } from ".";

export const userPermissionsValidationSchema = object({
  id: optional(string(invalidMsg)),
  code: nullish(numberValidator),
  permission: optional(string(invalidMsg)),
  userName: optional(string(invalidMsg)),
});
