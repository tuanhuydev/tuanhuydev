'use client';

import { motion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';
import Loader from '../commons/Loader';
import dynamic from 'next/dynamic';

const AnimatePresence = dynamic(async () => (await import('framer-motion')).default.AnimatePresence, {
	loading: () => <Loader />,
});

export default function WithAnimation({ children }: PropsWithChildren) {
	return (
		<AnimatePresence>
			<motion.div
				className="h-full py-2"
				initial={{ opacity: 0, y: 35 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 45 }}>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
