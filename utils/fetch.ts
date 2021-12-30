import qs from "query-string";
// 捕获异常内部处理的一个提示，和你项目用的 ui 库一致就可以
import { message } from "antd";

function filterObject(o: Record<string, string>, filter: Function) {
  const res: Record<string, string> = {};
  Object.keys(o).forEach((k) => {
    if (filter(o[k], k)) {
      res[k] = o[k];
    }
  });
  return res;
}

export enum EHttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

type ICustomRequestError = {
  status: number;
  statusText: string;
  url: string;
};

function dealErrToast(
  err: Error & ICustomRequestError,
  abortController?: AbortController
) {
  switch (err.status) {
    case 408: {
      abortController && abortController.abort();
      typeof window !== "undefined" && message.error(err.statusText);
      break;
    }
    default: {
      console.log(err);
      break;
    }
  }
}

export interface IResponseData {
  code: number;
  data: any;
  message: string;
}

interface IAnyMap {
  [propName: string]: any;
}

export interface IRequestOptions {
  headers?: any;
  signal?: AbortSignal;
  method?: EHttpMethods;
  query?: IAnyMap;
  params?: IAnyMap;
  data?: IAnyMap;
  body?: string;
  timeout?: number;
  credentials?: "include" | "same-origin";
  mode?: "cors" | "same-origin";
  cache?: "no-cache" | "default" | "force-cache";
}

/**
 * Http request
 * @param url request URL
 * @param options request options
 */
interface IHttpInterface {
  csrFetch<T = IResponseData>(
    url: string,
    options?: IRequestOptions
  ): Promise<T>;
}

const CAN_SEND_METHOD = ["POST", "PUT", "PATCH", "DELETE"];

class Http implements IHttpInterface {
  public async csrFetch<T>(
    url: string,
    options?: IRequestOptions,
    abortController?: AbortController
  ): Promise<T> {
    const { method, headers, timeout, cache } = options || {};
    const defaultHeaders = {
      "Content-type": "application/json;charset=UTF-8",
      Accept: "application/json",
    };
    const opts: IRequestOptions = {
      ...options,
      method: method || EHttpMethods["GET"],
      headers: headers ? { ...defaultHeaders, ...headers } : defaultHeaders,
      timeout: timeout || 60000,
      cache: cache || "no-cache",
    };

    abortController && (opts.signal = abortController.signal);

    if (opts && opts.query) {
      url += `${url.includes("?") ? "&" : "?"}${qs.stringify(
        filterObject(opts.query, Boolean)
      )}`;
    }

    const canSend =
      opts && opts.method && CAN_SEND_METHOD.includes(opts.method);

    if (canSend && opts.data) {
      opts.body = JSON.stringify(filterObject(opts.data, Boolean));
      opts.headers &&
        Reflect.set(
          opts.headers,
          "Content-Type",
          "application/json;charset=UTF-8"
        );
    }

    try {
      const res = await Promise.race([
        fetch(url, opts),
        new Promise<any>((_, reject) => {
          setTimeout(() => {
            return reject({
              status: 408,
              statusText: "请求超时，请稍后重试",
              url,
            });
          }, opts.timeout);
        }),
      ]);
      const result = await res.json();
      return result;
    } catch (e) {
      dealErrToast(e as Error & ICustomRequestError, abortController);
      return e as any;
    }
  }
}

const { csrFetch } = new Http();

export { csrFetch as default };
