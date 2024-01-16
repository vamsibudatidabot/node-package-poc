import ConfigConstructor from './config';
import utils from './utils';

const Utils = { CommonUtilities: utils.CommonUtilities, StandardizeQueryParams: utils.StandardizeQueryParams }

export type { Config } from './config';

export { Utils, ConfigConstructor };