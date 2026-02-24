/// main method! TODO: DG
var

/**
 * Game objects
 */
display,
inputKey,

frames,
spFrame,
lvFrame,
level,

alSprite,
taSprite,
ciSprite,

aliens,
alienDirection,

tank,
bullets,
cities;

var levelUp = false;
var score;
var lives;

var explosions;
var expSpriteContainer;

var exSprite;

var img;
var imgExpl;
var soundFx;

var sound = true;
var soundToggled = false;

var backgroundMovementSpeed = 1;
var backgroundMovementYAxis = -400;
var backgroundImage;

var canvasX;
var canvasY;

var gameOver = false;
var hitDetected = false;
var newgameToggled = false;

var lifeIcon;


// Main method, first to run
window.addEventListener('load', function () {

    canvasX = 700;
    canvasY = 908;

    // create game canvas
    display = new AliensCanvas(canvasX, canvasY);

    // insatntiate input handler
    inputKey = new InputKeyHandler();

    level = 1; //!!
    lvFrame = 60; // the less the faster? fps? hmm...
    score = 0;
    lives = 3;

    createSprites();

    ///alert("load method called!");
});

function createSprites() {

    soundFx = {
        shoot: new Howl({
            urls: ["sounds/shoot.ogg", "sounds/shoot.mp3"],
            //volume: .14
            volume: .02
        }),
        explosion: new Howl({
            urls: ["sounds/explosion.ogg", "sounds/explosion.mp3"],
            volume: .08
        }),
        background: new Howl({
            urls: ["sounds/stellardrone_endeavour.ogg", "sounds/stellardrone_endeavour.mp3"],
            loop: !0,
            buffer: !0,  
            volume: .9 // .7
        })
    };


    // Set the background image
    backgroundImage = new Image();
    backgroundImage.src = "resource/bglong.png";///bg.png"


    lifeIcon = new Image();
    lifeIcon.addEventListener("load", function () {
       /// alert("loaded");
    }, false);
    lifeIcon.src = "resource/life.png";///bg.png"


    /// --  v.shoot.play()

    imgExpl = new Image();
    imgExpl.addEventListener("load", function () {
        /// alert("loaded");
    }, false);
    imgExpl.src = "resource/explosion2.png";

    // create all sprites fram assets image
    img = new Image(); // var img
    img.addEventListener("load", function () {


        /*
        X = 0 Y = 1
        Width = 53 Height = 52
        Generated style

        X = 0 Y = 51
Width = 56 Height = 53
Generated style
        */

        // Create alien sprites in their two forms.
        alSprite = [];
        for (var i = 0, len = 10; i < len; i++) {
            alSprite.push([new Sprite(this, i * 40, 0, 40, 40), new Sprite(this, i * 40, 40, 40, 40)]);
        }

        taSprite = new Sprite(this, 365, 85, 40, 50); // tank sprite (shooter)

        /// taSprite = new Sprite(this, 0, 34, 15, 15); 
        /// taSprite = new Sprite(this, 15, 34, 15, 15); 
        /// taSprite = new Sprite(this, 30, 34, 15, 15); 
        /// taSprite = new Sprite(this, 45, 34, 15, 15); 
        /// taSprite = new Sprite(this, 60, 34, 15, 15); 
        /// taSprite = new Sprite(this, 75, 34, 15, 15);
        ///taSprite = new Sprite(this, 90, 34, 15, 15);
        //taSprite = new Sprite(this, 105, 34, 15, 15);

        /*
        var expSpriteArr = [
            [new Sprite(this, 0, 34, 15, 15), new Sprite(this, 15, 34, 15, 15)],
            [new Sprite(this, 30, 34, 15, 15), new Sprite(this, 45, 34, 15, 15)],
            [new Sprite(this, 60, 34, 15, 15), new Sprite(this, 75, 34, 15, 15)],
            [new Sprite(this, 90, 34, 15, 15), new Sprite(this, 105, 34, 15, 15)]
        ];*/
        ///ciSprite = new Sprite(this, 84, 8, 36, 24); // city sprites (disabled)

        // initate and run the game
        init();
        run();
    });
    // When image is loaded, the handler will fire, if image not found it will fail.
    img.src = "resource/FINAL3.png";

    if (sound) {
        //soundFx.background.play();
    }

}

/**
 * Initate game objects, creates the objects (in numbers) and puts them in arrays etc but does not visualise them..

 * TODO: hmm... put this in the main method perhaps?? - YES
 */
function init() {

    console.log("playing at level: " + level + " with framerate: " + lvFrame);

    // set start settings
    frames  = 0;
    spFrame = 0;


    alienDirection = 1; // init direction to the right

    var spacing = 70;

    // create the tank object
    // width and height are required for the intersection calculation.
    tank = {
        sprite: taSprite,
        x: (display.width - taSprite.w) / 2,
        y: display.height - (spacing + taSprite.h),

        w: taSprite.w,
        h: taSprite.h // imp for intersection
    };

    // initatie bullet array
    bullets = [];

    // create and populate alien array
    aliens = [];

    explosions = [];

    // TODO: Study this better
    var rows = [1, 0, 0, 2, 1]; // 1 row with type 2 of alien, 2 rows with type 1, etc.

    // var rows = [4];

    //var rows = [1, 0, 0, 2];

    for (var i = 0, len = rows.length; i < len; i++) {
        for (var j = 0; j < 8; j++) { // 10
         
            var a = rows[i];
            // create right offseted alien and push to alien
            // array


            // push in array an object with the sprite object and unique coordinates generated by loop.
            aliens.push({
                sprite: alSprite[a],
                x: 50 + j * spacing + [0, 4, 0][a],
                y: 50 + i * spacing,
                w: alSprite[a][0].w,
                h: alSprite[a][0].h
            });
        }

        ///alert(aliens);
    }

    removeWorld(level);

    levelUp = false; // continue game loops
};

/**
** THE GAME LOOP!!! ** 

 * Wrapper around the game loop function, updates and renders
 * the game
 */
function run() {
    var loop = function () {
        update();
        render();

        window.requestAnimationFrame(loop, display.canvas);
    };
    window.requestAnimationFrame(loop, display.canvas);
};


/**
 * Update the game logic
 */
function update() {
    movementLogic();

    if (gameOver) {
        return;
    }

    // update the frame count // TODO: WHY???
    frames++; // This is to make animations based on odd/even frame. Such as the aliens movement.

    //**** TODO ***//

    bulletLogic();

    alienLogic();

    explosionLogic();

    gameplayLogic();
};



/**
 * Manages the game rendering states inside the canvas.

 * Renders the alien objects inside of the canvas.
 * Renders the tank object inside of the canvas.
 */
function render() {
    // Clear the entire canvas.
    display.clear();

    //TODO: Make this in an auto loop method (the background)

    // Draw the background image with movement effect. //
    backgroundMovementYAxis += backgroundMovementSpeed;

    ///display.drawBackground(backgroundImage, backgroundMovementYAxis);

    // If the image scrolled off the screen, reset
    if (backgroundMovementYAxis >= 0) {
        backgroundMovementYAxis = -400;
    }


    // Draw the score on canvas
    display.drawText("SCORE: " + score, 55, 25); // top left
    display.drawText("LEVEL: " + level, canvasX - 55, canvasY - 5); // bottom right
    display.drawText("" + locationName, canvasX - 55, 25); // top right
    // alert(lifeIcon.width);

    // Draw lives.
    for (var i = 0, len = lives; i < len; i++) {
        var inc = 5 + 20 * i;
        display.drawImage(lifeIcon, inc, canvasY - 25);
    }

    

    // When game over, logic stops in this method.
    if (gameOver) {

        // Draw the score on canvas
        display.drawText("GAME OVER - PRESS ENTER", canvasX / 2, canvasY / 2);

        return;
    }

    
   
    // Draw all aliens.
    for (var i = 0, len = aliens.length; i < len; i++) {
        var a = aliens[i];
        display.drawSprite(a.sprite[spFrame], a.x, a.y);
    }

    //alert("xxx");

    // Draw all explosions.
    for (var i = 0, len = explosions.length; i < len; i++) {
        var e = explosions[i];

       // alert(e.sprite);

        display.drawSprite(e.sprite, e.x, e.y);
    }

    // Save contetx and draw bullet then restore.         // TODO: Context Save and Restore??
    display.ctx.save();
    for (var i = 0, len = bullets.length; i < len; i++) {
        display.drawBullet(bullets[i]);
    }
    display.ctx.restore(); // since drawBullet sets fillStyle, we want to change back settings.

    // Draw the tank sprite
    if (!hitDetected) {
        display.drawSprite(tank.sprite, tank.x, tank.y);
    }


};

/**
 * Hanldes the tank's movement by given key input.
 */
function movementLogic() {
    // Update tank position depending on pressed keys.

    if (inputKey.isDown(37)) { // Move Left
        tank.x -= 8;
    }
    if (inputKey.isDown(39)) { // Move Right
        tank.x += 8;
    }

    if (inputKey.isDown(77)) { // Mute (m)

        // Ensure one time call for toggle.
        if (!soundToggled) {

            soundToggled = true;
            setTimeout("toggleSound()", 500);
        }
    }

    if (inputKey.isDown(13)) { // New Game (ENTER)

        // Ensure one time call for toggle.
        if (!newgameToggled && gameOver) {

            newgameToggled = true;
            setTimeout("toggleNewGame()", 500);
        }
    }

    // Keep the tank sprite inside of the canvas.
    tank.x = Math.max(Math.min(tank.x, display.width - (30 + taSprite.w)), 30);
};

function toggleNewGame() {

    gameOver = false;
    lives = 3;
    score = 0;
    lvFrame = 60;
    level = 1;
    
    setTimeout("init()", 500);

    newgameToggled = false;
}

function toggleSound() {

    if (sound) {
        soundFx.background.pause();
        sound = false;
    } else {
        soundFx.background.play();
        sound = true;
    }

    soundToggled = false;
}

/**
 * Handles the bullets firing by key press function. 
 * Handles the bullet trajectory update movement.
 * Handles bullet hit action on aliens.
 */
function bulletLogic() {

    // On space bar pressed event, create new bullet sprite into the bullets array.
    if (inputKey.isPressed(32)) { // Space
        bullets.push(new Bullet(tank.x + 10, tank.y, -8, 2, 12, "#ccff33", false)); // #fff

        if (sound) {
            soundFx.shoot.play(); // play shoot sound.
        }

       // alert(aliens[0].y);
 
    }

    // Update all bullets position inside the canvas.
    for (var i = 0, len = bullets.length; i < len; i++) {
        var bullet = bullets[i];
        bullet.update();

        // Clear bullets which went outside of the canvas.
        if (bullet.y + bullet.height < 0 || bullet.y > display.height) {
            bullets.splice(i, 1);
            i--;
            len--;
            continue;
        }

        // Check if bullet hit any aliens and remove (splice) from array.
        // TODO: Score points!!
        for (var j = 0, len2 = aliens.length; j < len2; j++) {
            var alien = aliens[j];

            if (!bullet.enemy && AABBIntersect(bullet.x, bullet.y, bullet.width, bullet.height, alien.x, alien.y, alien.w, alien.h)) {
                aliens.splice(j, 1);
                j--;
                len2--;
                bullets.splice(i, 1);
                i--;
                len--;

                // Increase score.
                score += 100;

                // Create explosion at alien's coordinates.
                // Create object from here since due to manipulation it will keep the same variables when assigned for next explosion.
                var exSprite = new AnimationSprite(imgExpl, 0, 0, 88, 88, 60, 88); // 0 39 = xy of sprite / 15 15 = size frame / 10 15 framcnt and increment x

                ///var exp = exSprite;
                explosions.push({
                    sprite: exSprite,
                    x: alien.x,
                    y: alien.y,
                    w: exSprite.w,
                    h: exSprite.y
                });

                if (sound) {
                    soundFx.explosion.play(); // play explosion sound.
                }
            }
        }

        // check if enemy bullets hit tank
        if (bullet.enemy && AABBIntersect(bullet.x, bullet.y, bullet.width, bullet.height, tank.x, tank.y, tank.w, tank.h) && !hitDetected) { // orHitTimeout

            destroyTank();

            lives -= 1;
            hitDetected = true;

            setTimeout("resetHit()", 500); // callback

            if (lives <= 0) {

                gameOver = true;
                //console.log("HIT DEAD!!!");
            }

            // TODO: Explosion and game over, set flag game over
        }
    }
};

function destroyTank() {
    // Create explosion at tank's coordinates.
    // Create object from here since due to manipulation it will keep the same variables when assigned for next explosion.
    var exSpriteTank = new AnimationSprite(imgExpl, 0, 0, 88, 88, 60, 88);// 0 39 = xy of sprite / 15 15 = size frame / 10 15 framcnt and increment x

    ///var exp = exSprite;
    explosions.push({
        sprite: exSpriteTank,
        x: tank.x,
        y: tank.y,
        w: exSpriteTank.w,
        h: exSpriteTank.y
    });

    if (sound) {
        soundFx.explosion.play(); // play explosion sound.
    }
}

function resetHit() { // callback?
    hitDetected = false;

    tank.x = (display.width - taSprite.w) / 2;

    // TOOD: Set tank in middle.
}

function explosionLogic() {



    // Update all the explosions frames.
    for (var i = 0; i < explosions.length; i++) {

        // alert("ex1")

        explosions[i].sprite.updateFrame();

        //alert(explosions[i].sprite.complete);

        // Remove if animation is done
        if (explosions[i].sprite.complete) {
            explosions.splice(i, 1);
            i--;
        }
    }
};

/**
 * Handles alien sequential movement.
 */
function alienLogic() {
    
    // generate alien shooting
    alienShoot();

    // TODO: Study this part.

    // update the aliens at the current movement frequence
    if (frames % lvFrame === 0) {
        spFrame = (spFrame + 1) % 2; // switch animation by odd / even

        var displayWidth = display.width + 30; // the +30 adds an extra movement to the right in sequence.

        // get the whole canvas width
        var _max = 0, _min = displayWidth;

        // iterate through aliens and update postition
        for (var i = 0, len = aliens.length; i < len; i++) {
            var a = aliens[i];
            a.x += 30 * alienDirection;

            // find min/max values of all aliens for direction
            // change test
            _max = Math.max(_max, a.x + a.w);
            _min = Math.min(_min, a.x);
        }

       

        // check if aliens should move down and change direction
        if (_max > displayWidth - 30 || _min < 30) {
            // mirror direction and update position
            alienDirection *= -1;
            for (var i = 0, len = aliens.length; i < len; i++) {
                aliens[i].x += 30 * alienDirection;
                aliens[i].y += 30;

                /// console.log("alien " + i + "is at height " + aliens[i].y); //debug position y of aliens going down
                /// console.log(aliens[i].x += 30 * alienDirection); //debug the movement positive or negative x 
            }
        }
    }
}


/**
 * Creates and handles the bullet trajectory shot by aliens.
 */
function alienShoot() {

    // Makes the alien shoot in an random fashion, when math is < 0.0.3
    if (Math.random() < 0.03 && aliens.length > 0) {

        // Get a random alien from the array.
        var alienShooter = aliens[Math.round(Math.random() * (aliens.length - 1))];

        // iterate through aliens and check collision to make
        // sure only shoot from front line

        // To ensure there is no alien in front of him. ***

        for (var i = 0, len = aliens.length; i < len; i++) {
            var alien = aliens[i];

            // If there is collision with another alien in line, set that other alien the shooter. (move 1 row forward).
            if (AABBIntersect(alienShooter.x, alienShooter.y, alienShooter.w, 100, alien.x, alien.y, alien.w, alien.h)) {
                alienShooter = alien;
            }
        }

        // create and append new bullet from alien
        bullets.push(new Bullet(alienShooter.x + alienShooter.w * 0.5, alienShooter.y + alienShooter.h, 4, 3, 12, "#ff0000", true)); /// fff
    }
}

function gameplayLogic() {   


    ///lvFrame = 16;

    // Recreate next level
    if (aliens.length == 0 && levelUp == false) {
        // level++
        // life++ ?? 

        levelUp = true;
        level++;
        lives++;

        lvFrame -= 10; // make it faster

        ///console.log(lvFrame);

        if (lvFrame <= 0) { lvFrame = 6; }

        ///console.log(lvFrame);


      //  lvFrame = lvFrame- 5; // faster movement

        /// createSprites(); 

        ///sleep(1000);   // this is being repeatedly being called and hence

        setTimeout("init()", 2000);

    }

    // Check if aliens have reaced bottom of the canvas to end game.
    for (var i = 0, len = aliens.length; i < len; i++) {
        // if (aliens[i].y >= 570) { alert("game over!"); }

        if (aliens[i].y >= 770) {
            destroyTank();
            gameOver = true;
            lives = 0;
        } // 540

       // console.log(aliens[i].y);
    }
}