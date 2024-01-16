import {ConfigConstructor} from './config';
import utils from './utils';

const Utils = { CommonUtilities: utils.CommonUtilities, StandardizeQueryParams: utils.StandardizeQueryParams }
export { Utils, ConfigConstructor };

export type { AppConfig, Config } from './interfaces';