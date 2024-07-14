import LogService from "@lib/services/LogService";
import { HTTP_CODE } from "@shared/commons/constants/httpCode";
import BaseError from "@shared/commons/errors/BaseError";
import { NextRequest, NextResponse } from "next/server";
import qs from "qs";

class Network {
  #req: NextRequest;
  cookie?: string;

  static #instance: Network;

  constructor(req: NextRequest) {
    this.#req = req;
  }

  static makeInstance(req: NextRequest) {
    if (Network.#instance) {
      return Network.#instance;
    }
    return new Network(req);
  }

  async getBody(): Promise<any> {
    return this.#req.json();
  }

  extractSearchParams(): ObjectType {
    const { searchParams } = new URL(this.#req.url);

    const params: ObjectType = {};
    const numbericKeys = ["page", "pageSize"];
    const booleanKeys = ["active"];
    const parsedParams: ObjectType = qs.parse(searchParams.toString()) ?? {};

    Object.entries(parsedParams).forEach(([key, values]) => {
      if (numbericKeys.includes(key)) params[key] = parseInt(values, 10);
      else if (booleanKeys.includes(key)) params[key] = Boolean(values === "true");
      else if (values === "null") params[key] = null;
      else {
        params[key] = values;
      }
    });
    return params;
  }

  setCookie(key: string, value: any) {
    this.cookie = `${key}=${value}`;
  }

  successResponse(data: any) {
    let formatedData: any = data;
    if (Array.isArray(data)) {
      formatedData = (formatedData as ObjectType[]).map(({ _id, ...restData }: ObjectType) => ({
        id: _id,
        ...restData,
      }));
    } else if (typeof data === "object" && "_id" in data) {
      formatedData.id = data["_id"];
      delete formatedData._id;
    }
    const options: ObjectType = {
      status: 200,
    };
    if (this.cookie) {
      options["Set-Cookie"] = this.cookie;
    }
    return new NextResponse(JSON.stringify({ success: true, data: formatedData }), options);
  }

  failResponse = (error: BaseError) => {
    LogService.log(`[Server Error] ${(error as Error)?.message}`);
    const { message, status = HTTP_CODE.INTERNAL_ERROR } = error;
    const options: ObjectType = { status };

    const dataString = JSON.stringify({ success: false, error: message });
    return new NextResponse(dataString, options);
  };
}

export default Network.makeInstance;
