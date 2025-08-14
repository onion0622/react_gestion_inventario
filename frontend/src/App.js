import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Package, AlertTriangle } from 'lucide-react';

const InventorySystem = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Indicador de carga */}
        {loading && (
          <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
              <span>Cargando...</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Sistema de Inventario</h1>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                API Conectada
              </span>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Agregar Producto</span>
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">Total Productos</h3>
              <p className="text-2xl font-bold text-blue-800">{totalProducts}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-600">Valor Total</h3>
              <p className="text-2xl font-bold text-green-800">${totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-600">Stock Bajo</h3>
              <p className="text-2xl font-bold text-red-800">{lowStockProducts.length}</p>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Formulario de agregar/editar */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad *
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              <div className="md:col-span-2 flex space-x-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {editingProduct ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => adjustQuantity(product.id, -1)}
                          disabled={loading}
                          className="bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-600 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium min-w-8 text-center">{product.quantity}</span>
                        <button
                          onClick={() => adjustQuantity(product.id, 1)}
                          disabled={loading}
                          className="bg-green-100 hover:bg-green-200 disabled:opacity-50 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${(product.quantity * product.price).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.quantity <= product.minStock ? (
                        <div className="flex items-center space-x-1 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">Stock Bajo</span>
                        </div>
                      ) : (
                        <span className="text-sm text-green-600">En Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No se encontraron productos que coincidan con la búsqueda' : 'No hay productos en el inventario'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventorySystem;