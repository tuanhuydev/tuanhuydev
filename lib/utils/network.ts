import { HTTP_CODE } from "@lib/commons/constants/httpCode";
import BaseError from "@lib/commons/errors/BaseError";
import { NextRequest, NextResponse } from "next/server";
import qs from "qs";
import { logService } from "server/services/LogService";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

interface RequestParams {
  [key: string]: string | number | boolean | null;
}

interface ParsingConfig {
  numericKeys?: string[];
  booleanKeys?: string[];
  dateKeys?: string[];
}

class Network {
  private readonly req: NextRequest;
  private cookie?: string;

  constructor(req: NextRequest) {
    this.req = req;
  }

  static create(req: NextRequest): Network {
    return new Network(req);
  }

  async getBody(): Promise<unknown> {
    return this.req.json() as Promise<unknown>;
  }

  extractSearchParams(config?: ParsingConfig): RequestParams {
    const { searchParams } = new URL(this.req.url);

    const defaultConfig: ParsingConfig = {
      numericKeys: ["page", "pageSize"],
      booleanKeys: ["active"],
      dateKeys: [],
    };

    const finalConfig = { ...defaultConfig, ...config };
    const params: RequestParams = {};
    const parsedParams: Record<string, unknown> = qs.parse(searchParams.toString()) ?? {};

    Object.entries(parsedParams).forEach(([key, values]) => {
      if (finalConfig.numericKeys?.includes(key)) {
        params[key] = parseInt(values as string, 10);
      } else if (finalConfig.booleanKeys?.includes(key)) {
        params[key] = Boolean(values === "true");
      } else if (values === "null") {
        params[key] = null;
      } else {
        params[key] = values as string;
      }
    });
    return params;
  }

  setCookie(key: string, value: unknown): void {
    this.cookie = `${key}=${value as string}; Path=/; HttpOnly; SameSite=Strict`;
  }

  private transformSingleItem(item: unknown): unknown {
    if (typeof item === "object" && item !== null && "_id" in item) {
      const { _id, ...rest } = item;
      return { id: _id, ...rest };
    }
    return item;
  }

  private transformMongoData<T>(data: T): T {
    if (Array.isArray(data)) {
      return data.map((item) => this.transformSingleItem(item)) as T;
    }
    return this.transformSingleItem(data as unknown) as T;
  }

  successResponse<T>(data: T): NextResponse {
    const formattedData = this.transformMongoData(data);
    const options: { status: number; headers: Record<string, string> } = {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (this.cookie) {
      options.headers["Set-Cookie"] = this.cookie;
    }

    const response: ApiResponse<T> = { success: true, data: formattedData };
    return new NextResponse(JSON.stringify(response), options);
  }

  failResponse = (error: BaseError): NextResponse => {
    logService.log(`[Server Error] ${(error as Error)?.message}`);
    const { message, status = HTTP_CODE.INTERNAL_ERROR } = error;
    const options: Record<string, unknown> = {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response: ApiResponse = { success: false, error: message };
    return new NextResponse(JSON.stringify(response), options);
  };
}

export default Network;
