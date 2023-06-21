import React, { useReducer } from 'react';
import { createContext } from 'react';

import { EMPTY_OBJECT } from '@shared/configs/constants';
import { ComponentProps, ObjectType } from '@shared/interfaces/base';

export interface ProviderProps extends ComponentProps {
	context: any;
}

function reducer(state: ObjectType, item: ObjectType) {
	return { ...state, ...item };
}

export const AppContext = createContext(EMPTY_OBJECT);

export default function WithProvider(props: ProviderProps) {
	const [context, setContext] = useReducer(reducer, props.context);

	return <AppContext.Provider value={{ context, setContext }}>{props?.children}</AppContext.Provider>;
}
