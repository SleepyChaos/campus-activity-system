import request from './request'

export const listRegistrations = (params = {}) => {
  return request.get('/registrations', { params })
}

export const createRegistration = payload => request.post('/registrations', payload)

export const updateRegistration = (id, payload) => request.patch(`/registrations/${id}`, payload)
