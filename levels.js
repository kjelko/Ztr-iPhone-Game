var levels = [];

levels[0] = function(canvasId) {
  level = new Ztr(canvasId, window.innerWidth, window.innerHeight);

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
    sWidth: 75,
    sHeight: 20,
    sx: 60,
    sy: 0,
    dWidth: 75,
    dHeight: 20
  });
  level.setControlSprite('right', rHandle);
  
  var lHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 75,
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
  level.setStaticHitArea([
    {x:-10, y:-12},
    {x:-1,  y:-12},
    {x:-1,  y:-22},
    {x:1,   y:-22},
    {x:1,   y:-12},
    {x:10,  y:-12},
    {x:10,  y:21},
    {x:-10, y:21},
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
      hero.sx = 99;
    } else {
      blinked = false;
      hero.sx =0;
    }
  }
  
  function stopBlink(){
    clearInterval(blink);
    blinked = false;
    hero.sx = 0;
  }
  
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
    fixed : true,
    name: 'fix'
  });
  
  level.drawStaticSprite(pauseButton);
  var ui = new Ui(document.getElementById(canvasId), document.getElementById(canvasId).getContext('2d'));
  var b = {};
  b.coords = utils.square(pauseButton.dx, pauseButton.dy, pauseButton.dWidth, pauseButton.dHeight);
  b.callback = function(){level.pause(); LevelSelect(canvasId);};
  ui.addButton(b);
  
  level.start();  
  
};
levels[1] = function(canvasId) {
  level = new Ztr(canvasId, window.innerWidth, window.innerHeight);

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
    sWidth: 75,
    sHeight: 20,
    sx: 60,
    sy: 0,
    dWidth: 75,
    dHeight: 20
  });
  level.setControlSprite('right', rHandle);
  
  var lHandle = new Sprite({
    image: 'images/handle.png',
    sWidth: 75,
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
    {x:-10, y:-12},
    {x:-1,  y:-12},
    {x:-1,  y:-22},
    {x:1,   y:-22},
    {x:1,   y:-12},
    {x:10,  y:-12},
    {x:10,  y:21},
    {x:-10, y:21},
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
  level.drawObstacle(obstacle, beginCollision, endCollision);
  
  var obstacle2 = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 15,
    dx: 30,
    dy: 30
  });
  //level.drawObstacle(obstacle2, beginCollision, endCollision);
  
  
  var obstacle3 = new Sprite({
    image: 'images/car.png',
    sWidth: 297,
    sHeight: 147,
    sx: 0,
    sy: 0,
    dWidth: 30,
    dHeight: 15,
    dx: 400,
    dy: 250
  });
  //level.drawObstacle(obstacle3, function(h){alert('t')});
  
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
  var ui = new Ui(document.getElementById(canvasId), document.getElementById(canvasId).getContext('2d'));
  var b = {};
  b.coords = utils.square(pauseButton.dx, pauseButton.dy, pauseButton.dWidth, pauseButton.dHeight);
  b.callback = function(){level.pause(); LevelSelect(canvasId);};
  ui.addButton(b);
  
  
  
  level.start();  
  
};



