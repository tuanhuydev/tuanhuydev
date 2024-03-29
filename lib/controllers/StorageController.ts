import assetService, { AssetService } from "../services/AssetService";
import { CompleteMultipartUploadOutput } from "@aws-sdk/client-s3";
import S3Service from "@lib/services/S3Service";
import BadRequestError from "@lib/shared/commons/errors/BadRequestError";
import Network from "@lib/shared/utils/network";
import BaseError from "@shared/commons/errors/BaseError";
import { NextRequest } from "next/server";

class StorageController {
  #assetService: AssetService;
  static #instance: StorageController;

  static makeInstance(assetService: AssetService) {
    return StorageController.#instance ?? new StorageController(assetService);
  }

  constructor(assetService: AssetService) {
    this.#assetService = assetService;
  }

  async extractFileFromRequest(request: NextRequest): Promise<File> {
    const formData = await request.formData();
    const file = formData.get("file") as unknown;

    if (!file) throw new BaseError("Invalid File");
    return file as File;
  }

  validateFile = (file: File) => {
    const maxSizeInBytes = 1024 * 1024 * 2; // 2 MB
    if (file.size > maxSizeInBytes) throw new BadRequestError("File is too heavy");
  };

  async uploadFile(request: NextRequest, { type }: any) {
    const network = Network(request);
    try {
      const file: File = await this.extractFileFromRequest(request);

      this.validateFile(file);

      const data: CompleteMultipartUploadOutput = await S3Service.save(file as File, type as string);
      if (!data) throw new BaseError("Unable to upload file");

      const asset = await assetService.saveAsset(data.Location as string, type);

      return network.successResponse(asset);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default StorageController.makeInstance(assetService);
