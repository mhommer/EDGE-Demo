/**
 * ---FusionService---
 *
 *  Copyright (c) 2011 James Ferreira, 2013 Romain Vialard
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 
      var clientId = '399944064628-3ie91ujnnklvfeeccco88j8rul89rcn9.apps.googleusercontent.com';
      var apiKey = 'AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo';
	  var clientSecret = "rjqOF2_JtzDKyluRrjhz-dYM";
	  var scopes = 'https://www.google.com/auth/fusiontables';
	  var tableId = '1wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA';
	  var tableUserId = '1E7zxhrFUQhqJA0AKdAxn2BTQ-xlUj7EBYasLw4o';

function getTables() {
  var JSONOutput = ftRequest_('get');
  var tables = [];
  for (var i in JSONOutput.items) {
    tables[i] = new FusionTableApp.table(JSONOutput.items[i]);
  }
  return tables;
}

function getTableById(id) {
  var JSONOutput = ftRequest_('get', id);
  var table =  new FusionTableApp.table(JSONOutput);
  return table;
}

var FusionTableApp = {};

// Tables

FusionTableApp.table = function (table) {
  this.table = table;
};

var tableClass = FusionTableApp.table.prototype;

tableClass.getName = function () {
  return this.table.name;
};

tableClass.getId = function () {
  return this.table.tableId;
};

tableClass.getRows = function () {
  return ftRequest_("get", "SELECT * FROM "+this.table.tableId);
}

tableClass.addRow = function (row) {
  var values = [];
  var columns =[];
  var headers = [];
  for (var i in this.table.columns) {
    headers[i] = this.table.columns[i].name;
  }
  for(var i=0;i<headers.length;i++){
    columns.push("'"+headers[i] +"'");
    values.push("'"+encodeURI(row[Objapp.camelString(headers[i])]).replace(/'/g,"''")+"'"); 
  }  
  ftRequest_("post", "INSERT INTO "+this.table.tableId+" ("+columns.toString()+") VALUES ("+values.toString()+")");
}

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// OLD CODE FROM JAMES - For Backward compatibility
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

/**
 * Search for records in a Fusion Table 
 *
 * @param {String}  target   Quoted column name(s) ('First Name', 'Last Name') OR (*) for all 
 * @param {String}  where    valid statement see http://goo.gl/SkHI1
 *                            'Last Name' CONTAINS IGNORING CASE 'Ferr' 
 *                             AND 'First Name' CONTAINS IGNORING CASE 'J'" 
 * @returns {String[][]}      [[headers],[match row],[match row]...]
 *                            If no match returns []
 */
function searchFusion(target, where){
  var values = [];
  if (target == '*'){
    var values = getFusionHeaders();
  }else{
    values.push(target); 
  }
  var arrayResult = ftRequest_("get", "SELECT "+values.toString()+",ROWID FROM "+FUSION_ID+" WHERE "+ where);
  if(arrayResult.rows == undefined) return [];
  var columns = arrayResult.columns;
  var rows = arrayResult.rows;
  return new Array().concat([columns], rows);
}

/**
 * Updates a record in the Fusion table
 * Note: fusionObj must contain rowid of Fusion table record
 *
 * @param   {Object}  fusionObj  object with properties from cameled column names
 * @returns {String}             OK if successful
 */
function writeFusionObj(fusionObj){
  var values = [];
  var headers = getFusionHeaders();   
  for(var i=0;i<headers.length;i++){
    if (fusionObj[Objapp.camelString(headers[i])] != undefined)
    values.push(headers[i] +"='"+encodeURI(fusionObj[Objapp.camelString(headers[i])]).replace(/'/g,"''")+"'"); 
  }  
  var result = ftRequest_("post", "UPDATE "+FUSION_ID+" SET "+values.toString()+" WHERE ROWID = '"+fusionObj.rowid+"'");
  if (result.rows != undefined) return 'OK';
}

/**
 * Add a new record to a Fusion table
 *
 * @param   {Object}  fusionObj  object with properties from cameled column names
 * @returns {Integer}            rowid useful for unique ID of record
 */
function insertFusionObj(fusionObj){
  var values = [];
  var columns =[];
  var headers = getFusionHeaders(); 
  
  for(var i=0;i<headers.length;i++){
    columns.push("'"+headers[i] +"'");
    values.push("'"+encodeURI(fusionObj[Objapp.camelString(headers[i])]).replace(/'/g,"''")+"'"); 
  }  
  return ftRequest_("post", "INSERT INTO "+FUSION_ID+" ("+columns.toString()+") VALUES ("+values.toString()+")").rows[0][0];
}

/**
 * Get the Fusion row ID for a given column header and unique value
 *
 * @returns {Integer}    Fusion ROWID for record
 */
function getFusionROWID(header, key){
  var result = ftRequest_("get", "SELECT ROWID FROM "+FUSION_ID+" WHERE "+header+"='"+key+"'").rows;
  if(result == undefined) return null;
  return result[0][0];
}

/**
 * Get the column header names from Fusion Table
 *
 * @returns {String[]}    [header, header, ...]
 */
function getFusionHeaders(){
  var headers = [];
  //Logger.log(FUSION_ID);
  var result = ftRequest_("get", FUSION_ID).columns;
    for (var i = 0; i < result.length; i++){
    headers.push(result[i].name);  
  }  
  return headers;  
}

/**
 * Deletes a record in the Fusion Table
 *
 * @param  {String}  rowid  the ID of a Fusion table row
 */
function deleteFusionRow(rowid){  
   ftRequest_("post", "DELETE FROM "+FUSION_ID+" WHERE ROWID = '"+rowid+"'");  
}

/**
 * Used to authenticate to Fusion Tables
 * Run it twice!
 */
function doOAuth(){
  //ckProperties_();
  var method = 'get';
  var sql = "SHOW TABLES";  
  //Logger.log(ftRequest_(method,sql));
}

function ckProperties_(){
  if(ScriptProperties.getProperty('FUSION_ID') == undefined){
     ScriptProperties.setProperty('FUSION_ID', ''); 
  } 
  if(ScriptProperties.getProperty('FUSION_ID') == ''){
    throw 'Please set the ID of your Fusion Table in Script Properties'; 
  }
  if(ScriptProperties.getProperty('CLIENT_ID') == undefined){
     ScriptProperties.setProperty('CLIENT_ID', ''); 
  } 
  if(ScriptProperties.getProperty('CLIENT_ID') == ''){
    throw 'Please set the Client ID of your project in Script Properties'; 
  }
  if(ScriptProperties.getProperty('CLIENT_SECRET') == undefined){
     ScriptProperties.setProperty('CLIENT_SECRET', ''); 
  } 
  if(ScriptProperties.getProperty('CLIENT_SECRET') == ''){
    throw 'Please set the Client secret of your project in Script Properties'; 
  }
}

// We need an API key to connect to Fusion Tables
// https://code.google.com/apis/console
// Client ID for web applications (Client ID + Client secret)
var CLIENT_ID = clientId;
var CLIENT_SECRET = clientSecret;
var FUSION_ID = tableId;

/**
 * Sets the fusion ID
 * param {String} id The Fusion table ID
 * returns {String} current table ID
 */
function setFusionId(id){
alert("setting fusion");
  ScriptProperties.setProperty('FUSION_ID', id);
  alert("finish setting fusion");
  return ScriptProperties.getProperty('FUSION_ID');
}

/**
 * Sets the Client ID
 * param {String} id The Client ID
 * returns {String} Client ID
 */
function setClientId(id){
  ScriptProperties.setProperty('CLIENT_ID', id);
  return ScriptProperties.getProperty('CLIENT_ID');
}

/**
 * Sets the Client secret
 * param {String} id The Client secret
 * returns {String} Client secret
 */
function setClientSecret(id){
  ScriptProperties.setProperty('CLIENT_SECRET', id);
  return ScriptProperties.getProperty('CLIENT_SECRET');
}

/* - - - - - - - Utilities - - - - - - - */

function ftRequest_(method, query) {
  ckProperties_();
  var base = "https://www.googleapis.com/fusiontables/v1/";
  var fetchArgs = googleOAuth_();
  fetchArgs.method = method;
  if (method == 'get' && query == undefined) {
    url = base +'tables/';
  }
  else if(method == 'get' && query.search('SELECT') != -1){
    url = base+'query?sql='+query;
    fetchArgs.payload = null;
  }
  else if(method == 'get' && query != undefined){
     url = base +'tables/'+query;
  }
  else if (method == 'post') {
    url = base+'query?sql='+query;
    fetchArgs.payload = null;
  }
  var data = UrlFetchApp.fetch(url, fetchArgs).getContentText();
  var JSONOutput = Utilities.jsonParse(data);
  return JSONOutput;
}

function googleOAuth_() {
  var oAuthConfig = UrlFetchApp.addOAuthService('fusiontables');
  oAuthConfig.setRequestTokenUrl('https://www.google.com/accounts/OAuthGetRequestToken?scope=https://www.googleapis.com/auth/fusiontables');
  oAuthConfig.setAuthorizationUrl('https://www.google.com/accounts/OAuthAuthorizeToken');
  oAuthConfig.setAccessTokenUrl('https://www.google.com/accounts/OAuthGetAccessToken');
  oAuthConfig.setConsumerKey(CLIENT_ID);
  oAuthConfig.setConsumerSecret(CLIENT_SECRET);
  return {
    oAuthServiceName: 'fusiontables',
    oAuthUseToken: 'always'
  };
}

