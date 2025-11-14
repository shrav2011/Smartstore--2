
import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { Plus, Minus, Search, AlertTriangle, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Products: React.FC = () => {
  const { products, updateProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm)
    );
  }, [products, searchTerm]);

  const handleStockChange = (product: Product, amount: number) => {
    const newStock = Math.max(0, product.stock + amount);
    updateProduct({ ...product, stock: newStock });
  };
  
  const handleEdit = (id: string) => {
    navigate(`/edit-product/${id}`);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Products</h1>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">Current Stock</th>
                <th scope="col" className="px-6 py-3">Min Stock</th>
                <th scope="col" className="px-6 py-3">Barcode</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => {
                  const isLowStock = product.stock <= product.minStock;
                  return (
                    <tr key={product.id} className={`border-b dark:border-gray-700 ${isLowStock ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-800'}`}>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center">
                          {product.name}
                          {isLowStock && <AlertTriangle className="ml-2 text-red-500" size={16} title="Low Stock" />}
                        </div>
                        {isLowStock && <span className="text-xs text-red-500 dark:text-red-400">Low Stock</span>}
                      </th>
                      <td className="px-6 py-4 font-bold">{product.stock}</td>
                      <td className="px-6 py-4">{product.minStock}</td>
                      <td className="px-6 py-4 font-mono">{product.barcode}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                           <button onClick={() => handleStockChange(product, -1)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-red-200 dark:hover:bg-red-500 transition">
                            <Minus size={16} />
                          </button>
                          <button onClick={() => handleStockChange(product, 1)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-green-200 dark:hover:bg-green-500 transition">
                            <Plus size={16} />
                          </button>
                           <button onClick={() => handleEdit(product.id)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-blue-200 dark:hover:bg-blue-500 transition">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
