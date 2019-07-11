var paper = Raphael(100, 300, 1000, 500);
var axis = function (r, grid, offset) {
    var g = grid || false;
    var o = offset || 2;
  
    var w=r.width;
    var h=r.height;
  
    r.path("M"+w+","+o+"L0,"+o+"L"+o+","+h).attr("stroke", "red");
    r.path("M"+w+","+o+"L"+(w-5)+",5").attr("stroke", "red");
    r.path("M"+o+","+h+"L5,"+(h-5)).attr("stroke", "red");
  
    var len = grid ? h : 10;
    for (var i=1; i<=w/50; i=i+1) {
      r.path("M"+i*50+",0L"+i*50+","+len).attr("stroke", "gray");
      if(i%2 == 0) r.text(i*50-10,10,i*50).attr("fill", "blue");
    }
  
    var len = grid ? w : 10
    for (var i=1; i<=h/50; i=i+1) {
      r.path("M0,"+i*50+"L"+len+","+i*50).attr("stroke", "gray");
      if(i%2 == 0) r.text(10,i*50-10,i*50).attr("fill", "blue");
    }
  }
axis(paper)
	// var rect = paper
	// 	.rect(200, 200, 100, 100)
    //     .attr('fill', '#f00');
        var d = "M 10,10 L 400,10 L 400,180 L 10,180 L 10,10 M 10,80 L 400,80 L 400,180 L 10,180 L 10,80 M 10,110 L 400,110 L 400,180 L 10,180 L 10,100";
        
        var mark = paper.path(d)
        .attr('fill', '#d3d3d3');

	// Add freeTransform
	//var ft = paper.freeTransform(mark);

	// Hide freeTransform handles
	//ft.hideHandles();

	// Show hidden freeTransform handles
	

	// Apply transformations programmatically
	//ft.attrs.rotate = 45;

	

	// Remove freeTransform completely
	//ft.unplug();

	// Add freeTransform with options and callback
	ft = paper.freeTransform(mark, { keepRatio: true }, function(ft, events) {
		console.log(ft,"ft");
    });
    ft.showHandles();
    
    ft.apply();

	// Change options on the fly
    //ft.setOpts({ keepRatio: false });
    
    $( "#showSampleSVG" ).click(function() {
        $("#svgContainer").show();
        $("#svgContainer").html(' <object id="mySVG" type="image/svg+xml" data="https://niranjankala.github.io/svg-editor/assets/Basic-Shapes.svg"></object>');
    });
    $( "#hideSampleSVG" ).click(function() {
        $("#svgContainer").hide();
        $("#svgContainer").html('');
    });

    var paper1 = Raphael(100, 900, 1000, 500);
    paper1.setStart();
paper1.circle(10, 10, 5),
paper1.circle(30, 10, 5)
var st = paper1.setFinish();
st.attr({fill: "red"});