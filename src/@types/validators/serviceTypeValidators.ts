import { object, string, pipe, nonEmpty, nullish, boolean, optional } from "valibot";
import { invalidMsg } from ".";

export const serviceTypeValidationSchema = object({
  nameAr: pipe(string(invalidMsg), nonEmpty("Service name is required")),
  nameEn: optional(string(invalidMsg)),
  systemOfServiceId: nullish(string(invalidMsg)),
  shiftId: nullish(string(invalidMsg)),
  isActive: optional(boolean(invalidMsg)),
  womenIsRequired: nullish(boolean(invalidMsg)),
});
