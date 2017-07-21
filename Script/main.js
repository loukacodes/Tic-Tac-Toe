/*================================================
Classic TIC TAC TOE game built with vanilla JS
using miniMax algorithm based on this
https://www.youtube.com/watch?v=aWhb9dr1jNw&t=1604s
tutorial. Thank you KPkiller1671.

FRONT END DEVELOPMENT PROJECT on Freecodecamp.com
==================================================*/

var tiles = document.getElementsByClassName("tile");
var resetButton = document.getElementById("resetButton");
var message = document.getElementById("message");
var state = [0,0,0,0,0,0,0,0,0]; //all tiles are empty at initial state
var game = true;
var HUMAN = false;
var COMPUTER = true;
var humanValue = -1;
var computerValue = 1;
var winChances = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
var char; // X or O

window.onload = function() {
	for(var i = 0; i < tiles.length; i++) {
		var tile = tiles[i];
		tile.addEventListener("click", function() {return press(this);}, false);
	}
}

function reset() {
	for (var i = 0; i < 9; i++) {
		tiles[i].style.background = "#F1FAEE";
		tiles[i].innerText = "";
		state[i] = 0;
	}
	setMessage("");
	game = true;
}

function press(clicked) {
	if (!game) //if game is over (false), do nothing
		return;

	for (var i = 0; i < 9; i++) { //loop all tiles and check if it was the tile we've clicked and if it's empty
		if(tiles[i] == clicked && state[i] === 0) {
			set(i, HUMAN); //if yes, set value for that tile and then call the computer move
			callAI();
		}
	}
}

function chooseCharacter(clicked) {
	reset();
	char = clicked.id;
	if (char === "x") {
		document.getElementById("x").classList.add("activex");
		document.getElementById("o").classList.remove("activeo");
	} else {
		document.getElementById("o").classList.add("activeo");
		document.getElementById("x").classList.remove("activex");
	}
}

function setMessage(msg) {
	message.innerText = msg;
}

function set(index, player) {
	if (!game)
		return;

	if (char == undefined) {
		setMessage("Please choose X or O");
		return;
	}

	if (state[index] === 0) {

		if (player === HUMAN) {
			tiles[index].style.textShadow = "-1px -1px 10px #E63946, 1px -1px 10px #E63946, -1px 1px 10px #E63946, 1px 1px 10px #E63946, 0 0 10px #E63946";
			tiles[index].innerText = char;
			state[index] = humanValue;
		} else {
			tiles[index].style.textShadow = "-1px -1px 10px #457B9D, 1px -1px 10px #457B9D, -1px 1px 10px #457B9D, 1px 1px 10px #457B9D, 0 0 10px #457B9D";
			tiles[index].innerText = char == "o" ? "x" : "o";
			state[index] = computerValue;
		}

		if (checkWin(state, player)) {
			game = false;
			setMessage(player ? "COMPUTER WINS!" : "I CAN'T BELIEVE IT! YOU ARE SO TALENTEDDD");
		} else {
			if(checkFull(state)) {
				setMessage("It was a DRAW!");
				setTimeout(reset, 3000);
			}
		}

	}
}

function checkWin(board, player) {
	//return humanValue is current player is human and vice versa
	var value = player === HUMAN ? humanValue : computerValue;

	for (var i = 0; i < 8; i++) { //loop through all 8 win chances
		var win = true;

		for (var j = 0; j < 3; j++) {
			if (board[winChances[i][j]] != value) {
				win = false;
				break;
			}
		}

		if (win)
			return true;
	}
	return false;
}

function checkFull(board) {
	for (var i = 0; i < 9; i++) {
		if (board[i] === 0)
			return false;
	}
	return true; //if none of the tiles empty, board is full
}


function callAI() {
	computerBestMove(state, 0, COMPUTER)
}

function computerBestMove(board, depth, player) {
	if (checkWin(board, !player))
		return -10 + depth;

	if (checkFull(board))
		return 0;

	var value = player == HUMAN ? humanValue : computerValue;
	var max = -Infinity;
	var index = 0;

	for (var i = 0; i < 9; i++) {
		if (board[i] === 0) {
			var newboard = board.slice();
			newboard[i] = value;

			var moveval = -computerBestMove(newboard, 1+depth, !player);

			if (moveval > max) {
				max = moveval;
				index = i;
			}
		}
	}

	if (depth === 0) {
		set(index, COMPUTER)
	}

	return max
}
