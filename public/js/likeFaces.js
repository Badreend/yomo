		var access_token = '300916473635695|-JiAKyIwEKwBRoc7J2bjXYm2YYo'; 
		var likedShown = [];
		var counter = 0;
		var liked = [];
		var loves = [];
		var hahas = [];
		var lovesCounter = 0;
		var hahasCounter = 0;

		var postID = undefined; 
		var url = undefined;
		socket.on('getEmojiData', function(data){
			postID = data.postID;
			url = 'https://graph.facebook.com/v2.8/'+ postID + '/reactions' + '?fields=' + 'pic%2Cpic_large%2Cname%2Ctype%2Ccreated_time' + '&limit=3000' + '&access_token=' + access_token;
		});


		function getData(){
			$.getJSON(url, function(res){
				if(!res || res.error) {
				   console.log(!res ? 'error occurred' : res.error);
				   return;
				}
				loves = [];
				hahas = [];

				for(var i = 0; i < res.data.length; i++){
					if(res.data[i].type === "LOVE"){
						loves.push(res.data[i]);
					}else if(res.data[i].type === "HAHA"){
						hahas.push(res.data[i]);
					}
				};
				loves.reverse();
				hahas.reverse();

			});

		}


		function update(){
			updateLoves();
			updateHahas();
		}


		function updateLoves(){
			if(!loves[lovesCounter]){
				return;
			}else{
				console.log('tik')
				$face = $('<img>').attr('src',loves[lovesCounter].pic_large).attr('class','loveFace');
				$face.delay(4000).fadeOut(800);					
				$('.loveFacesContainer').append($face);
				lovesCounter++;
			}
		}


		function updateHahas(){


			if(!hahas[hahasCounter]){
				return;
			}else{
				$face = $('<img>').attr('src',hahas[hahasCounter].pic_large).attr('class','hahaFace');
				$face.delay(4000).fadeOut(800);					
				$('.hahaFacesContainer').append($face);
				hahasCounter++;
			}
		}
		setInterval(getData, 1000);

		setInterval(update, 1000);




		$(document).ready(function(){
			getData();
		});













