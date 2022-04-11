import { axios } from '@/utils/request'


export function postAction (url, params) {
  return axios({
    url: url,
    method: 'post',
    data: params
  })
}

export function getAction (url, params) {
  return axios({
    url,
    method: 'get',
    params
  })
}


export function httpAction (url, data, params, method) {
  return axios({
    url,
    method,
    data,
    params
  })
}