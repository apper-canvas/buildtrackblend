import resourceData from '@/services/mockData/resources.json';
import { toast } from 'react-toastify';

// Deep copy helper
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

// In-memory storage
let materials = deepCopy(resourceData.materials);
let equipment = deepCopy(resourceData.equipment);
let subcontractors = deepCopy(resourceData.subcontractors);

// Helper to get next ID
const getNextId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.Id)) + 1 : 1;
};

// Materials Service
export const materialService = {
  getAll: () => {
    return deepCopy(materials);
  },

  getById: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('Material ID must be a number');
    }
    const material = materials.find(m => m.Id === numId);
    return material ? deepCopy(material) : null;
  },

  create: (materialData) => {
    const newMaterial = {
      ...materialData,
      Id: getNextId(materials)
    };
    materials.push(newMaterial);
    toast.success(`Material "${newMaterial.name}" created successfully`);
    return deepCopy(newMaterial);
  },

  update: (id, materialData) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('Material ID must be a number');
    }
    
    const index = materials.findIndex(m => m.Id === numId);
    if (index === -1) {
      throw new Error('Material not found');
    }

    materials[index] = { ...materials[index], ...materialData, Id: numId };
    toast.success(`Material "${materials[index].name}" updated successfully`);
    return deepCopy(materials[index]);
  },

  delete: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('Material ID must be a number');
    }
    
    const index = materials.findIndex(m => m.Id === numId);
    if (index === -1) {
      throw new Error('Material not found');
    }

    const material = materials[index];
    materials.splice(index, 1);
    toast.success(`Material "${material.name}" deleted successfully`);
    return true;
  }
};

// Equipment Service
export const equipmentService = {
  getAll: () => {
    return deepCopy(equipment);
  },

  getById: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('Equipment ID must be a number');
    }
    const item = equipment.find(e => e.Id === numId);
    return item ? deepCopy(item) : null;
  },

  create: (equipmentData) => {
    const newEquipment = {
      ...equipmentData,
      Id: getNextId(equipment)
    };
    equipment.push(newEquipment);
    toast.success(`Equipment "${newEquipment.name}" created successfully`);
    return deepCopy(newEquipment);
  },

  update: (id, equipmentData) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('Equipment ID must be a number');
    }
    
    const index = equipment.findIndex(e => e.Id === numId);
    if (index === -1) {
      throw new Error('Equipment not found');
    }

    equipment[index] = { ...equipment[index], ...equipmentData, Id: numId };
    toast.success(`Equipment "${equipment[index].name}" updated successfully`);
    return deepCopy(equipment[index]);
  },

  delete: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('Equipment ID must be a number');
    }
    
    const index = equipment.findIndex(e => e.Id === numId);
    if (index === -1) {
      throw new Error('Equipment not found');
    }

    const item = equipment[index];
    equipment.splice(index, 1);
    toast.success(`Equipment "${item.name}" deleted successfully`);
    return true;
  }
};

// Subcontractors Service
export const subcontractorService = {
  getAll: () => {
    return deepCopy(subcontractors);
  },

  getById: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('Subcontractor ID must be a number');
    }
    const subcontractor = subcontractors.find(s => s.Id === numId);
    return subcontractor ? deepCopy(subcontractor) : null;
  },

  create: (subcontractorData) => {
    const newSubcontractor = {
      ...subcontractorData,
      Id: getNextId(subcontractors)
    };
    subcontractors.push(newSubcontractor);
    toast.success(`Subcontractor "${newSubcontractor.name}" created successfully`);
    return deepCopy(newSubcontractor);
  },

  update: (id, subcontractorData) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('Subcontractor ID must be a number');
    }
    
    const index = subcontractors.findIndex(s => s.Id === numId);
    if (index === -1) {
      throw new Error('Subcontractor not found');
    }

    subcontractors[index] = { ...subcontractors[index], ...subcontractorData, Id: numId };
    toast.success(`Subcontractor "${subcontractors[index].name}" updated successfully`);
    return deepCopy(subcontractors[index]);
  },

  delete: (id) => {
    const numId = parseInt(id);
    if (isNaN(numId)) {
      throw new Error('Subcontractor ID must be a number');
    }
    
    const index = subcontractors.findIndex(s => s.Id === numId);
    if (index === -1) {
      throw new Error('Subcontractor not found');
    }

    const subcontractor = subcontractors[index];
    subcontractors.splice(index, 1);
    toast.success(`Subcontractor "${subcontractor.name}" deleted successfully`);
    return true;
  }
};