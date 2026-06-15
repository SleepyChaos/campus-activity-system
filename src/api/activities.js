import request from './request'

export const listCategories = () => request.get('/categories')

export const listActivities = (params = {}) => {
  return request.get('/activities', { params })
}

export const getActivity = id => request.get(`/activities/${id}`)

export const createActivity = payload => request.post('/activities', payload)

export const updateActivity = (id, payload) => request.patch(`/activities/${id}`, payload)

export const removeActivity = id => request.delete(`/activities/${id}`)
