
import React, { useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { Upload, Download } from 'lucide-react';

const BackupRestore: React.FC = () => {
  const { products, importProducts } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    if (products.length === 0) {
      alert("No products to back up.");
      return;
    }
    
    const headers = ["id", "name", "stock", "minStock", "barcode"];
    const csvContent = [
      headers.join(","),
      ...products.map(p => headers.map(header => p[header as keyof Product]).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `smartstock_backup_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const rows = text.split('\n');
        const headers = rows[0].trim().split(',');
        const newProducts: Product[] = [];
        
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].trim();
          if (!row) continue;
          
          const values = row.split(',');
          const product: any = {};
          headers.forEach((header, index) => {
            const key = header as keyof Product;
            const value = values[index];
            if(key === 'stock' || key === 'minStock') {
              product[key] = parseInt(value, 10);
            } else {
              product[key] = value;
            }
          });
          newProducts.push(product as Product);
        }

        if (window.confirm(`Found ${newProducts.length} products. This will overwrite all current data. Continue?`)) {
          importProducts(newProducts);
          alert("Data restored successfully!");
        }
      } catch (error) {
        alert("Failed to parse CSV file. Please check the file format.");
        console.error(error);
      } finally {
        if(fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Backup & Restore</h1>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Backup Data</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Download all your product data as a CSV file. Keep it in a safe place.</p>
          <button onClick={handleBackup} className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Download className="h-5 w-5 mr-2" />
            Download Backup
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">Restore Data</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Upload a previously downloaded CSV backup file to restore your data. <strong className="text-red-500">Warning: This will overwrite all existing data.</strong></p>
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleRestore} className="hidden" id="restore-file-input" />
          <label htmlFor="restore-file-input" className="cursor-pointer inline-flex items-center justify-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <Upload className="h-5 w-5 mr-2" />
            Choose File to Restore
          </label>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
