import { Files, IncomingForm } from 'formidable';
import { NextApiRequest } from 'next';

import BadRequestError from '@shared/commons/errors/BadRequestError';

const fileParser = (req: NextApiRequest): Promise<any> => {
	return new Promise((resolve, reject) => {
		const form = new IncomingForm({
			multiples: false,
			keepExtensions: true,
		});
		form.parse(req, (err, fields, { file }: Files) => {
			if (err) return reject(new BadRequestError('Unable to upload file'));
			return resolve({ fields, file });
		});
	});
};
export default fileParser;
