	var socket = io();


	var teams = {};

	socket.on('initData',function(_data){
		teams = _data; 
		console.log(_data);
		displayTeams(teams);
	});


	socket.on('getPollData', function(data){
		console.log('getPollData')
		$(".loveBar").width(data.aPer+"%");
		$(".percentageLeft").html(Math.round(data.aPer)+"%");
		$(".hahaBar").width(data.bPer+"%");
		$(".percentageRight").html(Math.round(data.bPer)+"%");
	});



		socket.on('teams',function(_data){
			console.log(_data);
			teams.team_love = _data.team_love;
			teams.team_haha = _data.team_haha;
		});


	function displayTeams(){
		$(".team_love").append($('<img>').attr('src','img/cast_faces/wil_0.png').attr("class","team_love0"));
		$(".team_love").append($('<img>').attr('src','img/cast_faces/wil_0.png').attr("class","team_love1"));
		

		$(".team_haha").append($('<img>').attr('src','img/cast_faces/wil_0.png').attr("class","team_haha0"));
		$(".team_haha").append($('<img>').attr('src','img/cast_faces/wil_0.png').attr("class","team_haha1"));
	}


