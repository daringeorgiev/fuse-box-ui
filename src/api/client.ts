import axios from 'axios'
import { auth } from '../firebase'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message ?? err.message
    return Promise.reject(new Error(message))
  }
)

export default client
