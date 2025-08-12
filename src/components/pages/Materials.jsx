import React, { useState, useEffect } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import { materialService } from '@/services/api/resourceService';
import { toast } from 'react-toastify';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestingMaterial, setRequestingMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  const [requestForm, setRequestForm] = useState({
    quantity: '',
    notes: '',
    urgency: 'Normal'
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setMaterials(materialService.getAll());
    } catch (err) {
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedMaterials = () => {
    let filtered = materials.filter(material => {
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
                           filterStatus === 'low' && material.quantityInStock <= material.reorderLevel ||
                           filterStatus === 'critical' && (material.status === 'Critical' || material.quantityInStock <= material.reorderLevel * 0.5) ||
                           filterStatus === 'ordered' && material.status === 'Ordered';
      
      return matchesSearch && matchesStatus;
    });

    // Sort materials
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'stock':
          aVal = a.quantityInStock;
          bVal = b.quantityInStock;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'supplier':
          aVal = a.supplier.toLowerCase();
          bVal = b.supplier.toLowerCase();
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const openRequestModal = (material) => {
    setRequestingMaterial(material);
    setRequestForm({ quantity: '', notes: '', urgency: 'Normal' });
    setShowRequestModal(true);
  };

  const handleMaterialRequest = (e) => {
    e.preventDefault();
    try {
      const quantity = parseInt(requestForm.quantity);
      if (quantity <= 0) {
        toast.error('Quantity must be greater than 0');
        return;
      }
      
      materialService.requestMaterial(requestingMaterial.Id, quantity, requestForm.notes);
      setMaterials(materialService.getAll());
      setShowRequestModal(false);
      setRequestingMaterial(null);
    } catch (err) {
      toast.error('Failed to submit material request');
    }
  };

  const getStatusStats = () => {
    const total = materials.length;
    const lowStock = materials.filter(m => m.quantityInStock <= m.reorderLevel).length;
    const critical = materials.filter(m => m.status === 'Critical' || m.quantityInStock <= m.reorderLevel * 0.5).length;
    const ordered = materials.filter(m => m.status === 'Ordered').length;
    
    return { total, lowStock, critical, ordered };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-construction"></div>
      </div>
    );
  }

  const stats = getStatusStats();
  const data = filteredAndSortedMaterials();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">Material Inventory</h1>
          <p className="text-slate-600 mt-1">Track inventory levels, orders, and deliveries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Materials</p>
              <p className="text-2xl font-bold text-midnight">{stats.total}</p>
            </div>
            <ApperIcon name="Package" size={24} className="text-sky" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
            </div>
            <ApperIcon name="AlertTriangle" size={24} className="text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Critical Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
            </div>
            <ApperIcon name="AlertCircle" size={24} className="text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Ordered</p>
              <p className="text-2xl font-bold text-construction">{stats.ordered}</p>
            </div>
            <ApperIcon name="ShoppingCart" size={24} className="text-construction" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Search Materials</Label>
            <div className="relative">
              <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                id="search"
                type="text"
                placeholder="Search by name, category, supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="filter">Filter by Status</Label>
            <Select
              id="filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Materials</option>
              <option value="low">Low Stock</option>
              <option value="critical">Critical Stock</option>
              <option value="ordered">Recently Ordered</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="sortBy">Sort by</Label>
            <Select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Material Name</option>
              <option value="stock">Stock Level</option>
              <option value="status">Status</option>
              <option value="supplier">Supplier</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="sortOrder">Order</Label>
            <Select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100">
        <div className="p-6">
          <MaterialsInventoryTable 
            data={data} 
            onRequest={openRequestModal}
            onRefresh={loadMaterials}
          />
        </div>
      </div>

      {/* Material Request Modal */}
      {showRequestModal && requestingMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-midnight">
                  Request Material
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRequestModal(false)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <div className="font-medium text-midnight">{requestingMaterial.name}</div>
                <div className="text-sm text-slate-600">
                  Current Stock: {requestingMaterial.quantityInStock} {requestingMaterial.unit}
                </div>
                <div className="text-sm text-slate-600">
                  Reorder Level: {requestingMaterial.reorderLevel} {requestingMaterial.unit}
                </div>
              </div>
              
              <form onSubmit={handleMaterialRequest} className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity to Order *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={requestForm.quantity}
                    onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })}
                    required
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    Unit: {requestingMaterial.unit}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select
                    id="urgency"
                    value={requestForm.urgency}
                    onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={requestForm.notes}
                    onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                    placeholder="Additional requirements or notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setShowRequestModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-construction hover:bg-construction/90">
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Materials Inventory Table Component
const MaterialsInventoryTable = ({ data, onRequest, onRefresh }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Package" size={48} className="mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600">No materials found matching your criteria</p>
        <Button onClick={onRefresh} className="mt-4">
          Refresh
        </Button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Critical': return 'destructive';
      case 'Ordered': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Item Name</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Quantity Needed</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Quantity Ordered</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Quantity Delivered</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Supplier</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((material) => {
            const isLowStock = material.quantityInStock <= material.reorderLevel;
            const isCritical = material.status === 'Critical' || material.quantityInStock <= material.reorderLevel * 0.5;
            
            return (
              <tr key={material.Id} className={`border-b border-slate-100 hover:bg-slate-50 ${isCritical ? 'bg-red-25' : isLowStock ? 'bg-orange-25' : ''}`}>
                <td className="py-4 px-4">
                  <div className="flex items-start space-x-3">
                    {isCritical && <ApperIcon name="AlertCircle" size={16} className="text-red-500 mt-0.5" />}
                    {isLowStock && !isCritical && <ApperIcon name="AlertTriangle" size={16} className="text-orange-500 mt-0.5" />}
                    <div className="flex-1">
                      <div className="font-medium text-midnight">{material.name}</div>
                      <div className="text-sm text-slate-500">{material.category}</div>
                      <div className="text-xs text-slate-400">
                        {material.quantityInStock} {material.unit} in stock • ${material.unitCost.toFixed(2)}/{material.unit}
                      </div>
                      {isLowStock && (
                        <div className="text-xs text-orange-600 font-medium">
                          Reorder Point: {material.reorderLevel} {material.unit}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium">{material.quantityNeeded || 0} {material.unit}</div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium">{material.quantityOrdered || 0} {material.unit}</div>
                    {material.expectedDelivery && (
                      <div className="text-xs text-slate-500">
                        Expected: {new Date(material.expectedDelivery).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium">{material.quantityDelivered || 0} {material.unit}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-slate-700">{material.supplier}</div>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={getStatusColor(material.status)} size="sm">
                    {material.status}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-right">
                  {(isLowStock || isCritical) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onRequest(material)}
                      className="text-construction border-construction hover:bg-construction/10"
                    >
                      <ApperIcon name="ShoppingCart" size={14} />
                      <span className="ml-1">Order</span>
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Materials;