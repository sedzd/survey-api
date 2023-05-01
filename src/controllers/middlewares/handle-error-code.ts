/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, NextFunction, Response } from 'express';
import { ValidationError } from 'yup';

import { logger } from 'src/libs/logger/logger';
import { ErrorCodeMap, ErrorCodes } from 'src/domain/errors';

function handleValidationError(err: any, req: Request, res: Response) {
    logger.error({ err }, 'Validation Error');

    return res.status(err.status).json({
        message: err.message,
        error_code: err.error_code || ErrorCodes.API_VALIDATION_ERROR,
        errors: err.errors
            ? err.errors.map((e: { path: string; message: string; doc_url?: string }) => ({
                  path: e.path,
                  message: e.message,
                  doc_url: e.doc_url
              }))
            : err.errors
    });
}

function handleValidMappedStatusCodeError(err: any, req: Request, res: Response, statusCode: number) {
    const logContext = {
        error_code: err.error_code,
        status_code: statusCode,
        message: err.message,

        context: { path: err.context?.path, data: err.context?.data }
    };

    logger.warn(logContext, 'API error');

    return res.status(statusCode).send({
        error_code: err.error_code,
        message: err.message
    });
}
function handleUnexpectedError(err: any, req: Request, res: Response) {
    logger.error(err, 'unexpected error');

    return res.status(500).send({
        error_code: ErrorCodes.SERVER_ERROR,
        message: 'Something unexpected happened'
    });
}

export const errorHandler = () => {
    // eslint-disable-next-line
    return (err: any, req: Request, res: Response, _: NextFunction) => {
        try {
            if ((err as ValidationError) instanceof ValidationError) {
                return handleValidationError(err, req, res);
            }

            const statusCode = Number(ErrorCodeMap[err.error_code]);

            if (!Number.isNaN(statusCode)) {
                return handleValidMappedStatusCodeError(err, req, res, statusCode);
            }
            return handleUnexpectedError(err, req, res);
        } catch (e) {
            return handleUnexpectedError(e, req, res);
        }
    };
};
