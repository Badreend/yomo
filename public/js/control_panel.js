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



 socket.on('getTickerList', function(tickerList){
  $('#tickerList').html('');
  $('#tickerList').val('');

  for(var i = 0; i < tickerList.length; i++){
   var $tick = $('<li>').attr('data',tickerList[i].id).appendTo('#tickerList');


   $tick.append($('<img>').attr('src',tickerList[i].msg));
   $tick.append($('<h4>').text(tickerList[i].name));

   $tick.append($('<a>').attr('class','deleteTick').text('x'));
 }

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