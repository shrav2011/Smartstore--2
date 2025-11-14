
import React, { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import StatCard from '../components/StatCard';
import { Package, Boxes, AlertTriangle, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { products } = useProducts();

  const { totalProducts, totalStock, lowStockItems, lowStockCount } = useMemo(() => {
    const lowStockItems = products.filter(p => p.stock <= p.minStock);
    return {
      totalProducts: products.length,
      totalStock: products.reduce((sum, p) => sum + p.stock, 0),
      lowStockItems,
      lowStockCount: lowStockItems.length,
    };
  }, [products]);

  const chartData = useMemo(() => {
    return products
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10)
      .map(p => ({ name: p.name, stock: p.stock, minStock: p.minStock }));
  }, [products]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<Package size={24} className="text-white" />} 
          title="Total Products" 
          value={totalProducts} 
          color="bg-blue-500"
        />
        <StatCard 
          icon={<Boxes size={24} className="text-white" />} 
          title="Total Stock Quantity" 
          value={totalStock} 
          color="bg-green-500"
        />
        <StatCard 
          icon={<AlertTriangle size={24} className="text-white" />} 
          title="Low Stock Items" 
          value={lowStockCount} 
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Stock Overview (Top 10)</h2>
          {products.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" tick={{ fill: 'currentColor' }} className="text-xs text-gray-500 dark:text-gray-400" />
                <YAxis tick={{ fill: 'currentColor' }} className="text-xs text-gray-500 dark:text-gray-400" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    borderColor: '#4b5563',
                    color: '#ffffff',
                    borderRadius: '0.5rem'
                  }}
                  cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}
                />
                <Legend />
                <Bar dataKey="stock" fill="#3b82f6" name="Current Stock"/>
                <Bar dataKey="minStock" fill="#ef4444" name="Min Stock"/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No product data to display.
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
            <Bell className="mr-2 text-yellow-500" size={22}/>
            Low Stock Alerts
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {lowStockItems.length > 0 ? (
              lowStockItems.map(item => (
                <div key={item.id} className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                  <p className="font-semibold text-red-800 dark:text-red-300">{item.name}</p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Stock: {item.stock} (Min: {item.minStock})
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mt-4 text-center">No low stock items. Great job!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
