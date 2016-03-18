/** 
 * Frogger Game built using HTML5 Canvas.
 * @author Tim Clifford
 * @since 18/03/2016
*/

// @TODO
// Add gems to collect, messages for feedback, add lives, add levels, 
// make board larger, character selection and add some music.


// Global variables
var board_x = 505;
var board_y = 606;
var box_height = 83;
var box_width = 101;

var total_enemy = 6;

var score = 0;
var gems = 0;
var lives = 0;
var level = 1;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started.

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Set height and width for collision detection.
    this.height = box_height;
    this.width = box_width;

    // Set Enemy start position.
    this.x = this.y = this.speed = 0;
    this.setStartPosition();

    // Save previous location to use in Player collision detection
    this.previousX = this.x;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // If Enemy and Player collide, reset Player to its starting position
    if (this.collision()) {
        player.reset();
    }

    // Get Enemy's x position. Store the previous x value.
    var current_x = Math.round(this.x + (dt * this.speed));
    this.previousX = this.x;

    // Check if Enemy postion has moved off board.
    if (current_x > board_x) {
        // If so, move it to setStartPosition().
        this.setStartPosition();
    } else {
        // If enemy is still on board, update new position on current row
        this.x = current_x;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Set a random start position (1 of 3 possible rows).
Enemy.prototype.setStartPosition = function() {
    // Set a random start x position.
    this.x = this.getRandomInt(-505, -101);

    // Determine a random start row
    var rows = [69, 152, 235];
    var row = this.getRandomInt(0, 2);
    this.y = rows[row];

    // Set a random speed
    this.speed = this.getRandomInt(100, 500);
}

// Get enemy's previous location and enemy's current position.
// Get player's current position.
Enemy.prototype.collision = function() {
    // Check for collision if player and enemy are on same row.
    if (this.y == player.y) {

        // Create Enemy bounding box object.
        // This object will be passed to the intersect function
        // which determines if the boxes overlap.
        var enemyBox = {
            top: this.y,
            left: this.previousX,
            bottom: this.y + this.width,
            right: this.x + this.height
        };

        // Create Player bounding box object.
        // This object will be passed to the intersect function.
        var playerBox = {
            top: player.y,
            // Adding x + 20 to player's position to allow the enemy to
            // get closer to player for a more realistic collision.
            left: player.x + 20,
            bottom: player.y + player.height,
            right: player.x + player.width
        };

        // Check if the two boxes now intersect and therefore cause a collision.
        if (this.intersect(enemyBox, playerBox)) {
            return true;
        }
    }
    return false;
}

// Returns true if the enemy and player overlap at any point
Enemy.prototype.intersect = function(enemy, player) {
    return !(player.left > enemy.right || player.right < enemy.left ||
             player.top > enemy.bottom || player.bottom < enemy.top);
}

Enemy.prototype.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = "images/frogger.png";
    this.score = score;
    // Set height and width of player.
    this.height = 83;
    this.width = 101;

    // reset() moves the player to the starting position.
    this.x = this.y = 0;
    this.reset();
}

// Update player positioning has been moved to Player.prototype.handleInput.
// Render Player scoring and levels.
Player.prototype.update = function() {
    renderLevel();
    renderScoreboard();
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player movement. Checks for boundaries.
Player.prototype.handleInput = function(allowedKeys) {

    var x = y = 0;

    // Move left arrow.
    if (allowedKeys === 'left') {
        x = this.x - 101;
        // But don't move off far left.
        if (x >= 0) {
            this.x = x;
        }
    }

    // Move right arrow.
    if (allowedKeys === 'right') {
        x = this.x + 101;
        // But don't move off far right.
        if (x <= 404) {
            this.x = x;
        }
    }

    // Move up arrow.
    if (allowedKeys === 'up') {
        y = this.y - 83;
        // But don't move off the top of the board.
        if (y >= -14) {
            this.y = y;
        }
        // If player moved into water row 
        if (y == -14) {
            // If player reaches the water add 5 to score.
            levelComplete();
            // Then move back to starting position with a .5 delay.
            var reset = function resetDelay() {
                player.reset();
            }
            setTimeout(reset, 500);
        }
    }

    // down arrow
    if (allowedKeys === 'down') {
        y = this.y + 83;
        // Do not allow Player to move off bottom of board
        if (y <= 401) {
            this.y = y;
        }
    }
}

// Move player back to original starting position
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 401;
}

function renderScoreboard() {
    // Display Score
    ctx.clearRect(0, 0, 250, 43);
    ctx.fillStyle = 'black';
    ctx.font = '30px Impact';
    ctx.fillText("Score: " + this.score, 0, 40);
}

function renderLevel() {
    // Display Level
    ctx.font = "30px Helvetica, Arial, sans-serif";
    ctx.strokeText("Level: " + this.level, 300, 40);
}

function renderLives() {

}

// Level complete.
function levelComplete() {
    // If player reaches the water add 5 to score.
    this.score = this.score + 5;
    this.level = this.level + 1;

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies.
// Place the player object in a variable called player.

// // Set the number of enemies to display on the board.
var allEnemies = [];

// Create all enemies for game.
for (var index = 0; index < total_enemy; index++) {
    var enemyObj = new Enemy();
    allEnemies.push(enemyObj);
};

//Create player.
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});