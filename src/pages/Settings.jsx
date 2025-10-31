// Settings.jsx
import React, { useState, useEffect } from 'react';
import settingsApi from '../api/settings'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'

export default function Settings() {
  const { user } = useAuth() || {}
  const { addToast } = useToast()

  const [settings, setSettings] = useState({
    applicationName: 'Admin Dashboard',
    adminEmail: user?.email ?? 'admin@movieapp.com',
    emailNotifications: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changingPwd, setChangingPwd] = useState(false)

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = (setter) => {
    setter(prev => !prev)
  }

  const handleUpdatePassword = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      addToast('New passwords do not match!', { type: 'error' })
      return
    }
    setChangingPwd(true)
    try {
      const userId = settingsApi.getUserIdFromToken() ?? user?.id ?? user?.userId ?? 0
      const payload = {
        userId: Number(userId) || 0,
        oldPassword: settings.currentPassword,
        newPassword: settings.newPassword,
        confirmPassword: settings.confirmPassword,
      }
      await settingsApi.changePassword(payload)
      addToast('Password updated successfully!', { type: 'success' })
      setSettings((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch (err) {
      const msg = err?.response?.data || err?.message || 'Change password failed'
      addToast(typeof msg === 'string' ? msg : JSON.stringify(msg), { type: 'error' })
    } finally {
      setChangingPwd(false)
    }
  }

  const handleSaveChanges = async () => {
    setSaving(true)
    try {
      const payload = {
        appName: settings.applicationName,
        emailNotification: !!settings.emailNotifications,
      }
      await settingsApi.updateSettings(payload)
      addToast('Settings saved successfully!', { type: 'success' })
    } catch (err) {
      const msg = err?.response?.data || err?.message || 'Save failed'
      addToast(typeof msg === 'string' ? msg : JSON.stringify(msg), { type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true
    setLoading(true)
    settingsApi
      .getSettingData({ signal: ac.signal })
      .then((res) => {
        if (!mounted) return
        const data = res?.data ?? res
        setSettings((prev) => ({
          ...prev,
          applicationName: data.appName ?? prev.applicationName,
          emailNotifications: typeof data.emailNotification === 'boolean' ? data.emailNotification : prev.emailNotifications,
        }))
      })
      .catch((err) => {
        if (axiosIsAbort(err)) return
        const msg = err?.response?.data || err?.message || 'Failed to load settings'
        addToast(typeof msg === 'string' ? msg : JSON.stringify(msg), { type: 'error' })
      })
      .finally(() => setLoading(false))

    return () => {
      mounted = false
      ac.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function axiosIsAbort(err) {
    return err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED'
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your application settings</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-1">General Settings</h2>
        <p className="text-sm text-gray-500 mb-4">Configure general application settings</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
            <input
              type="text"
              name="applicationName"
              value={settings.applicationName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input
              type="email"
              name="adminEmail"
              value={settings.adminEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-1">Notifications</h2>
        <p className="text-sm text-gray-500 mb-4">Manage notification preferences</p>
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
            <p className="text-xs text-gray-500">Receive email notifications for new uploads</p>
          </div>
          <div className="flex items-center">
            <label htmlFor="email-toggle" className="relative inline-flex items-center cursor-pointer">
              <input
                id="email-toggle"
                type="checkbox"
                name="emailNotifications"
                className="sr-only"
                checked={!!settings.emailNotifications}
                onChange={(e) => setSettings((p) => ({ ...p, emailNotifications: e.target.checked }))}
                aria-label="Enable email notifications"
              />
              <span
                className={`w-12 h-7 flex items-center shrink-0 p-1 rounded-full transition-colors duration-200 ease-in-out ${
                  settings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-200 ease-in-out ${
                    settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </span>
            </label>
            <span className="ml-3 text-sm text-gray-700">{settings.emailNotifications ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-1">Security</h2>
        <p className="text-sm text-gray-500 mb-4">Manage security settings</p>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={settings.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility(setShowCurrentPassword)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showCurrentPassword ? (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                )}
              </svg>
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={settings.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility(setShowNewPassword)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showNewPassword ? (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                )}
              </svg>
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={settings.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showConfirmPassword ? (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                )}
              </svg>
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={handleUpdatePassword}
              disabled={changingPwd}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {changingPwd ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={() => alert("Cancelled!")}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}