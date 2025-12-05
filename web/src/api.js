import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000/api/v1' });

export function setToken(token){
  API.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
}

export default API;
