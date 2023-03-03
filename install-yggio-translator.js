/*
The MIT License (MIT)

Copyright (c) 2022 Sensative AB

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Copyright (C) 2021, Sensative AB, All rights reserved
// Author: Lars Mats
//

import fetch from 'node-fetch'
globalThis.fetch = fetch;

import {translate} from './dots-translator-generated.cjs';

const translatorVersion = "0.0.39";

const loginYggio = async (supplier, username, password) => {
    // Login to Yggio to obtain a token
    const supplierAccount = username;
    const api = 'https://' + supplier + '/auth/local';
    const getAuthOptions = (username, password) => {
        return {
            method: 'POST', port: 443,
            headers: { Accept: 'application/json', 'Content-Type': 'application/json','cache-control': 'no-cache'},
            body: JSON.stringify({ username, password}),
        }
    }
    let token = await fetch(api, getAuthOptions(supplierAccount, password))
        .then(response => { if(!response.ok) throw {message:'Login failed - check username and password'}; return response.json()})
        .then(data => data.token)
        .catch(err => {
            console.log("Login failed - connection problem?");
            console.log(err);
            return null;
        })

    return token;
}

const postYggioTranslator = async (supplier, token, translatorVersion) => {
    const api = 'https://' + supplier + '/api/translators';

    const translator = {
        name: 'sensative-vsm-yggio3-translator',
        version: translatorVersion,
        description: 'A translator for Sensative VM driven sensors',
        apiVersion: '1.0',
        match: {
          deviceModelName: 'sensative-vsm-lora',
        },
        spec: {
            // These are reported regularily
            vsm : "object",
            gnss: "object",
            semtechEncoded: "object",
            wifi: "object",
            output: "object",
            timestamps: "object",
            idd: "object",
            forward: "object",

        },
        code: translate.toString().replace("###VERSION###", translatorVersion),
      }
    
    console.log("Posting", { ...translator, code:"<code>"});

    const getAuthOptions = (token) => {
        return {
            method: 'POST', port: 443,
            headers: { Accept: 'application/json', 'Content-Type': 'application/json','cache-control': 'no-cache', 'Authorization' : 'Bearer ' + token},
            body: JSON.stringify(translator),
        }
    }
    let response = await fetch(api, getAuthOptions(token))
        .then(response => { if(!response.ok) throw {message:'Translator post failed: ' + JSON.stringify(response)}; return response.statusText;})
        .catch(err => {
            console.log("Post failed - check credentials and version?");
            console.log(err);
            return null;
        })
    return response;
}

if (process.argv.length == 5) {
    const yggioServer = process.argv[2];
    const yggioUsername = process.argv[3];
    const yggioPassword = process.argv[4];
    console.log("yggioServer: " + yggioServer);
    console.log("yggioUsername: " + yggioUsername);
    console.log("yggioPassword: " + "*****");
    console.log("translatorVersion: " + translatorVersion);

    console.log("Connecting...");
    // const supplier = "staging.yggio.net";
    let token = await loginYggio(yggioServer, yggioUsername, yggioPassword);
    console.log("Posting translator...");
    let response = await postYggioTranslator(yggioServer, token, translatorVersion);
    console.log("Response:" + response);
} else {
    console.log("Usage: " + process.argv[0] + " <yggio-server> <yggio-username> <yggio-password>");
}
