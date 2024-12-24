import { object, optional, string, pipe, nonEmpty, boolean } from "valibot";
import { invalidMsg } from ".";

export const serviceSystemValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty("Arabic system service name is required")),
  isActive: optional(boolean(invalidMsg)),
});
