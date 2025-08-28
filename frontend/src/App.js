import React, { useState } from 'react';
import { ProductsProvider } from './ProductsContext';
import InventorySystem from './InventorySystem';
import ContactForm from './ContactForm';
import ContactMessages from './ContactMessages';

const App = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Sistema de Gestión</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'inventory'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Inventario
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'contact'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Contáctanos
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'messages'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mensajes
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'inventory' && (
          <ProductsProvider>
            <InventorySystem />
          </ProductsProvider>
        )}
        {activeTab === 'contact' && <ContactForm />}
        {activeTab === 'messages' && <ContactMessages />}
      </div>
    </div>
  );
};

export default App;
