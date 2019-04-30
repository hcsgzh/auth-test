const LRU_Cache = require('lru-cache');

/**
 * the maximum size of the cache
 */
const options_cache = {
    max: 1000000,
};
/**
 * create a token cache
 */ 
const cache = new LRU_Cache(options_cache);

/**
 * Usage
 * 
 * This cache is for KeyCloak token and Internal Auth token
 * 
 * use the signature of a KeyCloak token as a key for the 
 * keyCloak token set(access_token, id_token, refresh_token) 
 * and Internal Auth token(access_token)
 * 
 * {
 *      keycloak: {
 *          access_token: {},
 *          id_token:     {},
 *          refresh_token:{}
 *      },
 *      internal: {
 *          access_token: {}
 *      }
 * }
 * 
 * to set a token_set in the cache:
 * The key will be the signature of the keycloak.access_token.
 * let key = token_set.keycloak.access_token.split('.')[2];
 * let result = cache.set(key, token_set);
 * 
 * to get a token_set from the cache:
 * let AToken_set = cache.get(Akey);
 */


module.exports = cache;