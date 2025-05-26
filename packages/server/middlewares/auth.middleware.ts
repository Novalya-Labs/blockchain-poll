import { NextFunction, Request, Response } from 'express';

export function authAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET') {
    if (!req.query?.role) return res.status(403).json({ message: 'Role is required' });
    if (req.query.role !== 'admin') return res.status(403).json({ message: 'Admin role is required' });
    next();
    return;
  }

  if (req.method === 'POST') {
    if (!req.body?.role) return res.status(403).json({ message: 'Role is required' });
    if (req.body.role !== 'admin') return res.status(403).json({ message: 'Admin role is required' });
    next();
    return;
  }
}

export function authCivil(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET') {
    if (!req.query?.role) return res.status(403).json({ message: 'Role is required' });
    if (req.query.role !== 'civil') return res.status(403).json({ message: 'Civil role is required' });
    next();
    return;
  }

  if (req.method === 'POST') {
    if (!req.body?.role) return res.status(403).json({ message: 'Role is required' });
    if (req.body.role !== 'civil') return res.status(403).json({ message: 'Civil role is required' });
    next();
    return;
  }
}
