'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';

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
