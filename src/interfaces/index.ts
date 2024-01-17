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

export enum NODE_ENVIRONMENTS {
    notset = 'notset',
    development = 'development',
    local = 'local',
    stage = 'stage',
    production = 'production',
    test = 'test',
    docker = 'docker'
}

export enum HTTPHeaders {
    ResponseTime = 'x-response-time',
    ForwardedFor = 'x-forwarded-for',
};

// Define sensitive keys you want to remove from logs
export enum SensitiveKeys {
    Password = 'password',
    NewPassword = 'new_password',
    OldPassword = 'old_password',
    RepeatPassword = 'repeat_password',
    Token = 'token',
    SecretKey = 'secret_key',
    AccessKeyId = 'access_key_id',
    AccountName = 'account_name',
    Database = 'database',
    Warehouse = 'warehouse',
    Authorization = 'authorization',
    SourceConnection = 'source_connection',
    SourceLocation = 'source_location',
    TargetConnection = 'target_connection',
    TargetLocation = 'target_location',
};

export enum SpecialMessages {
    Redacted = '* * * * * * *',
    DottedLine = '. . . . . . .',
}
