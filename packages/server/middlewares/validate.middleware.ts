import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';

export const validate =
  (schema: AnyZodObject, location: 'body' | 'params' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[location]);
    if (!result.success) return res.status(400).json({ error: result.error.errors });
    req[location] = result.data;
    next();
  };
