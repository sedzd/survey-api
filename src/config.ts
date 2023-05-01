import { get } from 'env-var';
export const AppConfig = {
    serviceName: get('SERVICE_NAME').default('survey').asString(),
    servicePort: get('PORT').default(3000).asPortNumber(),
    appEnv: get('APP_ENV').default('local').asEnum(['production', 'staging', 'integration', 'local']),
    nodeEnv: get('NODE_ENV').default('development').asEnum(['development', 'production', 'test']),
    npm: {
        packageVersion: get('npm_package_version').asString()
    },
    db: {
        database: get('PGDATABASE').default('survey').asString(),
        host: get('PGHOST').default('localhost').asString(),
        password: get('PGPASSWORD').default('test').asString(),
        port: get('PGPORT').default(54321).asPortNumber(),
        schema: get('PGSCHEMA').default('public').asString(),
        user: get('PGUSER').default('test').asString(),
        isMigration: get('IS_MIGRATION_MODE_ENABLED').asBoolStrict() === true,
        migration: {
            user: get('PGMIGRATEUSER').default('test').asString(),
            password: get('PGMIGRATEUSERPASSWORD').default('test').asString()
        },
        readonly: {
            host: get('PGROHOST').default('localhost').asString(),
            password: get('PGROPASSWORD').default('test').asString(),
            port: get('PGROPORT').default(54321).asPortNumber(),
            user: get('PGROUSER').default('test').asString()
        }
    }
};
