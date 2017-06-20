 var socket = io();
 var prevID = '';
 var pollState = false;



 $('.postIDInput').on('input', function(){
  var data = $('.postIDInput').val();
  socket.emit('newPostID', data);
  return false;
});



//  $('.msgInput').submit(function(){
//   var data = {};
//   data.msg = $('#msg').val();
//   data.sec = $('.inputSeconds').val()
//   data.msgStyle = $('input[name=msgPosition]').filter(':checked').val();

//   console.log(data);

//   socket.emit('chat message', data);
//   $('#msg').val('');
//   return false;
// });
//  socket.on('getEmojiData', function(data){

// });




var facebookData = {};

socket.on('returnSelectedComment', function(_comment){
  facebookData.selectedComment = _comment;
});



$('.oproep_submit').click(function(){
  var data = {};
  data.message = $('.oproep_message').val();
  console.log($('.oproep_message').val());
  data.sec = $('.oproep_sec').val();
  console.log(data);
  $('.oproep_message').val('');
  socket.emit('oproep', data);
  return false;
});


$('.comment_submit_live').click(function(){
  var data = {};
  data.name = facebookData.selectedComment.from.name;
  data.pic = facebookData.selectedComment.from.picture.data.url;
  data.message = facebookData.selectedComment.message;
  data.sec = $('.comment_sec_live').val();
  socket.emit('comment', data);
  console.log(data);
  return false;
});
$('.comment_submit').click(function(){
  var data = {};
  data.name = $('.comment_name').val();
  data.pic = $('.comment_pic').val();
  data.message = $('.comment_message').val();
  data.sec = $('.comment_sec').val();
  socket.emit('comment', data);
  console.log(data);
  $('.comment_name').val('');
  $('.comment_pic').val('');
  $('.comment_message').val('');
  return false;
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

//quick fix


var initTimer = 0;

$('.timerSwitch').change(function(e){
  if(initTimer > 0){
      var data = {};
      data.bool = $('.timerSwitch').prop('checked');
      console.log(data)
      socket.emit('timer', data);
  }
  initTimer++;

});




var limit = 3;
var teams = {};

socket.on('initData', function(_data){
  if(_data.timer.bool){
      $('.timerSwitch').bootstrapToggle('on')
  }else{
      $('.timerSwitch').bootstrapToggle('off')
  }


  var data = _data.teams;

  if(data.team_love){
        $('.love_checkbox').each(function () {
          for(var i = 0; i < data.team_love.length; i++){
           if($(this).attr('value') === data.team_love[i]){
            this.checked = true;
            console.log('true')
          }     
        }
      });
  }
  if(data.team_haha){
      $('.haha_checkbox').each(function () {
        for(var i = 0; i < data.team_haha.length; i++){
         if($(this).attr('value') === data.team_haha[i]){
          this.checked = true;
          console.log('true')
        }     
      }
    });
  }


  teams.team_love = data.team_love;
  teams.team_haha = data.team_haha;
  console.log('-----');
  console.log(teams);
  console.log('-----');

  console.log(_data.emojiData.connected);

  if(_data.emojiData.connected){
    $('.postIDInput').css("background-color", "#1CB27A");
  }else{
    $('.postIDInput').css("background-color", "#D1535D");
  }

  $('.postIDInput').val(_data.emojiData.postID);
  $('.totalEmojiData').text("Total: - Like " + _data.emojiData.typeCounter.LIKE + " - Love " + _data.emojiData.typeCounter.LOVE + " - Haha " + _data.emojiData.typeCounter.HAHA);
});


socket.on('syncData', function(_data){
  if(_data.emojiData.connected){
    $('.postIDInput').css("background-color", "#1CB27A");
  }else{
    $('.postIDInput').css("background-color", "#D1535D");
  }
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



 teams.team_love = team_love;
 socket.emit('teams', teams);
 console.log(teams);

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

 teams.team_haha = team_haha;

 socket.emit('teams', teams);
 console.log(teams);

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