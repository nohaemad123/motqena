import { object, optional, string, pipe, nonEmpty, boolean } from "valibot";
import { invalidMsg } from ".";

export const nationalityValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty("Arabic nationality name is required")),
  isActive: optional(boolean(invalidMsg)),
});
