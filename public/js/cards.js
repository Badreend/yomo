var socket = io();
    window.sounds = new Object();
	var audio = new Audio('sound/plop.mp3');
	audio.load();
    window.sounds['sound/plop.mp3'] = audio;

socket.on('comment',function(_data){
	audio.play();
	$('.cards_container').empty();
	$card = $('<div>').attr('class',"card");
	$card.delay(_data.sec*1000).fadeOut(300);

	$img = $('<img>').attr('src',_data.pic);
	$name = $('<h1>').html(_data.name);
	$message = $('<p>').html(_data.message);

	$card.append($img);
	$card.append($name);
	$card.append($message);

	$('.cards_container').append($card);
});


