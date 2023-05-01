import { Request, Response, NextFunction } from 'express';

import { RepositoryError } from 'src/libs/typeorm/error';
export const handleDbError = () => (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (RepositoryError.isDbError(err)) {
        throw RepositoryError.dbToDomainError(err);
    } else {
        next(err);
    }
};
