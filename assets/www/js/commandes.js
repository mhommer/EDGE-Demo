	var me;
	var meName;
	


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
	function addJoinedEvents(eventID, eventName, eventLocation, eventDate) {
		var urlEvent = "javascript:PopulateEvent("+eventID+","+me+")";
		$('.joined_events').append('<li class="wrapper ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c"><a href='+urlEvent+'>' + eventName + '</a><span>'+eventLocation+'</span> - <span>'+eventDate+'</span></li>');
	}

	function addMyEvents(eventID, eventName, eventLocation, eventDate) {
		var urlEvent = "javascript:PopulateEvent("+eventID+","+me+")";
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
	
	function findMyEvents() {	
		$.getJSON("https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA&typed=true",
		function (data) {
			var emptyJoinedEvents = true;
			var emptyMineEvents = true;
			for(var i = 0; i < data.rows.length; i++) {
				var items = data.rows[i][4];
				var splitJoined = items.split("|");
				for(var j = 0; j < splitJoined.length; j++) {
					if(splitJoined[j] == me){
						addJoinedEvents(data.rows[i][0],data.rows[i][1],data.rows[i][2],data.rows[i][3]);
						emptyJoinedEvents = false;
					}
				}		
				if(data.rows[i][5] == me){
					addMyEvents(data.rows[i][0],data.rows[i][1],data.rows[i][2],data.rows[i][3]);
					emptyMineEvents = false;
				}
			}
			checkEmptyJoinedEvents(emptyJoinedEvents);
			checkEmptyMineEvents(emptyMineEvents);
		});

	}
	
	function joinEvent(eventId, userId) {	
		$.getJSON("https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA WHERE id="+eventId+"&typed=true",
		function (data) {
			var currentJoinedUsers = data.rows[0][4]+"|"+userId;
			$.getJSON("https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=UPDATE%201wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA SET joined="+currentJoinedUsers+" WHERE id="+eventId+"&typed=true");
		});
	}
	
	function displayEvents() {	
		$.getJSON("https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA&typed=true",
		function (data) {	
			var item = "";
			for(var i = 0; i < data.rows.length; i++) {
				var urlEvent = "javascript:PopulateEvent("+data.rows[i][0]+","+me+")";
				item += '<li class="wrapper ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" ><a href='+urlEvent+'>' + data.rows[i][1] + '</a><span>'+data.rows[i][2]+'</span> - <span>'+data.rows[i][3]+'</span></li>';
				var itemID = data.rows[i][0];
			}
			findMyEvents();
			$('.all_events').append(item);
		});
	}
	
	function PopulateEvent(eventParameterID) {	
	$('.event_detail').empty();
		var json = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA WHERE id="+eventParameterID+"&typed=true";
		$.getJSON(json, function (data) {	
			var item = "";
			for(var i = 0; i < data.rows.length; i++) {
				$('.event_detail').append('<p class="stitched_title"><span>' + data.rows[i][1] + '</span></p>');
				$('.event_detail').append('<p><span class="ui-link" style="padding-top:10px;padding-left:40px;color:#A81BE0; font-weight:bold">Location: </span>' + data.rows[i][2] + '</p>');
				$('.event_detail').append('<p><span class="ui-link" style="padding-top:10px;padding-left:40px;color:#A81BE0; font-weight:bold">Date: </span>' + data.rows[i][3] + '</p>');
				$('.event_detail').append('<p><span class="ui-link" style="padding-top:10px;padding-left:40px;color:#A81BE0; font-weight:bold">Joined: </span></p>');
				$('.event_detail').append(buildWhoJoined(data.rows[i][4]));
				
				if(me!=null && me!=""){
					$('.add_join_button').empty().append('<form id="joiningEvent"><div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="" data-iconpos="" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Join Event</span></span><input class="ui-btn-hidden" type="button" name="eventToJoin" onClick="javascript:joinEvent('+eventParameterID+','+me+')" value="Join Event"></div></form>'); 
					$('#joiningEvent') 
					.attr("action","") .attr("method","post");
				}
			
				$('.goto_all_events').empty().append('<form id="seeAllEvents"><div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="" data-iconpos="" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">All Events</span></span><input class="ui-btn-hidden" type="button" name="allevents" onClick="javascript:window.location = \'index.html#main\';" value="See All Events"></div></form>'); 
				$('#seeAllEvents') 
				.attr("action","#main") .attr("method","post");
		
			}
		});
		window.location = "index.html#event";
	}
	
	
	function buildWhoJoined(userIds) {	
		var item="";
		var splitJoined = userIds.split("|");
		for(var j = 0; j < splitJoined.length; j++) { 
		displayUser(splitJoined[j]);
		}
	}
	
	function displayUser(userID) {	
		var item = "";
		var json = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201E7zxhrFUQhqJA0AKdAxn2BTQ-xlUj7EBYasLw4o WHERE id="+userID+"&typed=true";
	    $.getJSON(json, function(data) {	
			$('.event_detail').append('<p><span style="font-size: 12px; padding:50px;">' + data.rows[0][1] + ' ' +data.rows[0][2]+ '</span></p>');
		});
	}

	function findUserByUsername() {	
		var username =  $('input[id=formUsername]').val();
		liquid.helper.oauth.getAccessToken(function(tokenObj) {
       	 	token = tokenObj.access_token;
			if(username!=null && username!=""){
			meName = username;
			//url: https://www.googleapis.com/fusiontables/v1/query?access_token=ya29.AHES6ZQzTtccqZvnY7djg3UxO7tXal3cOPm9sFElX3ZNc54B_vcpYo4&sql=SELECT%20*%20FROM%201ir_IZ0sBCLkCM5HxrJm3rRPWMSF09wNwnNb0YEM
			//var json = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201E7zxhrFUQhqJA0AKdAxn2BTQ-xlUj7EBYasLw4o WHERE username='"+username+"'&typed=false";
			var json = "https://www.googleapis.com/fusiontables/v1/query?access_token="+token+"&sql=SELECT%20*%20FROM%201gfLO_zBIjASkgSrbII5weJwERVvFcSoNwe2Hk2w";
			//var json = "https://www.googleapis.com/fusiontables/v1/tables/1gfLO_zBIjASkgSrbII5weJwERVvFcSoNwe2Hk2w?access_token="+token;
			alert("url is " + json);
			console.error("url:" + json);
			
		    $.getJSON(json, function(data) {
		    	console.error("response");
		    	alert("erg" + data.rows[0][1]);
		    	/*
				if(data!=null && data.rows!=undefined){
				$('.username_li').empty().append(data.rows[0][1]+', Please refine your profile');
				me = data.rows[0][0];
				} else {
				$('.username_li').empty().append(username+', Please register');
				}*/
			}).fail(function( jqxhr, textStatus, error ) {
  					var err = textStatus + ', ' + error;
  					console.error("Request Failed: " + err);
  				})
			.success(function( ) {
  					console.error("success");
  				});	

			setTimeout(function(){
				displayEvents(me);
				window.location = 'index.html#profile';
			},500);
		
			}
		});
	}
	function PopulateNewEvent(eventParameterID, me) {	
		$('.thank_you_event').empty().append('');
		var json = "https://www.googleapis.com/fusiontables/v1/query?key=AIzaSyBE9qhxQaFUxLpRsKl55RZ3GDPM60eXoDo&sql=SELECT%20*%20from%201wCIJey8aemcoqYleNws0AHOBLWGYCQqpKI8XKUA WHERE id="+eventParameterID+"&typed=true";
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
				$('.thank_you_event').append('<form id="joiningEvent"><div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="" data-iconpos="" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Join Event</span></span><input class="ui-btn-hidden" type="button" name="eventToJoin" onClick="javascript:joinEvent('+eventParameterID+','+me+')" value="Join Event"></div></form>'); 
				$('#joiningEvent') 
				.attr("action","") .attr("method","post");
			}
			
			$('.thank_you_event').append('<form id="seeAllEvents"><div data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-icon="" data-iconpos="" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" aria-disabled="false"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">All Events</span></span><input class="ui-btn-hidden" type="button" name="allevents" onClick="javascript:window.location = \'index.html#main\';" value="See All Events"></div></form>'); 
			$('#seeAllEvents') 
			.attr("action","#main") .attr("method","post");	
		
		});
		window.location = "index.html#thanksEvent";
	}	
	
	function gotoNewEvent(){
		if(me!=null && me!=""){
			window.location = 'index.html#newEvent';
		}
	}
	
	function gotoMain(){
		window.location = 'index.html#main';
	}


	function gotoProfile(){
		window.location = 'index.html#profile';
	}