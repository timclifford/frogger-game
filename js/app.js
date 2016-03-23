/** 
 * Frogger Game built using HTML5 Canvas.
 * @author Tim Clifford
 * @since 18/03/2016
*/

// Global variables
var board_x = 1111;
var board_y = 830;
var box_height = 83;
var box_width = 101;

var totalCols = 11;
var totalRows = 9;

var total_enemy = 6;

// Starting Score and Gems
var score = 0;
var lives = 5;
var totalGem = 0;

//Starting Level
var level = 1;
var levelCompleted = false;

var gameIsOver = "false";

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

    var score = score;

    // Set Enemy start position.
    this.x = this.y = this.speed = 0;
    this.setStartPosition();

    // Save previous location to use in Player collision detection
    this.previousX = this.x;
    this.previousSpeed = this.speed;
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

// Set a random start position (1 of 6 possible rows).
Enemy.prototype.setStartPosition = function() {
    // Set a random start x position.
    this.x = this.getRandomInt(-1111, -101);

    // Determine a random start row
    var enemyRows = [69, 152, 235, 318, 401, 484];
    var randRow = this.getRandomInt(0, 5);
    this.y = enemyRows[randRow];

    // Set a random speed at start.
    var min = 100;
    var max = 500;
    this.speed = this.getRandomInt(min, max);

    //Set speed based on score.
    if (scoreRange(score, 50, 99)) {
        this.setSpeed = this.speed;
        var fasterMin = this.setSpeed += 50;
        var fasterMax = this.setSpeed += 50;
        this.speed = this.getRandomInt(fasterMin, fasterMax);
        this.setSpeed = this.speed;
        //console.log(this.setSpeed);
    } else if (scoreRange(score, 100, 499)) {
        this.setSpeed = this.speed;
        var fasterMin = this.setSpeed += 200;
        var fasterMax = this.setSpeed += 200;
        this.speed = this.getRandomInt(fasterMin, fasterMax);
        this.setSpeed = this.speed;
        //console.log(this.setSpeed);
    } else if (scoreRange(score, 500, 999)) {
        this.setSpeed = this.speed;
        var fasterMin = this.setSpeed += 100;
        var fasterMax = this.setSpeed += 500;
        this.speed = this.getRandomInt(fasterMin, fasterMax);
        this.setSpeed = this.speed;
        //console.log(this.setSpeed);
     } else if (scoreRange(score, 1000, 5000)) {
        this.setSpeed = this.speed;
        var fasterMin = this.setSpeed += 200;
        var fasterMax = this.setSpeed += 800;
        this.speed = this.getRandomInt(fasterMin, fasterMax);
        this.setSpeed = this.speed;
        //console.log(this.setSpeed);   
    } else {
        var min = 100;
        var max = 500;
        this.speed = this.getRandomInt(min, max);
    }
}

function scoreRange(x, min, max) {
  var score = this.score
  return score >= min && score <= max;
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
            var lostLive = player.lives -= 1;
            player.lives = lostLive;
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
    this.levelCompleted = false;

    // Lives
    this.lives = lives;

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
    // Check if player collides with gems. If true give the player extra points.
    if (checkObjectCollisions(player, gem)) {
        totalGem += 1;
        score += 5;
        gemPosition.apply(gem);
    }

    // Check if player collides with heart. If true give the player an extra live.
    if (checkObjectCollisions(player, life)) {
        // Call heartPosition function and apply life sprite to random position.
        this.lives += 1;
        heartPosition.apply(life);
    }

    renderLevel();
    renderLives();
    renderScoreboard();
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player movement. Checks for boundaries.
Player.prototype.handleInput = function(allowedKeys, allowedKeysWhenGameOver) {

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
        if (x <= 1101) {
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
        }
    }

    // down arrow
    if (allowedKeys === 'down') {
        y = this.y + 83;
        // Do not allow Player to move off bottom of board
        if (y <= 715) {
            this.y = y;
        }
    }

    // space
    if (allowedKeys === 'space') {
        player.reset();
    }

    if (allowedKeysWhenGameOver === 'esc') {
        resetGame();
    }

}

// Move player back to original starting position
Player.prototype.reset = function() {
    var total_x = box_width * 5; 
    var center_x = total_x;
    var total_y = box_height * totalRows;
    var start_y = total_y - 180;
    this.x = center_x;
    this.y = start_y;
}

// Gem class.

var Gem = function () {
     this.sprite = 'images/gem-blue.png';
     gemPosition.apply(this);
};

// Generate random gem position.
function gemPosition() {
    this.x = Math.floor(Math.random() * totalCols) * box_width;
    // Only load gems inside the path of the running enemy bugs.
    this.y = (Math.floor(Math.random() * (totalRows - 3)) * box_height) + 55;
};

// Unused.
Gem.prototype.update = function () {

};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Life class.
var Life = function () {
     this.sprite = 'images/heart.png';
     heartPosition.apply(life);
};

// Generate random heart position.
function heartPosition() {
    this.x = Math.floor(Math.random() * totalCols) * box_width;
    // Only load heart inside the path of the running enemy bugs.
    this.y = (Math.floor(Math.random() * (totalRows - 3)) * box_height) + 55;
};

// Unused.
Life.prototype.update = function () {

};

Life.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Check for object collisions. Takes objectA and objectB as params.
function checkObjectCollisions(objectA, objectB) {
    var playerX = Math.floor(objectA.x / box_width);
    var playerY = Math.floor(objectA.y / box_height);
    if (Array.isArray(objectB)) {
        for (var i = 0; i < objectB.length; i += 1) {
            var enemyX = Math.floor(objectB[i].x / box_width);
            var enemyY = Math.floor((objectB[i].y) / box_height);
            if (enemyX === playerX && enemyY === playerY) {
                return true;
            }
        }
    } else {
        var enemyX = Math.floor(objectB.x / box_width);
        var enemyY = Math.floor((objectB.y) / box_height);
        if (enemyX === playerX && enemyY === playerY) {
            return true;
        }
    }
}

/* Rendering */
function renderScoreboard() {
    // Display Score
    ctx.clearRect(0, 0, 250, 43);
    ctx.fillStyle = 'black';
    ctx.font = '30px Impact';
    ctx.fillText("Score: " + this.score, 0, 40);
}

function renderLevel() {
    // Display Level
    ctx.clearRect(1000, 0, 250, 43);
    ctx.font = "30px Impact, Arial, sans-serif";
    ctx.fillText("Level: " + this.level, 1000, 40);
}

function renderLives() {
    // Display Lives
    ctx.clearRect(420, 0, 100, 43);
    ctx.font = "30px Impact, Arial, sans-serif";
    ctx.fillText("Lives: " + player.lives, 420, 40);
}

function renderHeart() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Game Over.
var gameOver = function(x, y) {
    this.sprite = 'images/game_over.png';
    this.x = x;
    this.y = y;
}

// Unused.
gameOver.prototype.update = function () {

};

gameOver.prototype.render = function() {
    //Check if player has 0 lives. If they do then Game Over.
    if (player.lives === 0) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        gameOverScreen();
    }

};

function gameOverScreen() {
    //GameOverScreen
    $(".GameOverScreen").show();
    $(".hide").hide();
    gameIsOver = "true";
}

// Reset Game
function resetGame() {
    player.reset();
    player.lives = 5;
    this.score = 0;
    this.level = 1;
    //var totalGem = 0;
    gameIsOver = "false";
    $(".GameOverScreen").hide();
}

// Level complete.
function levelComplete() {

    this.levelCompleted = true;

    // If player reaches the water add 5 to score.
    this.score = this.score + 10;
    this.level = this.level + 1;

    // Then move back to starting position with a .5 delay.
    var reset = function resetDelay() {
        player.reset();
    }
    setTimeout(reset, 500);

    heartPosition.apply(life);
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

// Game Over.
var gameOverImage = 'images/game_over.png';
var gameOver = new gameOver(340, 370, gameOverImage);

// Add Gems.
var gem = new Gem();

// Add Lives.
var life = new Life();

//Create player.
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };
    var allowedKeysWhenGameOver = {
        27: 'esc'
    }
    switch (gameIsOver) {
        case "false":
            player.handleInput(allowedKeys[e.keyCode]);
            break;
        case 'true':
            player.handleInput(0, allowedKeysWhenGameOver[e.keyCode]);
            break;
        default:
            break;
    }
});