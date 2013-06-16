$(document).ready(function() {
    initCommandes();
	/* startApp after device ready */
	document.addEventListener("deviceready", startApp, false);
});


/**
 * Start the App
 */
function startApp() {
	var oAuth = liquid.helper.oauth;
	
    if (oAuth.isAuthorized()) {
    	console.error("oauth token there.");
    } else {
        console.error("oauth not there");
        liquid.helper.oauth.authorize(authorizeWindowChange);
        event.preventDefault();
    }
}       

function authorizeWindowChange(uriLocation) {
    //console.log("Location Changed: " + uriLocation); 
	var oAuth = liquid.helper.oauth;
	
	// oAuth process is successful!	
    if (oAuth.requestStatus == oAuth.status.SUCCESS) {
        var authCode = oAuth.authCode;
        console.error("OAUTH SUCCESS - token " + authCode);

        // have the authCode, now save the refreshToken and start Page TaskList
        oAuth.saveRefreshToken({ 
        	  	auth_code: oAuth.authCode
        	  }, function() {
        		  startPageTaskList();
        	  });
        
    } 
    else if (oAuth.requestStatus == oAuth.status.ERROR) 
    {
    	console.error("ERROR - status received = oAuth.status.ERROR");
    } 
    else {
        // do nothing, since user can be visiting different urls
    }
}


	//$.mobile.showPageLoadingMsg("a", "Loading Tasks...");
