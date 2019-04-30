var express = require('express');
var router = express.Router();

const request = require('request');
//import FormData from 'form-data';
const FormData = require('form-data');
const form = new FormData();


const auth = require('../system/auth');

const { decodeToken, token_precess } = require("../system/util");

const cache = require('../system/cache');

// this will be a problem if there are more than one different realms.
// this should be passed around.
var selectedRealm = {};


router.use('/getRealms', function (req, res, next) {
    auth.getRealms().then((results) => {
        //res.cookie('signature', '1234567890', { maxAge: 900000 });
        res.send({ data: results});
    });
});

router.use('/login', function (req, res, next) {
    console.log('auth/login...');
    const data = req.query;
    console.log(data.realm);
    //console.log(data.realm);

    const datajson = { realm: data.realm};


    auth.getKeycloakURL(datajson).then((results) => {
        console.log(results);
        selectedRealm = results;

        // use cookie to mark the realm that the client selected
        res.cookie('realm', datajson.realm, { maxAge: 10*60*60*1000, httpOnly: true });
                
        res.redirect(results.result);

        //res.send({ redirect: results});
    });

   
});

router.use('/logout', function (req, res, next) {
    let realm_cookie  = req.cookies.realm;
    console.log('logout ', realm_cookie);
    if(realm_cookie){
        const realm_data = { realm: realm_cookie };
        auth.getKeycloakURL(realm_data).then((results) => {
            console.log('logout result ', realm_data);
            console.log('logout result 2 ', results);
            res.redirect(results.logout_url);
        });
    }else {
        res.redirect('/');
    }
});

router.get('/callback', async function (req, res, next) {
    console.log('keycloak server call back');
    console.log(req.query);

    console.log(req.query.code);
    let start_date = Date.now();

    let realm_cookie  = req.cookies.realm;
    const realm_data = { realm: realm_cookie };

    const selectedRealm_1 = await auth.getKeycloakURL(realm_data);

    let opt = {
        url: selectedRealm_1.token_url,
        form: { grant_type: 'authorization_code', code: req.query.code, redirect_uri: selectedRealm_1.redirect, client_id: selectedRealm_1.client, client_secret: selectedRealm_1.secret }
    };
    let keycloak_token = await auth.getKeycloakToken(opt);
    let start2_date = Date.now();
    console.log('time to get keycloak token using the code: ', (start2_date-start_date));

    let keycloak_certs = await auth.getJWCs(selectedRealm_1.keycloak+selectedRealm_1.realm);
    let start21_date = Date.now();
    console.log('time to get keycloak certs using the code: ', (start21_date-start2_date));

    let detoken = await token_precess(keycloak_token.access_token, 'test_id');
    console.log('keycloak token: ', detoken);
    console.log('check if the token expire: ',detoken.isExpired());
    let start3_date = Date.now();
    console.log('time to decode keycloak access_token : ', (start3_date-start21_date));

    let realm_url = selectedRealm_1.keycloak + selectedRealm_1.realm;
    let jwt = await auth.validation(keycloak_token.access_token, 'Bearer', realm_url).catch(error => {
        console.log(error);
        console.log(error.message.indexOf('expired'));
        if(error.message.indexOf('expired')>0){
            //refresh token
            console.log('need to refresh token');
        }
        throw new Error('Higher-level error. ' + error.message);
    });
    console.log('successed to verify and validate the access token. ', jwt);
    // let jwt_re = await auth.validation(keycloak_token.refresh_token, 'Refresh').catch(error => {
    //     console.log(error);
    //     console.log(error.message.indexOf('expired'));
    //     if(error.message.indexOf('expired')>0){
    //         //refresh token
    //         console.log('need to refresh token');
    //     }
    //     throw new Error('Higher-level error. ' + error.message);
    // });
    // console.log('successed to verify and validate the refresh token. ', jwt_re);
    let start31_date = Date.now();
    console.log('time to decode, validate, convert pubKey and verify keycloak access_token and refresh token : ', (start31_date-start3_date));

    res.redirect('/app');

    // // refresh keycloak token test
    
    // //let new_token_set = await auth.refreshToken(selectedRealm.realm, keycloak_token.refresh_token);
    // //console.log('finish refreshing keycloak token');


    // // exchange to internal token
    // let internal_token = await auth.getInternalToken(keycloak_token.access_token);

    // let start4_date = Date.now();
    // console.log('time to exchange to internal token : ', (start4_date-start3_date));

    // // refresh keycloak token test
    
    // // let new_token_set = await auth.refreshToken(selectedRealm.realm, keycloak_token.refresh_token);
    // // console.log('finish refreshing keycloak token');
    // // let start5_date = Date.now();
    // // console.log('time to refresh keycloak token : ', (start5_date-start4_date));

    // // // exchange to internal token agian
    // // let internal_token2 = await auth.getInternalToken(new_token_set.access_token);
    // // let start6_date = Date.now();
    // // console.log('time to exchange to internal token again : ', (start6_date-start5_date));


    // if (internal_token && internal_token.access_token) {
    //     // after successful exchange internal token
    //     // Double Submit Cookies Method
    //     // send the keycloak token to client
    //     res.cookie('token', keycloak_token.access_token, { maxAge: 900000, httpOnly: true });
    //     res.cookie('signature', keycloak_token.access_token.split('.')[2], { maxAge: 900000 });
    //     console.log('cookie created successfully');

    //     // cache the keycloak_token and the internal_token in the cache
    //     let token_set = {
    //         keycloak: keycloak_token,
    //         internal: internal_token
    //     };
    //     let key = token_set.keycloak.access_token.split('.')[2];
    //     cache.set(key, token_set);

    //     let start7_date = Date.now();

    //     console.log('time for login: ', (start7_date - start_date));

    //     res.redirect('/dash/server');
    // }

    // auth.getInternalToken(keycloak_token.access_token).then(result => {
    //     console.log('get back form internal auth server.....2222');
    //     decodeToken(result.access_token);
    //     console.log('decoded internal token......');

    //     if (result && result.access_token) {
    //         // check if client sent cookie
    //         var cookie = req.cookies.cookieName;
    //         if (cookie === undefined) {
    //             // no: set a new cookie
    //             var randomNumber = Math.random().toString();
    //             randomNumber = randomNumber.substring(2, randomNumber.length);
    //             res.cookie('cookieTest', randomNumber, { maxAge: 900000, httpOnly: true });
    //             res.cookie('token', result.access_token, { maxAge: 900000, httpOnly: true });
    //             res.cookie('signature', result.access_token.split('.')[2], { maxAge: 900000 });
    //             console.log('cookie created successfully');
    //         }
    //         else {
    //             // yes, cookie was already present 
    //             console.log('cookie exists', cookie);
    //         } 
    //         res.redirect('/dash');
    //     }
    // });



    // request.post({
    //     url: selectedRealm.token_url,
    //     form: { grant_type: 'authorization_code', code: req.query.code, redirect_uri: selectedRealm.redirect, client_id: selectedRealm.client, client_secret: selectedRealm.secret }
    // },
    //     function (err, httpResponse, body) {
    //         //console.log(httpResponse);
    //         //console.log(err);
    //         console.log('should get token now!@!!!!!!!!');
    //         //console.log(body);
    //         const json = JSON.parse(body);
    //         var token = json;
    //         decodeToken(token.access_token);
    //         //res.redirect('/?token=' + json.access_token);

    //         auth.getInternalToken(token.access_token).then(result => {
    //             console.log('get back form internal auth server.....2222');
    //             decodeToken(result.access_token);
    //             console.log('decoded internal token......');

    //             if (result && result.access_token) {
    //                 // check if client sent cookie
    //                 var cookie = req.cookies.cookieName;
    //                 if (cookie === undefined) {
    //                     // no: set a new cookie
    //                     var randomNumber = Math.random().toString();
    //                     randomNumber = randomNumber.substring(2, randomNumber.length);
    //                     res.cookie('cookieTest', randomNumber, { maxAge: 900000, httpOnly: true });
    //                     res.cookie('token', result.access_token, { maxAge: 900000, httpOnly: true });
    //                     res.cookie('signature', result.access_token.split('.')[2], { maxAge: 900000 });
    //                     console.log('cookie created successfully');
    //                 }
    //                 else {
    //                     // yes, cookie was already present 
    //                     console.log('cookie exists', cookie);
    //                 } 
    //                 res.redirect('/dash');
    //             }

    //             //
    //         });

    //         console.log('finished the exchange of tokens....');

            
    //     });




});





module.exports = router;