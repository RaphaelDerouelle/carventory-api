import { Router } from 'express';
import {
  createVehicule,
  getAllVehicules,
  getVehiculeById,
  updateVehicule,
  deleteVehicule
} from '@/controllers/vehicule';

const VehiculeRouter = Router();

// Create a new vehicule
VehiculeRouter.post('/vehicules', createVehicule);

// Get all vehicules for a specific company
VehiculeRouter.get('/companies/:companyId/vehicules', getAllVehicules);

// Get a specific vehicule by ID
VehiculeRouter.get('/vehicules/:id', getVehiculeById);

// Update a vehicule by ID
VehiculeRouter.put('/vehicules/:id', updateVehicule);

// Delete a vehicule by ID
VehiculeRouter.delete('/vehicules/:id', deleteVehicule);

export default VehiculeRouter;
