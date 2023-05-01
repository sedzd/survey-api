export enum Path {
    BODY = 'body',
    COOKIES = 'cookies',
    HEADERS = 'headers',
    PARAMS = 'params',
    QUERY = 'query',
    SIGNEDCOOKIES = 'signedCookies'
}

export const getKeyValue =
    <T, U extends keyof T>(key: U) =>
    (obj: T) =>
        obj[key];
