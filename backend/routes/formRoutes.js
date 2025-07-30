import express from 'express';
import { createForm, listForms, getForm, submitResponse, viewResponses } from '../controllers/formController.js';
import auth from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/', auth, createForm);
router.get('/', auth, listForms);
router.get('/:id/responses', auth, viewResponses);

router.get('/:id', getForm);
router.post('/:id/response', submitResponse);

export default router;

