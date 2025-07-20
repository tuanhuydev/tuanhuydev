import { HTTP_CODE } from "@lib/commons/constants/httpCode";
import BaseError from "@lib/commons/errors/BaseError";
import { NextRequest, NextResponse } from "next/server";
import qs from "qs";
import LogService from "server/services/LogService";

interface ApiResponse<T = any> {
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

// Define ObjectType locally to avoid dependencies
type ObjectType = Record<string, any>;

class Network {
  private readonly req: NextRequest;
  private cookie?: string;

  constructor(req: NextRequest) {
    this.req = req;
  }

  static create(req: NextRequest): Network {
    return new Network(req);
  }

  // Backward compatibility - will be deprecated
  static makeInstance(req: NextRequest): Network {
    return new Network(req);
  }

  async getBody(): Promise<any> {
    return this.req.json();
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
    const parsedParams: ObjectType = qs.parse(searchParams.toString()) ?? {};

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

  setCookie(key: string, value: any): void {
    this.cookie = `${key}=${value}`;
  }

  private transformSingleItem(item: any): any {
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
    return this.transformSingleItem(data);
  }

  successResponse<T>(data: T): NextResponse {
    const formattedData = this.transformMongoData(data);
    const options: Record<string, any> = {
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
    LogService.log(`[Server Error] ${(error as Error)?.message}`);
    const { message, status = HTTP_CODE.INTERNAL_ERROR } = error;
    const options: Record<string, any> = {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response: ApiResponse = { success: false, error: message };
    return new NextResponse(JSON.stringify(response), options);
  };
}

export default Network.makeInstance;
