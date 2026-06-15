import request from './request'

export const login = params => {
  return request.get('/users', { params })
}
