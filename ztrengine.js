var Ztr = function(cvs, windowW, windowH){

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
    endFunction : null
  };
  
  /* ----------------- Public Functions --------------------*/
  
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
  
  var runTimer = function() {
    if(globals.timer) {
      var self = this;
      globals.timer--;
      
      if(globals.timer == 0) {
        this.pause();
        globals.endFunction({
          trail : globals.trail
        });
      }
      
      if(!globals.paused && globals.timer != 0)
        setTimeout(function(){runTimer.call(self)}, 1000);
    }
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
    sprite.dx = sprite.dx - globals.playable.width/2;
    sprite.dy = sprite.dy - globals.playable.height/2;
    sprite.fixed = false;
    sprite.id = globals.sprites.length;
    globals.sprites[sprite.id] = sprite;
  };

  this.drawStaticSprite = function(sprite) {
    sprite.fixed = true;
    globals.staticSprites.push(sprite);
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
    this.drawStaticSprite(sprite);
  }
  
  this.deleteSprite = function(sprite){
    globals.sprites[sprite.id] = null;
  }
  
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
  };
  
  this.drawTrail = function(x, opt_clearHistory) {
    if(x && globals.trail.context == null) {
      globals.trail.canvas.width = globals.background.dWidth;
      globals.trail.canvas.height = globals.background.dHeight;
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
    globals.hero.hitAreaStatic = [
      {x: globals.view.pos.x - sprite.dWidth/2,
       y: globals.view.pos.y - sprite.dHeight/2},
           
      {x: globals.view.pos.x - sprite.dWidth/2 + sprite.dWidth,
       y: globals.view.pos.y - sprite.dHeight/2},
           
      {x: globals.view.pos.x - sprite.dWidth/2 + sprite.dWidth,
       y: globals.view.pos.y - sprite.dHeight/2 + sprite.dHeight},
           
      {x: globals.view.pos.x - sprite.dWidth/2,
       y: globals.view.pos.y - sprite.dHeight/2 + sprite.dHeight}
    ];
    globals.staticSprites.push(globals.hero);
  };
  
  this.setStaticHitArea = function(sprite, polygon){
    sprite.hitAreaStatic = polygon;
  }
  
  
  this.drawObstacle = function(obj, beginCollision, endCollision) {
    this.drawSprite(obj);
    this.hitTest(globals.hero, obj, beginCollision, endCollision, true);
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
  
  var getHitArea = function(obj) {
    if(!obj.fixed) {
      var sqr2 = [[], [], [], []];
      var gvpx = globals.view.pos.x;
      var gvpy = globals.view.pos.y;
      
      sqr2[0][0] = obj.dx + gvpx;
      sqr2[0][1] = obj.dy + gvpy;
      
      sqr2[1][0] = obj.dx + gvpx + obj.dWidth;
      sqr2[1][1] = obj.dy + gvpy;
      
      sqr2[2][0] = obj.dx + gvpx + obj.dWidth;
      sqr2[2][1] = obj.dy + gvpy + obj.dHeight;
      
      sqr2[3][0] = obj.dx + gvpx;
      sqr2[3][1] = obj.dy + gvpy + obj.dHeight;
      
      return sqr2;
    
    } else {
      return utils.rotatePoly(globals.view.angle, obj.hitAreaStatic);
    }
    
  };
  
  var checkHits = function() {
    
    for(i in globals.collisions) {
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
  
  this.start = function() {
    globals.canvas.fillStyle = 'black';
    globals.canvas.font = 'bold 35px Arial';
    globals.canvas.fillText('loading...', 100, 100);
    checkSpritesLoaded.call(this);
  };
  
  /* ----------------- Private Functions -------------------- */

  var checkSpritesLoaded = function(){
    var that = this;
    if(spritesLoaded()) {
      this.setTouchListeners();
      this.resume();
    } else {
      setTimeout(function(){checkSpritesLoaded.call(that)}, 100);
    }
  }

  var loop = function(){
    var context = globals.canvas,
    view = globals.view;
    
    context.clearRect(0,0,globals.window.width,globals.window.height);
    context.fillStyle = '#252f3c';
    context.fillRect(0,0,globals.window.width, globals.window.height);
    
    updateControls();
    updateView();
    
    context.save();
    context.translate(globals.window.width/2, globals.window.height/2);
    context.rotate(view.angle);
    
    drawBackground();
    
    drawTrailToLevel();
    drawSprites();
    
    context.restore();
    
    drawPreviewMap();
    drawStaticSprites();
    drawTimer();
    
  };
  
  var drawTimer = function(){
    if(globals.timer){
      globals.canvas.font = 'bold 25px Arial';
      globals.canvas.fillText(globals.timer, 10, 35);
    }
  };
  
  var drawBackground = function(){
    var bg = globals.background;
    globals.canvas.drawImage(bg.image,
      bg.sx, bg.sy,
      bg.sWidth, bg.sHeight,
      globals.view.pos.x-globals.playable.width/2,
      globals.view.pos.y-globals.playable.height/2,
      bg.dWidth, bg.dHeight
    );
  };
  
  var drawTrailToLevel = function(){
    globals.canvas.drawImage(globals.trail.canvas,
      globals.view.pos.x-globals.playable.width/2,
      globals.view.pos.y-globals.playable.height/2
    );
  };
  
  var spritesLoaded = function(){
    for(i in globals.sprites){
      if(!globals.sprites[i].load) {
        return false;
      }
    }
    for(i in globals.staticSprites){
      if(!globals.staticSprites[i].load) {
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
  
  var drawPreviewMap = function(){
    var context = globals.canvas,
    prevW = globals.background.dWidth/10,
    prevH = globals.background.dHeight/10,
    prevPosX = globals.window.width - prevW - 10,
    prevPosY = globals.window.height - prevH - 10;              //change this
    context.fillStyle = 'rgba(0,0,0,0.3)';
    context.fillRect(prevPosX-1, prevPosY-1, prevW+2, prevH+2);
    context.drawImage(globals.trail.canvas,
      0, 0,
      prevW*10, prevH*10,
      prevPosX, prevPosY,
      prevW, prevH
    );
  };
  
  var drawSprites = function(){
    for(sId in globals.sprites) {
      s = globals.sprites[sId];
      if(s) {
        globals.canvas.drawImage(s.image,
          s.sx, s.sy,
          s.sWidth, s.sHeight,
          globals.view.pos.x + s.dx, globals.view.pos.y+s.dy,
          s.dWidth, s.dHeight
        );
      }
    }
  }
  
  var drawStaticSprites = function(){
    var context = globals.canvas;
    for(sId in globals.staticSprites) {
      s = globals.staticSprites[sId];
        context.drawImage(s.image,
          s.sx, s.sy,
          s.sWidth, s.sHeight,
          s.dx, s.dy,
          s.dWidth, s.dHeight
        );
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
  
  var checkPlayableBounds = function() {
    var view = globals.view;
    var w = globals.playable.width/2-10;
    var h = globals.playable.height/2-10;
    
    if (view.pos.x < -1*w) view.pos.x = -1*w;
    if (view.pos.x > w) view.pos.x = w;
    if (view.pos.y < -1*h) view.pos.y = -1*h;
    if (view.pos.y > h) view.pos.y = h;
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
    for(i in e.changedTouches) {
      if(e.changedTouches[i] == globals.controlTouches.right){
        globals.controlTouches.right = null;
      } else if(e.changedTouches[i] == globals.controlTouches.left){
        globals.controlTouches.left = null;
      }
    }
  };
  
};