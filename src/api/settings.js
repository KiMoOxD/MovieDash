import axiosClient from './axiosClient'

function safeGetConfig(config) {
  return config || {}
}

const settingsApi = {
  getSettingData: (config) => axiosClient.get('/Setting/GetSettingData', safeGetConfig(config)),
  updateSettings: (payload, config) => axiosClient.put('/Setting/UpdateSetting', payload, safeGetConfig(config)),
  changePassword: (payload, config) => axiosClient.post('/Setting/ChangePassword', payload, safeGetConfig(config)),

  // Decode user id from a JWT stored in localStorage under 'token'. Returns null if not found.
  getUserIdFromToken: () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const parts = token.split('.')
      if (parts.length < 2) return null
      const base64Url = parts[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
      const json = decodeURIComponent(
        atob(padded)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const payload = JSON.parse(json)
      // Common claim names for id
      return payload.userId ?? payload.user_id ?? payload.sub ?? payload.id ?? payload.nameid ?? null
    } catch (err) {
      return null
    }
  },
}

export default settingsApi
