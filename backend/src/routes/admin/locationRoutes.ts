import express from 'express';
import { 
  getLocations, 
  getLocationById, 
  createLocation, 
  updateLocation, 
  deleteLocation 
} from '../../controllers/admin/locationController';
import { protect, admin } from '../../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getLocations)
  // To restrict creation to admin, uncomment "protect, admin" once middlewares are imported correctly
  .post(protect, admin, createLocation);

router.route('/:id')
  .get(getLocationById)
  .put(protect, admin, updateLocation)
  .delete(protect, admin, deleteLocation);

export default router;



