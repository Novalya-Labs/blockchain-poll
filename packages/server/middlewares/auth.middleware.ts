import { NextFunction, Request, Response } from 'express';

export function authAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.body.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}

export function authCivil(req: Request, res: Response, next: NextFunction) {
  if (req.body.role !== 'civil') return res.status(403).json({ message: 'Forbidden' });
  next();
}
