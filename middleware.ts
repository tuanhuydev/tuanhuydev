import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
	console.log('Handling Error');
	try {
		return NextResponse.next();
	} catch (error) {
		console.log(error);
		return;
	}
}

export const matcher = {
	matcher: '/api/*',
};
