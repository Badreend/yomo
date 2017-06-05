	var socket = io();


	var teams = {};
	var fbData = {};
	socket.on('initData',function(_data){
		teams = _data.teams; 
		fbData = _data.emojiData; 
		displayTeams(teams);
		console.log(_data);
		calcBar(fbData.typeCounter.LOVE,fbData.typeCounter.HAHA)
	});
	socket.on('syncData',function(_data){
		//teams = _data.teams;
		fbData = _data.emojiData;
		//console.log(_data);
		calcBar(fbData.typeCounter.LOVE,fbData.typeCounter.HAHA)

	});

	socket.on('getPollData', function(data){
		console.log('getPollData')
		$(".loveBar").width(data.aPer+"%");
		$(".percentageLeft").html(Math.round(data.aPer)+"%");
		$(".hahaBar").width(data.bPer+"%");
		$(".percentageRight").html(Math.round(data.bPer)+"%");
	});



	socket.on('teams',function(_data){
			//console.log(_data);
			teams.team_love = _data.team_love;
			teams.team_haha = _data.team_haha;
			displayTeams(teams);

		});


	function displayTeams(_teams){
		console.log('display_team');
		$(".team_love").empty();
		$(".team_haha").empty();
		for(var i = 0; i < _teams.team_love.length; i++){ 
			$(".team_love").append($('<img>').attr('src','img/cast_faces/wil_0.png').attr("class","team_love"+i+""));
		}
		for(var i = 0; i < _teams.team_haha.length; i++){ 
			$(".team_haha").append($('<img>').attr('src','img/cast_faces/wil_0.png').attr("class","team_haha"+i+""));
		}
	}


	socket.on('getProfile',function(_data){
		if(_data.type === "LOVE"){
			$face = ($('<img>').attr('src',_data.pic_large).attr('class','profilePic loveFace'));
			$face.delay(3000).fadeOut(800);					
			$('.loveFacesContainer').append($face);

			$(".team_love").children('img').each(function(){
				$(this).attr('src','img/cast_faces/wil_'+1+'.png');
				setTimeout(function() {
					console.log('close');
					console.log($(this));
					$(".team_love").children('img').attr('src','img/cast_faces/wil_'+0+'.png');
				}, 3000);
			});
		}else if(_data.type === "HAHA"){
			$face = $(".hahaFacesContainer").append($('<img>').attr('src',_data.pic_large).attr('class','profilePic hahaFace'));
			$face.delay(3000).fadeOut(800);					
			$('.hahaFacesContainer').append($face);

			$(".team_haha").children('img').each(function(){
				$(this).attr('src','img/cast_faces/wil_'+1+'.png');
				setTimeout(function() {
					console.log('close');
					console.log($(this));
					$(".team_haha").children('img').attr('src','img/cast_faces/wil_'+0+'.png');
				}, 3000);
			});
		}

	});

	function calcBar(_a,_b){

		var a = _a - fbData.baseline.love ;
		var b = _b - fbData.baseline.haha ;

		a+=1;
		b+=1;

		if(a <= 0){
			a = 1;
		}
		if(b <= 0){
			b = 1; 
		}

		var full = a+b;

		var per = full/100


		var aPer = a/per;
		var bPer = b/per;

		$(".loveBar").width(aPer+"%");
		$(".percentageLeft").html(Math.round(aPer)+"%");
		$(".hahaBar").width(bPer+"%");
		$(".percentageRight").html(Math.round(bPer)+"%");
	}


		socket.on('oproep',function(_data){
						$('.messages_container').empty();

			$oproep = $('<div>').attr('class',"oproep").html(_data.message);
			$oproep.delay(_data.sec*1000).fadeOut(300);

			$('.messages_container').append($oproep);
		});

		socket.on('comment',function(_data){
			$('.messages_container').empty();
			$comment = $('<div>').attr('class',"comment");
			$comment.delay(_data.sec*1000).fadeOut(300);

			$img = $('<img>').attr('src',_data.pic);
			$name = $('<h2>').html(_data.name);
			$message = $('<p>').html(_data.message);

			$comment.append($img);
			$comment.append($name);
			$comment.append($message);




			$('.messages_container').append($comment);
		});


