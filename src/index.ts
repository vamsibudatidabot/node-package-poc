import ConfigConstructor from './config';
import utils from './utils';

const Utils = { CommonUtilities: utils.CommonUtilities, StandardizeQueryParams: utils.StandardizeQueryParams }
export * from './interfaces/app';
export { Utils, ConfigConstructor };