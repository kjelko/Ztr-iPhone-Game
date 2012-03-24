var Sprite = function(p){
  this.load = false;
  
  var setLoad = function(){
    this.load = true;
  }
  
  var image = new Image();
  image.src = p.image;
  var that = this;
  image.onload = function(){setLoad.call(that)};
  this.image = image;
  this.sx = p.sx;
  this.sy = p.sy;
  this.sWidth = p.sWidth;
  this.sHeight = p.sHeight;00
  this.dx = p.dx;
  this.dy = p.dy;
  this.dWidth = p.dWidth;
  this.dHeight = p.dHeight;
};