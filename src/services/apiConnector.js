import axios from 'axios';

// Create an instance of Axios with default configuration
export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method:method,
        url:url,
        data: bodyData?bodyData:null,
        headers : headers?headers:null,
        params: params?params:null,
    });
}
