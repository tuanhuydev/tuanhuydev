import { NextRequest } from 'next/server';

export interface BaseController {
	store: (req: NextRequest) => Promise<any>;
	getAll: (req: NextRequest) => Promise<any>;
	update: (req: NextRequest, params?: any) => Promise<any>;
	delete: (req: NextRequest, params?: any) => Promise<any>;
}
