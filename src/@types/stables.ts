import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";
import environment from "@/environment";

export enum CookiesEnum {
  userAccessToken = "x-access-token",
  adminAccessToken = "a-access-token",
}
export const customId = () => Date.now().toString(36) + Math.round(Math.random() * 10 ** 6).toString(36);

export function toBase(id: string, base: 2 | 4 | 8 | 16) {
  const half = Math.floor(id.length / 2);
  const first = id.slice(0, half);
  const second = id.slice(half);
  return parseInt(first, 16).toString(base).toUpperCase() + parseInt(second, 16).toString(base).toUpperCase();
}

export function addParamsToUrl(url: string, searchParams: any): string {
  // add query searchParams to URL
  let params = "";
  for (const key in searchParams) {
    if (Object.prototype.hasOwnProperty.call(searchParams, key)) {
      const val = searchParams[key];
      if (!params) params = `?${key}=${val}`;
      else params += `&${key}=${val}`;
    }
  }
  url += params;

  return url;
}

/**
 * Resolves a relative URL to an absolute URL using the provided base URL.
 * If the URL is already absolute, it returns it unchanged.
 *
 * @param url - The URL to resolve (can be a relative or absolute URL).
 * @param baseUrl - The base URL to use for resolving relative URLs.
 * @returns The resolved absolute URL.
 */
export function prepareUrl(url: string, searchParams?: any): string {
  try {
    url = addParamsToUrl(url, searchParams);

    // If the URL is absolute, return it as-is
    if (/^(https?:\/\/)/i.test(url)) {
      return url;
    }

    // Create a new URL object with the base URL and relative URL
    return new URL("/api/" + url, environment.apiHost).toString();
  } catch (_error) {
    // console.error("Error resolving URL:", error);
    return url; // Return the original URL in case of error
  }
}

export function getTranslatedName(names: ITranslatedName[], locale: string) {
  const enName = names.find((n) => n.language === "en")?.value;
  return names.find((n) => n.language === locale)?.value ?? enName;
}
