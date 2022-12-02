export const TIME_INTERVAL = 3 * 1000;
export const MAX_RETRY = 3;
export const MAX_DEPTH = 1;
export const SEARCH_BATCH_SIZE = 10;
export const DOI_BATCH_SIZE = 40;
export const DOI_REGEXP = new RegExp(/^[\d]{2}\.[\d]{1,}\/.*/);
export const ALLOW_UPDATE = process.env.ALLOW_UPDATE ? (eval(process.env.ALLOW_UPDATE) as boolean) : false;
