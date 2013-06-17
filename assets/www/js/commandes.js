	var me;
	var meName;
	
	var events;


	function initCommandes() {
		//document.ready is now in index.js

		$('.wrapper').css({left:$('span.item:first').position()['left']});
		
		$('.item').mouseover(function () {
			$('.wrapper').stop().animate({left:$(this).position()['left']}, {duration:200});
			$('.panel').stop().animate({left:$(this).position()['left'] * (-4)}, {duration:200});
		});
		
		//displayFormLogin();
		//displayFormProfile();
	}


	/*function displayFormLogin(){
		$('.login_form').empty().append('<form id="loginForm"><input class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset" type="text" id="formUsername" placeholder="e.g. mhom" /><div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="" data-iconpos="" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Go</span></span><input class="ui-btn-hidden" type="button" value="Go" onclick="javascript:findUserByUsername();"/></div></form>'); 
		$('#loginForm').attr("action","#profile") .attr("method","post");
	}*/
				

	/*function displayFormProfile(){
		$('.profile_form').empty().append('<form id="profileForm"><input class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset" type="email" id="email" placeholder="e.g. first.last@netlight.com"/><input class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"  type="tel" id="phoneNumber" placeholder="e.g. +4915211112222333"/><input type="button" value="Go" onclick="javascript:window.location = \'index.html#profile\';findUserByUsername();"/></form><input type="button" value="See All Events" onClick="javascript:window.location = \'index.html#main\';"/>'); 
		$('#profileForm').attr("action","#profile") .attr("method","post");
	}*/

	function getDateString(timestamp){
		var eventDatetime = timestamp;
		if(eventDatetime == "undefined" || eventDatetime == null || eventDatetime == ""){
			return "";
		}
		var eventDate = new Date(parseInt(eventDatetime));
		
		var eventMonth = eventDate.getMonth();
		var eventYear = eventDate.getFullYear();
		var eventDay = eventDate.getDate();
		var eventHours = eventDate.getHours();
		var eventMinutes = eventDate.getMinutes();
		
		eventDate = eventYear+"/"+eventMonth+"/"+eventDay+" "+eventHours+":"+eventMinutes;
		
		return eventDate;
	}

	function addJoinedEvents(eventID, eventName, eventLocation, eventDate) {
		var urlEvent = "javascript:PopulateEvent("+eventID+")";
		$('.joined_events').append('<li class="wrapper ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c"><a href='+urlEvent+'>' + eventName + '</a><span>'+eventLocation+'</span> - <span>'+eventDate +'</span></li>');
	}

	function addMyEvents(eventID, eventName, eventLocation, eventDate) {
		var urlEvent = "javascript:PopulateEvent("+eventID+")";
		$('.my_events').append('<li class="wrapper ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" ><a href='+urlEvent+'>' + eventName + '</a><span>'+eventLocation+'</span> - <span>'+eventDate+'</span></li>');
	}
	
	function checkEmptyMineEvents(emptyMineEvents){
		if(emptyMineEvents){
			$('.my_events').append('<li class="wrapper ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" ></li>');
		}
	}

	function checkEmptyJoinedEvents(emptyJoinedEvents){
		if(emptyJoinedEvents){
			$('.joined_events').append('<li class="wrapper ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" ></li>');
		}
	}
	
	function findMyEvents(data) {	
			//var json = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA&typed=true";
			//$.getJSON(json).done(function( data ) {
			  //  console.error("success");

				var emptyJoinedEvents = true;
				var emptyMineEvents = true;
				for(var i = 0; i < data.rows.length; i++) {
					var items = data.rows[i][3];
					var splitJoined = items.split("|");
					for(var j = 0; j < splitJoined.length; j++) {
						if(splitJoined[j] == me){
							addJoinedEvents(i ,data.rows[i][0],data.rows[i][1],getDateString(data.rows[i][2]));
							emptyJoinedEvents = false;
						}
					}		
					if(data.rows[i][4] == me){
						addMyEvents(i ,data.rows[i][0],data.rows[i][1],getDateString(data.rows[i][2]));
						emptyMineEvents = false;
					}
				}
				checkEmptyJoinedEvents(emptyJoinedEvents);
				checkEmptyMineEvents(emptyMineEvents);
			//});

	}
	
	function joinEvent(eventID) {	
		liquid.helper.oauth.getAccessToken(function(tokenObj) {
       	 	var token = tokenObj.access_token;
			var evt = events[eventID];
			var what = evt[0];
			var where = evt[1];
			var when = evt[2];

			var json = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20ROWID,%20attendees%20FROM%201ir_IZ0sBCLkCM5HxrJm3rRPWMSF09wNwnNb0YEM%20WHERE%20%20what='"+what+"' AND loc='"+where+"' AND timestamp='"+when+"'&access_token="+token;
			
			console.error("url:" + json);
			
		    $.getJSON(json).done(function( data ) {
		    		console.error("success");
					var rowid = data.rows[0][0];
					var attendees = data.rows[0][1];
					attendees_new = attendees + "|" + me;
		    		var json2 = "https://www.googleapis.com/fusiontables/v1/query?access_token="+token+"&sql=UPDATE%201ir_IZ0sBCLkCM5HxrJm3rRPWMSF09wNwnNb0YEM%20SET%20attendees='"+attendees_new+"'%20WHERE%20ROWID='"+rowid+"'";
					console.error("url:" + json2);

					$.ajax({
						  type: "POST",
						  url: json2,
						  data: {  }
						}).done(function() {
						  	console.error("success joining event");
						  	gotoMainWithRefresh();
						}).fail(function() {
		  					console.error("joining event failed");
		  					alert("Sorry, we couldn't add you to the event :(");
		  				});
  				}).fail(function() {
  					console.error("reuest failed");
		  			alert("Sorry, we couldn't add you to the event :(");
  				});
  			
		});
	}
	
	function displayEvents() {	
		liquid.helper.oauth.getAccessToken(function(tokenObj) {
       	 	var token = tokenObj.access_token;
			
			//var json = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA&typed=true"
			var json = "https://www.googleapis.com/fusiontables/v1/query?access_token="+token+"&sql=SELECT%20*%20from%201ir_IZ0sBCLkCM5HxrJm3rRPWMSF09wNwnNb0YEM&typed=true";
			console.error("url:" + json);
			
		    $.getJSON(json).done(function( data ) {
		    	console.error("success");

		    	events = data.rows;

				var item = "";
				for(var i = 0; i < data.rows.length; i++) {
					var urlEvent = "javascript:PopulateEvent("+i+")";
					item += '<li class="wrapper ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" ><a href='+urlEvent+'>' + data.rows[i][0] + '</a><span>'+data.rows[i][1]+'</span> - <span>'+data.rows[i][2]+'</span></li>';
					var itemID = i;
				}
				findMyEvents(data);
				$('.all_events').append(item);
			});
		});
	}
	

	
	
	function buildWhoJoined(userIds) {	
		var item="";
		var splitJoined = userIds.split("|");
		for(var j = 0; j < splitJoined.length; j++) { 
			displayUser(splitJoined[j]);
		}
	}
	
	function displayUser(userID) {	
		liquid.helper.oauth.getAccessToken(function(tokenObj) {
       	 	var token = tokenObj.access_token;
			var item = "";
			var json = "https://www.googleapis.com/fusiontables/v1/query?access_token="+token+"&sql=SELECT%20*%20from%201gfLO_zBIjASkgSrbII5weJwERVvFcSoNwe2Hk2w WHERE id='"+userID+"'&typed=true";
			//var json = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201E7zxhrFUQhqJA0AKdAxn2BTQ-xlUj7EBYasLw4o WHERE id="+userID+"&typed=true";
	    	$.getJSON(json).done(function(data) {	
	    		console.error("success");
	    		if (data.rows!= null && data.rows != undefined) {
					$('.event_detail').append('<p><span style="font-size: 12px; padding:50px;">' + data.rows[0][1] + ' ' +data.rows[0][2]+ '</span></p>');
				}
				else {
					$('.event_detail').append('<p><span style="font-size: 12px; padding:50px;">User ' + userID + '</span></p>');
				}
			});
		});
	}

	function findUserByUsername() {	
		var username =  $('input[id=formUsername]').val();
		liquid.helper.oauth.getAccessToken(function(tokenObj) {
       	 	var token = tokenObj.access_token;
			if(username!=null && username!=""){
			meName = username;
			var json = "https://www.googleapis.com/fusiontables/v1/query?access_token="+token+"&sql=SELECT%20*%20from%201gfLO_zBIjASkgSrbII5weJwERVvFcSoNwe2Hk2w WHERE id='"+username+"'&typed=false";
			console.error("url:" + json);
			
		    $.getJSON(json).done(function( data ) {
		    	console.error("success");
		    	if(data!=null && data.rows!=undefined){
		    		console.error("user "+data.rows[0][1]+" found");
		    		$('.prof_name').text('name: ' + data.rows[0][1] + ' ' + data.rows[0][2]);
		    		$('#prof_id').val(data.rows[0][0]);
					$('#prof_email').val(data.rows[0][3]);
					$('#prof_phone').val(data.rows[0][4]);
					$('.username_li').empty().append(data.rows[0][1]+', Please refine your profile');
					me = data.rows[0][0];
					window.location = 'index.html#profile';
				} else {
		    		console.error("user "+username+" not found");
					$('.username_li').empty().append('Sorry ' + username+', we can\'t find you in the system');
					alert('Sorry ' + username+', we can\'t find you in the system');
				}
				
				

  				}).fail(function() {
  					console.error("reuest failed");
  					alert('Sorry ' + username+', we can\'t find you in the system');
  				});
			/*setTimeout(function(){
				displayEvents(me);
				window.location = 'index.html#profile';
			},500);*/
		
			}
		});
	
	}
	function saveProfile() {	
		var username =  $('input[id=prof_id]').val();
		var email =  $('input[id=prof_email]').val();
		var phone =  $('input[id=prof_phone]').val();
		liquid.helper.oauth.getAccessToken(function(tokenObj) {
       	 	var token = tokenObj.access_token;
			if(username!=null && username!=""){

			//var json = "https://www.googleapis.com/fusiontables/v1/query?access_token="+token+"&sql=UPDATE%201gfLO_zBIjASkgSrbII5weJwERVvFcSoNwe2Hk2w%20SET%20phone='"+phone+"',%20email='"+email+"'%20WHERE%20id='"+username+"'";
			//var json = "https://www.googleapis.com/fusiontables/v1/query?access_token="+token+"&sql=SELECT%20*%20from%201gfLO_zBIjASkgSrbII5weJwERVvFcSoNwe2Hk2w WHERE id='"+username+"'&typed=false";
			var json = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20ROWID%20FROM%201gfLO_zBIjASkgSrbII5weJwERVvFcSoNwe2Hk2w%20WHERE%20%20id='"+username+"'&access_token="+token;
			
			console.error("url:" + json);
			
		    $.getJSON(json).done(function( data ) {
		    		console.error("success");
					var rowid = data.rows[0][0];
		    		var json2 = "https://www.googleapis.com/fusiontables/v1/query?access_token="+token+"&sql=UPDATE%201gfLO_zBIjASkgSrbII5weJwERVvFcSoNwe2Hk2w%20SET%20phone='"+phone+"',%20email='"+email+"'%20WHERE%20ROWID='"+rowid+"'";
					console.error("url:" + json2);

					$.ajax({
						  type: "POST",
						  url: json2,
						  data: {  }
						}).done(function() {
						  	console.error("success writing profile");
						  	gotoMainWithRefresh();
						}).fail(function() {
		  					console.error("writing profile failed");
		  					alert("Sorry, your profile could not be stored.");
		  				});
  				}).fail(function() {
  					console.error("reuest failed");
  					alert("Sorry, your profile could not be stored.");
  				});
  			}
		});
	}

	function createNewEvent() {
		var what =  $('input[id=eventTitle]').val();
		var where =  $('input[id=eventLocation]').val();
		var when =  createDateAsTimestamp($('input[id=eventDate]').val());

		if(what!=null && what!="" && where!=null && where!="" && when!=null && when!=""){

			liquid.helper.oauth.getAccessToken(function(tokenObj) {
	       	 	var token = tokenObj.access_token;
				
	    		var json = "https://www.googleapis.com/fusiontables/v1/query?access_token="+token+"&sql=INSERT%20INTO%201ir_IZ0sBCLkCM5HxrJm3rRPWMSF09wNwnNb0YEM%20(what, loc, timestamp, attendees, creator) VALUES ('"+what+"','"+where+"','"+when+"','"+me+"','"+me+"')";
				console.error("url:" + json);

				$.ajax({
					  type: "POST",
					  url: json,
					  data: {  }
					}).done(function() {
					  	console.error("success writing event");
					  	gotoSuccessScreen();
					}).fail(function() {
	  					console.error("writing event failed");
	  					alert("Sorry, your event could not be created :'(");
	  				});
			});
		} else {
			alert("Please fill out all fields.");
		}
	}

	function createDateAsTimestamp(eventDate){
		if(eventDate == "undefined" || eventDate==""){
			alert("Please enter a valid date in this format: 06/26/2013 18:30");
			return false;
		}	
		eventDateSplit = eventDate.split(" ");
		if(eventDateSplit.length<2){
			alert("Please enter a valid date in this format: 06/26/2013 18:30");
			return false;
		}
		var eventTime = eventDateSplit[1].split(":");
		if(eventTime.length<2){
			alert("Please enter a valid time in this format: 18:30");
			return false;
		}
		var eventTime = eventDateSplit[1].split(":");
		if(eventTime.length<2){
			alert("Please enter a valid time in this format: 18:30");
			return false;
		}
		eventDate = eventDate.trim();
		var timestamp = Date.parse(eventDate);
		return timestamp;
	}
	function PopulateEvent(eventParameterID) {	

	$('.event_detail').empty();
		
		//var json = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA WHERE id="+eventParameterID+"&typed=true";
		//$.getJSON(json, function (data) {	
			var evt = events[eventParameterID];
				$('.event_detail').append('<p class="stitched_title"><span>' + evt[0] + '</span></p>');
				$('.event_detail').append('<p><span class="ui-link" style="padding-top:10px;padding-left:40px;color:#A81BE0; font-weight:bold">Location: </span>' + evt[1] + '</p>');
				$('.event_detail').append('<p><span class="ui-link" style="padding-top:10px;padding-left:40px;color:#A81BE0; font-weight:bold">Date: </span>' + getDateString(evt[2]) + '</p>');
				$('.event_detail').append('<p><span class="ui-link" style="padding-top:10px;padding-left:40px;color:#A81BE0; font-weight:bold">Joined: </span></p>');
				$('.event_detail').append(buildWhoJoined(evt[3]));
				
				if (evt[3].indexOf(me) === -1){
					//$('.add_join_button').empty().append('<form id="joiningEvent"><input type="button" name="eventToJoin" onClick="javascript:joinEvent('+eventParameterID+','+me+');" value="Join Event"></div></form>'); 
					$('.add_join_button').empty().append('<form id="joiningEvent"><div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="" data-iconpos="" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Join Event</span></span><input class="ui-btn-hidden" type="button" name="eventToJoin" onClick="javascript:joinEvent('+eventParameterID+')" value="Join Event"></div></form>'); 
					
				} else if (evt[4].indexOf(me) === -1) {
					$('.add_join_button').empty().append('<h3 class="centered">You joined this event<h3>'); 
				} else {
					$('.add_join_button').empty().append('<h3 class="centered">You created this event<h3>'); 
				}
			
				/*$('.goto_all_events').empty().append('<form id="seeAllEvents"><div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="" data-iconpos="" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">All Events</span></span><input class="ui-btn-hidden" type="button" name="allevents" onClick="javascript:window.location = \'index.html#main\';" value="See All Events"></div></form>'); 
				$('#seeAllEvents') 
				.attr("action","#main") .attr("method","post");*/
		//});
		window.location = "index.html#event";
	}

	function PopulateNewEvent(eventParameterID, me) {	
		$('.thank_you_event').empty().append('');
		liquid.helper.oauth.getAccessToken(function(tokenObj) {
       	 	var token = tokenObj.access_token;
			//var json = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA WHERE id="+eventParameterID+"&typed=true";
			var json = "https://www.googleapis.com/fusiontables/v1/query?access_token="+token+"&sql=SELECT%20*%20from%201ir_IZ0sBCLkCM5HxrJm3rRPWMSF09wNwnNb0YEM WHERE id='"+username+"'&typed=false";
			$.getJSON(json, function (data) {	
				if(data.rows!=undefined){
					for(var i = 0; i < data.rows.length; i++) {
						$('.thank_you_event').append('<p style="font-size: 24px;"><span>' + data.rows[i][1] + '</span></p>');
						$('.thank_you_event').append('<p><span class="ui-link" style="padding-top:10px;padding-left:40px;color:#A81BE0; font-weight:bold">Location: </span>' + data.rows[i][2] + '</p>');
						$('.thank_you_event').append('<p><span class="ui-link" style="padding-top:10px;padding-left:40px;color:#A81BE0; font-weight:bold">Date: </span>' + data.rows[i][3] + '</p>');
						$('.thank_you_event').append('<p><span class="ui-link" style="padding-top:10px;padding-left:40px;color:#A81BE0; font-weight:bold">Joined: </span></p>');
						$('.thank_you_event').append(buildWhoJoined(data.rows[i][4]));			
					}
				} else {
					$('.thank_you_event').append('<p><span class="ui-link" style="padding-top:10px;padding-left:40px;color:#A81BE0; font-weight:bold">No event has been registered</span></p>');
				}

				if(me!=null && me!=""){			
					$('.thank_you_event').append('<form id="joiningEvent"><div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="" data-iconpos="" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Join Event</span></span><input class="ui-btn-hidden" type="button" name="eventToJoin" onClick="javascript:joinEvent('+eventParameterID+')" value="Join Event"></div></form>'); 
					$('#joiningEvent') 
					.attr("action","") .attr("method","post");
				}
				
				/*$('.thank_you_event').append('<form id="seeAllEvents"><div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="" data-iconpos="" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">All Events</span></span><input class="ui-btn-hidden" type="button" name="allevents" onClick="javascript:gotoMainWithRefresh();" value="See All Events"></div></form>'); 
				$('#seeAllEvents') 
				.attr("action","#main") .attr("method","post");	*/
			
			});
			window.location = "index.html#thanksEvent";
		});
	}	
	
	function gotoNewEvent(){
		if(me!=null && me!=""){
			window.location = 'index.html#newEvent';
		}
	}
	
	function gotoMain(){
		window.location = 'index.html#main';
	}

	function gotoMainWithRefresh(){
		window.location = 'index.html#main';
		displayEvents();
	}

	function gotoSuccessScreen(){
		window.location = 'index.html#thanksEvent';
	}

	function gotoProfile(){
		window.location = 'index.html#profile';
	}