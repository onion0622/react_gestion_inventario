import React, { createContext, useState, useContext, useEffect } from 'react';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    minStock: ''
  });

  const API_BASE = 'http://localhost:5000/api';

  // Cargar productos desde la API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Error al cargar productos');
        // Fallback a datos locales si la API no está disponible
        const sampleData = [
          { id: 1, name: 'Laptop Dell XPS', quantity: 15, price: 899.99, minStock: 5 },
          { id: 2, name: 'Mouse Inalámbrico', quantity: 3, price: 29.99, minStock: 10 },
          { id: 3, name: 'Teclado Mecánico', quantity: 25, price: 79.99, minStock: 8 },
          { id: 4, name: 'Monitor 24"', quantity: 12, price: 199.99, minStock: 6 }
        ];
        setProducts(sampleData);
      }
    } catch (error) {
      console.error('Error conectando con la API:', error);
      // Fallback a datos locales
      const sampleData = [
        { id: 1, name: 'Laptop Dell XPS', quantity: 15, price: 899.99, minStock: 5 },
        { id: 2, name: 'Mouse Inalámbrico', quantity: 3, price: 29.99, minStock: 10 },
        { id: 3, name: 'Teclado Mecánico', quantity: 25, price: 79.99, minStock: 8 },
        { id: 4, name: 'Monitor 24"', quantity: 12, price: 199.99, minStock: 6 }
      ];
      setProducts(sampleData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!formData.name || !formData.quantity || !formData.price) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const productData = {
        name: formData.name,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        minStock: parseInt(formData.minStock) || 5
      };

      let response;
      if (editingProduct) {
        response = await fetch(`${API_BASE}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });
      } else {
        response = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData)
        });
      }

      if (response.ok) {
        await fetchProducts(); // Recargar la lista
        resetForm();
      } else {
        alert('Error al guardar el producto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({ name: '', quantity: '', price: '', minStock: '' });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  // Editar producto
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      quantity: product.quantity.toString(),
      price: product.price.toString(),
      minStock: product.minStock.toString()
    });
    setShowAddForm(true);
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/products/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchProducts(); // Recargar la lista
        } else {
          alert('Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
      } finally {
        setLoading(false);
      }
    }
  };

  // Ajustar cantidad
  const adjustQuantity = async (id, change) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newQuantity = Math.max(0, product.quantity + change);
    
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          quantity: newQuantity
        })
      });

      if (response.ok) {
        await fetchProducts(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Calcular estadísticas
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const lowStockProducts = products.filter(p => p.quantity <= p.minStock);

  const contextValue = {
    products,
    setProducts,
    loading,
    setLoading,
    searchTerm,
    setSearchTerm,
    showAddForm,
    setShowAddForm,
    editingProduct,
    setEditingProduct,
    formData,
    setFormData,
    filteredProducts,
    fetchProducts,
    handleSubmit,
    resetForm,
    handleEdit,
    handleDelete,
    adjustQuantity,
    totalProducts,
    totalValue,
    lowStockProducts
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
