// app/inventory/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaBarcode,
  FaRobot,
  FaFileImport,
  FaFileExport,
  FaThLarge,
  FaList,
} from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Registrar elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Definición de la interfaz para un producto
interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  unitPrice: number;
  supplier: string;
  lastUpdated: string;
}

type ViewMode = "compact" | "detailed";

export default function InventoryPage() {
  // Datos iniciales de ejemplo para el inventario
  const initialProducts: Product[] = [
    {
      id: 1,
      name: "Harina",
      category: "Ingredientes",
      stock: 25,
      unitPrice: 2.5,
      supplier: "Proveedor A",
      lastUpdated: "2025-02-12",
    },
    {
      id: 2,
      name: "Aceite de Oliva",
      category: "Ingredientes",
      stock: 8,
      unitPrice: 10,
      supplier: "Proveedor B",
      lastUpdated: "2025-02-10",
    },
    {
      id: 3,
      name: "Tomate",
      category: "Verduras",
      stock: 15,
      unitPrice: 1.2,
      supplier: "Proveedor C",
      lastUpdated: "2025-02-11",
    },
    // Puedes agregar más productos...
  ];

  // Estados
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({
    category: "",
    supplier: "",
    stockMin: "",
    stockMax: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"product" | "barcode" | "chatbot">(
    "product"
  );
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Product | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("detailed");
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Función para agregar entradas al log de actividad
  const addLog = (message: string) => {
    setActivityLog((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };

  // Filtrado y búsqueda combinados
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = advancedFilters.category
      ? product.category.toLowerCase() === advancedFilters.category.toLowerCase()
      : true;
    const matchesSupplier = advancedFilters.supplier
      ? product.supplier.toLowerCase() === advancedFilters.supplier.toLowerCase()
      : true;
    const stockMin = advancedFilters.stockMin ? parseInt(advancedFilters.stockMin, 10) : -Infinity;
    const stockMax = advancedFilters.stockMax ? parseInt(advancedFilters.stockMax, 10) : Infinity;
    const matchesStock = product.stock >= stockMin && product.stock <= stockMax;
    return matchesSearch && matchesCategory && matchesSupplier && matchesStock;
  });

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortDirection === "asc" ? valA - valB : valB - valA;
    }
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Manejo del checkbox de selección individual
  const toggleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Manejo del checkbox de selección global
  const toggleSelectAll = () => {
    if (selectedProducts.length === sortedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(sortedProducts.map((p) => p.id));
    }
  };

  // Abrir modal: según tipo (producto, escaneo de código, chatbot)
  const openModal = (type: "product" | "barcode" | "chatbot", product: Product | null = null) => {
    setModalType(type);
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setModalOpen(false);
  };

  // Envío del formulario de agregar/editar producto
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : products.length + 1,
      name: (formData.get("name") as string).trim(),
      category: (formData.get("category") as string).trim(),
      stock: parseInt(formData.get("stock") as string, 10),
      unitPrice: parseFloat(formData.get("unitPrice") as string),
      supplier: (formData.get("supplier") as string).trim(),
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    if (editingProduct) {
      setProducts(products.map((prod) => (prod.id === editingProduct.id ? newProduct : prod)));
      addLog(`Producto "${newProduct.name}" actualizado.`);
    } else {
      setProducts([...products, newProduct]);
      addLog(`Producto "${newProduct.name}" agregado.`);
    }
    closeModal();
  };

  // Eliminar producto individual
  const deleteProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      setProducts(products.filter((product) => product.id !== id));
      addLog(`Producto "${product?.name}" eliminado.`);
    }
  };

  // Acciones en lote: eliminación
  const batchDelete = () => {
    if (selectedProducts.length === 0) return;
    if (confirm("¿Seguro que deseas eliminar los productos seleccionados?")) {
      const names = products.filter((p) => selectedProducts.includes(p.id)).map((p) => p.name);
      setProducts(products.filter((product) => !selectedProducts.includes(product.id)));
      addLog(`Productos eliminados: ${names.join(", ")}`);
      setSelectedProducts([]);
    }
  };

  // Funciones de Import/Export CSV (simulación)
  const exportCSV = () => {
    let csv = "id,name,category,stock,unitPrice,supplier,lastUpdated\n";
    products.forEach((p) => {
      csv += `${p.id},"${p.name}","${p.category}",${p.stock},${p.unitPrice},"${p.supplier}",${p.lastUpdated}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inventario.csv";
    link.click();
    addLog("Exportación de CSV completada.");
  };

  const importCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Aquí se puede parsear el CSV y actualizar el inventario
      addLog("Importación de CSV completada (simulación).");
    };
    reader.readAsText(file);
  };

  // Función para alternar la ordenación al hacer click en un encabezado
  const handleSort = (col: keyof Product) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  };

  // Cálculos para el dashboard resumido
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock < 10).length;
  const totalInventoryValue = products.reduce((acc, p) => acc + p.stock * p.unitPrice, 0);

  // Preparar datos para el gráfico: distribución de valor por categoría
  const categoryData: { [key: string]: number } = {};
  products.forEach((p) => {
    const value = p.stock * p.unitPrice;
    categoryData[p.category] = (categoryData[p.category] || 0) + value;
  });
  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Valor en Inventario",
        data: Object.values(categoryData),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Título */}
      <h1 className="text-3xl font-bold mb-4">Gestión de Inventario</h1>

      {/* Dashboard Resumido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow transform hover:scale-105 transition duration-300">
          <p className="text-sm text-gray-500">Total de Productos</p>
          <p className="text-2xl font-semibold">{totalProducts}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow transform hover:scale-105 transition duration-300">
          <p className="text-sm text-gray-500">Productos con Stock Crítico</p>
          <p className="text-2xl font-semibold text-red-600">{lowStockCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow transform hover:scale-105 transition duration-300">
          <p className="text-sm text-gray-500">Valor Total del Inventario</p>
          <p className="text-2xl font-semibold">
            ${totalInventoryValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Gráfico de Distribución de Valor por Categoría */}
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2">Distribución de Valor por Categoría</h2>
        <Pie data={chartData} options={chartOptions} />
      </div>

      {/* Notificaciones */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-red-100 dark:bg-red-900 rounded shadow">
          <p className="text-red-700 dark:text-red-300">
            Atención: Existen {lowStockCount} productos con stock bajo.
          </p>
        </div>
      )}

      {/* Controles y Filtros */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
          <button
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className="px-4 py-2 rounded border bg-gray-100 dark:bg-gray-700"
          >
            Filtros Avanzados
          </button>
          <button
            onClick={() => openModal("product")}
            className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            <FaPlus className="mr-2" /> Agregar Producto
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={batchDelete}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar Seleccionados
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white flex items-center"
          >
            <FaFileExport className="mr-2" /> Exportar CSV
          </button>
          <label className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center cursor-pointer">
            <FaFileImport className="mr-2" /> Importar CSV
            <input
              type="file"
              accept=".csv"
              onChange={importCSV}
              className="hidden"
            />
          </label>
          <button
            onClick={() => openModal("barcode")}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
          >
            <FaBarcode className="mr-2" /> Escanear Código
          </button>
          <button
            onClick={() => openModal("chatbot")}
            className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white flex items-center"
          >
            <FaRobot className="mr-2" /> Chatbot
          </button>
          <button
            onClick={() =>
              setViewMode(viewMode === "detailed" ? "compact" : "detailed")
            }
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white flex items-center"
          >
            {viewMode === "detailed" ? (
              <>
                <FaThLarge className="mr-2" /> Vista Compacta
              </>
            ) : (
              <>
                <FaList className="mr-2" /> Vista Detallada
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filtros Avanzados */}
      {showAdvancedFilter && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded shadow flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1">Categoría</label>
            <input
              type="text"
              value={advancedFilters.category}
              onChange={(e) =>
                setAdvancedFilters({ ...advancedFilters, category: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              placeholder="Ej. Ingredientes"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Proveedor</label>
            <input
              type="text"
              value={advancedFilters.supplier}
              onChange={(e) =>
                setAdvancedFilters({ ...advancedFilters, supplier: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              placeholder="Ej. Proveedor A"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Stock Mínimo</label>
            <input
              type="number"
              value={advancedFilters.stockMin}
              onChange={(e) =>
                setAdvancedFilters({ ...advancedFilters, stockMin: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Stock Máximo</label>
            <input
              type="number"
              value={advancedFilters.stockMax}
              onChange={(e) =>
                setAdvancedFilters({ ...advancedFilters, stockMax: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      )}

      {/* Tabla de Inventario */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="px-4 py-2 border">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === sortedProducts.length &&
                    sortedProducts.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="cursor-pointer"
                />
              </th>
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Nombre
              </th>
              {viewMode === "detailed" && (
                <>
                  <th
                    className="px-4 py-2 border cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    Categoría
                  </th>
                  <th
                    className="px-4 py-2 border cursor-pointer"
                    onClick={() => handleSort("unitPrice")}
                  >
                    Precio Unitario
                  </th>
                  <th
                    className="px-4 py-2 border cursor-pointer"
                    onClick={() => handleSort("supplier")}
                  >
                    Proveedor
                  </th>
                  <th
                    className="px-4 py-2 border cursor-pointer"
                    onClick={() => handleSort("lastUpdated")}
                  >
                    Última Actualización
                  </th>
                </>
              )}
              <th
                className="px-4 py-2 border cursor-pointer"
                onClick={() => handleSort("stock")}
              >
                Stock
              </th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr
                key={product.id}
                className={`text-center ${
                  product.stock < 10 ? "bg-red-100 dark:bg-red-900" : ""
                }`}
              >
                <td className="px-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleSelectProduct(product.id)}
                    className="cursor-pointer"
                  />
                </td>
                <td className="px-4 py-2 border">{product.name}</td>
                {viewMode === "detailed" && (
                  <>
                    <td className="px-4 py-2 border">{product.category}</td>
                    <td className="px-4 py-2 border">
                      ${product.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border">{product.supplier}</td>
                    <td className="px-4 py-2 border">{product.lastUpdated}</td>
                  </>
                )}
                <td className="px-4 py-2 border flex items-center justify-center gap-1">
                  {product.stock}
                  {product.stock < 10 && (
                    <FaExclamationTriangle
                      className="text-red-600"
                      title="Stock bajo"
                    />
                  )}
                </td>
                <td className="px-4 py-2 border flex justify-center gap-2">
                  <button
                    onClick={() => openModal("product", product)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {sortedProducts.length === 0 && (
              <tr>
                <td colSpan={viewMode === "detailed" ? 8 : 4} className="px-4 py-2 text-center">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Historial de Actividad */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded shadow max-h-40 overflow-y-auto">
        <h2 className="font-bold mb-2">Historial de Actividad</h2>
        {activityLog.length === 0 ? (
          <p className="text-sm text-gray-500">Sin actividad registrada.</p>
        ) : (
          <ul className="text-sm">
            {activityLog.map((log, idx) => (
              <li key={idx} className="border-b border-gray-200 dark:border-gray-700 py-1">
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal General */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-700 p-6 rounded shadow-lg w-full max-w-md relative transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            {modalType === "product" && (
              <>
                <h2 className="text-xl font-bold mb-4">
                  {editingProduct ? "Editar Producto" : "Agregar Producto"}
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingProduct?.name || ""}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Categoría</label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={editingProduct?.category || ""}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      defaultValue={editingProduct?.stock || 0}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Precio Unitario</label>
                    <input
                      type="number"
                      step="0.01"
                      name="unitPrice"
                      defaultValue={editingProduct?.unitPrice || ""}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Proveedor</label>
                    <input
                      type="text"
                      name="supplier"
                      defaultValue={editingProduct?.supplier || ""}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 rounded border"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700"
                    >
                      {editingProduct ? "Actualizar" : "Agregar"}
                    </button>
                  </div>
                </form>
              </>
            )}
            {modalType === "barcode" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Escanear Código de Barras</h2>
                <p className="text-sm">
                  (Simulación) Aquí se activaría la cámara o se recibiría el código escaneado.
                </p>
                <button
                  onClick={() => {
                    addLog("Escaneo de código de barras simulado.");
                    closeModal();
                  }}
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Simular Escaneo
                </button>
              </div>
            )}
            {modalType === "chatbot" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Chatbot</h2>
                <p className="text-sm">
                  (Simulación) Aquí se integraría un chatbot para consultas sobre el inventario.
                </p>
                <button
                  onClick={() => {
                    addLog("Chatbot simulado iniciado.");
                    closeModal();
                  }}
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                >
                  Iniciar Chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}