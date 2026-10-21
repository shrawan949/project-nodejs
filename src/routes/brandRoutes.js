import express from 'express';
import { getBrands, getBrandBySlug, createBrand, updateBrand, deleteBrand } from '../controllers/brandController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBrands);
router.get('/:slug', getBrandBySlug);

router.use(protect, authorize('admin'));
router.post('/', createBrand);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

export default router;
