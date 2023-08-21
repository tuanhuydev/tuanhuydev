export type PrepareHeaders = (
	headers: Headers,
	api: {
		getState: () => unknown;
		extra: unknown;
		endpoint: string;
		type: 'query' | 'mutation';
		forced: boolean | undefined;
	}
) => Headers | void;
