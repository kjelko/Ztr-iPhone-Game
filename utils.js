var utils = {};

utils.pointInPoly = function(poly, pt){
	for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1]))
		&& (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
		&& (c = !c);
	return c;
}


utils.distance = function(pt, pt2) {
  return Math.sqrt(Math.pow((pt2[0] - pt[0]), 2) + Math.pow((pt2[1] - pt[1]), 2));
}

utils.polyOverlap = function(poly1, poly2){
  if(utils.checkPolyOverlap(poly1, poly2)) {
    return true;
  } else if(utils.checkPolyOverlap(poly2, poly1)) {
    return true;
  } else {
    return false;
  }
};

utils.checkPolyOverlap = function(poly1, poly2) {
    for(i = 0; i < poly1.length; i++){
    
      var x1 = poly1[i][0],
      y1 = poly1[i][1],
      x2 = (poly1[i+1]) ? poly1[i+1][0] : poly1[0][0],
      y2 = (poly1[i+1]) ? poly1[i+1][1] : poly1[0][1];  
    
      var dx = x2 - x1,
      dy = y2 - y1;
      bottom = Math.sqrt(dx*dx + dy*dy),
      unitx = dx/bottom,
      unity = dy/bottom,
      curx = x1,
      cury = y1;
    
      var d = utils.distance([x1, y1],[x2, y2]);
    
      var pointsColliding = 0;
    
      while(utils.distance([x1, y1], [x2, y2]) < d) {
        if(utils.pointInPoly(poly2, [curx, cury])) {
          return true;
        }
        curx += 5*unitx;
        cury += 5*unity;
      }
  }
}

utils.square = function(x, y, width, height) {
  return [[x, y], [x+width, y], [x+width, y+height], [x, y+height]];
}

utils.rotatePoly = function(angle, poly) {
  var cos = Math.cos(-1*angle),
  sin = Math.sin(-1*angle),
  poly2 = [];
  
  for(i = 0; i < poly.length; i++){
    poly2[i] = [];
    poly2[i][0] = cos * poly[i][0] - sin * poly[i][1];
    poly2[i][1] = cos * poly[i][1] + sin * poly[i][0];
  }
  
  return poly2;
};






utils.sat = function(poly1, poly2) {
    var points1 = poly1,
			points2 = poly2,
			i = 0, l = points1.length,
			j, k = points2.length,
			normal = {x: 0, y: 0},
			length,
			min1, min2,
			max1, max2,
			interval,
			MTV = null,
			MTV2 = null,
			MN = null,
      MN2 = null,
			dot,
			nextPoint,
			currentPoint;
		
		//loop through the edges of Polygon 1
		for(;i<l;i++) {
			nextPoint = points1[(i==l-1 ? 0 : i+1)];
			currentPoint = points1[i];
			
			//generate the normal for the current edge
			normal.x = -(nextPoint[1] - currentPoint[1]);
			normal.y = (nextPoint[0] - currentPoint[0]);
			
			//normalize the vector
			length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
			normal.x /= length;
			normal.y /= length;
			
			//default min max
			min1 = min2 = -1;
			max1 = max2 = -1;
			
			//project all vertices from poly1 onto axis
			for(j = 0; j < l; ++j) {
				dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
				if(dot > max1 || max1 === -1) max1 = dot;
				if(dot < min1 || min1 === -1) min1 = dot;
			}
			
			//project all vertices from poly2 onto axis
			for(j = 0; j < k; ++j) {
				dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
				if(dot > max2 || max2 === -1) max2 = dot;
				if(dot < min2 || min2 === -1) min2 = dot;
			}
			
			//calculate the minimum translation vector should be negative
			if(min1 < min2) {
			    interval = min2 - max1;
				
				normal.x = -normal.x;
			    normal.y = -normal.y;
			} else {
			    interval = min1 - max2;			   
			}
			
			//exit early if positive
			if(interval >= 0) {
				return false;
			}
			
			if(MTV === null || interval > MTV) {
				MTV = interval;
				MN = {x: normal.x, y: normal.y};
			}
		}
		
		//loop through the edges of Polygon 2
		for(i=0;i<k;i++) {
			nextPoint = points2[(i==k-1 ? 0 : i+1)];
			currentPoint = points2[i];
			
			//generate the normal for the current edge
			normal.x = -(nextPoint[1] - currentPoint[1]);
			normal.y = (nextPoint[0] - currentPoint[0]);
			
			//normalize the vector
			length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
			normal.x /= length;
			normal.y /= length;
			
			//default min max
			min1 = min2 = -1;
			max1 = max2 = -1;
			
			//project all vertices from poly1 onto axis
			for(j = 0; j < l; ++j) {
				dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
				if(dot > max1 || max1 === -1) max1 = dot;
				if(dot < min1 || min1 === -1) min1 = dot;
			}
			
			//project all vertices from poly2 onto axis
			for(j = 0; j < k; ++j) {
				dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
				if(dot > max2 || max2 === -1) max2 = dot;
				if(dot < min2 || min2 === -1) min2 = dot;
			}
			
			//calculate the minimum translation vector should be negative
			if(min1 < min2) {
			    interval = min2 - max1;
				  normal.x = -normal.x;
			    normal.y = -normal.y;
			} else {
			    interval = min1 - max2;
			}
			
			//exit early if positive
			if(interval >= 0) {
				return false;
			}
			
			if(interval > MTV2 || MTV2 === null) {
				MTV2 = interval;
				MN2 = {x: normal.x, y: normal.y};
			}
		}
		if(Math.abs(MTV) < Math.abs(MTV2))
    return {overlap: MTV, normal: MN};
    else
    return {overlap: MTV2, normal: MN2};
	
  }


