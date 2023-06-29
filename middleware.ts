import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const verifyCredential = (credential: any) => {
	return true;
};

export default function middleware(request: NextRequest) {
	try {
		// Attach / Detach API credential
		// Verify tokens before proceeding anything
		return NextResponse.next();
	} catch (error) {
		return;
	}
}

export const matcher = {
	matcher: '/api/*',
};
