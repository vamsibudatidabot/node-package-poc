/**
 * Bunch of general purpose static methods for easy use.
 */

import { logger } from "logger";
import { Request } from 'express';
import { InternalServerError } from "errors";
import { isEmpty } from "lodash";
import crypto from 'crypto';

/**
 * Node env string enum
 */
export enum NODE_ENVIRONMENTS {
    notset = 'notset',
    development = 'development',
    local = 'local',
    stage = 'stage',
    production = 'production',
    test = 'test',
    docker = 'docker'
}

export function getEnv(envVar: string, fallback: string | undefined = undefined, required = true): string {
    const envValue = process.env[envVar];
    if (typeof envValue === 'string') {
        return envValue;
    }
    if (required && typeof fallback === 'undefined') {
        logger.error(`getEnv(${envVar}, ${fallback}) failed as required is set but nothing is found`, { envVar, fallback, required });
        throw new InternalServerError(`Environment variable "${envVar}" required but not set`);
    }
    return fallback ?? '';
}

export function dabotParseInt(maybeNumber: string) {
    const num = parseInt(maybeNumber, 10);
    if (isNaN(num)) {
        throw Error("Not a number");
    } else {
        return num;
    }
}

export const nodeEnv = (): NODE_ENVIRONMENTS => {
    type NodeEnvKey = keyof typeof NODE_ENVIRONMENTS;
    const envKey = process.env?.NODE_ENV as NodeEnvKey;
    if (envKey && NODE_ENVIRONMENTS[envKey]) {
        return NODE_ENVIRONMENTS[envKey];
    }
    logger.crit(`process.env.NODE_ENV not set or understood=${process.env?.NODE_ENV} envKey=${envKey}`, {  NODEENV: process.env?.NODE_ENV ?? '--' });
    return NODE_ENVIRONMENTS.notset;
};

/**
 * Recursively cleans out fields with nulls or undefined from an array or an object.
 * @param obj: any
 * @returns any
 */
export const cleanEmpty = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj
            .map(v => (v && typeof v === 'object') ? cleanEmpty(v) : v)
            .filter(v => !(v == null));
    } else {
        return Object.entries(obj)
            .map(([k, v]) => [k, v && typeof v === 'object' ? cleanEmpty(v) : v])
            .reduce((a: any, [k, v]) => (v == null ? a : (a[k] = v, a)), {});
    }
}

export const getMethodName = (request: Request) => {
    if (isEmpty(request) || isEmpty(request.route) || isEmpty(request.route.path) || Object.keys(request.route.methods).length === 0) {
        logger.error(`getMethodName() request parameter is not set`, { request });
        throw new InternalServerError(`getMethodName() request parameter is not set`);
    }
    return `${Object.keys(request.route.methods)[0].toUpperCase()} ${request.route.path}`;
}


/**
* Resolve Promise
* @param promise Promise<any>
* @returns Promise<any>
*/
export const resolvePromise = async (promise: Promise<any>, promiseName: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        promise.then((data: any) => {
            logger.info(`Resolved promise ${promiseName}`)
            resolve(data);
        }).catch((error: any) => {
            if (error) {
                logger.error(`Rejected promise ${promiseName}`, {
                    error: error,
                    error_message: error.message,
                });
                return reject(error);
            }
        })
    });
}

export const decryptData = async (value: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const decipher = crypto.createDecipheriv(getEnv('CRYPTO_ALGORITHM'), Buffer.from(getEnv('CRYPTO_KEY'), 'hex'), Buffer.from(getEnv('CRYPTO_IV'), 'hex'));
        try {
            if(!value.length) {
                return resolve(value);
            }
            let decryptedTxt = Buffer.from(value, 'hex');
            let decrypted = decipher.update(decryptedTxt);
            decrypted = await Buffer.concat([decrypted, await decipher.final()]);
            resolve(JSON.parse(decrypted.toString('utf8')));
        } catch (error: any) {
            reject(error);
        }
    })
}

export const CalculateOffset = (limit: number , page: number) => {
      return page && page > 0 ? (page - 1) * limit : 0;
}