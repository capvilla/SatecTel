const axios = require('axios');
const MY_TOKEN = '7196401152:AAFhJDYSgpxb3gjJsTui_xnsxnwSXmFBE-8';

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