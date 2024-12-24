import { invalidMsg } from "@/@types/validators";
import { boolean, date, object, optional } from "valibot";

export const advertisementValidationSchema = object({
  date: date("this field is required"),
  isActive: optional(boolean(invalidMsg)),
});
