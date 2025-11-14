
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useProducts } from '../hooks/useProducts';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { clearAllProducts } = useProducts();
  const appVersion = "1.0.0";

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all product data? This action cannot be undone.')) {
      clearAllProducts();
      alert('All product data has been cleared.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Appearance</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">Dark Mode</span>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800`}
          >
            <span className="sr-only">Toggle Dark Mode</span>
            <span
              className={`${
                theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'
              } absolute w-full h-full rounded-full`}
            />
            <span
              className={`${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Data Management</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-300">Clear All Data</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Permanently delete all products from this device.</p>
          </div>
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
          >
            Clear Data
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">About</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">App Version</span>
          <span className="text-gray-800 dark:text-gray-200 font-mono">{appVersion}</span>
        </div>
         <div className="flex items-center justify-between mt-2">
          <span className="text-gray-600 dark:text-gray-300">Created by</span>
          <span className="text-gray-800 dark:text-gray-200 font-semibold">Shravan</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
