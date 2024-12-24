import { object, optional, string, pipe, nonEmpty, boolean } from "valibot";
import { invalidMsg } from ".";

export const jobValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty("Arabic job name is required")),
  isActive: optional(boolean(invalidMsg)),
});
