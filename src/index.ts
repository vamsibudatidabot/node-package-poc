import {ConfigConstructor} from './config';
import * as Interfaces from './interfaces';
import utils from './utils';

const Utils = { CommonUtilities: utils.CommonUtilities, StandardizeQueryParams: utils.StandardizeQueryParams }
export type AppInterfaces = typeof Interfaces;
export { Utils, ConfigConstructor };