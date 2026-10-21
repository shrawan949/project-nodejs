import express from 'express';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/addressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getAddresses).post(createAddress);
router.route('/:id').put(updateAddress).delete(deleteAddress);

export default router;
