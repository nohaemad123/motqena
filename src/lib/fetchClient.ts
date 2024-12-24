import { CookiesEnum, prepareUrl } from "@/@types/stables";
import { useAppStore } from "@/store";
import { getCookie } from "cookies-next";
import { enqueueSnackbar } from "notistack";

type HttpMethodType = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

type HeadersType = HeadersInit & { [key: string]: any };

interface IFetchClientConfig extends Omit<RequestInit, "body" | "headers"> {
  method?: HttpMethodType;
  body?: any;
  headers?: HeadersType;
  params?: any;
  stringify?: boolean;
}

export default async function fetchClient<T>(
  input: string | URL | globalThis.Request,
  { params, body, stringify = true, ...init }: IFetchClientConfig = {},
): Promise<T> {
  useAppStore.setState({ isHttpClientLoading: true });

  const accessToken = useAppStore.getState().userToken ?? getCookie(CookiesEnum.userAccessToken);
  const auth = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

  const config: IFetchClientConfig = {
    ...init,
    body,
    headers: {
      ...auth,
      ...init?.headers,
    },
  };

  if (stringify) {
    config.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    };
    config.body = body !== undefined && stringify ? JSON.stringify(body) : body;
  }

  // Resolve URL using the utility function
  const url = prepareUrl(input instanceof globalThis.Request ? input.url : input.toString(), params);

  const req = new Request(url, config);

  try {
    return await attemptFetch<T>(req, config);
  } catch (error: any) {
    // global error handler
    if (error.message) enqueueSnackbar(error.message, { variant: "error" });
    throw error;
  } finally {
    useAppStore.setState({ isHttpClientLoading: false });
  }
}

async function attemptFetch<T>(req: Request, config: IFetchClientConfig): Promise<T> {
  const res = await fetch(req, config);

  const jsonData = await res.json();

  if (!res.ok) {
    if (res.status >= 400) {
      // Handle other status codes 400 or higher
      throw { status: res.status, message: jsonData.message };
    }
  }

  return jsonData;
}
