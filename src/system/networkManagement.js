import React from 'react';
//import { withContext } from '../context';


export default class Network {

    // static serverRoot = "http://localhost:3005";
    static serverRoot = "";

    static opt = {
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST'
	};

    // the auth header is stored in AppContextProvider
    // Here are url, headers, body for post
    static async fetch(url, method, obj){

        return new Promise(async function (resolve, reject) {
            try{
                console.log('request URL: '+ Network.serverRoot + url);
                

                // let obj_post = {};
                // obj_post.method = 'POST';
                // obj_post.headers = {
                //     Accept: 'application/json',
                //     'Content-Type': 'application/json',
                // };
                method?Network.opt.method = method:null;
                obj? Network.opt.body = JSON.stringify(obj): null;
                console.log('request playload : ', Network.opt);

                const response = await fetch(Network.serverRoot + url, Network.opt);
                console.log('server reposnse: ', response);

                if(response.status === 200){
                    // no error
                    const data = await response.json();
                    console.log('send request success : ', data);

                    /**
                     * the data:
                     * {
                     *  data:{}
                     * }
                     * 
                     * if there is a refresh_token in the data, then automatcally
                     * update the HTTP Auth header from the cookie
                     * 
                     */
                    // refresh the HTTP Auth header, if a refresh_token is detected
                    // because of signature in cookie will be send by server,
                    // then the refresh_token is not necessary any more.
                    if(data.refresh_token){

                    }

                    
                    //document.cookie;
                    // get all the cookies
                    let cookie = document.cookie.split('; ').reduce((acc, c) => {
                        const [key, val] = c.split('='); 
                        acc[key] = val; 
                        return acc;
                    }, {});
                    console.log('all cookies : ',cookie);

                    // read the cookies, if there is a signature, then add the auth header and delete the signature from cookies.
                    if(cookie.signature){
                        // Once detect a signature in the cookie, put the signature in the HTTP auth header
                        // and delete the signature from the cookie
                        console.log('signature is received!! ', cookie.signature);
                        Network.opt.headers.authorization = 'Bearer ' + cookie.signature;

                        console.log('delete the signature from the cookie');
                        // to delete the signature from cookie
                        // using to set a expirartion date for the signature
                        let d = new Date(); //Create an date object
                        d.setTime(d.getTime() - (1000*60*60*24)); //Set the time to the past. 1000 milliseonds = 1 second
                        let expires = "expires=" + d.toGMTString(); //Compose the expirartion date
                        document.cookie = 'signature'+"="+"; "+expires;//Set the cookie with name and the expiration date
                    }

                    resolve (data);
                }else {
                    //error happened

                    //throw errorObj
                }
            }catch(e){
                console.log('UNKNOWN ERROR HIT: ', e.message);
                reject(e.message);
            }
        });
    }
}