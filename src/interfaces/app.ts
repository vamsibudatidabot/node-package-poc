import { Pool, Options as PoolOptions } from 'generic-pool'
import * as snowflake from 'snowflake-sdk';
import * as Knex from 'knex';

export interface AppConfig {
    name: string,
    port: number
}  

export interface Config {
    app: AppConfig; // dabot configuration
    metaDatabase: Knex.Knex.Config   // dabot storage
    snowFlake: { snowFlakeConnectionOptions: snowflake.ConnectionOptions, snowFlakeConnectionPoolOptions: PoolOptions }
}