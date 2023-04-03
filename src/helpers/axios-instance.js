import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.VUE_APP_HOST + '/api/';

export function setAuthorization(token)
{
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios;