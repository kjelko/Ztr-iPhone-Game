/**
 * @fileoverview This is the ztr engine that powers the game.
 * Ztr = 'Zero Turn Radius' - This is concept that is mimicked by this engine.
 *
 * @todo This code is awfully messy.
 * @todo Documentation?
 *
 */


/**
 * Build it.
 * @param {HTMLCanvas} cvs A canvas element.
 * @param {int} windowW The width of the window.
 * @param {int} windowH The height of the window.
 * @constructor
 * 
 * @todo Make it so this accepts a Ui object as a param
 * @todo Make everything more settable (speed, mower width, etc)
 * 
 */
var Ztr = function(cvs, windowW, windowH){

  /**
   * This is the global variable that stores just about everything
   * that the engine needs.
   * @type {object}
   */
  var
    ztr = this,
    loop = null,
    window = {width:windowW, height: windowH},
    playable = {width: 0, height: 0}, 
    self = this,
    sprites = [],
    staticSprites = [],
    hero = null,
    canvasDom = document.getElementById(cvs),
    canvas = document.getElementById(cvs).getContext('2d'),
    controlTouches = {right: null, left: null},
    controlSprites = {right: null, left: null},
    view = {angle: 0, pos: {x: 0, y: 0}},
    speed = 5,  //default speed value.
    background = null,
    drawTrail = false,
    trail = {
      image: new Image(),
      points:[],
      canvas: document.createElement('canvas'),
      context: null
    },
    collisions  = [],
    timer  = false,
    paused = false,
    endFunction = null,
    spriteMap = document.createElement('canvas'),
    spriteMapContext = null,
    levelNo = null,
    goal = null;
  
  
  /**
   * Here are defined a number of public functions that can be called externally.
   * They are generally used to prep the engine for running.
   * 
   */
  
  this.setGoal = function(newGoal){
    goal = newGoal;
  }
  
  this.setLevelNo = function(newLevelNo){
    levelNo = newLevelNo;
  }
  
  this.setGameOver = function(f){
    endFunction = f;
  };
  
  this.pause = function(){
    paused = true;
    clearInterval(loop);
  }
  
  this.resume = function(){
    self = this;
    paused = false;
    setTimeout(function(){runTimer.call(self)}, 1000);
    loop = setInterval(loop, 1000/35);
  }
  
  this.setTimer = function(t) {
    timer = t;
  }
  
  this.setTouchListeners = function() {
    if('createTouch' in document) {
      canvasDom.addEventListener('touchstart', function(e){handleTouchStart(e)}, false);
      canvasDom.addEventListener('touchmove', function(e){handleTouchMove(e)}, false);
      canvasDom.addEventListener('touchend', function(e){handleTouchEnd(e)}, false);
    }
  };

  this.setWindow = function(w, h){
    window.width = w;
    window.height = h;
    canvas = canvasDom.getContext('2d');
  };

  this.drawSprite = function(sprite){
    sprites.push(sprite);
    sprites.sort(function(a, b){return a.dz - b.dz});
    if(sprite.drawToSpriteMap) {
      if(sprite.hitAreaStatic) {
        this.drawToSpriteMap(sprite.hitAreaStatic);
      } else {
        this.drawToSpriteMap(utils.square(sprite.dx, sprite.dy,
          sprite.dWidth, sprite.dHeight));
      }
    }
  };

  this.drawStaticSprite = function(sprite) {
    this.drawSprite(sprite);
  };
  
  this.setControlSprite = function(side, sprite){
    if(side == 'right') {
      sprite.dx = window.width - sprite.dWidth;
      controlSprites.right = sprite;
    } else if(side == 'left') {
      sprite.dx = 0;
      controlSprites.left = sprite;
    }
    sprite.dy = canvasDom/2 - sprite.dHeight/2;
    this.drawSprite(sprite);
  };
  
  this.setView = function(angle, newx, newy){
    view.angle = (angle) ? angle : 0;
    view.pos = {
      x: (newx) ? newx : 0,
      y: (newy) ? newy : 0
    };
  };
  
  this.setSpeed = function(newSpeed) {
    speed = (newSpeed > 0) ? newSpeed : 1;
  };
  
  this.setBackground = function(sprite){
    background = sprite;
    playable.width = sprite.dWidth;
    playable.height = sprite.dHeight;
    spriteMap.width = playable.width;
    spriteMap.height = playable.height;
    spriteMapContext = spriteMap.getContext('2d');
  };
  
  this.drawTrail = function(x, opt_clearHistory) {
    if(x && trail.context == null) {
      trail.canvas.width = playable.width;
      trail.canvas.height = playable.height;
      trail.context = trail.canvas.getContext('2d');
    } else if (x && trail.context != null && opt_clearHistory) {
      trail.context.clearRect(0,0,playable.width,playable.height);
    }
    drawTrail = x;
  };
  
  this.setTrailImage = function(imgPath) {
    trail.image.src = imgPath;
  };
  
  this.setHero = function(sprite) {
    hero = sprite;
    hero.fixed = true;
    this.drawSprite(hero);
  };
  
  this.drawObstacle = function(obj, beginCollision, endCollision) {
    this.drawSprite(obj);
    //this.drawToSpriteMap(obj.hitAreaStatic);
    this.hitTest(hero, obj, beginCollision, endCollision, true);
  };
  
  this.drawToSpriteMap = function(poly) {
    spriteMapContext.beginPath();
    spriteMapContext.moveTo(poly[0][0], poly[0][1]);
    for(var i in poly){
      spriteMapContext.lineTo(poly[i][0], poly[i][1]);
    }
    spriteMapContext.closePath();
    spriteMapContext.fillStyle = '#111';
    spriteMapContext.fill();
  };
  
  this.drawItem = function(obj, beginCollision, endCollision) {
    this.drawSprite(obj);
    this.hitTest(hero, obj, beginCollision, endCollision, false);
  };
  
  this.hitTest = function(obj1, obj2, beginCollision, endCollision, solid) {
    collisions.push({
      o1: obj1,
      o2: obj2,
      beginCollision: beginCollision,
      endCollision: endCollision,
      solid: solid,
      active: false
    });
  };
  
  this.start = function() {
    canvas.fillStyle = 'black';
    canvas.font = 'bold 35px Arial';
    canvas.fillText('loading...', 100, 100);
    checkSpritesLoaded.call(this);
  };
  
  /**
   * Here are defined some private functions that cannot be accessed externally.
   * This is where most of the calculations and game updating happen.
   *
   */

  /**
   * This is the main game loop. 
   *
   */
  var loop = function(){
    
    canvas.clearRect(0,0,window.width,window.height);
    canvas.fillStyle = '#252f3c';
    canvas.fillRect(0,0,window.width, window.height);
    
    updateControls();
    updateView();
    
    drawBackground();
    drawTrailToLevel();
    drawSprites();
    drawPreviewMap();
    drawTimer();
  };
  
  var checkSpritesLoaded = function(){
    var that = this;
    if(spritesLoaded()) {
      this.setTouchListeners();
      this.resume();
    } else {
      setTimeout(function(){checkSpritesLoaded.call(that)}, 100);
    }
  }
  
  var spritesLoaded = function(){
    for(var i in sprites){
      if(!sprites[i].load) {
        return false;
      }
    }
    if(!background.load ||
       !controlSprites.left.load ||
       !controlSprites.right.load) {
      return false;
    }
    return true;
  };
  
  var getHandleY = function(clientY){
    var h = window.height;
    if(clientY < h/2 - 115)
      return h/2-115
    else if(clientY > h/2 + 115)
      return h/2+115
    else
      return clientY;
  };
  
  var handleTouchStart = function(e) {
    if(e.changedTouches[0].clientX > window.width-70){
      controlTouches.right = e.changedTouches[0];
    } else if(e.changedTouches[0].clientX < 70){
      controlTouches.left = e.changedTouches[0];
    }
  };
  
  var handleTouchMove = function(e) {
    e.preventDefault();
  };
  
  var handleTouchEnd = function(e) {
    for(var i in e.changedTouches) {
      if(e.changedTouches[i] == controlTouches.right){
        controlTouches.right = null;
      } else if(e.changedTouches[i] == controlTouches.left){
        controlTouches.left = null;
      }
    }
  };
  
  var getSpeed = function(){
    return speed/5;
  };
  
  var updateView = function() {
    var trailPoints = trail.points, h = window.height, t, r, l;
    
    if(controlTouches.right)
      r = -1 * (getHandleY(controlTouches.right.clientY)-h/2);
    else
      r = 0
      
    if(controlTouches.left)  
      l = -1 * (getHandleY(controlTouches.left.clientY)-h/2);
    else
      l = 0;
    
    view.angle += (((r-l)/2*Math.PI/180)/60) * getSpeed();
    view.pos.x += (Math.sin(view.angle)*(r+l)/80) * getSpeed();
    view.pos.y += (Math.cos(view.angle)*(r+l)/80) * getSpeed();
    checkHits();
    
    
    checkPlayableBounds();
    
    if(drawTrail) {
      if(!trailPoints.length ||
        (view.pos.x < trailPoints[trailPoints.length-1].x - 8 ||
        view.pos.x > trailPoints[trailPoints.length-1].x + 8) ||
        (view.pos.y < trailPoints[trailPoints.length-1].y - 8 ||
        view.pos.y > trailPoints[trailPoints.length-1].y + 8)
        ) {
        addToTrail({x: view.pos.x, y: view.pos.y});
      }
    }
  };
  
  var updateControls = function(){
    var h = window.height;
    
    if(!controlSprites.right)
      controlSprites.right = {set: false, dHeight:0};
    if(!controlSprites.left)
      controlSprites.left = {set: false, dHeight:0};
    
    if(controlTouches.right) {
      var touch = controlTouches.right;
      controlSprites.right.dy = getHandleY(touch.clientY) - controlSprites.right.dHeight/2;
    } else {
      controlSprites.right.dy = h/2 -
      controlSprites.right.dHeight/2;
    }
    
    if(controlTouches.left) {
      var touch = controlTouches.left;
      controlSprites.left.dy = getHandleY(touch.clientY) - controlSprites.left.dHeight/2;
    } else {
      controlSprites.left.dy = h/2 -
      controlSprites.left.dHeight/2;
    }
  };
  
  var checkPlayableBounds = function() {
    var w = playable.width/2-10;
    var h = playable.height/2-10;
    
    if (view.pos.x < -1*w) view.pos.x = -1*w;
    if (view.pos.x > w) view.pos.x = w;
    if (view.pos.y < -1*h) view.pos.y = -1*h;
    if (view.pos.y > h) view.pos.y = h;
  };
  
  var rotateCanvas = function(){
    canvas.save();
    canvas.translate(window.width/2, window.height/2);
    canvas.rotate(view.angle);
  };
  
  var restoreCanvas = function(){
    canvas.restore();
  };
  
  var drawBackground = function(){
    rotateCanvas();
    canvas.drawImage(background.image,
      background.sx, background.sy,
      background.sWidth, background.sHeight,
      view.pos.x-playable.width/2,
      view.pos.y-playable.height/2,
      background.dWidth, background.dHeight
    );
    restoreCanvas();
  };
  
  var drawTrailToLevel = function(){
    rotateCanvas();
    canvas.drawImage(trail.canvas,
      view.pos.x-playable.width/2,
      view.pos.y-playable.height/2
    );
    restoreCanvas();
  };
  
  var drawPreviewMap = function(){
    prevW = background.dWidth/10,
    prevH = background.dHeight/10,
    prevPosX = window.width - prevW - 10,
    prevPosY = window.height - prevH - 10;
    canvas.fillStyle = 'rgba(0,0,0,0.3)';
    canvas.fillRect(prevPosX-1, prevPosY-1, prevW+2, prevH+2);
    canvas.drawImage(trail.canvas,
      0, 0,
      prevW*10, prevH*10,
      prevPosX, prevPosY,
      prevW, prevH
    );
    canvas.drawImage(spriteMap,
      0, 0,
      prevW*10, prevH*10,
      prevPosX, prevPosY,
      prevW, prevH
    );
  };
  
  var drawSprites = function(){
    for(var sId in sprites) {
      var s = sprites[sId];
      if(!s.fixed) {
        rotateCanvas();
        canvas.drawImage(s.image,
          s.sx, //- playable.width/2,
          s.sy, //- playable.height/2,
          s.sWidth, s.sHeight,
          view.pos.x + s.dx - playable.width/2,
          view.pos.y + s.dy - playable.height/2,
          s.dWidth, s.dHeight
        );
        restoreCanvas();
      } else {
        canvas.drawImage(s.image,
          s.sx, s.sy,
          s.sWidth, s.sHeight,
          s.dx, s.dy,
          s.dWidth, s.dHeight
        );
      }
    }
  };
  
  var runTimer = function() {
    if(timer) {
      var self = this;
      timer--;
      
      if(timer == 0) {
        this.pause();
        endFunction({
          levelNo : levelNo,
          goal : goal,
          trail : trail,
          spriteMap: spriteMapContext
        });
      }
      
      if(!paused && timer != 0)
        setTimeout(function(){runTimer.call(self)}, 1000);
    }
  }
  
  var drawTimer = function(){
    if(timer){
      canvas.font = 'bold 25px Arial';
      canvas.fillText(timer, 10, 35);
    }
  };
  
  var addToTrail = function(point){
    var preContext = trail.context;
    trail.points.push(point);
    
    preContext.drawImage(trail.image,
      0, 0, 30, 30,
      -1*point.x+playable.width/2-15, -1*point.y+playable.height/2-15,
      30, 30
    );
    
  };
  
  var getHitArea = function(obj) {
    if(!obj.fixed) {
      var sqr2 = [[], [], [], []];
      var gvpx = view.pos.x;
      var gvpy = view.pos.y;
      
      for(var i = 0; i <= 3; i++){
        sqr2[i][0] = obj.hitAreaStatic[i][0] + gvpx - playable.width/2;
        sqr2[i][1] = obj.hitAreaStatic[i][1] + gvpy - playable.height/2;
      }
      
      return sqr2;
    
    } else {
      return utils.rotatePoly(view.angle, obj.hitAreaStatic);
    }
    
  };
  
  var checkHits = function() {
    
    for(var i in collisions) {
      cxt = canvas;
      htest = collisions[i];
    
      htest.o1.hitArea = getHitArea(htest.o1);
      htest.o2.hitArea = getHitArea(htest.o2);
      
        var item = utils.sat(htest.o1.hitArea, htest.o2.hitArea);
        if(item) {
          if(htest.solid) {
              view.pos.x -= item.normal.x *-item.overlap;
              view.pos.y -= item.normal.y *-item.overlap;
            }
          if(!htest.active) {
            htest.beginCollision(ztr);
            htest.active = true;
          }
        } else if(htest.active) {
            htest.endCollision(ztr);
            htest.active = false;
        } else {
            htest.active = false;
        }
      
    }
    
  };
  
};