var utils = {};

utils.pointInPoly = function(poly, pt){
	for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
		&& (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
		&& (c = !c);
	return c;
}


utils.distance = function(pt, pt2) {
  return Math.sqrt(Math.pow((pt2.x - pt.x), 2) + Math.pow((pt2.y - pt.y), 2));
}

utils.polyOverlap = function(poly1, poly2){
  
  if(utils.checkPolyOverlap(poly1, poly2))
    return true;
  else if(utils.checkPolyOverlap(poly2, poly1))
    return true;
  else
    return false;
  
}

utils.checkPolyOverlap = function(poly1, poly2) {
    for(i = 0; i < poly1.length; i++){
    
    var x1 = poly1[i].x,
    y1 = poly1[i].y,
    x2 = (poly1[i+1]) ? poly1[i+1].x : poly1[0].x,
    y2 = (poly1[i+1]) ? poly1[i+1].y : poly1[0].y;  
  
    var dx = x2 - x1,
    dy = y2 - y1;
    bottom = Math.sqrt(dx*dx + dy*dy),
    normx = dx/bottom,
    normy = dy/bottom,
    curx = x1,
    cury = y1;
  
    var d = utils.distance({x:x1,y:y1},{x:x2,y:y2});
  
    while(utils.distance({x:x1,y:y1},{x:curx,y:cury}) < d) {
      if(utils.pointInPoly(poly2, {x:curx, y:cury})) {
        return true;
      }
      curx += 5*normx;
      cury += 5*normy;
    }
  }

  return false;
}

utils.square = function(x, y, width, height) {
  return [
    {x: x, y:y},
    {x: x+width, y:y},
    {x: x+width, y:y+height},
    {x: x, y:y+height}
  ]
}

utils.rotatePoly = function(angle, poly) {
  var cos = Math.cos(-1*angle),
  sin = Math.sin(-1*angle),
  poly2 = [];
  
  for(i = 0; i < poly.length; i++){
    poly2[i] = {};
    poly2[i].x = cos * poly[i].x - sin * poly[i].y;
    poly2[i].y = cos * poly[i].y + sin * poly[i].x;
  }
  
  return poly2;
};