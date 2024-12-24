import { object, string, pipe, nonEmpty, array, minLength, boolean, optional } from "valibot";
import { invalidMsg, numberValidator, requiredMsg } from ".";

export const ProvidedServiceValidationSchema = object({
  typeOfServiceId: pipe(string(invalidMsg), nonEmpty("Type of service is required")),
  systemOfServiceId: pipe(string(invalidMsg), nonEmpty("system of service is required")),
  isActive: optional(boolean()),
  details: pipe(
    array(
      object({
        branchId: pipe(string(invalidMsg), nonEmpty("branch is required")),
        nationalityId: pipe(string(invalidMsg), nonEmpty("nationality is required")),
        hourPrice: optional(numberValidator),
        dayPrice: optional(numberValidator),
        monthPrice: optional(numberValidator),
        descount: optional(numberValidator),
        tax: optional(numberValidator),
        externalFees: optional(numberValidator),
        internalFees: optional(numberValidator),
        governmentFees: optional(numberValidator),
        workerCount: optional(numberValidator),
      }),
    ),
    minLength(1, requiredMsg),
  ),
});
