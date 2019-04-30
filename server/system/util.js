const request = require('request');

function doRequest(opt) {
    return new Promise(function (resolve, reject) {
        request.post(opt, function (error, res, body) {
            //console.log('res.statusCode:: ' + res.statusCode);
            //console.log('http request to internal auth server....');
            //error?console.log(error):null;
            //console.log(body);
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(res.body);
            }
        });
    });
}

function doRequestGet(opt) {
    return new Promise(function (resolve, reject) {
        request.get(opt, function (error, res, body) {
            //console.log('res.statusCode:: ' + res.statusCode);
            //console.log('http request to internal auth server....');
            error?console.log(error):null;
            //console.log(res);
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(body);
            }
        });
    });
}

/**
 * decode a token string to a token object 
 * @param {*} token 
 * @param {*} clientId 
 */
function token_precess (token, clientId) {

    return new Promise(function (resolve, reject) {
        let token_obj = {};
        //let token = token;
        clientId? token_obj.clientId = clientId : null;
    
        if (token) {
            try {
                const parts = token.split('.');
                token_obj.header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
                token_obj.payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                token_obj.signature = Buffer.from(parts[2], 'base64');
                token_obj.signed = parts[0] + '.' + parts[1];
            } catch (err) {
                token_obj.payload = {
                exp: 0
                };
            }
        }else {
            reject('there is no token!!!');
        }

        /**
         * Determine if this token is expired.
         *
         * @return {boolean} `true` if it is expired, otherwise `false`.
         */
        token_obj.isExpired = function isExpired () {
            return ((this.payload.exp * 1000) < Date.now());
        };

        resolve (token_obj);

    });

}

/**
   * Determine if this token is expired.
   *
   * @return {boolean} `true` if it is expired, otherwise `false`.
   */
function isExpired (token_obj) {
    return ((token_obj.payload.exp * 1000) < Date.now());
};

function decodeToken (token) {
    //console.log('start to decode token: ' + token);
    const payload = token.split('.')[1];
    const header = token.split('.')[0];

    const decodedToken = {
        'header': decodeBase64(header),
        'payload': decodeBase64(payload),
    };

    console.log(decodedToken);

    //deToken = decodedToken;

    return decodedToken;
}

function decodeBase64 (str) {


    str = str.replace('/-/g', '+');
    str = str.replace('/_/g', '/');
    switch (str.length % 4) {
        case 0:
            break;
        case 2:
            str += '==';
            break;
        case 3:
            str += '=';
            break;
        default:
            throw 'Invalid token';
    }

    str = (str + '===').slice(0, str.length + (str.length % 4));
    str = str.replace(/-/g, '+').replace(/_/g, '/');

    //Buffer.from('Hello World!').toString('base64')
    //console.log(str);

    str = decodeURIComponent(Buffer.from(str, 'base64').toString());
    //console.log('again::::::: ' + str);
    str = JSON.parse(str);
    console.log('JSON object::');
    //console.log(str);
    return str;
};


module.exports = {
    decodeToken: decodeToken,
    decodeBase64: decodeBase64,
    doRequest: doRequest,
    doRequestGet: doRequestGet,
    token_precess: token_precess
};