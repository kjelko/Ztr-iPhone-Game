/**
 * @fileoverview Defines the UI class that is used to handle some general
 * UI functions through the canvas.
 *
 */

/**
 * Creates a new Ui object.
 * @param {HTMLCanvas} canvas The canvas element to use.
 * @param {2dCanvasContext} cxt The 2d context of canvas.
 * @constructor
 * 
 */
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


/**
 * Determine if the visitor is on a phone or not.
 * @return {boolean} True if the device is a phone.
 * 
 */
Ui.prototype.isTouchDevice = function(){
  return (window.Touch) ? true : false;
};


/**
 * Handles any touch event.
 * @param {event} e The touch event.
 */
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


/**
 * Handles any click event.
 * @param {event} e The click event.
 * 
 */
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

/**
 * Set up the event listeners.
 * 
 */
Ui.prototype.setListeners = function(){
  var self = this;
  if(this.isTouchDevice()) {
    this.canvas.addEventListener('touchstart',
      function(e){self.handleTouch.call(self, e)});
  } else {
    this.canvas.addEventListener('click',
      function(e){self.handleClick.call(self, e)});
  }
};


/**
 * Adds a new button to the UI.
 * @param {Object} button A button with coords, callback, etc.
 * 
 */
Ui.prototype.addButton = function(button){
  this.buttons.push(button);
  this.drawButton(button);
};


/**
 * Physically draws the button on the canvas.
 * @param {Object} button The button to draw.
 *
 */
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


/**
 * Writes some text to the canvas.
 * @param {string} text The string to write out.
 * @param {Object} pos The xy position of the string.
 * @todo Add an align option.
 * 
 */
Ui.prototype.addText = function(text, pos){
  this.context.fillStyle = '#000';
  this.context.font = 'bold 45px Arial';
  this.context.fillText(text, pos[0], pos[1]);
};


/**
 * Clears the canvas and (optionally) any buttons.
 * @param {boolean} clearButtons Whether to clear buttons or not.
 *
 */
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


/**
 * Draws a sprite object to the canvas.
 * @param {Object} s A sprite to draw.
 *
 */
Ui.prototype.drawSprite = function(s){
  this.context.drawImage(s.image,
    s.sx, s.sy,
    s.sWidth, s.sHeight,
    s.dx, s.dy,
    s.dWidth, s.dHeight
  );
};


/**
 * Creates a new button object.
 * @param {Object} rect An object containing points of the rectangle.
 * @param {string || HTMLImage} Color/image to use as a background for button.
 * @param {function} callback The function to call when button is hit.
 *
 */
Ui.button = function(rect, fill, callback){
  this.coords = rect;
  if(typeof(fill) == 'string') {
    this.fill = fill;
  } else {
    this.image = fill;
  }
  this.callback = callback;
};