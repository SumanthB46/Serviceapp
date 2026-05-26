import express from 'express';
import { submitContactForm } from '../../controllers/user/contactController';

const router = express.Router();

router.post('/', submitContactForm);

export default router;
