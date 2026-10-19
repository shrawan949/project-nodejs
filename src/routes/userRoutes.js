import express from 'express';
import {
  getUsers,
  updateUser,
  deleteUser,
  getAdminStats,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.route('/')
  .get(getUsers);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

export default router;
