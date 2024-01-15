
type secondaryFunctionType = (arg: any) => any;
/**
 * Checks the param passed in is an array, and if it isn't then it converts to an array. 
 * Second argument will also check all array entries
 * 
 * Example: standardizeArrayQueryParam( request.query.id, standardizeIntegerQueryParam )
 * Standardizes the array, and then runs standardizeIntegerQueryParam on each item in the array
 * 
 * @param param argument to check
 * @param secondaryCheck optional - will run another function against each member of the array.
 * @returns array
 */
export function standardizeArrayQueryParam<Type>(param: any, secondaryCheck?: secondaryFunctionType ): Type[] | undefined {
    // An "array" query param could be missing (undefined), a single item, or an array, so standardize it
    if (param === undefined){
        return undefined;
    }
    const results = Array.isArray(param) ? param : [param];
    if ( typeof secondaryCheck !== 'undefined'){
        return results.map((x:any) => secondaryCheck(x));
    }
    return results;
}

export function standardizeStringQueryParam(param: any): string | undefined {
    if (param === undefined || param === null) {
        return param;
    }

    return String(param);
}

export function standardizeDateQueryParam(param: any): Date | undefined {
    if (param === undefined) {
        return param;
    }

    return new Date(String(param));
}

export function standardizeBooleanQueryParam(param: any): boolean | undefined {
    if (param === undefined) {
        return false;
    }

    if (param.toLowerCase() !== 'true') {
        return false;
    }

    return true;
}

export function standardizeIntegerQueryParam(param: any): number | undefined {
    if (param === undefined) {
        return param;
    }
    return Number(param);
}

export function standardizeSQLQueryParam(param: any): any {
    if (param === undefined) {
        return "";
    }
    return param;
}
