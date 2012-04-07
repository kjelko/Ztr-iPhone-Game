/**
 * @fileoverview Define each level as a function.  Also included are some
 * temporary auxiliary functions.
 * 
 */


/**
 * The array that holds the levels.
 * @type {Array.<object>}
 */
var levels = [];



levels[1] = function(ui) {
  
  //Grab a new instance of the ztr engine
  level = new Ztr(ui.canvas.id, ui.width, ui.height);


  //Set up the background
  var background = new Sprite({
    image: 'images/grass.png',
    sWidth: 100,
    sHeight: 500,
    sx: 0,
    sy: 0,
    dWidth: 100,
    dHeight: 500
  });
  level.setBackground(background);
  
  
  //So we can see where we've mowed
  level.drawTrail(true);
  level.setTrailImage('images/cut_grass.png');
  
  
  //Here we set the control sprites for the handles.
  var rHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 70,
    sHeight: 20,
    sx: 70,
    sy: 0,
    dWidth: 75,
    dHeight: 20,
    dz: 5,
    fixed: true
  });  
  var lHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 70,
    sHeight: 20,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 20,
    dz: 5,
    fixed: true
  });
  level.setControlSprite('right', rHandle);
  level.setControlSprite('left', lHandle);
  
  
  //example of a static sprite that is relative to the view port, not the level.
  var hero = new Sprite({
    image: 'images/tank.png',
    sWidth: 30,
    sHeight: 52,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 52,
    dx: ui.width/2 - 15,
    dy: ui.height/2 - 26,
    dz: 1,
    fixed: true,
    hitArea: [[-11, -12], [11,  -12], [11,  23], [-11, 23]]
  });
  level.setHero(hero);
  
  
  //Set the starting point for the hero
  level.setView(0, 0, -200);
  
  
  //Create the quit button.  This should probably be managed elsewhere.
  var pauseButton = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 15,
    dx: ui.width/2-15,
    dy: ui.height-15,
    dz: 9,
    fixed : true
  });
  
  var b = new Ui.button(utils.square(pauseButton.dx, pauseButton.dy,
    pauseButton.dWidth, pauseButton.dHeight), null, function(){
      level.pause();
      ui.clear(true);
      LevelSelect(ui);
    });
  ui.addButton(b);
  level.drawStaticSprite(pauseButton);
  
  
  //Set the amount of time the player has to mow
  level.setTimer(30);
  
  
  //Set the function to be called when time runs out
  level.setGameOver(function(levelInfo){
    levelComplete(levelInfo, 1, 90);
  });
  
  
  //Let's mow!
  level.start();  
  
};








levels[2] = function(ui) {
  
  //Grab a new instance of the ztr engine
  level = new Ztr(ui.canvas.id, ui.width, ui.height);


  //Set up the background
  var background = new Sprite({
    image: 'images/grass.png',
    sWidth: 500,
    sHeight: 500,
    sx: 0,
    sy: 0,
    dWidth: 500,
    dHeight: 500
  });
  level.setBackground(background);
  
  
  //So we can see where we've mowed
  level.drawTrail(true);
  level.setTrailImage('images/cut_grass.png');
  
  
  //Here we set the control sprites for the handles.
  var rHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 70,
    sHeight: 20,
    sx: 70,
    sy: 0,
    dWidth: 75,
    dHeight: 20,
    dz: 5,
    fixed: true
  });  
  var lHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 70,
    sHeight: 20,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 20,
    dz: 5,
    fixed: true
  });
  level.setControlSprite('right', rHandle);
  level.setControlSprite('left', lHandle);
  
  
  //example of a static sprite that is relative to the view port, not the level.
  var hero = new Sprite({
    image: 'images/tank.png',
    sWidth: 30,
    sHeight: 52,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 52,
    dx: ui.width/2 - 15,
    dy: ui.height/2 - 26,
    dz: 1,
    fixed: true,
    hitArea: [[-11, -12], [11,  -12], [11,  23], [-11, 23]]
  });
  level.setHero(hero);
  
  
  //Define a few quick functions to handle animations.  This should probably
  //be managed by some other object.
  var blink, hitWait, blinked = false;
  function beginCollision(){
    level.drawTrail(false);
    clearTimeout(hitWait);
    stopBlink();
    blink = setInterval(animateBlink, 100);
  }
  function endCollision(){
    hitWait = setTimeout(function(){
      level.drawTrail(true)
      stopBlink();
      }, 2000);
  }
  function animateBlink(){
    if(!blinked) {
      blinked = true;
      hero.sx = 30;
    } else {
      blinked = false;
      hero.sx = 0;
    }
  }
  function stopBlink(){
    clearInterval(blink);
    blinked = false;
    hero.sx = 0;
  }
  
  
  //Add some other various sprites
  var driveway = new Sprite({
    image: 'images/driveway.png',
    sWidth: 216,
    sHeight: 124,
    sx: 0,
    sy: 0,
    dWidth: 216,
    dHeight: 124,
    dx: 0,
    dy: 155,
    dz: -1
  });
  level.drawSprite(driveway);
  
  var car = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 37,
    dx: 100,
    dy: 200,
    dz: 1
  });
  //Here the hit area defaults to the boundaries of the sprite
  level.drawObstacle(car, function(){}, function(){});
  
  var house = new Sprite({
    image: 'images/house.png',
    sWidth: 300,
    sHeight: 206,
    sx: 0,
    sy: 0,
    dWidth: 300,
    dHeight: 206,
    dx: 110,
    dy: 230,
    dz: 2,
    hitArea: [[130, 250], [390, 250], [390, 416], [130, 416]]
  });
  level.drawObstacle(house, function(){}, function(){});
  
  
  //Set the starting point for the hero
  level.setView(0, -25, 50);
  
  
  //Create the quit button.  This should probably be managed elsewhere.
  var pauseButton = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 15,
    dx: ui.width/2-15,
    dy: ui.height-15,
    dz: 9,
    fixed : true
  });
  
  var b = new Ui.button(utils.square(pauseButton.dx, pauseButton.dy,
    pauseButton.dWidth, pauseButton.dHeight), null, function(){
      level.pause();
      ui.clear(true);
      LevelSelect(ui);
    });
  ui.addButton(b);
  level.drawStaticSprite(pauseButton);
  
  
  //Set the amount of time the player has to mow
  level.setTimer(150);
  
  
  //Set the function to be called when time runs out
  level.setGameOver(function(levelInfo){
    levelComplete(levelInfo, 2, 60);
  });
  
  
  //Let's mow!
  level.start();  
  
};


/**
 * Auxiliary function to handle level completion.  Ideally this would be
 * managed by some all encompasing object.
 * @param {Object} levelInfo Passes the trail canvas to calculate percent mowed.
 * @param {int} levelNo The level number.
 * @param {int} goal the percent of lawn that needs to be mowed. 
 *
 */
var levelComplete = function(levelInfo, levelNo, goal){
  level.pause();
  var t= levelInfo.trail;
  var pixels = t.context.getImageData(0,0,t.canvas.width, t.canvas.height).data;
  var coveredPixels = 0;
  
  for(i=0; i < pixels.length; i++){
    if(pixels[i] != 0) coveredPixels++
  }
  var percent = Math.round(coveredPixels/pixels.length * 100);
  
  var moveOn = function(){
    ui.clear(true);
    LevelSelect(ui);
  }

  if(percent >= goal) {
    if(levels[levelNo+1])
      db.levelInfo(levelNo+1, 0, 1, function(){});
    db.levelInfo(levelNo, percent, 2, moveOn);
    alert('Congrats! You mowed ' + percent + ' percent of the lawn!');
  } else {
    db.levelInfo(levelNo, percent, 1, moveOn);
    alert('Oh no! You only mowed ' + percent + ' percent of the lawn!');
  }  
  
};


