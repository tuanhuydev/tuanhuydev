'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';

export default function WithAnimation({ children }: PropsWithChildren) {
	return (
		<AnimatePresence>
			<motion.div
				className="h-full"
				initial={{ opacity: 0, y: 35 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0 }}
				transition={{ delay: 0.2 }}>
				<div className="p-4 h-full overflow-auto flex flex-col">{children}</div>
			</motion.div>
		</AnimatePresence>
	);
}
