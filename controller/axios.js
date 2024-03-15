const axios = require('axios');
const MY_TOKEN = '6731977181:AAGgM2nyaTVZKpOqduFQTwW7etnuBg_vbtM';

const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;

function getAxiosInstance() {
    return {
        get(method, params) {
            return axios.get(`/${method}`, {
                baseURL: BASE_URL,
                params
            });
        },
        post(method, data) {
            return axios({
                method: "post",
                baseURL: BASE_URL,
                url: `/${method}`,
                data
            });
        },
    };
}

module.exports = { axiosInstance: getAxiosInstance() };
