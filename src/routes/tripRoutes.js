import express from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all trip routes so only logged-in users can access them
router.use(protect);

router.route('/')
  .get(getTrips)     // GET  /api/trips
  .post(createTrip);  // POST /api/trips

router.route('/:id')
  .get(getTripById)   // GET    /api/trips/:id
  .put(updateTrip)    // PUT    /api/trips/:id
  .delete(deleteTrip);// DELETE /api/trips/:id

export default router;