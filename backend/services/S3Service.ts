import { S3 } from 'aws-sdk';
import fs from 'fs';

import BaseError from '@shared/commons/errors/BaseError';
import { awsAccessKeyId, awsBucketName, awsRegion, awsSecretAccessKey } from '@shared/configs/constants';

import { StorageInterface } from '@backend/interfaces/helper';

class S3Service implements StorageInterface {
	#instance: AWS.S3;
	#bucket: string;

	constructor() {
		this.#instance = new S3({
			accessKeyId: awsAccessKeyId,
			secretAccessKey: awsSecretAccessKey,
			region: awsRegion,
		});
		this.#bucket = awsBucketName;
	}

	async save(file: File, location: string) {
		// TODO: Modify file
		const params: S3.Types.PutObjectRequest = {
			Bucket: this.#bucket,
			ACL: 'public-read',
			Key: `${location}/${(file as File).name}`,
			Body: fs.createReadStream((file as any).path),
		};
		return new Promise((resolve, reject) => {
			this.#instance.upload(params, (error: Error, data: any) => {
				if (error) return reject(error);
				return resolve(data);
			});
		});
	}
	getBuckets() {
		return new Promise((resolve, reject) => {
			this.#instance.listBuckets((error, data) => {
				if (error) return reject(new BaseError('Unable to get buckets'));
				return resolve(data);
			});
		});
	}
}

export default new S3Service();
