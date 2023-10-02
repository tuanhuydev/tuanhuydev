'use client';

import { EMPTY_OBJECT } from '@lib/configs/constants';
import { notification } from 'antd';
import React, { PropsWithChildren, useReducer } from 'react';
import { createContext } from 'react';

import { ObjectType } from '@shared/interfaces/base';

function reducer(state: ObjectType, item: ObjectType) {
	return { ...state, ...item };
}

export const AppContext = createContext(EMPTY_OBJECT);

export default function WithProvider(props: PropsWithChildren) {
	const [notify, notifyContext] = notification.useNotification();

	const [context, setContext] = useReducer(reducer, {
		theme: 'light',
		playSound: true,
		notify,
	});

	return (
		<AppContext.Provider value={{ context, setContext }}>
			{props.children}
			{notifyContext}
		</AppContext.Provider>
	);
}
