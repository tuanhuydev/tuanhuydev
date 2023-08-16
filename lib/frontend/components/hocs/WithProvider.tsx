'use client';

import { notification } from 'antd';
import React, { PropsWithChildren, useReducer } from 'react';
import { createContext } from 'react';

import { EMPTY_OBJECT } from '@shared/configs/constants';
import { ObjectType } from '@shared/interfaces/base';

function reducer(state: ObjectType, item: ObjectType) {
	return { ...state, ...item };
}

export const AppContext = createContext(EMPTY_OBJECT);

export default function WithProvider(props: PropsWithChildren) {
	const [toastAPI, toastContext] = notification.useNotification();

	const [context, setContext] = useReducer(reducer, {
		theme: 'light',
		playSound: true,
		toastAPI,
	});

	return (
		<AppContext.Provider value={{ context, setContext }}>
			{props.children}
			{toastContext}
		</AppContext.Provider>
	);
}
