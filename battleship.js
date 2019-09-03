'use strict'

// set grid rows and columns and the size of each square
var rows = 10;
var cols = 10;
var squareSize = 50;

// get the container element
var gameBoardContainer = document.getElementById("gameboard");

// make the grid columns and rows
for (let i = 0; i < cols; i++) {
	for (let j = 0; j < rows; j++) {
		
		// create a new div HTML element for each grid square and make it the right size
		var square = document.createElement("div");
		gameBoardContainer.appendChild(square);

    // give each div element a unique id based on its row and column, like "s00"
		square.id = 's' + j + i;			
		
		// set each grid square's coordinates: multiples of the current row or column number
		var topPosition = j * squareSize;
		var leftPosition = i * squareSize;			
		
		// use CSS absolute positioning to place each grid square on the page
		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';						
	}
}

/* lazy way of tracking when the game is won: just increment hitCount on every hit
   in this version, and according to the official Hasbro rules (http://www.hasbro.com/common/instruct/BattleShip_(2002).PDF)
   there are 17 hits to be made in order to win the game:
      Carrier     - 5 hits
      Battleship  - 4 hits
      Destroyer   - 3 hits
      Submarine   - 3 hits
      Patrol Boat - 2 hits
*/

/* create the 2d array that will contain the status of each square on the board
   and place ships on the board (later, create function for random placement!)

   0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot
*/
var gameBoard = [
				[0,0,0,1,1,1,1,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,1,0,0,0],
				[0,0,0,0,0,0,1,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,1,1,1],
				[1,0,0,1,0,0,0,0,0,0],
				[1,0,0,1,0,0,0,0,0,0],
				[1,0,0,1,0,0,0,0,0,0],
				[1,0,0,0,0,0,0,0,0,0]
				]

var hitCount = 0;
// WE CREATE A TOTALHITS VARIABLE TO COUNT THE SHIP PARTS' TOTAL IN THE GAMEBOARD ARRAY, SO WE CAN MODIFY THE NUMBER OF SHIPS AND COUNT THEM EASILY. AFTER THAT, WHEN HITCOUNT REACHES TOTALHITS, THE GAME IS OVER. 
var totalHits = 0;
for (let i=0; i<gameBoard.length; i++){
	totalHits += gameBoard[i].filter(hit => hit == 1).length;
}


// set event listener for all elements in gameboard, run fireTorpedo function when square is clicked
gameBoardContainer.addEventListener("click", fireTorpedo, false);

// initial code via http://www.kirupa.com/html5/handling_events_for_many_elements.htm:
function fireTorpedo(e) {
    // if item clicked (e.target) is not the parent element on which the event listener was set (e.currentTarget)
	if (e.target !== e.currentTarget) {
        // extract row and column # from the HTML element's id
		var row = parseInt(e.target.id.substring(1,2));
		var col = parseInt(e.target.id.substring(2,3));
		// THIS CHANGES THE UL ELEMENT TO SHOW A LIST OF HITS SO WE CAN TRACK VISUALLY WHAT'S ALREADY DONE. 
		document.getElementById("changeText").innerHTML+=`<li>Clicked on row ${row + 1}, column ${col + 1}</li>`;
				
		// if player clicks a square with no ship, change the color and change square's value
		if (gameBoard[row][col] == 0) {
			e.target.style.background = '#7af';
			// set this square's value to 3 to indicate that they fired and missed
			gameBoard[row][col] = 3;
			
		// if player clicks a square with a ship, change the color and change square's value
		} else if (gameBoard[row][col] == 1) {
			e.target.style.background = 'red';
			// THIS CHANGES THE COLOR OF THE CURRENT LI ELEMENT TO RED WHEN WE HIT A SHIP. 
			document.getElementById("changeText").lastElementChild.style.color = 'red';
			// set this square's value to 2 to indicate the ship has been hit
			gameBoard[row][col] = 2;
			
			// increment hitCount each time a ship is hit
			hitCount++;
			// WHEN HITCOUNT EQUALS TOTALHITS, AN ALERT IS DISPLAYED (ALREADY IMPLEMENTED) WITH A SETTIMEOUT SO WE CAN SEE THE FINISHED GAME, AND A CONFIRM MESSAGE ASKING IF WE WANT TO PLAY AGAIN, WHICH RELOADS THE PAGE (AND THE GAME) IF THE ASWER IS TRUE. 
			if (hitCount == totalHits) {
				setTimeout(function() { alert("All enemy battleships have been defeated! You win!"); }, 1);
				setTimeout(function() { 
					var reset = confirm("Do you want to play again?");
					if (reset){
						location.reload();
					}
				}, 2);
			}
			
		// if player clicks a square that's been previously hit, let them know
		} else if (gameBoard[row][col] > 1) {
			alert("Stop wasting your torpedos! You already fired at this location.");
		}		
    }
    e.stopPropagation();
}
