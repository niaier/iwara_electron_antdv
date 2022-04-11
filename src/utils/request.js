import axios from 'axios';

const service = axios.create({
  baseURL: '',
  timeout: 60000,

})

service.interceptors.response.use(response => {
  return response.data
})

export {
  service as axios
}