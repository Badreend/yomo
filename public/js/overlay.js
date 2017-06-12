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
		teams = _data.teams;
		fbData = _data.emojiData;
		//console.log(_data);
		calcBar(fbData.typeCounter.LOVE,fbData.typeCounter.HAHA)
		//displayTeams(teams);
	});

	socket.on('getPollData', function(data){
		console.log('getPollData')
		$(".loveBar").width(data.aPer+"%");
		$(".percentageLeft").html(Math.round(data.aPer)+"%");
		$(".hahaBar").width(data.bPer+"%");
		$(".percentageRight").html(Math.round(data.bPer)+"%");
	});



	socket.on('getTeams',function(_data){
			console.log(_data);
			console.log('getTeams');
			teams.team_love = _data.team_love;
			teams.team_haha = _data.team_haha;
			displayTeams(teams);

		});


	function displayTeams(_teams){
		console.log('tik')
		$(".team_love").empty();
		$(".team_haha").empty();
		if(_teams.team_love){
			for(var i = 0; i < _teams.team_love.length; i++){ 
				$face = $('<img>').attr('src','img/cast_faces/'+_teams.team_love[i]+'_0.png').attr("class","team_love"+i+"");
				$face.attr('name',_teams.team_love[i]);
				$(".team_love").append($face);
			}
		}
		if(_teams.team_haha){
			for(var i = 0; i < _teams.team_haha.length; i++){ 
				$face = $('<img>').attr('src','img/cast_faces/'+_teams.team_haha[i]+'_0.png').attr("class","team_haha"+i+"");
				$face.attr('name',_teams.team_haha[i]);
				$(".team_haha").append($face);			}
		}
	}


	socket.on('getProfile',function(_data){
		if(_data.type === "LOVE"){
			$emojiFace = ($('<img>').attr('src',_data.pic_large).attr('class','profilePic loveFace'));
			$emojiFace.delay(3000).fadeOut(800);					
			$('.loveFacesContainer').append($emojiFace);

			$(".team_love").children('img').each(function(){
				var name = $(this).attr('name');
				$selectedFace = $(this).attr('src','img/cast_faces/'+name+'_'+1+'.png');

				setTimeout(function() {
					$(".team_love").children('img').each(function(){
						name = $(this).attr('name');
						$(this).attr('src','img/cast_faces/'+name+'_'+0+'.png');
					});
				}, 3000);
			});
		}else if(_data.type === "HAHA"){
			$emojiFace = ($('<img>').attr('src',_data.pic_large).attr('class','profilePic hahaFace'));
			$emojiFace.delay(3000).fadeOut(800);					
			$('.hahaFacesContainer').append($emojiFace);

			$(".team_haha").children('img').each(function(){
				var name = $(this).attr('name');
				$(this).attr('src','img/cast_faces/'+name+'_'+1+'.png');
				$that = $(this);


				setTimeout(function() {
					$(".team_haha").children('img').each(function(){
						name = $(this).attr('name');
						$(this).attr('src','img/cast_faces/'+name+'_'+0+'.png');
					});
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


		// socket.on('oproep',function(_data){
		// 				$('.messages_container').empty();

		// 	$oproep = $('<div>').attr('class',"oproep").html(_data.message);
		// 	$oproep.delay(_data.sec*1000).fadeOut(300);

		// 	$('.messages_container').append($oproep);
		// });

		// socket.on('comment',function(_data){
		// 	$('.messages_container').empty();
		// 	$comment = $('<div>').attr('class',"comment");
		// 	$comment.delay(_data.sec*1000).fadeOut(300);

		// 	$img = $('<img>').attr('src',_data.pic);
		// 	$name = $('<h2>').html(_data.name);
		// 	$message = $('<p>').html(_data.message);

		// 	$comment.append($img);
		// 	$comment.append($name);
		// 	$comment.append($message);




		// 	$('.messages_container').append($comment);
		// });


