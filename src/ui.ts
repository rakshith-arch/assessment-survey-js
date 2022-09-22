//functions to show/hide the different containers
const landingcont = document.getElementById("landwrap");
const gamecont = document.getElementById("gamewrap");
const endcont = document.getElementById("endwrap");

function showlanding(){
	landingcont.style.display = "block";
	gamecont.style.display = "none";
	endcont.style.display = "none";
}

function showgame(){
	landingcont.style.display = "none";
	gamecont.style.display = "block";
	endcont.style.display = "none";
}

function showend(){
	landingcont.style.display = "none";
	gamecont.style.display = "none";
	endcont.style.display = "block";
}

//add button listeners

document.getElementById("b1").addEventListener("click", function() {
	buttonpress(1);
});

document.getElementById("b2").addEventListener("click", function() {
	buttonpress(2);
});

document.getElementById("b3").addEventListener("click", function() {
	buttonpress(3);
});

document.getElementById("b4").addEventListener("click", function() {
	buttonpress(4);
});


function buttonpress(num: number){
	console.log(num);
}
