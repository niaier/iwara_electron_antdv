import { getAction } from '@/api/http/manage'

// 获取所有
const getData = (params) => getAction('http://localhost:3001/data?type=downloaded', params)

export {
  getData
}