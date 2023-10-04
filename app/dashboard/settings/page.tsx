'use client';

import DynamicForm from '@lib/components/DynamicForm/DynamicForm';
import WithAnimation from '@lib/components/hocs/WithAnimation';
import React from 'react';

export default function Page() {
	return (
		<WithAnimation>
			<DynamicForm />
		</WithAnimation>
	);
}
