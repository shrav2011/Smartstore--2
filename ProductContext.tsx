
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductByBarcode: (barcode: string) => Product | undefined;
  clearAllProducts: () => void;
  importProducts: (newProducts: Product[]) => void;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error("Failed to parse products from localStorage", error);
      setProducts([]);
    }
  }, []);

  const saveProducts = (productsToSave: Product[]) => {
    try {
      localStorage.setItem('products', JSON.stringify(productsToSave));
      setProducts(productsToSave);
    } catch (error) {
      console.error("Failed to save products to localStorage", error);
    }
  };

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: Date.now().toString() };
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
  }, [products]);

  const updateProduct = useCallback((updatedProduct: Product) => {
    const updatedProducts = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    saveProducts(updatedProducts);
  }, [products]);

  const deleteProduct = useCallback((id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    saveProducts(updatedProducts);
  }, [products]);

  const getProductById = useCallback((id: string) => {
    return products.find((p) => p.id === id);
  }, [products]);
  
  const getProductByBarcode = useCallback((barcode: string) => {
    return products.find((p) => p.barcode === barcode);
  }, [products]);

  const clearAllProducts = useCallback(() => {
    saveProducts([]);
  }, []);
  
  const importProducts = useCallback((newProducts: Product[]) => {
    saveProducts(newProducts);
  }, []);


  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById, getProductByBarcode, clearAllProducts, importProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
