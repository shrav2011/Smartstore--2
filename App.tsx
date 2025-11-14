
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ProductProvider } from './context/ProductContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import BarcodeScanner from './pages/BarcodeScanner';
import BackupRestore from './pages/BackupRestore';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <ProductProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/edit-product/:id" element={<AddProduct />} />
              <Route path="/scan" element={<BarcodeScanner />} />
              <Route path="/backup-restore" element={<BackupRestore />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </HashRouter>
      </ProductProvider>
    </ThemeProvider>
  );
}

export default App;
