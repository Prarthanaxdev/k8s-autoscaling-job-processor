import { Router } from 'express';
import { submitJob, getJobStatus } from './controller';

const router = Router();

/**
 * @swagger
 * /submit:
 *   post:
 *     summary: Submit a new job
 *     tags:
 *       - Jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: integer
 *                 description: Job type (0=primes, 1=bcrypt, 2=sort)
 *                 example: 0
 *               payload:
 *                 type: object
 *                 description: Job payload
 *                 example: { "data": "test" }
 *     responses:
 *       200:
 *         description: Job submitted successfully
 *       401:
 *         description: Unauthorized: Invalid API key
 */
router.post('/submit', submitJob);

/**
 * @swagger
 * /status/{id}:
 *   get:
 *     summary: Get job status by ID
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job status and result
 *       404:
 *         description: Job not found
 */
router.get('/status/:id', getJobStatus);

export default router;
