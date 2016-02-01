var view = {
    displayMessage: function(msg) {
        var messageArea= document.getElementById("messageArea");
        messageArea.innerHTML=msg;
    },
    displayHit: function(location) {
        var cell=document.getElementById(location);
        cell.setAttribute("class","hit");
    },
    displayMiss: function(location) {
        var cell=document.getElementById(location);
        cell.setAttribute("class","miss");
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    
    ships: [{ locations: [0,0,0], hits: ["","",""] },
        { locations: [0,0,0], hits: ["","",""] },
        { locations: [0,0,0], hits: ["","",""] }],
    
    fire: function(guess) {
        for (var i=0; i<this.numShips; i++) {
            var ship=this.ships[i];
            var index=ship.locations.indexOf(guess);
            if (index>=0) {
                ship.hits[index]="hit";
                // TODO: only do the following if this is the first time this location has been fired at
                // otherwise, alert("You've already hit me there!");
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my ship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Haha, you missed!");
        return false;
    },
    
    isSunk: function(ship) {
        for (var i=0;i<this.shipLength;i++) {
            if (ship.hits[i]!=="hit") {
                return false;
            }
        }
        return true;
    },
    
    generateShipLocations: function() {
        var locations;
        for (var i=0; i<this.numShips; i++) {
            do {
                locations=this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    
    generateShip: function() {
        var direction = Math.floor(Math.random() *2);
        var row, col;
        if (direction===1) {
            // horizontal ship
            row=Math.floor(Math.random() * this.boardSize);
            col=Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            // vertical ship
            col=Math.floor(Math.random() * this.boardSize);
            row=Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }
        var newShipLocations=[];
        for (var i=0;i<this.shipLength; i++) {
            if (direction===1) {
                // add location to array for a horizontal ship
                newShipLocations.push(row+""+(col+i));
            } else {
                // add location to array for a vertical ship
                newShipLocations.push((row+i)+""+col);
            }
        }
        return newShipLocations;
    },
    
    collision: function(locations) {
        for (var i=0; i<this.numShips; i++) {
            var ship=model.ships[i];
            for (var j=0; j<locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >=0) {
                    return true;
                }
            }
        }
        return false;
    }
};

var controller = {
    guesses:0,
    
    processGuess: function(guess) {
        var location=parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit=model.fire(location);
            if (hit && model.shipsSunk===model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses +" guesses. :( ");
                // TODO: Disable the form, game is over. maybe make a button to start new game, which refreshes. 
            }
        }
        
    }
};

function parseGuess(guess) {
    var alphabet=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    if (guess===null || guess.length!=2) {
        alert("You're kinda dumb. Please enter a letter and a number on the board.");
    } else {
        firstChar = guess.charAt(0);
        var row=alphabet.indexOf(firstChar);
        var column=guess.charAt(1);
            
        if (isNaN(row) || isNaN(column) || row<0 || row>=model.boardSize || column<0 || column>=model.boardSize) {
            alert("That's not on the board.");
        } else {
            return row+column;
        }
    }
    return null;
}

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick=handleFireButton;
    
    var guessInput=document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    
    model.generateShipLocations();
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode===13) {
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    var guessInput=document.getElementById("guessInput");
    var guess=guessInput.value;
    controller.processGuess(guess);
    
    guessInput.value="";
}

window.onload=init;

