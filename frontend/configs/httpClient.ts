import axios from 'axios';
import qs from 'qs';

import { BASE_URL } from '@shared/configs/constants';

const apiClient = axios.create({
	baseURL: `${BASE_URL}/api`,
	headers: {
		'Content-Type': 'application/json',
	},
	paramsSerializer: function (params) {
		return qs.stringify(params, { arrayFormat: 'brackets' });
	},
	transformRequest: [
		function (data, headers) {
			return JSON.stringify(data);
		},
	],
	transformResponse: [
		function (data) {
			return JSON.parse(data);
		},
	],
});
export default apiClient;
