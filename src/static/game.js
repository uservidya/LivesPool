function load_balls() {
	var ballsInPlay = {
		"placeholder" : false,
		"ball-one" : false,
		"ball-two" : false,
		"ball-three" : false,
		"ball-four" : false,
		"ball-five" : false,
		"ball-six" : false,
		"ball-seven" : false,
		"ball-eight" : false,
		"ball-nine" : false,
		"ball-ten" : false,
		"ball-eleven" : false,
		"ball-twelve" : false,
		"ball-thirteen" : false,
		"ball-fourteen" : false,
		"ball-fifteen" : false
	};
	
	var indexToId = [
		"placeholder",
		"ball-one",
		"ball-two",
		"ball-three",
		"ball-four",
		"ball-five",
		"ball-six",
		"ball-seven",
		"ball-eight",
		"ball-nine",
		"ball-ten",
		"ball-eleven",
		"ball-twelve",
		"ball-thirteen",
		"ball-fourteen",
		"ball-fifteen"
	];

	$.ajax({
        url: "/api/game/ballsontable",
        success: function(data) {
            $.each(data["data"], function(index, value) {
            	ballsInPlay[indexToId[value]] = true;
            });
	        $.each(ballsInPlay, function(index, value) {
		   		if(value) {
		   			$("#" + index).css("opacity", 1);
		   		}
		   		else {
		   			$("#" + index).css("opacity", 0.3);
		   		}
	   		});
    	}
	});


   setTimeout(load_balls, 5000);
   return ballsInPlay;
}

function toggle_ball(id) {
	var idToBall = {
		"ball-one" : 1,
		"ball-two" : 2,
		"ball-three" : 3,
		"ball-four" : 4,
		"ball-five" : 5,
		"ball-six" : 6,
		"ball-seven" : 7,
		"ball-eight" : 8,
		"ball-nine" : 9,
		"ball-ten" : 10,
		"ball-eleven" : 11,
		"ball-twelve" : 12,
		"ball-thirteen" : 13,
		"ball-fourteen" : 14,
		"ball-fifteen" : 15
	};
	
	var num = idToBall[id];
	
	$.ajax({
		type: "POST",
		url: "/api/game/toggleball",
		data: JSON.stringify({ball: num}),
		success: function() {
			console.log("Successful POST: ball #" + num);
		}
	});
}

function on_click_ball(ballsInPlay) {
	$('div.poolball').click(function() {
		var id = $(this).attr('id');
		if(ballsInPlay[id]) {
			$(this).fadeTo(700, 0.3);
			ballsInPlay[id] = false;
			toggle_ball(id);
		}
		else {
			$(this).fadeTo(700, 1);
			ballsInPlay[id] = true;
			toggle_ball(id);
		}	
	});
}

$(document).ready(function() {
	var ballsInPlay = load_balls();
	on_click_ball(ballsInPlay);
	//load_players("#game_list");
});
