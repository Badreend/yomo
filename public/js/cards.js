Howler.mobileAutoEnable = true;

console.log('init')

var sound = new Howl({
	src: ['sound/plop.mp3']
});

var socket = io();

socket.on('comment',function(_data){

	$card = $('<li>').attr('class',"card");



	$img = $('<img>').attr('src',_data.pic);
	$name = $('<h1>').html(_data.name);
	$message = $('<p>').html(_data.message);

	$card.append($img);
	$card.append($name);
	$card.append($message);

	$card.on('swipe',function(){

		$(this).fadeOut(500,function(){
			$(this).remove();
		});
	});

	$('.cards_container').append($card);
});




socket.on('timer',function(_data){
	if(_data.bool){
		console.log('timer');
		var now = new Date();
		now.setMinutes(now.getMinutes() + 20);
		$('.timer').countdown(now, function(event) {
			$(this).html(event.strftime('%M:%S'));
		});	
	}else{
		$('.timer').countdown(new Date(), function(event) {
			$(this).html(event.strftime('%M:%S'));
		});			}

	})