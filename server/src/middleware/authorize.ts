import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access forbidden: insufficient permissions' 
      });
    }

    next();
  };
};

export const requireAdmin = authorize([UserRole.ADMIN]);
export const requireAdminOrCandidate = authorize([UserRole.ADMIN, UserRole.CANDIDATE]);
export const requireAnyRole = authorize([UserRole.ADMIN, UserRole.CANDIDATE, UserRole.CUSTOMER]);