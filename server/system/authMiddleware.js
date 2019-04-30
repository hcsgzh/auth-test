
const { token_precess } = require("./util");
const auth = require('../system/auth');
const cache = require('../system/cache');


const withAuth = function(req, res, next){
    const token = req.cookies.token;
    const signature = req.headers['authorization'];

    const expectedType = "bearer";
    const notBefore = 0;
    const realmUrl = "https://www.mcatnt.nz/auth/realms/tntmca";

    if (!token && !signature && token.split('.')[2]===signature) {
        res.status(401).send({'message':'Unauthorized: No token provided or Bad token'});
    }else {
        // verify keycloak token 
        // validate keycloak token 
        let jwt = await auth.validation(token, 'Bearer').catch(error=> {
            if(error.message.indexOf('expired')>0){
                //need to refresh token
                // verify the access token even it is expired, But need to check if it is eligible 
                let jwt2 = await auth.verifying(token).catch(error=>{
                    console.log('verifying token: ', error);
                    res.status(401).send({'message':'Unauthorized: No token provided or Bad token'});
                });
                console.log('need to refresh token here!');
                // check the cache for refresh token
                let token_set = cache.get(signature);
                if(token_set){
                    // find the token_set from the cache
                    let deRefreshToken = await token_precess(token_set.keycloak.refresh_token).catch(err=>{
                        console.log('decode refresh token: ', err);
                        // don't think this will happen
                        res.status(401).send({'message':'Unauthorized: No token provided or Bad token'});
                    });
                    // check if the refresh_token is expired
                    if(deRefreshToken.isExpired()){
                       // expired 
                       // redirect the browser to the realms
                       //res.redirect('/');
                       res.status(401).send({'message':'Unauthorized: refresh token is expired'});
                    }else {
                      //  unexpired and refresh token
                      let realm = auth.getRealmFromIssuer(deRefreshToken.payload.iss);
                      let new_token_set = await auth.refreshToken(realm, token_set.keycloak.refresh_token).catch(err=>{
                          console.log('refresh token process failed! ', err);
                      });
                      let internal_token = await auth.getInternalToken(new_token_set.access_token).catch(err=>{
                            console.log('after refresh token and exchange to internal token process failed! ', err);
                      });
                      if (internal_token && internal_token.access_token) {
                        // after successful exchange internal token
                        // Double Submit Cookies Method
                        // send the keycloak token to client
                        res.cookie('token', new_token_set.access_token, { maxAge: 900000, httpOnly: true });
                        res.cookie('signature', new_token_set.access_token.split('.')[2], { maxAge: 900000 });
                        console.log('cookie created successfully');
                
                        // cache the keycloak_token and the internal_token in the cache
                        let token_set2 = {
                            keycloak: new_token_set,
                            internal: internal_token
                        };
                        let key2 = token_set2.keycloak.access_token.split('.')[2];
                        cache.set(key2, token_set2);
                        }

                    }

                }else{
                    // could not find the token from the cache
                    // maybe exceed 1 million token in the cache

                    // redirect the browser to the realms
                    //res.redirect('/');
                    res.status(401).send({'message':'Unauthorized: token provided is expired and did not match anything'});
                }


            }else {
                //any other error happened, will reject the request.
                res.status(401).send({'message':'Unauthorized: No token provided or Bad token'});
            }
        });

        let token_set = cache.get(signature);
        if(token_set){
            // find the token set from the cache
            // check if internal auth token is expired
            let deIntToken = await token_precess(token_set.internal.access_token).catch(err=>{
                console.log('decode internal auth access token: ', err);
                // don't think this will happen
                res.status(401).send({'message':'Unauthorized: token provided is fine but decode internal auth token failed'});
            });
            // check if the internal auth access token is expired
            if(deIntToken.isExpired()){
               // internal auth access token is expired 
               // reexchange internal auth access token
               let internal_token2 = await auth.getInternalToken(token_set.keycloak.access_token).catch(err=>{
                console.log('internal auth token is expired and re-exchange to internal token process failed! ', err);
                });
                if (internal_token2 && internal_token2.access_token) {
                    // do not need to send the keycloak token to frontend, because there is no change for keycloak token
                    // re-cache the keycloak_token and the internal_token2 in the cache
                    let token_set3 = {
                        keycloak: token_set.keycloak,
                        internal: internal_token2
                    };
                    let key3 = token_set3.keycloak.access_token.split('.')[2];
                    cache.set(key3, token_set3);
                }
            }
        }else{
            res.status(401).send({'message':'Unauthorized: token provided is fine but did not match anything'});
        }
        next();
    }
}

module.exports = withAuth;