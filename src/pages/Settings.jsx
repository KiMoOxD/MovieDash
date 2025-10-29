// Settings.jsx
import React, { useState } from 'react';

export default function Settings() {
  // Mock state - replace with API or context later
  const [settings, setSettings] = useState({
    applicationName: "Admin Dashboard",
    adminEmail: "admin@movieapp.com",
    emailNotifications: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdatePassword = () => {
    if (settings.newPassword !== settings.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    // In real app: call API to update password
    alert("Password updated successfully!");
    setSettings(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  const handleSaveChanges = () => {
    // In real app: call API to save all settings
    alert("Settings saved successfully!");
  };

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
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="toggle"
              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                settings.emailNotifications ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            ></label>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-1">Security</h2>
        <p className="text-sm text-gray-500 mb-4">Manage security settings</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={settings.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={settings.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={settings.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleUpdatePassword}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              Update Password
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
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}