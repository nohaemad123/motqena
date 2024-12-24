import { invalidMsg, optionalPhoneValidator } from "@/@types/validators";
import { object, number, optional, string, nullish, date, array } from "valibot";

export const searchValidationSchema = object({
  page: number(),
  pageSize: number(),
  search: optional(string(invalidMsg)),
  selectColumns: optional(array(string(invalidMsg))),
  sortColumn: nullish(string(invalidMsg)),
  sortColumnDirection: nullish(string(invalidMsg)),
  readDto: optional(
    object({
      name: optional(string(invalidMsg)),
      mobile: optionalPhoneValidator,
      code: optional(string(invalidMsg)),
      dateFrom: nullish(date(invalidMsg)),
      dateTo: nullish(date(invalidMsg)),
      date: nullish(date(invalidMsg)),
      fromAccountId: optional(string(invalidMsg)),
      toAccountId: optional(string(invalidMsg)),
    }),
  ),
});
