//$(function () {
// for create grid



function axis (r,f, grid, offset,ratio) {
    var g = grid || false;
    var o = offset || 2;
    var w=r.width;
    var h=r.height;
    
    r.path("M"+w+","+o+"L0,"+o+"L"+o+","+h).attr("stroke", "red");
    r.path("M"+w+","+o+"L"+(w-5)+",5").attr("stroke", "red");
    r.path("M"+o+","+h+"L5,"+(h-5)).attr("stroke", "red");
    var len = grid ? h : 50;
    for (var i=0,j=-3; i<=w/f; i=i+ratio,j++) {    
     //   debugger  
      if(j%5 == 0 ) {
        r.path("M"+i*f+",0L"+i*f+","+len).attr({"stroke": "#696969", "stroke-width":0.50});
        r.text(i*f-10,h-10,(i*f/ratio)-30).attr({"fill": "blue", "stroke-width":1});
        }
     else
       r.path("M"+i*f+",0L"+i*f+","+len).attr({"stroke": "#696969", "stroke-width":0.25});

    }
    
    
    // var len = grid ? w : 10
    // for (var i=0,j=-3; i<=h/f; i=i+ratio,j++) {
    //   if(j%5 == 0  )
    //   {
    //       r.path("M0,"+i*f+"L"+len+","+i*f).attr({"stroke": "#696969","stroke-width":0.50});
    //       //debugger
    //       r.text(10,h-(i*f-10),i*f/ratio-30).attr("fill", "blue");
    //  }
    //   else
    //   r.path("M0,"+i*f+"L"+len+","+i*f).attr({"stroke": "#696969","stroke-width":0.25});
    // }

    var len = grid ? w : 10
    for (var i=h/f,j=-3; i>0; i=i-ratio,j++) {
      if(j%5 == 0  )
      {
          r.path("M0,"+i*f+"L"+len+","+i*f).attr({"stroke": "#696969","stroke-width":0.50});
          //debugger
          r.text(10,h-10-(i*f),i*f/ratio-20).attr("fill", "blue");
     }
      else
      r.path("M0,"+i*f+"L"+len+","+i*f).attr({"stroke": "#696969","stroke-width":0.25});
    }
}

// draw corridor
function DrawCorridor(x, y, w, h, g) {
    isCorridorDrawn = true;
    var element = paper.path(`M ${x},${y}  L ${x+w},${y} L ${x+w},${y+h} L ${x},${y+h} L ${x}, ${y} z` +
        `M ${x},${y+h+g}  L ${x+w},${y+h+g} L ${x+w},${2*h+y+g} L ${x},${2*h+y+g} L ${x},${y+h+g} z`)
        .attr({'fill': '#D3D3D3', "stroke": '#D3D3D3'})                            
        
    $(element.node).attr('id', 'path' + x + y);
    element.click(function (e) {
        elemClicked = $(element.node).attr('id');
    });
    return element;                
}

// draw corridor
function DrawFreeform(x, y, w) {
    isCorridorDrawn = true;
    var element = paper.path(`M ${x},${y}  L ${x+w},${y} `)
        .attr({'fill': '#D3D3D3', "stroke": '#D3D3D3'})                            
        
    $(element.node).attr('id', 'path' + x + y);
    element.click(function (e) {
        elemClicked = $(element.node).attr('id');
    });
    return element;                
}

/**
     * Fetches angle between centre of x and y and current x  and y 
     * where 3 O'Clock is 0 and 12 O'Clock is 270 degrees
     * 
     * @param cx centre of x co-ordinate
     * @param cy centre of y co-ordinate
     * @param x current mouse x co-ordinate
     * @param y current mouse y co-ordinate
     * @return angle in degress from 0-360.
*/
				
function getAngle(cx,cy,x,y) {
    var dx = x - cx;
    // Minus to correct for coord re-mapping
    var dy = -(y - cy);
    var inRads = Math.atan2(dy, dx);
    // We need to map to coord system when 0 degree is at 3 O'clock, 270 at 12 O'clock
    if (inRads < 0)
        inRads = Math.abs(inRads);
    else
        inRads = 2 * Math.PI - inRads;
    return inRads * 180 / Math.PI;
}

function getWidth(w,h){
    return Math.sqrt( w*w + h*h );
}

function getDistaanceBetween(cx,cy,mx,my){
    return getWidth(cx-mx,cy-my);
}

function roundDown(number, modulus) {
    var remainder = number % modulus;
    if (remainder == 0) {
        return number;
    } else {
        return number  - remainder;
    }
}



//});