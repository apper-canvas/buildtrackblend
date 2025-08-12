import React, { useEffect, useState } from "react";
import { equipmentService, materialService, subcontractorService } from "@/services/api/resourceService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const Resources = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [requestingMaterial, setRequestingMaterial] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [materials, setMaterials] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [subcontractors, setSubcontractors] = useState([]);

  // Form states
  const [materialForm, setMaterialForm] = useState({
    name: '', category: '', unit: '', quantityInStock: '', quantityNeeded: '',
    quantityOrdered: '', quantityDelivered: '', unitCost: '', supplier: '', 
    reorderLevel: '', status: 'In Stock', description: ''
  });
  const [requestForm, setRequestForm] = useState({
    quantity: '', notes: '', urgency: 'Normal'
  });
  const [equipmentForm, setEquipmentForm] = useState({
    name: '', type: '', serialNumber: '', status: 'Available', location: '',
    purchaseDate: '', purchaseCost: '', notes: ''
  });
  const [subcontractorForm, setSubcontractorForm] = useState({
    name: '', contactPerson: '', email: '', phone: '', address: '',
    specialties: [], rating: '', licenseNumber: '', insuranceExpiry: '',
    status: 'Active', notes: ''
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setMaterials(materialService.getAll());
      setEquipment(equipmentService.getAll());
      setSubcontractors(subcontractorService.getAll());
    } catch (err) {
      setError('Failed to load resources');
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'materials', label: 'Materials', icon: 'Package', count: materials.length },
    { id: 'equipment', label: 'Equipment', icon: 'Wrench', count: equipment.length },
    { id: 'subcontractors', label: 'Subcontractors', icon: 'Users', count: subcontractors.length }
  ];

  // Filter data based on search
  const filteredData = () => {
    const data = activeTab === 'materials' ? materials : 
                 activeTab === 'equipment' ? equipment : subcontractors;
    
    if (!searchTerm) return data;
    
    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      if (activeTab === 'materials') {
        return item.name.toLowerCase().includes(searchLower) ||
               item.category.toLowerCase().includes(searchLower) ||
               item.supplier.toLowerCase().includes(searchLower);
      } else if (activeTab === 'equipment') {
        return item.name.toLowerCase().includes(searchLower) ||
               item.type.toLowerCase().includes(searchLower) ||
               item.status.toLowerCase().includes(searchLower);
      } else {
        return item.name.toLowerCase().includes(searchLower) ||
               item.contactPerson.toLowerCase().includes(searchLower) ||
               item.specialties.some(s => s.toLowerCase().includes(searchLower));
      }
    });
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      if (activeTab === 'materials') {
        setMaterialForm({ ...item });
      } else if (activeTab === 'equipment') {
        setEquipmentForm({ 
          ...item,
          purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
          lastMaintenance: item.lastMaintenance ? item.lastMaintenance.split('T')[0] : '',
          nextMaintenance: item.nextMaintenance ? item.nextMaintenance.split('T')[0] : ''
        });
      } else {
        setSubcontractorForm({ 
          ...item,
          specialties: Array.isArray(item.specialties) ? item.specialties : [],
          insuranceExpiry: item.insuranceExpiry ? item.insuranceExpiry.split('T')[0] : ''
        });
      }
    } else {
      // Reset forms
setMaterialForm({
        name: '', category: '', unit: '', quantityInStock: '', quantityNeeded: '',
        quantityOrdered: '', quantityDelivered: '', unitCost: '', supplier: '', 
        reorderLevel: '', status: 'In Stock', description: ''
      });
      setEquipmentForm({
        name: '', type: '', serialNumber: '', status: 'Available', location: '',
        purchaseDate: '', purchaseCost: '', notes: ''
      });
      setSubcontractorForm({
        name: '', contactPerson: '', email: '', phone: '', address: '',
        specialties: [], rating: '', licenseNumber: '', insuranceExpiry: '',
        status: 'Active', notes: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'materials') {
const formData = {
          ...materialForm,
          quantityInStock: parseInt(materialForm.quantityInStock) || 0,
          quantityNeeded: parseInt(materialForm.quantityNeeded) || 0,
          quantityOrdered: parseInt(materialForm.quantityOrdered) || 0,
          quantityDelivered: parseInt(materialForm.quantityDelivered) || 0,
          unitCost: parseFloat(materialForm.unitCost) || 0,
          reorderLevel: parseInt(materialForm.reorderLevel) || 0,
          lastOrdered: editingItem ? editingItem.lastOrdered : new Date().toISOString()
        };
        
        if (editingItem) {
          materialService.update(editingItem.Id, formData);
        } else {
          materialService.create(formData);
        }
        setMaterials(materialService.getAll());
      } else if (activeTab === 'equipment') {
        const formData = {
          ...equipmentForm,
          purchaseCost: parseFloat(equipmentForm.purchaseCost) || 0,
          hoursUsed: editingItem ? editingItem.hoursUsed : 0,
          purchaseDate: equipmentForm.purchaseDate ? new Date(equipmentForm.purchaseDate).toISOString() : null,
          lastMaintenance: equipmentForm.lastMaintenance ? new Date(equipmentForm.lastMaintenance).toISOString() : null,
          nextMaintenance: equipmentForm.nextMaintenance ? new Date(equipmentForm.nextMaintenance).toISOString() : null
        };
        
        if (editingItem) {
          equipmentService.update(editingItem.Id, formData);
        } else {
          equipmentService.create(formData);
        }
        setEquipment(equipmentService.getAll());
      } else {
        const formData = {
          ...subcontractorForm,
          rating: parseFloat(subcontractorForm.rating) || 0,
          projectsCompleted: editingItem ? editingItem.projectsCompleted : 0,
          insuranceExpiry: subcontractorForm.insuranceExpiry ? new Date(subcontractorForm.insuranceExpiry).toISOString() : null
        };
        
        if (editingItem) {
          subcontractorService.update(editingItem.Id, formData);
        } else {
          subcontractorService.create(formData);
        }
        setSubcontractors(subcontractorService.getAll());
      }
      
      setShowModal(false);
      setEditingItem(null);
    } catch (err) {
      toast.error('Failed to save resource');
    }
  };

  const handleDelete = (item) => {
    setDeleteConfirm(item);
  };

const confirmDelete = () => {
    try {
      if (activeTab === 'materials') {
        materialService.delete(deleteConfirm.Id);
        setMaterials(materialService.getAll());
      } else if (activeTab === 'equipment') {
        equipmentService.delete(deleteConfirm.Id);
        setEquipment(equipmentService.getAll());
      } else {
        subcontractorService.delete(deleteConfirm.Id);
        setSubcontractors(subcontractorService.getAll());
      }
    } catch (err) {
      toast.error('Failed to delete resource');
    } finally {
      setDeleteConfirm(null);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-construction"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-600">{error}</p>
        <Button onClick={loadData} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">Resources</h1>
          <p className="text-slate-600 mt-1">Manage materials, equipment, and subcontractors</p>
        </div>
        <Button onClick={() => openModal()} className="bg-construction hover:bg-construction/90">
          <ApperIcon name="Plus" size={16} />
          Add {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-construction border-b-2 border-construction bg-construction/5'
                  : 'text-slate-600 hover:text-midnight hover:bg-slate-50'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              <Badge variant="secondary" size="sm">{tab.count}</Badge>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
<div className="p-6">
          {activeTab === 'materials' && <MaterialsTab data={filteredData()} onEdit={openModal} onDelete={handleDelete} onRequest={openRequestModal} />}
          {activeTab === 'equipment' && <EquipmentTab data={filteredData()} onEdit={openModal} onDelete={handleDelete} />}
          {activeTab === 'subcontractors' && <SubcontractorsTab data={filteredData()} onEdit={openModal} onDelete={handleDelete} />}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-midnight">
                  {editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'materials' && <MaterialForm form={materialForm} setForm={setMaterialForm} />}
                {activeTab === 'equipment' && <EquipmentForm form={equipmentForm} setForm={setEquipmentForm} />}
                {activeTab === 'subcontractors' && <SubcontractorForm form={subcontractorForm} setForm={setSubcontractorForm} />}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-construction hover:bg-construction/90">
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-midnight">Confirm Deletion</h3>
                  <p className="text-sm text-slate-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-slate-700 mb-6">
                Are you sure you want to delete "{deleteConfirm.name}"?
              </p>
              
              <div className="flex justify-end space-x-3">
                <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
</div>
          </div>
        </div>
      )}

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

// Materials Tab Component
const MaterialsTab = ({ data, onEdit, onDelete, onRequest }) => {
  const getLowStockCount = () => {
    return data.filter(material => 
      material.quantityInStock <= material.reorderLevel
    ).length;
  };

  const getCriticalStockCount = () => {
    return data.filter(material => 
      material.status === 'Critical' || material.quantityInStock <= material.reorderLevel * 0.5
    ).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Critical': return 'destructive';
      case 'Ordered': return 'secondary';
      default: return 'secondary';
    }
  };
if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Package" size={48} className="mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600">No materials found</p>
      </div>
    );
  }

  const lowStockCount = getLowStockCount();
  const criticalStockCount = getCriticalStockCount();

return (
    <div className="space-y-4">
      {/* Alert Summary */}
      {(lowStockCount > 0 || criticalStockCount > 0) && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="AlertTriangle" size={20} className="text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-800">Stock Alerts</h3>
              <p className="text-sm text-orange-700">
                {criticalStockCount > 0 && `${criticalStockCount} critical stock item${criticalStockCount > 1 ? 's' : ''}`}
                {criticalStockCount > 0 && lowStockCount > criticalStockCount && ', '}
                {lowStockCount > criticalStockCount && `${lowStockCount - criticalStockCount} low stock item${lowStockCount - criticalStockCount > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Material</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Qty Needed</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Qty Ordered</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Qty Delivered</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Stock Status</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Supplier</th>
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
                        <div className="text-xs text-slate-400">${material.unitCost.toFixed(2)}/{material.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{material.quantityNeeded || 0} {material.unit}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{material.quantityOrdered || 0} {material.unit}</div>
                      {material.expectedDelivery && (
                        <div className="text-xs text-slate-500">
                          Expected: {new Date(material.expectedDelivery).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{material.quantityDelivered || 0} {material.unit}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-2">
                      <Badge variant={getStatusColor(material.status)} size="sm">{material.status}</Badge>
                      <div className="text-sm">
                        <div className="font-medium">{material.quantityInStock} {material.unit} in stock</div>
                        <div className="text-xs text-slate-500">
                          Reorder at: {material.reorderLevel} {material.unit}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-slate-700">{material.supplier}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {isLowStock && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onRequest(material)}
                          className="text-construction border-construction hover:bg-construction/10"
                        >
                          <ApperIcon name="ShoppingCart" size={14} />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => onEdit(material)}>
                        <ApperIcon name="Edit2" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(material)}>
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Equipment Tab Component
const EquipmentTab = ({ data, onEdit, onDelete }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Wrench" size={48} className="mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600">No equipment found</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'In Use': return 'warning';
      case 'Maintenance': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Equipment</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Location</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Maintenance</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.Id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-4 px-4">
                <div>
                  <div className="font-medium text-midnight">{item.name}</div>
                  <div className="text-sm text-slate-500">{item.serialNumber}</div>
                </div>
              </td>
              <td className="py-4 px-4">
                <Badge variant="secondary">{item.type}</Badge>
              </td>
              <td className="py-4 px-4">
                <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm text-slate-700">{item.location}</div>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm">
                  <div className="text-slate-700">
                    Next: {item.nextMaintenance ? new Date(item.nextMaintenance).toLocaleDateString() : 'Not scheduled'}
                  </div>
                  <div className="text-slate-500">{item.hoursUsed}h used</div>
                </div>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                    <ApperIcon name="Edit2" size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Subcontractors Tab Component
const SubcontractorsTab = ({ data, onEdit, onDelete }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Users" size={48} className="mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600">No subcontractors found</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Pending': return 'warning';
      case 'Inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Company</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Contact</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Specialties</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Rating</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((contractor) => (
            <tr key={contractor.Id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-4 px-4">
                <div>
                  <div className="font-medium text-midnight">{contractor.name}</div>
                  <div className="text-sm text-slate-500">{contractor.projectsCompleted} projects</div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="text-sm">
                  <div className="font-medium">{contractor.contactPerson}</div>
                  <div className="text-slate-500">{contractor.phone}</div>
                  <div className="text-slate-500">{contractor.email}</div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-1">
                  {contractor.specialties.slice(0, 2).map((specialty, index) => (
                    <Badge key={index} variant="secondary" size="sm">{specialty}</Badge>
                  ))}
                  {contractor.specialties.length > 2 && (
                    <Badge variant="secondary" size="sm">+{contractor.specialties.length - 2}</Badge>
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Star" size={14} className="text-yellow-500" />
                  <span className="font-medium">{contractor.rating}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <Badge variant={getStatusColor(contractor.status)}>{contractor.status}</Badge>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(contractor)}>
                    <ApperIcon name="Edit2" size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(contractor)}>
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Form Components
const MaterialForm = ({ form, setForm }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="name">Material Name *</Label>
      <Input
        id="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
    </div>
    <div>
      <Label htmlFor="category">Category *</Label>
      <Select
        id="category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        required
      >
        <option value="">Select category</option>
        <option value="Concrete">Concrete</option>
        <option value="Steel">Steel</option>
        <option value="Lumber">Lumber</option>
        <option value="Electrical">Electrical</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Finishing">Finishing</option>
        <option value="Other">Other</option>
      </Select>
    </div>
    <div>
      <Label htmlFor="unit">Unit *</Label>
      <Select
        id="unit"
        value={form.unit}
        onChange={(e) => setForm({ ...form, unit: e.target.value })}
        required
      >
        <option value="">Select unit</option>
        <option value="piece">Piece</option>
        <option value="bag">Bag</option>
        <option value="ft">Feet</option>
        <option value="sheet">Sheet</option>
        <option value="yard">Yard</option>
        <option value="ton">Ton</option>
        <option value="gallon">Gallon</option>
      </Select>
    </div>
    <div>
      <Label htmlFor="quantityInStock">Quantity in Stock</Label>
      <Input
        id="quantityInStock"
        type="number"
        value={form.quantityInStock}
        onChange={(e) => setForm({ ...form, quantityInStock: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="quantityNeeded">Quantity Needed</Label>
      <Input
        id="quantityNeeded"
        type="number"
        value={form.quantityNeeded}
        onChange={(e) => setForm({ ...form, quantityNeeded: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="quantityOrdered">Quantity Ordered</Label>
      <Input
        id="quantityOrdered"
        type="number"
        value={form.quantityOrdered}
        onChange={(e) => setForm({ ...form, quantityOrdered: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="quantityDelivered">Quantity Delivered</Label>
      <Input
        id="quantityDelivered"
        type="number"
        value={form.quantityDelivered}
        onChange={(e) => setForm({ ...form, quantityDelivered: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="unitCost">Unit Cost</Label>
      <Input
        id="unitCost"
        type="number"
        step="0.01"
        value={form.unitCost}
        onChange={(e) => setForm({ ...form, unitCost: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="reorderLevel">Reorder Level</Label>
      <Input
        id="reorderLevel"
        type="number"
        value={form.reorderLevel}
        onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="status">Status</Label>
      <Select
        id="status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="In Stock">In Stock</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Critical">Critical</option>
        <option value="Ordered">Ordered</option>
      </Select>
    </div>
    <div>
      <Label htmlFor="supplier">Supplier *</Label>
      <Input
        id="supplier"
        value={form.supplier}
        onChange={(e) => setForm({ ...form, supplier: e.target.value })}
        required
      />
    </div>
    <div className="md:col-span-2">
      <Label htmlFor="description">Description</Label>
      <Input
        id="description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
    </div>
  </div>
);

const EquipmentForm = ({ form, setForm }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="name">Equipment Name *</Label>
      <Input
        id="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
    </div>
    <div>
      <Label htmlFor="type">Type *</Label>
      <Select
        id="type"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        required
      >
        <option value="">Select type</option>
        <option value="Heavy Machinery">Heavy Machinery</option>
        <option value="Concrete Equipment">Concrete Equipment</option>
        <option value="Material Handling">Material Handling</option>
        <option value="Power Tools">Power Tools</option>
        <option value="Safety Equipment">Safety Equipment</option>
        <option value="Other">Other</option>
      </Select>
    </div>
    <div>
      <Label htmlFor="serialNumber">Serial Number</Label>
      <Input
        id="serialNumber"
        value={form.serialNumber}
        onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="status">Status</Label>
      <Select
        id="status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="Available">Available</option>
        <option value="In Use">In Use</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Out of Service">Out of Service</option>
      </Select>
    </div>
    <div>
      <Label htmlFor="location">Location</Label>
      <Input
        id="location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="purchaseDate">Purchase Date</Label>
      <Input
        id="purchaseDate"
        type="date"
        value={form.purchaseDate}
        onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
      />
    </div>
    <div>
      <Label htmlFor="purchaseCost">Purchase Cost</Label>
      <Input
        id="purchaseCost"
        type="number"
        step="0.01"
        value={form.purchaseCost}
        onChange={(e) => setForm({ ...form, purchaseCost: e.target.value })}
      />
    </div>
    <div className="md:col-span-2">
      <Label htmlFor="notes">Notes</Label>
      <Input
        id="notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
    </div>
  </div>
);

const SubcontractorForm = ({ form, setForm }) => {
  const handleSpecialtyChange = (specialty) => {
    const currentSpecialties = form.specialties || [];
    const updatedSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter(s => s !== specialty)
      : [...currentSpecialties, specialty];
    setForm({ ...form, specialties: updatedSpecialties });
  };

  const availableSpecialties = ['Electrical', 'Plumbing', 'HVAC', 'Concrete', 'Steel', 'Roofing', 'Flooring', 'Painting', 'Landscaping'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Company Name *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="contactPerson">Contact Person *</Label>
        <Input
          id="contactPerson"
          value={form.contactPerson}
          onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>
      <div className="md:col-span-2">
        <Label>Specialties</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableSpecialties.map((specialty) => (
            <button
              key={specialty}
              type="button"
              onClick={() => handleSpecialtyChange(specialty)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                (form.specialties || []).includes(specialty)
                  ? 'bg-construction text-white border-construction'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-construction'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="rating">Rating</Label>
        <Input
          id="rating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="licenseNumber">License Number</Label>
        <Input
          id="licenseNumber"
          value={form.licenseNumber}
          onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
        <Input
          id="insuranceExpiry"
          type="date"
          value={form.insuranceExpiry}
          onChange={(e) => setForm({ ...form, insuranceExpiry: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          id="status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>
    </div>
  );
};

export default Resources;