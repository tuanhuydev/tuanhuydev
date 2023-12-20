import axios from "axios";
import qs from "qs";

const apiClient = axios.create({
  baseURL: `/api`,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: "brackets" });
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
