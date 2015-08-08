function drawMouth(){
	var canvas = document.getElementById("mouthOutline");
    var ctx = canvas.getContext("2d");
    
    var path = new Path2D();
    path.moveTo(10, 50);
    path.quadraticCurveTo(100,10,150,40);
    path.quadraticCurveTo(200,10,290,50);
    path.quadraticCurveTo(150,210,10,50);
    ctx.lineWidth = 4;
   

    ctx.scale(3,3);
     ctx.stroke(path);
};

function goToChoosePicture(){
	document.getElementById("firstPage").style.display = "none";
	document.getElementById("secondPage").style.display = "block";
	drawMouth();
};

function uploadFirst(event){
	var showMouthClosed = document.getElementById("showMouthClosed");

	var files = event.target.files;
	var file;
	var fileAsDataUrl= "";
	if(files && files.length > 0){
		file = files[0];

		var fileReader = new FileReader();
		fileReader.readAsDataURL(file);
        fileReader.onload = function (event) {
            showMouthClosed.src = event.target.result;
            document.getElementById("secondPage").style.display = "none";
			document.getElementById("thirdPage").style.display = "block";
            fileAsDataUrl = event.target.result;
            try {
	         	if(fileAsDataUrl != ""){	
		        	localStorage.setItem("mouthClosed", fileAsDataUrl);
		        }else{
		        	console.log("Conversion failed");
		        }
		    }
		    catch (e) {
		        console.log("Storage failed: " + e);
		    }
        };
        
	}
};

function uploadSecond(event){
	var showMouthOpen = document.getElementById("showMouthOpen");

	var files = event.target.files;
	var file;
	var fileAsDataUrl= "";
	if(files && files.length > 0){
		file = files[0];

		var fileReader = new FileReader();
		fileReader.readAsDataURL(file);
        fileReader.onload = function (event) {
            showMouthOpen.src = event.target.result;
            document.getElementById("thirdPage").style.display = "none";
			document.getElementById("fourthPage").style.display = "block";
            fileAsDataUrl = event.target.result;
            try {
	         	if(fileAsDataUrl != ""){	
		        	localStorage.setItem("mouthOpen", fileAsDataUrl);
		        }else{
		        	console.log("Conversion failed");
		        }
		    }
		    catch (e) {
		        console.log("Storage failed: " + e);
		    }
        };
        
	}
};

function gotToPageFive(){
	document.getElementById("fourthPage").style.display = "none";
	document.getElementById("fifthPage").style.display = "block";
}

function startGame(){
	window.location.href = "gamePage.html"
};

function startTimer(){
	loadCatcher();
	dropCandy();
	var seconds = 30;
	setInterval(function(){
		if(seconds >0){
			seconds--;
			document.getElementById("gameTimer").innerHTML = seconds;
		} else if(seconds == 0){
			document.getElementById("gameContainer").display = "none";
			document.getElementById("gameOver").display = "block";
		}
	}, 1000);
};

function dropCandy(){
	var width = window.innerWidth;
	var ht = window.innerHeight;

	setInterval(function(){
		var randLeft = Math.floor(Math.random() * width);
		$("#paddle1").css("left", randLeft+"px");
		$("#paddle1").css("top", "0px");
		$("#paddle1").animate({top: ht+"px"}, 2000, "linear");
	}, 3000);

	setInterval(function(){
		var randLeft = Math.floor(Math.random() * width);
		$("#paddle2").css("left", randLeft+"px");
		$("#paddle2").css("top", "0px");
		$("#paddle2").animate({top: ht+"px"}, 1000, "linear");
	}, 2000);

	setInterval(function(){
		var randLeft = Math.floor(Math.random() * width);
		$("#paddle3").css("left", randLeft+"px");
		$("#paddle3").css("top", "0px");
		$("#paddle3").animate({top: ht+"px"}, 3000, "linear");
	}, 4000); 
};

function loadCatcher(){
	var catcher = document.getElementById("mouthCatcher");
	var mouthClosedUrl = localStorage.getItem("mouthClosed");
	var mouthOpenUrl = localStorage.getItem("mouthOpen");
	catcher.src=mouthClosedUrl;
	$("#mouthCatcher").draggable({
		stop: function(evt, ui){
			var top = ui.offset.top;
			var bottom = top+200;
			var left = ui.offset.left;
			var right = left+200;
			for(var i=1 ; i<=3 ; i++){
				var paddleLeft = parseInt($("#paddle"+i).css("left").substring(0,3) ,10);
				var paddleTop = parseInt($("#paddle"+i).css("top").substring(0,3) ,10);
				if( paddleLeft > left && paddleLeft < right
					&& paddleTop > top && paddleTop < bottom){
					var score = document.getElementById("gameScore").innerHTML;
					score = parseInt(score, 10) + 10;
					document.getElementById("gameScore").innerHTML = score;
				}
			}
		}
	});
};