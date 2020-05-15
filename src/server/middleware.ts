import { Request, Response } from 'express';
import { QTIP_AUTH_TOKEN } from './constants';

export const authenticateUser = (
    req: Request,
    res: Response,
    next: () => void
) => {
    if (req.header('X-AUTH-TOKEN') === QTIP_AUTH_TOKEN) {
        next();
        return;
    }

    res.sendStatus(403);
};

export const authenticateUserPromise = (req: Request, res: Response) =>
    new Promise((resolve) => authenticateUser(req, res, () => resolve(true)));
