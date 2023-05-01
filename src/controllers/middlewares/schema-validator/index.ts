import { object, ObjectShape } from 'yup';
import { NextFunction, Request, Response } from 'express';

import { Path, getKeyValue } from './type';

import { ErrorCodes } from 'src/domain/errors';

interface IValidateShapes {
    [key: string]: ObjectShape;
}
export const validateSchema = (shapes: IValidateShapes) => async (req: Request, _: Response, next: NextFunction) => {
    try {
        await Promise.all(
            Object.entries(shapes).map(([path, shape]: [Path, ObjectShape]) =>
                object(shape)
                    .validate(getKeyValue<Request, Path>(path)(req), { stripUnknown: true, abortEarly: true })
                    .then((validated) => {
                        req[path] = validated;
                    })
            )
        );
        return next();
    } catch (error) {
        error.status = 400;
        error.code = ErrorCodes.API_VALIDATION_ERROR;
        delete error.errors;
        return next(error);
    }
};
