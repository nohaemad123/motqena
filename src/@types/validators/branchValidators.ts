import { object, optional, string, pipe, nonEmpty, email, number, minLength, check, boolean } from "valibot";
import { invalidMsg, numberValidator, requiredMsg } from ".";

export const branchValidationSchema = object({
  nameEn: optional(string(invalidMsg)),
  nameAr: pipe(string(invalidMsg), nonEmpty(requiredMsg)),
  email: pipe(string(invalidMsg), nonEmpty(requiredMsg), email("Invalid email")),
  phone: pipe(
    string(requiredMsg),
    nonEmpty(requiredMsg),
    check((input) => /^\d+$/.test(input), "Phone must contain only numbers"),
    minLength(10, "Phone must be 10 digit"),
  ),
  longitude: number("The location is required"),
  latitude: numberValidator,
  cityName: pipe(string(invalidMsg), nonEmpty("City name is required")),
  neighborhood: pipe(string(invalidMsg), nonEmpty("Neighborhood is required")),
  locationTitle: pipe(string(requiredMsg), nonEmpty(requiredMsg)),
  isActive: optional(boolean(invalidMsg)),
});
