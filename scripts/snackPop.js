var originalWidth, originalHeight;
var x = 0,
    y = 0;
var vx = 0,
    vy = 0;
var ax = 0,
    ay = 0;

/*function to initialize the client height*/
function init() {
    var height = window.innerHeight;
    document.getElementById("outerContainer").style.height = height + "px";
};

function goToChoosePicture() {
    document.getElementById("firstPage").style.display = "none";
    document.getElementById("secondPage").style.display = "block";
    drawMouth();
};


/*function to render the mouth shape on the HTML 5 canvas*/
function drawMouth() {
    var canvas = document.getElementById("mouthOutline");
    var ctx = canvas.getContext("2d");

    var path = new Path2D();
    path.moveTo(10, 50);
    path.quadraticCurveTo(100, 10, 150, 40);
    path.quadraticCurveTo(200, 10, 290, 50);
    path.quadraticCurveTo(150, 210, 10, 50);
    ctx.lineWidth = 4;
    ctx.stroke(path);
};

/*function to upload the image*/
function upload(event, imageId, pageId, buttonId) {
    var showMouthClosed = document.getElementById(imageId);
    var files = event.target.files;
    var file;
    var image = new Image();
    var fileAsDataUrl = "";
    if (files && files.length > 0) {
        file = files[0];
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function(event) {
            showMouthClosed.src = event.target.result;
            image.src = event.target.result;
            image.onload = function() {
                originalWidth = this.width;
                originalHeight = this.height;
            }
            document.getElementById(pageId).style.display = "none";
            document.getElementById(buttonId).style.display = "block";
            $("#mouthClosedOverlay").draggable({
                stop: function(evt, ui) {
                    var top = ui.offset.top;
                    var bottom = top + 200;
                    var left = ui.offset.left;
                    var right = left + 200;
                    for (var i = 1; i <= 3; i++) {
                        var paddleLeft = parseInt($("#paddle" + i).css("left").substring(0, 3), 10);
                        var paddleTop = parseInt($("#paddle" + i).css("top").substring(0, 3), 10);
                        if (paddleLeft > left && paddleLeft < right && paddleTop > top && paddleTop < bottom) {
                            var score = document.getElementById("gameScore").innerHTML;
                            score = parseInt(score, 10) + 10;
                            document.getElementById("gameScore").innerHTML = score;
                            catcher.src = mouthOpenUrl;
                            setTimeout(function() {
                                catcher.src = mouthClosedUrl;
                            }, 400);
                        }
                    }
                }
            });
        };
    }
};

function gotToPageFive() {
    document.getElementById("fourthPage").style.display = "none";
    document.getElementById("fifthPage").style.display = "block";
}

function goBackToChoosePicture() {
    document.getElementById("buttonCollection").style.display = "none";
    document.getElementById("secondPage").style.display = "block";
};

function goBackToChoosePictureOne() {
    document.getElementById("buttonCollectionOne").style.display = "none";
    document.getElementById("thirdPage").style.display = "block";
};

function cropAndSave() {
    document.getElementById("thirdPage").style.display = "block";
    saveCroppedPicture("showMouthClosed", "mouthClosedOverlay", "mouthClosedContainer", "mouthClosed", "canvas");
    document.getElementById("secondPage").style.display = "none";
    document.getElementById("buttonCollection").style.display = "none";
};

function cropAndSaveSecond() {
    document.getElementById("fourthPage").style.display = "block";
    saveCroppedPicture("showMouthOpen", "mouthOpenOverlay", "mouthOpenContainer", "mouthOpen", "canvasOne");
    document.getElementById("thirdPage").style.display = "none";
    document.getElementById("buttonCollectionOne").style.display = "none";
};

//function to save the cropped picture into the local storage

function saveCroppedPicture(imageId, overlayId, containerId, storageId, canvasId) {

    var imgTarget = document.getElementById(imageId);
    var img = $(imgTarget);

    var left = $("#" + overlayId).offset().left - $("#" + containerId).offset().left;
    var top = $("#" + overlayId).offset().top - $("#" + containerId).offset().top;
    var width = $("#" + overlayId).width();
    var height = $("#" + overlayId).height();

    var relativeLeft = left * (originalWidth / img.width());
    var relativeTop = top * (originalHeight / img.height());
    var relativeW = (originalWidth / img.width()) * width;
    var relativeHt = (originalHeight / img.height()) * height;

    var tempCanvas = document.createElement("canvas");
    tempCanvas.width = originalWidth;
    tempCanvas.height = originalHeight;
    var tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(imgTarget, 0, 0);

    var imageData = tempCtx.getImageData(relativeLeft, relativeTop, relativeW, relativeHt);

    var newCanvas = document.createElement("canvas");
    newCanvas.width = relativeW;
    newCanvas.height = relativeHt;
    newCanvas.getContext("2d").putImageData(imageData, 0, 0);

    var cropCanvas = document.getElementById(canvasId);
    cropCanvas.width = width;
    cropCanvas.height = height;

    var ctx = cropCanvas.getContext("2d");
    ctx.scale(0.1, 0.1);
    ctx.drawImage(newCanvas, 0, 0);


    var fileAsDataUrl = cropCanvas.toDataURL("image/jpg");

    try {
        if (fileAsDataUrl != "") {
            localStorage.setItem(storageId, fileAsDataUrl);
        } else {
            console.log("Conversion failed");
        }
    } catch (e) {
        console.log("Storage failed: " + e);
    }
};

function startGame() {
    window.location.href = "gamePage.html";

};


function startTimer() {
    init();
    loadCatcher();
    dropCandy();
    var seconds = 30;
    setInterval(function() {
        if (seconds > 0) {
            seconds--;
            document.getElementById("gameTimer").innerHTML = seconds;
        } else if (seconds == 0) {
            document.getElementById("gameContainer").style.display = "none";
            document.getElementById("gameOver").style.display = "block";
            var score = document.getElementById("gameScore").innerHTML;
            document.getElementById("finalScore").innerHTML = score;

        }
    }, 1000);
};

function dropCandy() {
    var width = window.innerWidth;
    var ht = window.innerHeight;

    setInterval(function() {
        var randLeft = Math.floor(Math.random() * width);
        $("#paddle1").css("left", randLeft + "px");
        $("#paddle1").css("top", "0px");
        $("#paddle1").animate({
            top: ht + "px"
        }, 2000, "linear");
    }, 3000);

    setInterval(function() {
        var randLeft = Math.floor(Math.random() * width);
        $("#paddle2").css("left", randLeft + "px");
        $("#paddle2").css("top", "0px");
        $("#paddle2").animate({
            top: ht + "px"
        }, 1000, "linear");
    }, 2000);

    setInterval(function() {
        var randLeft = Math.floor(Math.random() * width);
        $("#paddle3").css("left", randLeft + "px");
        $("#paddle3").css("top", "0px");
        $("#paddle3").animate({
            top: ht + "px"
        }, 3000, "linear");
    }, 4000);
};

function loadCatcher() {
    var catcher = document.getElementById("mouthCatcher");
    var mouthClosedUrl = localStorage.getItem("mouthClosed");
    var mouthOpenUrl = localStorage.getItem("mouthOpen");
    catcher.src = mouthOpenUrl;

    $("#mouthCatcher").draggable({
        stop: function(evt, ui) {
            var top = ui.offset.top;
            var bottom = top + 200;
            var left = ui.offset.left;
            var right = left + 200;
            for (var i = 1; i <= 3; i++) {
                var paddleLeft = parseInt($("#paddle" + i).css("left").substring(0, 3), 10);
                var paddleTop = parseInt($("#paddle" + i).css("top").substring(0, 3), 10);
                if (paddleLeft > left && paddleLeft < right && paddleTop > top && paddleTop < bottom) {
                	$("#paddle" + i).css("top") = "0px;"
                    var score = document.getElementById("gameScore").innerHTML;
                    score = parseInt(score, 10) + 10;
                    document.getElementById("gameScore").innerHTML = score;
                    catcher.src=mouthOpenUrl;
					setTimeout(function(){
						catcher.src=mouthClosedUrl;
					},400);
                }
            }
        }
    });

    if (window.DeviceMotionEvent) {
        window.ondevicemotion = function(event) {
            ax = event.accelerationIncludingGravity.x * 5;
            ay = event.accelerationIncludingGravity.y * 5;
        }

        setInterval(function() {
            vx = vx + ax;
            vy = vy - ay;

            vx = vx * 0.98;
            vy = vy * 0.98;

            y = parseInt(y + vy / 50);
            x = parseInt(x + vx / 50);

            checkForBounds();

            document.getElementById("mouthCatcher").style.top = y + "px";
            document.getElementById("mouthCatcher").style.left = x + "px";

        }, 25);
    }

};




function checkForBounds() {
    if (x < 0) {
        x = 0;
        vx = -vx;
    }

    if (y < 0) {
        y = 0;
        vy = -vy;
    }

    if (x > document.documentElement.clientWidth - 20) {
        x = document.documentElement.clientWidth - 50;
        vx = -vx / 2;
    }
    if (y > document.documentElement.clientHeight - 20) {
        y = document.documentElement.clientHeight - 20;
        vy = -vy / 2;
    }
};