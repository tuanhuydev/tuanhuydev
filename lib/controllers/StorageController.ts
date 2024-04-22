import { CompleteMultipartUploadOutput } from "@aws-sdk/client-s3";
import S3Service from "@lib/services/S3Service";
import BadRequestError from "@lib/shared/commons/errors/BadRequestError";
import Network from "@lib/shared/utils/network";
import BaseError from "@shared/commons/errors/BaseError";
import { NextRequest } from "next/server";

class StorageController {
  static #instance: StorageController;

  static makeInstance() {
    return StorageController.#instance ?? new StorageController();
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

  async uploadImage(formData: FormData) {
    const image = formData.get("file") as unknown;

    if (!image) throw new BaseError("Invalid File");

    this.validateFile(image as unknown as File);

    const data: CompleteMultipartUploadOutput = await S3Service.save(image as File, "image");
    if (!data) throw new BaseError("Unable to upload file");

    return data;
  }

  async uploadBackup(formData: FormData) {
    const file = formData.get("file") as unknown as File;
    if (!file) throw new BaseError("Invalid File");
    this.validateFile(file as unknown as File);

    const fileContent: string = await file.text();
    const backup = JSON.parse(fileContent);

    if ("posts" in backup) {
      // Promise.all(
      //   backup.posts.forEach(({ id, ...postBody }: Post) => {
      //     return PostPrismaRepository.createPost(postBody);
      //   }),
      // );
    }
    if ("users" in backup) {
      // Promise.all(
      //   backup.users.forEach(({ id, ...userBody }: Post) => {
      //     return UserService.createUser(userBody);
      //   }),
      // );
    }
  }

  async uploadFile(request: NextRequest, { type }: any) {
    const formData = await request.formData();

    const network = Network(request);
    try {
      switch (type) {
        case "image":
          const asset = await this.uploadImage(formData);
          return network.successResponse(asset);

        case "backup":
          await this.uploadBackup(formData);
          return network.successResponse("Backup uploaded");
        default:
          throw new BadRequestError("Invalid File Type");
      }
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default StorageController.makeInstance();
