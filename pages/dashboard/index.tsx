'use client';

import { Skeleton } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function Page() {
	const router = useRouter();

	useEffect(() => {
		router.push('/dashboard/home');
	}, [router]);

	return <Skeleton />;
}
