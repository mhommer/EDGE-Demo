/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var clientId = '399944064628-3ie91ujnnklvfeeccco88j8rul89rcn9.apps.googleusercontent.com';
var redirectURI = 'http://localhost/EDGE-Demo/';


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        getToken();
        this.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);


    }
};


function getToken ()  {

    var tokenCapture = function (url) {

        var url = 'https://accounts.google.com/o/oauth2/auth?' +
            'client_id=' + clientId + '&' +
            'redirect_uri=' + redirectURI + '&' +
            'scope=https://www.googleapis.com/auth/fusiontables&' +
            'response_type=token&' +
            'approval_prompt=force&' +
            'login_hint=buzzlight.netlight@gmail.com';

        this.document.location.href = url;
    };

    var url = this.window.location.href;
    var tokenIndex = url.indexOf('access_token');

    if (tokenIndex >= 0) {
        var token,
            expirysecs,
            type;

        var firstAndIndex = url.indexOf('&');

        token = url.substring(tokenIndex, firstAndIndex);
        token = token.substr(token.indexOf('=')+1, token.length);

        var expiryIndex = url.indexOf('expires_in');
        expirysecs = url.substr(expiryIndex, url.length);
        expirysecs = expirysecs.substr(expirysecs.indexOf('=')+1, expirysecs.length);

        var tokenobject = {
            token : token,
            expiry : expirysecs * 1000,
            timestamp : new Date().getTime()
        }

        writeToFile(tokenobject.toString(), 'logintoken');

        readJSONFromFile('logintoken', function (text) {

        });

    } else {

        tokenCapture();
    }


}

/**
 *
 * @param object    JSON object to write
 * @param filename  filename to write it to
 */
function writeToFile (object, filename) {

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    function gotFS(fileSystem) {
        fileSystem.root.getFile(filename, {create: true}, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwrite = function(evt) {
            console.log("write success to file "+ filename);
        };

        writer.write(object);

    }

    function fail(error) {
        console.log('error writing to file '+ filename + ". " + error.code);
    }

}


function readJSONFromFile (filename, callback) {

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);


    function gotFS(fileSystem) {
        fileSystem.root.getFile(filename, null, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.file(gotFile, fail);
    }

    function gotFile(file){
        readAsText(file);
    }


    function readAsText(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("Read as text");
            console.log(evt.target.result);
            callback(evt.target.result);
        };
        reader.readAsText(file);
    }

    function fail(evt) {
        console.log(evt.target.error.code);
    }
}

app.initialize();




