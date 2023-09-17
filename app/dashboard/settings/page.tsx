'use client';

import React from 'react';
import DynamicForm from '@lib/components/DynamicForm/DynamicForm';
import WithAnimation from '@lib/components/hocs/WithAnimation';

export default function Page() {
	return (
		<WithAnimation>
			<DynamicForm />
		</WithAnimation>
	);
}
