var Ui = function(canvas, context){
  
  this.canvas = canvas
  this.context = context
  if(window.devicePixelRatio) {
    ratio = window.devicePixelRatio;
  } else {
    ratio = 1;
  }
  
    this.canvas.width = window.innerWidth * ratio;
    this.canvas.height = window.innerHeight * ratio;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    function preventTouchMove(e) {e.preventDefault()}
    this.canvas.addEventListener('touchmove', preventTouchMove, false);
  
  this.context.scale(ratio, ratio);
  this.setListeners();
  this.buttons = [];
  
  this.clear();

};


Ui.prototype.isTouchDevice = function(){
  return (window.Touch) ? true : false;
};


Ui.prototype.handleTouch = function(e){
  
  for(i in this.buttons){
    var b = this.buttons[i],
    touchx = e.changedTouches[0].clientX,
    touchy = e.changedTouches[0].clientY;
    if(utils.pointInPoly(b.coords, [touchx, touchy])) {
      b.callback.call();
    }
  }
};


Ui.prototype.handleClick = function(e){
  for(i in this.buttons){ 
    var b = this.buttons[i],
    clickx = e.clientX - this.canvas.offsetLeft,
    clicky = e.clientY - this.canvas.offsetTop;
    if(utils.pointInPoly(b.coords, [clickx, clicky])) {
      b.callback();
    }
  }
};

Ui.prototype.setListeners = function(){
  var self = this;
  if(this.isTouchDevice()) {
    this.canvas.addEventListener('touchstart', function(e){self.handleTouch.call(self, e)});
  } else {
    this.canvas.addEventListener('click', function(e){self.handleClick.call(self, e)});
  }
};


Ui.prototype.addButton = function(button){
  this.buttons.push(button);
  this.drawButton(button);
};


Ui.prototype.drawButton = function(button) {
  if(button.fill) {
    this.context.fillStyle = button.fill;
    this.context.fillRect(button.coords[0][0], button.coords[0][1],
      button.coords[1][0] - button.coords[0][0],
      button.coords[3][1] - button.coords[0][1])
  } else if(button.image) {
    //this.context.drawImage();
  }
};


Ui.prototype.addText = function(text, pos){
  this.context.fillStyle = '#000';
  this.context.font = 'bold 45px Arial';
  this.context.fillText(text, pos[0], pos[1]);
};


Ui.prototype.clear = function(clearButtons){
  var self = this;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.fillStyle ='#eee';
  this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
  if(clearButtons) {
    this.buttons = [];
  } else {
    for(i = 0; i < this.buttons.length; i++)
      this.drawButton(this.buttons[i]);
  }
};


Ui.button = function(rect, fill, callback){
  this.coords = rect;
  if(typeof(fill) == 'string') {
    this.fill = fill;
  } else {
    this.image = fill;
  }
  this.callback = callback;
};

Ui.prototype.drawSprite = function(s){
  this.context.drawImage(s.image,
    s.sx, s.sy,
    s.sWidth, s.sHeight,
    s.dx, s.dy,
    s.dWidth, s.dHeight
  );
};