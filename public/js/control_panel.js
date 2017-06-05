 var socket = io();
 var prevID = '';
 var pollState = false;



 $('.postIDInput').on('input', function(){
  var data = $('.postIDInput').val();
  socket.emit('newPostID', data);
  return false;
});
 $('.msgInput').submit(function(){
  var data = {};
  data.msg = $('#msg').val();
  data.sec = $('.inputSeconds').val()
  data.msgStyle = $('input[name=msgPosition]').filter(':checked').val();

  console.log(data);

  socket.emit('chat message', data);
  $('#msg').val('');
  return false;
});
 socket.on('getEmojiData', function(data){
  if(data){
    if(prevID !== data.postID){
      console.log(data);
      if(data.connected){
        $('.postIDInputLabel').css("background-color", "#1CB27A");
      }else{
        $('.postIDInputLabel').css("background-color", "#D1535D");
      }

      $('.postIDInput').val(data.postID);
      $('.postIDInput').val(data.postID);

    };
    prevID = data.postID;
    $('.totalEmojiData').text("Total: - Like " + data.count.like + " - Love " + data.count.love + " - Haha " + data.count.haha);
  };
});


 $('.tickerForm').submit(function(){
  var data = {};
  data.msg = $('.tickerInput').val();
  data.name = $('.tickerInputName').val();
  socket.emit('newTick', data);
  $('.tickerInput').val('');
  $('.tickerInputName').val('');

  return false;
  

});

var facebookData = {};

 socket.on('returnSelectedComment', function(_comment){
  facebookData.selectedComment = _comment;
 });





 socket.on('fbComments', function(_comments){
  $('#commentList').html('');
  $('#commentList').val('');

  for(var i = 0; i < _comments.length; i++){
   var $comment = $('<li>').data(_comments[i]).appendTo('#commentList');
   $comment.append($('<img>').attr('src',_comments[i].from.picture.data.url));
   if(facebookData.selectedComment){
     if(facebookData.selectedComment.id === _comments[i].id){
       $comment.addClass('selectedComment')
     }
   }


   $comment.append($('<h4>').text(_comments[i].from.name));
  $comment.append($('<p>').text(_comments[i].message));


$comment.click(function() {
    socket.emit('selectedComment', $(this).data());
           $(this).addClass('selectedComment')

    console.log( $(this).data());
});
  // $comment.append($('<a>').attr('class','deleteTick').text('x'));
 }



$('.grid').masonry({
  // options...
  itemSelector: '.grid-item',
  columnWidth: 10
});

 $(".deleteTick").click(function(){
  var id = $(this).parent().attr('data');

  socket.emit('removeTick', id);
  return false;
});
 // $('#tickerList').scrollTop($('#tickerList')[0].scrollHeight);
});



 $('.pollActive').change(function(e){
  var pollData = {};
  pollData.bool = $('.pollActive').prop('checked');
  pollData.minutes = $('.pollDuration').val();

  var selectedGroupNr = $(".selectedGroup").filter(':checked').val();
  console.log(selectedGroupNr);

  pollData.nameLeft = $('.'+selectedGroupNr+'a').val();
  pollData.nameRight = $('.'+selectedGroupNr+'b').val();
  console.log(pollData);
  socket.emit('pollState', pollData);
});



var limit = 2;
var teams = {};

socket.on('initData', function(_data){
        console.log(_data)

  $('.love_checkbox').each(function () {
    for(var i = 0; i < _data.team_love.length; i++){
     if($(this).attr('value') === _data.team_love[i]){
        this.checked = true;
        console.log('true')
     }     
    }
  });

    $('.haha_checkbox').each(function () {
    for(var i = 0; i < _data.team_haha.length; i++){
     if($(this).attr('value') === _data.team_haha[i]){
        this.checked = true;
        console.log('true')
     }     
    }
  });
    teams.team_love = _data.team_love;
    teams.team_haha = _data.team_haha;
});





$('.love_checkbox').on('change', function(evt) {
  var team_love = [];
   if($(this).siblings(':checked').length >= limit) {
       this.checked = false;
   }

   $('.love_checkbox').each(function () {
     if($(this).is(':checked')){
           team_love.push($(this).attr('value'));
     }
  });

   console.log(team_love);


   teams.team_love = team_love;
   socket.emit('teams', teams);

});



$('.haha_checkbox').on('change', function(evt) {
    var team_haha = [];

   if($(this).siblings(':checked').length >= limit) {
       this.checked = false;
   }

    $('.haha_checkbox').each(function () {
     if($(this).is(':checked')){
           team_haha.push($(this).attr('value'));
     }
  });
   console.log(team_haha);

   teams.team_haha = team_haha;
   socket.emit('teams', teams);

});







$('.winLove').change(function(e){
  var winLove = {};
  winLove.bool = $('.winLove').prop('checked');
  console.log(winLove.bool);
  socket.emit('winLove', winLove);
});

$('.winHaha').change(function(e){
  var winHaha= {};
  winHaha.bool = $('.winHaha').prop('checked');
  console.log(winHaha.bool);
  socket.emit('winHaha', winHaha);
});