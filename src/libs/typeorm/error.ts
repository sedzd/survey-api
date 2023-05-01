import { DatabaseError } from 'pg-protocol';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { PG_UNIQUE_VIOLATION, PG_NOT_NULL_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { snakeCase } from 'lodash';

import { StandardError } from 'src/domain/standard-error';
import { ErrorCodes } from 'src/domain/errors';
export abstract class RepositoryError extends StandardError {
    public static isQueryFailedError = (err: Error): err is QueryFailedError & DatabaseError =>
        err instanceof QueryFailedError;

    public static isDbError = (err: Error) => err instanceof QueryFailedError || err instanceof EntityNotFoundError;

    public static dbToDomainError(error: Error): Error {
        if (RepositoryError.isQueryFailedError(error)) {
            if (error.code === PG_UNIQUE_VIOLATION) {
                return new StandardError(
                    ErrorCodes.DUPLICATE_FIELD_VALUE,
                    `${RepositoryError.getDupColumnName(error)} already exists`
                );
            }
            if (error.code === PG_NOT_NULL_VIOLATION) {
                return new StandardError(
                    ErrorCodes.API_VALIDATION_ERROR,
                    `${RepositoryError.getRequiredColumn(error)} is required`
                );
            }
        }
        if (error instanceof EntityNotFoundError) {
            const entity = snakeCase(this.getNotFoundEntity(error));

            return new StandardError(
                ErrorCodes.DATA_NOT_FOUND,
                `${entity.replace('_', ' ').toLocaleLowerCase()} is not found`
            );
        }

        return new StandardError(ErrorCodes.SERVER_ERROR, error.message, { error });
    }

    private static getDupColumnName(error: DatabaseError): string {
        const match = /\(([^)]+)\)/.exec(error.detail);
        return match ? match[1] : '';
    }

    private static getRequiredColumn(error: DatabaseError): string {
        const match = /"([^"]*)"/.exec(error.message);
        return match ? match[1] : '';
    }

    private static getNotFoundEntity(error: EntityNotFoundError): string {
        const match = /"([^"]*)"/.exec(error.message);
        return match ? match[1] : 'entity';
    }
}
