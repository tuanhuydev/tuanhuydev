import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import UnauthorizedError from '@lib/shared/commons/errors/UnauthorizedError';
import { StorageInterface } from 'lib/backend/interfaces/helper';
import BaseError from 'lib/shared/commons/errors/BaseError';
import { awsAccessKeyId, awsBucketName, awsRegion, awsSecretAccessKey } from 'lib/shared/configs/constants';

class S3Service implements StorageInterface {
	#S3Client: S3 | undefined;
	#bucket: string;

	static #instance: S3Service;

	static makeInstance() {
		// Implement Singleton
		if (S3Service.#instance) {
			return S3Service.#instance;
		}
		return new S3Service();
	}

	constructor() {
		if (awsAccessKeyId && awsSecretAccessKey && awsRegion) {
			this.#S3Client = new S3({
				credentials: {
					accessKeyId: awsAccessKeyId,
					secretAccessKey: awsSecretAccessKey,
				},
				region: awsRegion,
			});
		}
		this.#bucket = awsBucketName;
	}

	async save(file: File, location: string) {
		try {
			if (!file || !location || !this.#bucket || !this.#S3Client) throw new BaseError('Unable to upload file');
			const uploader = new Upload({
				client: this.#S3Client,
				params: {
					Bucket: this.#bucket,
					ACL: 'public-read',
					Key: `${location}/${(file as File).name}`,
					Body: file as Blob,
				},
			});
			const uploadedFile = await uploader.done();
			return uploadedFile;
		} catch (err) {
			throw new BaseError((err as Error).message);
		}
	}
	getBuckets() {}
}

export default S3Service.makeInstance();
