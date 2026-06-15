import request from './request'

export const listPhotos = (params = {}) => request.get('/photos', { params })

export const createPhoto = payload => request.post('/photos', payload)
