import { NextApiRequest, NextApiResponse } from 'next';

export interface BaseController {
	store: (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
	getAll: (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
	update: (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
	delete: (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
}
