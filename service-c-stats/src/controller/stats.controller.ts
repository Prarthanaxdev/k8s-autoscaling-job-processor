import { Request, Response } from 'express';
import { getStats } from '../services/stats.service.js';

export const statsHandler = async (req: Request, res: Response) => {
  try {
    const stats = await getStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
