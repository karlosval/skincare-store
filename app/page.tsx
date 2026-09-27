'use client';

import { useEffect, useState } from 'react';

interface Product {
  pid: string;
  productNameEn: string;
  productImage: string;
  sellPrice: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        
        // Extrae la lista de productos de forma segura
        const list = json.data?.data?.list || json.data?.list || [];
        setProducts(list);
      } catch (err) {
        console.error('Error cargando productos:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <header className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Lumina Skincare
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Dispositivos y herramientas avanzadas para el cuidado facial
        </p>
      </header>

      <section className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No se encontraron productos disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.pid} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col justify-between"
              >
                <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
                  <img 
                    src={product.productImage} 
                    alt={product.productNameEn}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h2 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">
                    {product.productNameEn || 'Dispositivo de Belleza'}
                  </h2>
                  
                  <div className="mt-auto">
                    <p className="text-xs text-gray-400 mb-1">Precio sugerido</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-rose-600">
                        ${(parseFloat(product.sellPrice || '0') * 2.5).toFixed(2)} USD
                      </span>
                      <button className="bg-rose-500 text-white text-xs px-3 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors">
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}