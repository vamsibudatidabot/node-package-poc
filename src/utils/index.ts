import { getEnv, dabotParseInt, nodeEnv, cleanEmpty, resolvePromise, decryptData, getMethodName, CalculateOffset } from "./commonUtilities";
import { standardizeArrayQueryParam, standardizeStringQueryParam, standardizeDateQueryParam, standardizeBooleanQueryParam, standardizeIntegerQueryParam, standardizeSQLQueryParam } from "./standardizeQueryParams";

const CommonUtilities = {
    getEnv, dabotParseInt, nodeEnv, cleanEmpty, resolvePromise, decryptData, getMethodName, CalculateOffset
}
const StandardizeQueryParams = {
    standardizeArrayQueryParam, standardizeStringQueryParam, standardizeDateQueryParam, standardizeBooleanQueryParam, standardizeIntegerQueryParam, standardizeSQLQueryParam
}

const Utils = { CommonUtilities, StandardizeQueryParams }

export default { Utils };