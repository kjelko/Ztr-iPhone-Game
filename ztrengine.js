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
  var globals = {
    loop: null,
    hits : 0,
    window : {width:windowW, height: windowH},
    playable : {width: 0, height: 0}, 
    self : this,
    sprites : [],
    staticSprites : [],
    hero: null,
    canvasDom : document.getElementById(cvs),
    canvas : document.getElementById(cvs).getContext('2d'),
    controlTouches : {right: null, left: null},
    controlSprites : {right: null, left: null},
    view: {angle: 0, pos: {x: 0, y: 0}},
    background : null,
    drawTrail: false,
    trail: {
      image: new Image(),
      points:[],
      canvas: document.createElement('canvas'),
      context: null
    },
    collisions : [],
    timer : false,
    paused : false,
    endFunction : null,
    spriteMap : document.createElement('canvas'),
    spriteMapContext: null
  };
  
  
  /**
   * Here are defined a number of public functions that can be called externally.
   * They are generally used to prep the engine for running.
   * 
   */
  
  this.setGameOver = function(f){
    globals.endFunction = f;
  };
  
  this.pause = function(){
    globals.paused = true;
    clearInterval(globals.loop);
  }
  
  this.resume = function(){
    self = this;
    globals.paused = false;
    setTimeout(function(){runTimer.call(self)}, 1000);
    globals.loop = setInterval(loop, 1000/35);
  }
  
  this.setTimer = function(t) {
    globals.timer = t;
  }
  
  this.setTouchListeners = function() {
    var canvas = globals.canvasDom;
    if('createTouch' in document) {
      canvas.addEventListener('touchstart', function(e){handleTouchStart(e)}, false);
      canvas.addEventListener('touchmove', function(e){handleTouchMove(e)}, false);
      canvas.addEventListener('touchend', function(e){handleTouchEnd(e)}, false);
    }
  };

  this.setWindow = function(w, h){
    globals.window.width = w;
    globals.window.height = h;
    globals.canvas = globals.canvasDom.getContext('2d');
  };

  this.drawSprite = function(sprite){
    globals.sprites.push(sprite);
    globals.sprites.sort(function(a, b){return a.dz - b.dz});
    if(sprite.drawToSpriteMap) {
      this.drawToSpriteMap(utils.square(sprite.dx, sprite.dy,
        sprite.dWidth, sprite.dHeight));
    }
  };

  this.drawStaticSprite = function(sprite) {
    this.drawSprite(sprite);
  };
  
  this.setControlSprite = function(side, sprite){
    var canvas = globals.canvasDom;
    if(side == 'right') {
      sprite.dx = globals.window.width - sprite.dWidth;
      globals.controlSprites.right = sprite;
    } else if(side == 'left') {
      sprite.dx = 0;
      globals.controlSprites.left = sprite;
    }
    sprite.dy = canvas/2 - sprite.dHeight/2;
    this.drawSprite(sprite);
  };
  
  this.setView = function(angle, newx, newy){
    globals.view.angle = (angle)?angle:0;
    globals.view.pos = {
      x: (newx) ? newx : 0,
      y: (newy) ? newy : 0
    };
  };
  
  this.setBackground = function(sprite){
    globals.background = sprite;
    globals.playable.width = sprite.dWidth;
    globals.playable.height = sprite.dHeight;
    globals.spriteMap.width = globals.playable.width;
    globals.spriteMap.height = globals.playable.height;
    globals.spriteMapContext = globals.spriteMap.getContext('2d');
  };
  
  this.drawTrail = function(x, opt_clearHistory) {
    if(x && globals.trail.context == null) {
      globals.trail.canvas.width = globals.playable.width;
      globals.trail.canvas.height = globals.playable.height;
      globals.trail.context = globals.trail.canvas.getContext('2d');
    } else if (x && globals.trail.context != null && opt_clearHistory) {
      globals.trail.context.clearRect(0,0,globals.playable.width,globals.playable.height);
    }
    globals.drawTrail = x;
  };
  
  this.setTrailImage = function(imgPath) {
    globals.trail.image.src = imgPath;
  };
  
  this.setHero = function(sprite) {
    globals.hero = sprite;
    globals.hero.fixed = true;
    this.drawSprite(globals.hero);
  };
  
  this.drawObstacle = function(obj, beginCollision, endCollision) {
    this.drawSprite(obj);
    this.drawToSpriteMap(obj.hitAreaStatic);
    this.hitTest(globals.hero, obj, beginCollision, endCollision, true);
  };
  
  this.drawToSpriteMap = function(poly) {
    var cxt = globals.spriteMapContext;
    cxt.beginPath();
    cxt.moveTo(poly[0][0], poly[0][1]);
    for(var i in poly){
      cxt.lineTo(poly[i][0], poly[i][1]);
    }
    cxt.closePath();
    cxt.fillStyle = '#111';
    cxt.fill();
  };
  
  this.drawItem = function(obj, beginCollision, endCollision) {
    this.drawSprite(obj);
    this.hitTest(globals.hero, obj, beginCollision, endCollision, false);
  };
  
  this.hitTest = function(obj1, obj2, beginCollision, endCollision, solid) {
    globals.collisions.push({
      o1: obj1,
      o2: obj2,
      beginCollision: beginCollision,
      endCollision: endCollision,
      solid: solid,
      active: false
    });
  };
  
  this.start = function() {
    globals.canvas.fillStyle = 'black';
    globals.canvas.font = 'bold 35px Arial';
    globals.canvas.fillText('loading...', 100, 100);
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
    var context = globals.canvas,
    view = globals.view;
    
    context.clearRect(0,0,globals.window.width,globals.window.height);
    context.fillStyle = '#252f3c';
    context.fillRect(0,0,globals.window.width, globals.window.height);
    
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
    for(var i in globals.sprites){
      if(!globals.sprites[i].load) {
        return false;
      }
    }
    if(!globals.background.load ||
       !globals.controlSprites.left.load ||
       !globals.controlSprites.right.load) {
      return false;
    }
    return true;
  };
  
  var getHandleY = function(clientY){
    var h = globals.window.height;
    if(clientY < h/2 - 115)
      return h/2-115
    else if(clientY > h/2 + 115)
      return h/2+115
    else
      return clientY;
  };
  
  var handleTouchStart = function(e) {
    if(e.changedTouches[0].clientX > globals.window.width-70){
      globals.controlTouches.right = e.changedTouches[0];
    } else if(e.changedTouches[0].clientX < 70){
      globals.controlTouches.left = e.changedTouches[0];
    }
  };
  
  var handleTouchMove = function(e) {
    e.preventDefault();
  };
  
  var handleTouchEnd = function(e) {
    for(var i in e.changedTouches) {
      if(e.changedTouches[i] == globals.controlTouches.right){
        globals.controlTouches.right = null;
      } else if(e.changedTouches[i] == globals.controlTouches.left){
        globals.controlTouches.left = null;
      }
    }
  };
  
  var updateView = function() {
    var context = globals.canvas,
    view = globals.view,
    trailPoints = globals.trail.points,
    cSprt = globals.controlSprites,
    h = globals.window.height,
    touches = globals.controlTouches,
    t, r, l;
    
    if(touches.right)
      r = -1 * (getHandleY(globals.controlTouches.right.clientY)-h/2);
    else
      r = 0
      
    if(touches.left)  
      l = -1 * (getHandleY(globals.controlTouches.left.clientY)-h/2);
    else
      l = 0;
    
    view.angle += (((r-l)/2*Math.PI/180)/60);
    view.pos.x += (Math.sin(view.angle)*(r+l)/80);
    view.pos.y += (Math.cos(view.angle)*(r+l)/80);
    checkHits();
    
    
    checkPlayableBounds();
    
    if(globals.drawTrail) {
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
    var h = globals.window.height,
    cSprites = globals.controlSprites;
    
    if(!cSprites.right)
      cSprites.right = {set: false, dHeight:0};
    if(!cSprites.left)
      cSprites.left = {set: false, dHeight:0};
    
    if(globals.controlTouches.right) {
      var touch = globals.controlTouches.right;
      cSprites.right.dy = getHandleY(touch.clientY) - cSprites.right.dHeight/2;
    } else {
      cSprites.right.dy = h/2 -
      cSprites.right.dHeight/2;
    }
    
    if(globals.controlTouches.left) {
      var touch = globals.controlTouches.left;
      cSprites.left.dy = getHandleY(touch.clientY) - cSprites.left.dHeight/2;
    } else {
      cSprites.left.dy = h/2 -
      cSprites.left.dHeight/2;
    }
  };
  
  var checkPlayableBounds = function() {
    var view = globals.view;
    var w = globals.playable.width/2-10;
    var h = globals.playable.height/2-10;
    
    if (view.pos.x < -1*w) view.pos.x = -1*w;
    if (view.pos.x > w) view.pos.x = w;
    if (view.pos.y < -1*h) view.pos.y = -1*h;
    if (view.pos.y > h) view.pos.y = h;
  };
  
  var rotateCanvas = function(){
    var context = globals.canvas;
    context.save();
    context.translate(globals.window.width/2, globals.window.height/2);
    context.rotate(globals.view.angle);
  };
  
  var restoreCanvas = function(){
    globals.canvas.restore();
  };
  
  var drawBackground = function(){
    rotateCanvas();
    var bg = globals.background;
    globals.canvas.drawImage(bg.image,
      bg.sx, bg.sy,
      bg.sWidth, bg.sHeight,
      globals.view.pos.x-globals.playable.width/2,
      globals.view.pos.y-globals.playable.height/2,
      bg.dWidth, bg.dHeight
    );
    restoreCanvas();
  };
  
  var drawTrailToLevel = function(){
    rotateCanvas();
    globals.canvas.drawImage(globals.trail.canvas,
      globals.view.pos.x-globals.playable.width/2,
      globals.view.pos.y-globals.playable.height/2
    );
    restoreCanvas();
  };
  
  var drawPreviewMap = function(){
    var context = globals.canvas,
    prevW = globals.background.dWidth/10,
    prevH = globals.background.dHeight/10,
    prevPosX = globals.window.width - prevW - 10,
    prevPosY = globals.window.height - prevH - 10;
    context.fillStyle = 'rgba(0,0,0,0.3)';
    context.fillRect(prevPosX-1, prevPosY-1, prevW+2, prevH+2);
    context.drawImage(globals.trail.canvas,
      0, 0,
      prevW*10, prevH*10,
      prevPosX, prevPosY,
      prevW, prevH
    );
    context.drawImage(globals.spriteMap,
      0, 0,
      prevW*10, prevH*10,
      prevPosX, prevPosY,
      prevW, prevH
    );
  };
  
  var drawSprites = function(){
    for(var sId in globals.sprites) {
      var s = globals.sprites[sId];
      if(!s.fixed) {
        rotateCanvas();
        globals.canvas.drawImage(s.image,
          s.sx, //- globals.playable.width/2,
          s.sy, //- globals.playable.height/2,
          s.sWidth, s.sHeight,
          globals.view.pos.x + s.dx - globals.playable.width/2,
          globals.view.pos.y + s.dy - globals.playable.height/2,
          s.dWidth, s.dHeight
        );
        restoreCanvas();
      } else {
        globals.canvas.drawImage(s.image,
          s.sx, s.sy,
          s.sWidth, s.sHeight,
          s.dx, s.dy,
          s.dWidth, s.dHeight
        );
      }
    }
  };
  
  var runTimer = function() {
    if(globals.timer) {
      var self = this;
      globals.timer--;
      
      if(globals.timer == 0) {
        this.pause();
        globals.endFunction({
          trail : globals.trail,
          spriteMap: globals.spriteMapContext
        });
      }
      
      if(!globals.paused && globals.timer != 0)
        setTimeout(function(){runTimer.call(self)}, 1000);
    }
  }
  
  var drawTimer = function(){
    if(globals.timer){
      globals.canvas.font = 'bold 25px Arial';
      globals.canvas.fillText(globals.timer, 10, 35);
    }
  };
  
  var addToTrail = function(point){
    var preContext = globals.trail.context;
    globals.trail.points.push(point);
    
    preContext.drawImage(globals.trail.image,
      0, 0, 30, 30,
      -1*point.x+globals.playable.width/2-15, -1*point.y+globals.playable.height/2-15,
      30, 30
    );
    
  };
  
  var getHitArea = function(obj) {
    if(!obj.fixed) {
      var sqr2 = [[], [], [], []];
      var gvpx = globals.view.pos.x;
      var gvpy = globals.view.pos.y;
      
      for(var i = 0; i <= 3; i++){
        sqr2[i][0] = obj.hitAreaStatic[i][0] + gvpx - globals.playable.width/2;
        sqr2[i][1] = obj.hitAreaStatic[i][1] + gvpy - globals.playable.height/2;
      }
      
      return sqr2;
    
    } else {
      return utils.rotatePoly(globals.view.angle, obj.hitAreaStatic);
    }
    
  };
  
  var checkHits = function() {
    
    for(var i in globals.collisions) {
      cxt = globals.canvas;
      htest = globals.collisions[i];
    
      htest.o1.hitArea = getHitArea(htest.o1);
      htest.o2.hitArea = getHitArea(htest.o2);
      
        var item = utils.sat(htest.o1.hitArea, htest.o2.hitArea);
        if(item) {
          if(htest.solid) {
              globals.view.pos.x -= item.normal.x *-item.overlap;
              globals.view.pos.y -= item.normal.y *-item.overlap;
            }
          if(!htest.active) {
            htest.beginCollision.call(htest);
            htest.active = true;
          }
        } else if(htest.active) {
            htest.endCollision.call(htest);
            htest.active = false;
        } else {
            htest.active = false;
        }
      
    }
    
  };
  
};