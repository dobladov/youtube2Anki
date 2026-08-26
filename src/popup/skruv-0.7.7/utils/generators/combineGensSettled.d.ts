export default combineGensSettled;
/**
 * @template T
 * @param  {...AsyncGenerator<T>} gens
 * @returns {AsyncGenerator<T[]>}
 */
declare function combineGensSettled<T>(...gens: AsyncGenerator<T, any, any>[]): AsyncGenerator<T[], any, any>;
