import React, { useState, useEffect } from 'react';
import { FaFilm, FaUsers, FaCreditCard } from 'react-icons/fa';
import { FiTv } from "react-icons/fi";
import dashboardApi from '../api/dashboard';
import { useToast } from '../contexts/ToastContext';

export default function Overview() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    totalActiveUsers: 0,
    totalActiveSubscriptions: 0,
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const showApiErrors = (err) => {
    if (err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError' || /cancel/i.test(err?.message || '')) return;
    const problems = err?.response?.data;
    if (typeof problems === 'string' && problems.trim()) {
      addToast(problems, { type: 'error' });
      return;
    }
    if (problems?.errors && typeof problems.errors === 'object') {
      Object.values(problems.errors).forEach((arr) => {
        if (Array.isArray(arr)) arr.forEach((m) => addToast(m, { type: 'error' }));
        else addToast(String(arr), { type: 'error' });
      });
      return;
    }
    const title = problems?.title || problems?.message || err?.message || 'An error occurred';
    addToast(title, { type: 'error' });
  };

  const loadStats = async (config) => {
    setLoading(true);
    try {
      const res = await dashboardApi.getStats(config);
      const data = res.data ?? res;
      setStats({
        totalMovies: Number(data.totalMovies) || 0,
        totalSeries: Number(data.totalSeries) || 0,
        totalActiveUsers: Number(data.totalActiveUsers) || 0,
        totalActiveSubscriptions: Number(data.totalActiveSubscriptions) || 0,
      });
    } catch (err) {
      console.error('loadStats error', err.response ?? err);
      // If backend returns 404/no-data as plain text, show info and keep zeros
      const resp = err?.response;
      if (resp && (resp.status === 404 || resp.status === 204)) {
        const body = resp.data;
        if (typeof body === 'string' && body.trim()) addToast(body, { type: 'info' });
        setStats({ totalMovies: 0, totalSeries: 0, totalActiveUsers: 0, totalActiveSubscriptions: 0 });
      } else {
        showApiErrors(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadStats({ signal: controller.signal });
    return () => controller.abort();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
      <p className="text-gray-500 mb-6">Welcome back! Here's what's happening today.</p>
      <div className="grid grid-cols-4 gap-4">
        {/* Total Movies Card */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500/90">Total Movies</h2>
            <p className="text-xl font-semibold mt-1">{loading ? '—' : stats.totalMovies}</p>
          </div>
          <div className="bg-gray-200 rounded-md p-2">
            <FaFilm className="h-6 w-6 text-gray-700" />
          </div>
        </div>

        {/* Total Series Card */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500/90">Total Series</h2>
            <p className="text-xl font-semibold mt-1">{loading ? '—' : stats.totalSeries}</p>
          </div>
          <div className="bg-gray-200 rounded-md p-2">
            <FiTv className="h-6 w-6 text-gray-700" />
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500/90">Active Users</h2>
            <p className="text-xl font-semibold mt-1">{loading ? '—' : stats.totalActiveUsers}</p>
          </div>
          <div className="bg-gray-200 rounded-md p-2">
            <FaUsers className="h-6 w-6 text-gray-700" />
          </div>
        </div>

        {/* Active Subscriptions Card */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500/90">Active Subscriptions</h2>
            <p className="text-xl font-semibold mt-1">{loading ? '—' : stats.totalActiveSubscriptions}</p>
          </div>
          <div className="bg-gray-200 rounded-md p-2">
            <FaCreditCard className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}