var originalWidth, originalHeight;


function init() {
	var height = window.innerHeight;
	document.getElementById("outerContainer").style.height = height + "px";
};

function goToChoosePicture(){
	document.getElementById("firstPage").style.display = "none";
	document.getElementById("secondPage").style.display = "block";
	drawMouth();
	init();
};

function drawMouth(){
	var canvas = document.getElementById("mouthOutline");
    var ctx = canvas.getContext("2d");
    
    var path = new Path2D();
    path.moveTo(10, 50);
    path.quadraticCurveTo(100,10,150,40);
    path.quadraticCurveTo(200,10,290,50);
    path.quadraticCurveTo(150,210,10,50);
    ctx.lineWidth = 4;
     ctx.stroke(path);
};

function upload(event, imageId, pageId, buttonId){
	var showMouthClosed = document.getElementById(imageId);
	var files = event.target.files;
	var file;
	var image = new Image();
	var fileAsDataUrl= "";
	if(files && files.length > 0){
		file = files[0];
		var fileReader = new FileReader();
		fileReader.readAsDataURL(file);
        fileReader.onload = function (event) {
            showMouthClosed.src = event.target.result;
            image.src = event.target.result;
            image.onload = function(){
            	originalWidth = this.width;
            	originalHeight = this.height;
            }
            document.getElementById(pageId).style.display = "none";
			document.getElementById(buttonId).style.display = "block";
        };     
	}
};

function gotToPageFive(){
	document.getElementById("fourthPage").style.display = "none";
	document.getElementById("fifthPage").style.display = "block";
	init();
}

function goBackToChoosePicture(){
	document.getElementById("buttonCollection").style.display = "none";
	document.getElementById("secondPage").style.display = "block";
};

function cropAndSave(){
	document.getElementById("thirdPage").style.display = "block";
	saveCroppedPicture("showMouthClosed", "mouthClosedOverlay", "mouthClosedContainer", "mouthClosed");
	document.getElementById("secondPage").style.display = "none";
	document.getElementById("buttonCollection").style.display = "none";
};

function cropAndSaveSecond(){
	document.getElementById("fourthPage").style.display = "block";
	saveCroppedPicture("showMouthOpen", "mouthOpenOverlay", "mouthOpenContainer", "mouthOpen");
	document.getElementById("thirdPage").style.display = "none";
	document.getElementById("buttonCollectionOne").style.display = "none";
};

function saveCroppedPicture(imageId, overlayId, containerId, storageId){
	
	var imgTarget = document.getElementById(imageId);
	var img = $(imgTarget);

	var left=$("#"+overlayId).offset().left - $("#"+containerId).offset().left;
	var top=$("#"+overlayId).offset().top - $("#"+containerId).offset().top;
	var width = $("#"+overlayId).width();
	var height = $("#"+overlayId).height();

	var relativeLeft = left * (originalWidth / img.width());
	var relativeTop = top *(originalHeight / img.height());
	var relativeW = (originalWidth / img.width()) * width;
	var relativeHt = (originalHeight / img.height()) * height;

	var tempCanvas= document.createElement("canvas"); 
    tempCanvas.width = originalWidth ;
    tempCanvas.height = originalHeight; 
    var tempCtx = tempCanvas.getContext('2d'); 
    tempCtx.drawImage(imgTarget, 0, 0); 

    var imageData = tempCtx.getImageData(relativeLeft,relativeTop, relativeW, relativeHt);

    var newCanvas= document.createElement("canvas"); 
    newCanvas.width = relativeW ;
    newCanvas.height = relativeHt; 
    newCanvas.getContext("2d").putImageData(imageData, 0, 0);

	var cropCanvas = document.getElementById("canvas");
	cropCanvas.width = width;
	cropCanvas.height = height;

	var ctx = cropCanvas.getContext("2d");
	ctx.scale(0.1, 0.1);                    
    ctx.drawImage(newCanvas, 0, 0);


	var fileAsDataUrl = cropCanvas.toDataURL("image/jpg");
           
    try {
     	if(fileAsDataUrl != ""){	
        	localStorage.setItem(storageId, fileAsDataUrl);
        }else{
        	console.log("Conversion failed");
        }
    }
    catch (e) {
        console.log("Storage failed: " + e);
    }
};

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

