var Commons = {};

Commons.gameOver = function(levelInfo, levelNo, goal){
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


var levels = [];

levels[1] = function(ui) {
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
    dHeight: 20
  });
  level.setControlSprite('right', rHandle);
  
  var lHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 70,
    sHeight: 20,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 20
  });
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
    dx: window.innerWidth/2 - 15,
    dy: window.innerHeight/2 - 26
  });
  level.setHero(hero);
  level.setStaticHitArea(hero, [
    [-11, -12],
    [-1,  -12],
    [-1,  -22],
    [1,   -22],
    [1,   -12],
    [11,  -12],
    [11,  22],
    [-11, 22],
  ]);
  
  var invisibleArea = {
    fixed: false,
    dx: -50, dy:-250,
    dHeight: 50, dWidth: 100
  };
  //level.hitTest(hero, invisibleArea, function(){alert('Excellent')}, function(){alert('Bye!')}, false);
  
  
  
  level.setGameOver(function(levelInfo){
    Commons.gameOver(levelInfo, 1, 30);
  });
  
  
  
  
  //example of how you can set the start view info.
  level.setView(0, 0, -200);
  
  
  var pauseButton = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 15,
    dx: window.innerWidth/2-15,
    dy: window.innerHeight-15,
    fixed : true
  });
  
  level.drawStaticSprite(pauseButton);
  var button = new Ui.button(utils.square(pauseButton.dx, pauseButton.dy, pauseButton.dWidth, pauseButton.dHeight), null, function(){
    level.pause();
    ui.clear(true);
    LevelSelect(ui);
  });
  
  ui.addButton(button);
  level.setTimer(20);
  level.start();  
  
};








levels[2] = function(ui) {
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
    dHeight: 20
  });
  level.setControlSprite('right', rHandle);
  
  var lHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 70,
    sHeight: 20,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 20
  });
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
    dx: window.innerWidth/2 - 15,
    dy: window.innerHeight/2 - 26
  });
  level.setHero(hero);
  level.setStaticHitArea(hero, [
    [-11, -12],
    [-1,  -12],
    [-1,  -22],
    [1,   -22],
    [1,   -12],
    [11,  -12],
    [11,  22],
    [-11, 22],
  ]);
  
  var invisibleArea = {
    fixed: false,
    dx: -50, dy:-250,
    dHeight: 50, dWidth: 100
  };
  //level.hitTest(hero, invisibleArea, function(){alert('Excellent')}, function(){alert('Bye!')}, false);
  
  
  
  level.setGameOver(function(levelInfo){
    Commons.gameOver(levelInfo, 2, 90);
  });
  
  
  
  
  //example of how you can set the start view info.
  level.setView(0, 0, -200);
  
  
  var pauseButton = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 15,
    dx: window.innerWidth/2-15,
    dy: window.innerHeight-15,
    fixed : true
  });
  
  level.drawStaticSprite(pauseButton);
  var button = new Ui.button(utils.square(pauseButton.dx, pauseButton.dy, pauseButton.dWidth, pauseButton.dHeight), null, function(){
    level.pause();
    ui.clear(true);
    LevelSelect(ui);
  });
  
  ui.addButton(button);
  level.setTimer(30);
  level.start();  
  
};








levels[3] = function(ui) {
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
    dHeight: 20
  });
  level.setControlSprite('right', rHandle);
  
  var lHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 70,
    sHeight: 20,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 20
  });
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
    dx: window.innerWidth/2 - 15,
    dy: window.innerHeight/2 - 26
  });
  level.setHero(hero);
  level.setStaticHitArea(hero,[
    [-11, -12],
    [11,  -12],
    [11,  23],
    [-11, 23],
  ]);
  
  
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
  
  var blink, hitWait, blinked = false;
  
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
  
  
  //example of a sprite relative to the level.
  var obstacle = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 37,
    dx: 100,
    dy: 200
  });
  level.drawObstacle(obstacle, function(){}, function(){});
  
  var obstacle2 = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 15,
    dx: 276,
    dy: 387
  });
  level.drawItem(obstacle2, beginCollision, endCollision);
  
  
  var coin = new Sprite({
    image: 'images/coin.jpg',
    sWidth: 295,
    sHeight: 294,
    sx: 0,
    sy: 0,
    dWidth: 20,
    dHeight: 20,
    dx: 400,
    dy: 250
  });
 /* level.drawItem(coin, function(){alert('You collected a coin!'); level.deleteSprite(coin)}, function(){});*/
  
  //example of how you can set the start view info.
  level.setView(0, 5, 25);
  
  
  var pauseButton = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 15,
    dx: window.innerWidth/2-15,
    dy: window.innerHeight-15,
    fixed : true,
    name: 'fix'
  });
  
  level.drawStaticSprite(pauseButton);
  var b = new Ui.button(utils.square(pauseButton.dx, pauseButton.dy,
    pauseButton.dWidth, pauseButton.dHeight), null, function(){
      level.pause();
      ui.clear(true);
      LevelSelect(ui);
    });
  ui.addButton(b);
  
  level.setTimer(50);
  
  level.setGameOver(function(levelInfo){
    Commons.gameOver(levelInfo, 3, 90);
  });
  
  level.start();  
  
};











//
levels[4] = function(ui) {
  level = new Ztr(ui.canvas.id, ui.width, ui.height);

  //Set up the background
  var background = new Sprite({
    image: 'images/grass.png',
    sWidth: 500,
    sHeight: 300,
    sx: 0,
    sy: 0,
    dWidth: 500,
    dHeight: 300
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
    dHeight: 20
  });
  level.setControlSprite('right', rHandle);
  
  var lHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 70,
    sHeight: 20,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 20
  });
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
    dx: window.innerWidth/2 - 15,
    dy: window.innerHeight/2 - 26
  });
  level.setHero(hero);
  level.setStaticHitArea(hero,[
    [-11, -12],
    [11,  -12],
    [11,  23],
    [-11, 23],
  ]);
  
  //example of a sprite relative to the level.
  var obstacle = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 37,
    dx: 100,
    dy: 200
  });
  
  level.drawObstacle(obstacle, function(){}, function(){});
  
  //example of how you can set the start view info.
  level.setView(0, 5, 25);
  
  
  var pauseButton = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 15,
    dx: window.innerWidth/2-15,
    dy: window.innerHeight-15,
    fixed : true,
    name: 'fix'
  });
  
  level.drawStaticSprite(pauseButton);
  var b = new Ui.button(utils.square(pauseButton.dx, pauseButton.dy,
    pauseButton.dWidth, pauseButton.dHeight), null, function(){
      level.pause();
      ui.clear(true);
      LevelSelect(ui);
    });
  ui.addButton(b);
  
  level.setTimer(40);
  
  level.setGameOver(function(levelInfo){
    Commons.gameOver(levelInfo, 4, 90);
  });
  
  level.start();  
  
};

levels[5] = function(ui) {
  level = new Ztr(ui.canvas.id, ui.width, ui.height);

  //Set up the background
  var background = new Sprite({
    image: 'images/grass.png',
    sWidth: 500,
    sHeight: 300,
    sx: 0,
    sy: 0,
    dWidth: 500,
    dHeight: 300
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
    dHeight: 20
  });
  level.setControlSprite('right', rHandle);
  
  var lHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 70,
    sHeight: 20,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 20
  });
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
    dx: window.innerWidth/2 - 15,
    dy: window.innerHeight/2 - 26
  });
  level.setHero(hero);
  level.setStaticHitArea(hero,[
    [-11, -12],
    [11,  -12],
    [11,  23],
    [-11, 23],
  ]);
  
  //example of a sprite relative to the level.
  var obstacle = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 75,
    dHeight: 37,
    dx: 100,
    dy: 200
  });
  
  level.drawObstacle(obstacle, function(){}, function(){});
  
  //example of how you can set the start view info.
  level.setView(0, 5, 25);
  
  
  var pauseButton = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 15,
    dx: window.innerWidth/2-15,
    dy: window.innerHeight-15,
    fixed : true,
    name: 'fix'
  });
  
  level.drawStaticSprite(pauseButton);
  var b = new Ui.button(utils.square(pauseButton.dx, pauseButton.dy,
    pauseButton.dWidth, pauseButton.dHeight), null, function(){
      level.pause();
      ui.clear(true);
      LevelSelect(ui);
    });
  ui.addButton(b);
  
  level.setTimer(40);
  
  level.setGameOver(function(levelInfo){
    Commons.gameOver(levelInfo, 4, 90);
  });
  
  level.start();  
  
};



