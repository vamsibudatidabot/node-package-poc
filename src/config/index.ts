import { getEnv, nodeEnv, NODE_ENVIRONMENTS, dabotParseInt } from "../utils/commonUtilities";
import * as Knex from 'knex';
import * as snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import {logger, SERVICE_NAME} from 'logger';
import { Pool, Options as PoolOptions } from 'generic-pool'

/**
 * This is the config for all possible environments run by this service.
 *
 * There is something to be said to make this file much simpler as just a defined object.
 * But being explicit in places where misspellings are common is good, so here's all the interfaces.
 */

interface AppConfig {
    name: string,
    port: number
}  

interface Config {
    app: AppConfig; // dabot configuration
    metaDatabase: Knex.Knex.Config   // dabot storage
    snowFlake: { snowFlakeConnectionOptions: snowflake.ConnectionOptions, snowFlakeConnectionPoolOptions: PoolOptions }
}

const KnexConfigDefaults: Knex.Knex.Config = {
    client: 'postgresql',
    asyncStackTraces: true,
    // explicit pool size. 2:10 This is the default
    pool: { min: 2, max: 50 },
    // Default logs to console, we need to use our logger function instead.
    log: {
        warn(message) {
            logger.warning(message);
        },
        error(message) {
            logger.error(message);
        },
        deprecate(message) {
            logger.crit(`Deprecated Error: ${message}`);
        },
        debug(message) {
            logger.debug(message);
        },
    }
}

const snowFlakeConnectionOptions: snowflake.ConnectionOptions = {
    // The values should access from env variables
    account: "uqb11827.us-east-1",
    username: "dabot_demo",
    password: "Dabot@123"
}

const snowFlakeConnectionPoolOptions: PoolOptions = {
    max: 10, // specifies the maximum number of connections in the pool
    min: 0
}

function getConfig(): Config {
    return {
        app: {
            name: SERVICE_NAME,
            port: dabotParseInt(getEnv('APP_PORT', '5004')) // YOUR HTTP PORT
        },
        metaDatabase: {
            ...KnexConfigDefaults,
            connection: getEnv(
                'META_DATABASE_URL',
                `postgresql://postgres:Try2open@localhost:5400/${
                    /test/i.test(getEnv('NODE_ENV')) ? 'dabot_test' : 'dabot'
                }`
            ),
        },
        snowFlake: {
            snowFlakeConnectionOptions: { ...snowFlakeConnectionOptions },
            snowFlakeConnectionPoolOptions: { ...snowFlakeConnectionPoolOptions }
        }
    };
}

class ConfigConstructor {
    data: Config;

    constructor() {
        let pathUrl = path.resolve(__dirname, `../../.env`);
        if (nodeEnv()) {
            // pathUrl = `${pathUrl}.${nodeEnv()}`; // This can be used for local setup
            pathUrl = `${getEnv('CONFIG', '/usr/src/app/conf/.env')}`;
            logger.warning(`Original path is ${pathUrl}.`);
        }
        else {
            logger.error(`process.env.NODE_ENV not set or understood=${process.env?.NODE_ENV}`);
        }
        if (fs.existsSync(pathUrl)) {
            logger.info(`Reading config from : ${pathUrl}`);
            dotenv.config({ path: pathUrl, debug: !(nodeEnv() === NODE_ENVIRONMENTS.test) });
        }
        else {
            logger.warning(`No config file ${pathUrl} found.`);
        }

        this.data = getConfig();
    }

}

export { ConfigConstructor, Config };
