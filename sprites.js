/**
 * @fileoverview Defines the sprite class.
 * 
 */

/**
 * Constructor for sprites.
 * @param {Object} p An object that contains the necessary info to build a
 * sprite.
 * @todo Clean this shit up.
 * 
 */
var Sprite = function(p){
  var that = this;
  
  //Lets us know when the sprite image has loaded
  this.load = false;
  
  //Callback for onload event
  var setLoad = function(){
    this.load = true;
  }
  
  //Set up the onload listener for the sprite image
  var image = new Image();
  image.src = p.image;
  image.onload = function(){setLoad.call(that)};
  
  //sets all the boring stuff for canvas drawing
  this.image = image;
  this.sx = p.sx;
  this.sy = p.sy;
  this.sWidth = p.sWidth;
  this.sHeight = p.sHeight;
  this.dx = p.dx;
  this.dy = p.dy;
  this.dWidth = p.dWidth;
  this.dHeight = p.dHeight;
  
  //Determine if the sprite is fixed.  Defualt to false.
  if(p.fixed)
    this.fixed = true;
  else
    this.fixed = false;
  
  //Determine the z index of the sprite. Default to 0.
  if(p.dz != undefined)
    this.dz = p.dz;
  else
    this.dz = 0;
  
  //Set up the sprite hit area.  Defaults to the borders of the sprite.
  if(p.hitArea){
    this.hitAreaStatic = p.hitArea;
  } else {
    this.setHitArea([
      [this.dx, this.dy],
      [this.dx + this.dWidth, this.dy],
      [this.dx + this.dWidth, this.dy + this.dHeight],
      [this.dx, this.dy + this.dHeight]
    ]);
  }
  
};

/**
 * Sets the hit area for a sprite.
 * @param {Object} poly The polygon that defines the new hit area.
 */
Sprite.prototype.setHitArea = function(poly) {
  this.hitAreaStatic = poly;
};