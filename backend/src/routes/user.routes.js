import express from 'express';
import {getAllUsers, getUserById, updateUserStatus} from '../controllers/user.controller.js';


const router = express.Router();

// Example route handlers
// GET /api/v1/users
router.get('/', getAllUsers);

// GET /api/v1/users/:id
router.get('/:id',getUserById);

// PUT /api/v1/users/:id/status
router.put('/:id', updateUserStatus);
export default router;