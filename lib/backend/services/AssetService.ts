import BaseError from "@lib/shared/commons/errors/BaseError";
import prismaClient from "@prismaClient/prismaClient";

export class AssetService {
  static #instance: AssetService;

  static makeInstance() {
    return AssetService.#instance ?? new AssetService();
  }

  async saveAsset(url: string, type: string) {
    const newAsset = await prismaClient.asset.create({ data: { url, type } });
    if (!newAsset) throw new BaseError("Unable to create asset");
    return newAsset;
  }
}

export default AssetService.makeInstance();
