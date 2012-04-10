/**
 * @fileoverview Contains some useful math related functions
 *
 */

var utils = {};


/**
 * Checks to see if point is inside a polygon.
 * @param {Object} poly The polygon.
 * @param {Object} pt The point.
 * 
 */
utils.pointInPoly = function(poly, pt){
	for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1]))
		&& (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
		&& (c = !c);
	return c;
}


/**
 * Provides a quick way to build a square.
 * @param {int} x The x coord of the top left corner.
 * @param {int} y The y coord of the top left corner.
 * @param {int} width
 * @param {int} height
 * @return {Object} An object containing the points of the square.
 * 
 */
utils.square = function(x, y, width, height) {
  return [[x, y], [x+width, y], [x+width, y+height], [x, y+height]];
}


/**
 * Rotates a polygon around a given angle.
 * @param {int} angle
 * @param {Object} The polygon to rotate.
 * @return {Object} An polygon object with updated points.
 * 
 */
utils.rotatePoly = function(angle, poly) {
  var cos = Math.cos(-1*angle),
  sin = Math.sin(-1*angle),
  poly1 = [];
  
  for(i = 0; i < poly.length; i++){
    poly1[i] = [];
    poly1[i][0] = cos * poly[i][0] - sin * poly[i][1];
    poly1[i][1] = cos * poly[i][1] + sin * poly[i][0];
  }
  
  return poly1;
};


/**
 * Defines the seperating axis theorem collision test.
 * @param {Object} poly1 Polygon object to check. 
 * @param {Object} poly2 Polygon object to check.
 * @return {Object} Returns an object with information about the collision.
 *
 */
utils.sat = function(poly1, poly2){
  var mtv, mtv2, norm1, norm2, current, next,
  dot, overlap, min1, max1, min2, max2, magnitude, norm = {};
  
  for(i = 0; i < poly1.length; i++) {
    current = poly1[i],
    next = poly1[(i == poly1.length-1) ? 0 : i+1];
    
    norm.x = -(next[1] - current[1]);
    norm.y = (next[0] - current[0]);
    magnitude = Math.sqrt(norm.x*norm.x + norm.y*norm.y);
    norm.x /= magnitude;
    norm.y /= magnitude;
    
    min1 = min2 = max1 = max2 = -1;
    
    for(j = 0; j < poly1.length; ++j) {
      dot = poly1[j][0] * norm.x + poly1[j][1] * norm.y;
      if(dot > max1 || max1 == -1) max1 = dot;
      if(dot < min1 || min1 == -1) min1 = dot;
    }
    
    for(j = 0; j < poly2.length; ++j) {
      dot = poly2[j][0] * norm.x + poly2[j][1] * norm.y;
      if(dot > max2 || max2 == -1) max2 = dot;
      if(dot < min2 || min2 == -1) min2 = dot;
    }
    
    if(min1 < min2) {
      overlap = min2 - max1;
      norm.x *= -1;
      norm.y *= -1;
    } else {
      overlap = min1 - max2;
    }
    
    if(overlap >= 0) return false;
    
    if(mtv == undefined || overlap > mtv){
      mtv = overlap;
      norm1 = {x: norm.x, y: norm.y};
    }
    
  }
  
  for(i = 0; i < poly2.length; i++) {
    current = poly2[i],
    next = poly2[(i == poly2.length-1) ? 0 : i+1];
    
    norm.x = -(next[1] - current[1]);
    norm.y = (next[0] - current[0]);
    magnitude = Math.sqrt(norm.x*norm.x + norm.y*norm.y);
    norm.x /= magnitude;
    norm.y /= magnitude;
    
    min1 = min2 = max1 = max2 = -1;
    
    for(j = 0; j < poly1.length; ++j) {
      dot = poly1[j][0] * norm.x + poly1[j][1] * norm.y;
      if(dot > max1 || max1 == -1) max1 = dot;
      if(dot < min1 || min1 == -1) min1 = dot;
    }
    
    for(j = 0; j < poly2.length; ++j) {
      dot = poly2[j][0] * norm.x + poly2[j][1] * norm.y;
      if(dot > max2 || max2 == -1) max2 = dot;
      if(dot < min2 || min2 == -1) min2 = dot;
    }
    
    if(min1 < min2) {
      overlap = min2 - max1;
      norm.x *= -1;
      norm.y *= -1;
    } else {
      overlap = min1 - max2;
    }
    
    if(overlap >= 0) return false;
    
    if(mtv2 == undefined || overlap > mtv2){
      mtv2 = overlap;
      norm2 = {x: norm.x, y: norm.y};
    }
    
  }
  
  if(Math.abs(mtv) < Math.abs(mtv2))
    return {overlap: mtv, normal: norm1};
  else
    return {overlap: mtv2, normal: norm2}
  
};