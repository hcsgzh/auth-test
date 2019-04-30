


const FormData = require('form-data');
const form = new FormData();

const crypto = require('crypto');
const jwkToPem = require('jwk-to-pem');


const { doRequest, doRequestGet, token_precess } = require('./util');
const { decodeToken } = require("./util");

const realms = [{
    realm: 'tntmca',
    secret: 'a22016b8-bd37-4bd0-ba2a-c8ee65cd42a2',  //   30ed4536-1f65-4147-88a2-3a987d0c606c
    client: 'tntopcon',
    discription: 'This is for shared auth server.',
    redirect: 'http://localhost:3005/auth/callback',
    keycloak: 'https://www.mcatnt.nz/auth/realms/'
}, {
        realm: 'tntadm',
        secret: '9d117501-7cac-4718-804c-add036e5266e', 
        client: 'tntopcon',
        discription: 'This is for admin auth server.',
        redirect: 'http://localhost:3005/auth/callback',
        keycloak: 'https://www.mcatnt.nz/auth/realms/'
    }];

//const keycloak = 'http://tntauth2.mccarthy.co.nz:8888/auth/realms/';//++'hugh/protocol/openid-connect/auth?client_id=' + CLIENT_ID + '&scope=openid&response_type=code&redirect_uri=' + redirect;
const keycloak = 'https://www.mcatnt.nz/auth/realms/';

const hostself = 'http://localhost:3005';

/**
 * keycloak certs for a realm
 * need to store with the realms and be paired
 */
let certs = [];

class Auth {

    static async getRealms() {

        let results = realms.map((item, index) => {
            return { 'id': index+1 ,'name': item.realm };
        });

        results.forEach(item => {
            console.log(item);
        });

        return results;
    }

    /**
     * generate the keycloak URL by using a realm
     * @param {*} data  realm
     */
    static async getKeycloakURL(data) {

        let realm = realms.find(item => {
            return item.realm === data.realm;
        });
        console.log(realm);

        realm.result = keycloak + realm.realm + '/protocol/openid-connect/auth?client_id=' + realm.client + '&scope=openid&response_type=code&redirect_uri=' + encodeURIComponent(realm.redirect);
        //https://www.mcatnt.nz/auth/realms/hugh/protocol/openid-connect/token
        realm.token_url = keycloak + realm.realm + '/protocol/openid-connect/token';
        realm.logout_url = keycloak + realm.realm + '/protocol/openid-connect/logout?redirect_uri='+ encodeURIComponent(hostself);

        return realm;
    }

    /**
     * generate the keycloak URL by using a keycloak token issuser
     * @param {*} issuer a keycloak token issuer
     */
    static async getKeycloakURLByIssuer(issuer){
        //https://www.mcatnt.nz/auth/realms/tntmca
        // get the last sagment of the url, if the url is not ended by '/'.
        let realm = issuer.split('/').pop();
        let data = { realm:realm };

        let url = getKeycloakURL(data);

        return url;
    }

    /**
     * extract the realm from a keycloak token issuer
     * @param {*} issuer a keycloak token issuer
     */
    static async getRealmFromIssuer(issuer){
        //https://www.mcatnt.nz/auth/realms/tntmca
        // get the last sagment of the url, if the url is not ended by '/'.
        issuer.split('/').pop();
        //split("/").pop()
    }

    static async getJWK(kid) {
        //let keys = certs;
        return new Promise(async function (resolve, reject) {
            let key = certs.find((key) => { return key.kid === kid; });
            if (key) {
                resolve(jwkToPem(key));
            }else {
                reject({'message': 'no certs found!'});
            }
        });
    }

    /**
     * just verify the keycloak access token
     * @param {*} token 
     */
    static async verifying (token) {
        return new Promise(async function (resolve, reject) {
            try{
                let deToken = await token_precess(token);
                console.log('verify keycloak token: ', deToken);
                // convert cert to public KEY and use it to verify token
                Auth.getJWK(deToken.header.kid).then(key => {
                    verify.update(deToken.signed);
                    if (!verify.verify(key, deToken.signature)) {
                        reject(new Error('invalid token (public key signature)'));
                    } else {
                        resolve(deToken);
                    }
                }).catch((err) => {
                    reject(new Error('failed to load public key to verify token. Reason: ' + err.message));
                });
            }catch(error) {
                reject(error);
            }
        });
    }

    /**
     * validate and verify keycloak access token
     * @param {*} token 
     * @param {*} expectedType  access token  Bearer, refresh token will be Refresh
     */
    static async validation (token, expectedType, realmUrl) {
        return new Promise(async function (resolve, reject) {
            try{
                if(!token){
                    reject(new Error('message invalid token (no token)')); 
                }
                //const expectedType = "Bearer"; // access token, refresh token will be Refresh
                const notBefore = 0;
                // const realmUrl = "https://www.mcatnt.nz/auth/realms/tntmca";
                let publicKey = false;
            
                // TODO: validate keycloak token 
                let deToken = await token_precess(token);
                console.log('validateion keycloak token: ', deToken);
                
                if (deToken.isExpired()) {
                    reject(new Error('message invalid token (expired)'));
                } else if (!deToken.signed) {
                    reject(new Error('message invalid token (not signed)'));
                } else if (deToken.payload.typ !== expectedType) { //"Bearer"
                    reject(new Error('message invalid token (wrong type)'));
                } else if (deToken.payload.iat < notBefore) {
                    reject(new Error('message invalid token (future dated)'));
                } else if (deToken.payload.iss !== realmUrl) {
                    reject(new Error('message invalid token (wrong ISS)'));
                } else {
                    // TODO: verify keycloak token 
                    const verify = crypto.createVerify('RSA-SHA256');
                    // if public key has been supplied use it to validate token
                    if (publicKey) {
                        try {
                        verify.update(deToken.signed);
                        if (!verify.verify(this.publicKey, deToken.signature, 'base64')) {
                            reject(new Error('invalid token (signature)'));
                        } else {
                            resolve(token);
                        }
                        } catch (err) {
                        reject(new Error('Misconfigured parameters while validating token. Check your keycloak.json file!'));
                        }
                    } else {
                        // convert cert to public KEY and use it to verify token
                        Auth.getJWK(deToken.header.kid).then(key => {
                            verify.update(deToken.signed);
                            if (!verify.verify(key, deToken.signature)) {
                                reject(new Error('invalid token (public key signature)'));
                            } else {
                                resolve(deToken);
                            }
                        }).catch((err) => {
                            reject(new Error('failed to load public key to verify token. Reason: ' + err.message));
                        });
                    }
                }
                }catch(error) {
                    reject(error);
                }
            });
    }

    /**
     * to refresh keycloak token
     * @param {*} realm 
     * @param {*} refresh_token 
     */
    static async refreshToken (realm, refresh_token){
        return new Promise(async function (resolve, reject) {
            let keycloak_realm_src = await Auth.getKeycloakURL({'realm':realm});
            //client_secret: keycloak_realm_src.secret
            let opt = {
                url: keycloak_realm_src.token_url,
                form: { grant_type: 'refresh_token', client_id: keycloak_realm_src.client, refresh_token: refresh_token, client_secret: keycloak_realm_src.secret }
            };

            console.log('start to refresh token. ', opt);
            let result = await doRequest(opt).catch(err=>{
                console.log('refresh token request : ', err);
                reject(err);
            });
        
            console.log('should get new token now!@!!!!!!!!');
            const json = JSON.parse(result);
            let token = json;

            console.log('new token: ', token);
            resolve(token);

        });
    }

    /**
     * get keycloak certs
     * @param {*} realmURL 
     */
    static async getJWCs (realmURL){

        return new Promise(async function (resolve, reject) {
            try{
                console.log(realmURL + '/protocol/openid-connect/certs');
                let res = await doRequestGet({
                    url: realmURL + '/protocol/openid-connect/certs'
                });
                console.log(res);
                const json = JSON.parse(res);
                console.log('keycloak certs for '+realmURL, json);
                certs = json.keys;
                resolve(json);
            }catch(error) {
                reject(error);
            }
        });
    }

    static async getKeycloakToken(data) {
        return new Promise(async function (resolve, reject) {
            try{
                console.log('callback from keycloak server. and to change the Auth_code to a keycloak token');
                let result = await doRequest(data);
        
                console.log('should get token now!@!!!!!!!!');
                const json = JSON.parse(result);
                let token = json;
                console.log('keycloak token: ',token);
                decodeToken(token.access_token);
                resolve(token);
            }catch(error) {
                reject(error);
            }
        });

    }

    static async getInternalToken(keycloakToken) {
        return new Promise(async function (resolve, reject) {

        console.log('start to get internal token .....');
        
        //let result = await request.post({
        //    url: 'http://pgtdev1.mccarthy.co.nz:48050/auth/protocol/openid-connect/token',
        //    headers: {
        //        'Authorization': 'Bearer ' + keycloakToken,
        //    },
        //    form: { grant_type: 'urn:mcatnt.co.nz:oauth:grant-type:validate_bearer', client_id: 'tntopcon', client_secret: 'Bu661es' }
        //},
        //    function (err, httpResponse, body) {
        //    console.log('get back form internal auth server .....');
        //    //console.log(httpResponse);
        //    //console.log(err);
        //    console.log('should get internal token now!@!!!!!!!!');
        //    console.log(body);
        //    const json = JSON.parse(body);
        //        var internaltoken = json;
        //    //decodeToken(token.access_token);
        //    //res.redirect('/?token=' + json.access_token);

        //    return internaltoken;
        //    });

        try{
            let res = await doRequest({
                url: 'http://pgtdev1.mccarthy.co.nz:48050/auth/protocol/openid-connect/token',
                headers: {
                    'Authorization': 'Bearer ' + keycloakToken,
                },
                form: { grant_type: 'urn:mcatnt.co.nz:oauth:grant-type:validate_bearer', client_id: 'tntopcon', client_secret: 'Bu661es' }
            });
            console.log(res);
            const json = JSON.parse(res);
            var internaltoken = json;
            //decodeToken(token.access_token);
            //res.redirect('/?token=' + json.access_token);
            console.log('getInternalToken   .....');
            //return internaltoken;
            resolve(internaltoken);
        }catch(error) {
            reject(error);
        }
    });

        
        //console.log(result);

    }

}


module.exports = Auth;