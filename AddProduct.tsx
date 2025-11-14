
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ScanLine, Save, Trash2 } from 'lucide-react';

const AddProduct: React.FC = () => {
  const { addProduct, getProductById, updateProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [name, setName] = useState('');
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [barcode, setBarcode] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const product = getProductById(id);
      if (product) {
        setName(product.name);
        setStock(product.stock);
        setMinStock(product.minStock);
        setBarcode(product.barcode);
        setIsEditing(true);
      }
    } else if (location.state?.barcode) {
        setBarcode(location.state.barcode);
    }
  }, [id, getProductById, location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      alert('Product name is required.');
      return;
    }
    const productData = { name, stock, minStock, barcode };

    if (isEditing && id) {
      updateProduct({ ...productData, id });
    } else {
      addProduct(productData);
    }
    navigate('/products');
  };
  
  const handleDelete = () => {
    if (id && window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      navigate('/products');
    }
  };


  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
              <input type="number" id="stock" value={stock} onChange={e => setStock(parseInt(e.target.value, 10))} min="0" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label htmlFor="minStock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Stock Level</label>
              <input type="number" id="minStock" value={minStock} onChange={e => setMinStock(parseInt(e.target.value, 10))} min="0" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>

          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Barcode</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input type="text" id="barcode" value={barcode} onChange={e => setBarcode(e.target.value)} className="flex-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
              <button type="button" onClick={() => navigate('/scan')} className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-500">
                <ScanLine className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <button type="submit" className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Save className="h-5 w-5 mr-2" />
              {isEditing ? 'Update Product' : 'Save Product'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleDelete} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
