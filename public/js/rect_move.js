//$(function () {
    //alert("Your screen resolution is: " + document.body.clientWidth + "x" +document.body.clientHeight);
    var defaultData;
    var isNext = false;
    var calFeetToPixel = function (width, height, viewboxOffset){
        var viewboxWidth = document.body.clientWidth -viewboxOffset,
        actualWidth= document.body.clientHeight-document.body.clientHeight*15/100,
        feetToPixel = (viewboxWidth / width).toFixed(3),
        rh= height*feetToPixel;
        feetToPixel=feetToPixel.slice(0,feetToPixel.length-1);
        
        if(rh> actualWidth){        
            feetToPixel = (actualWidth / height).toFixed(3);
            feetToPixel=feetToPixel.slice(0,feetToPixel.length-1);
        }

        return roundDown(feetToPixel, 0.5);
    }

    var getPaperConfig = function (width,height,viewboxOffset){
        var data= {}
        data.offset = viewboxOffset;
        data.width = width;
        data.height = height;
        data.viewboxOffset = viewboxOffset;
        data.viewboxRatio = calFeetToPixel(width, height, viewboxOffset);
        return data;
    }

    var paperConfig = getPaperConfig(420,300,30);
    var corridorConfig = {
        x:10,
        y:10,
        w:20,
        h:30*paperConfig.viewboxRatio,
        g:10*paperConfig.viewboxRatio,
        gridSize: 10 // in feet
    };
        var paper,
        mouseDownX = 0,
        mouseDownY = 0,
        shape,
        isCorridorDrawn = false;
   
    
    // Rect button click
    function drawShape(x,y,w,h,g, containerId){
        paper = Raphael(containerId, paperConfig.width*paperConfig.viewboxRatio, paperConfig.height*paperConfig.viewboxRatio);
        // set svg as background image
        paper.image("https://niranjankala.github.io/svg-editor/assets/Pagasus_POC_Site_3.svg", 0, 0, paperConfig.width*paperConfig.viewboxRatio, paperConfig.height*paperConfig.viewboxRatio);
        axis(paper,corridorConfig.gridSize,true,1,paperConfig.viewboxRatio);
        isCorridorDrawn = false;
        $('#'+containerId).unbind('mousedown');
        $('#'+containerId).unbind('mousemove');
        $('#'+containerId).unbind('mouseup');

        $('#'+containerId).mousedown(function (e) {
        // Prevent text edit cursor while dragging in webkit browsers
            $('#'+containerId).unbind('mousedown');
            $('#'+containerId).unbind('mousedown');    
            e.originalEvent.preventDefault();
            var offset = $("#svg_paper").offset();
            mouseDownX = getSnapToGridPoint((e.pageX - offset.left-20), corridorConfig.gridSize),
            mouseDownY = getSnapToGridPoint((e.pageY - offset.top-25), corridorConfig.gridSize)
            
            // mouseDownX = e.pageX - offset.left-20;
            // mouseDownY = e.pageY - offset.top-25;
            if(isCorridorDrawn == true) return false
            
            shape = DrawCorridor(mouseDownX, mouseDownY, w, h, g);                    
            var ft = paper.freeTransform(shape);
           
            $('#'+containerId).mousemove(function (e) {
                ft.unplug();
                var offset = $('#'+containerId).offset(),
                upX = e.pageX - offset.left,
                upY = e.pageY - offset.top,
                width = getDistaanceBetween(mouseDownX,mouseDownY+27,upX,upY); //upX - mouseDownX,
                height = upY - mouseDownY,
                angle=getAngle(mouseDownX,mouseDownY+27,upX,upY)	
                updatePath = `M ${mouseDownX},${mouseDownY}  L ${mouseDownX+width},${mouseDownY} L ${mouseDownX+width},${mouseDownY+h} L ${mouseDownX},${mouseDownY+h} L ${mouseDownX}, ${mouseDownY} z
                M ${mouseDownX},${mouseDownY+h+g}  L ${mouseDownX+width},${mouseDownY+h+g} L ${mouseDownX+width},${2*h+mouseDownY+g} L ${mouseDownX},${2*h+mouseDownY+g} L ${mouseDownX},${mouseDownY+h+g} z`
                
                shape.attr({path: updatePath})
                //paper.image("https://niranjankala.github.io/svg-editor/assets/Pagasus_POC_Site_3.svg", mouseDownX, mouseDownY, width, h);
                ft = paper.freeTransform(shape, {snap:{drag:corridorConfig.gridSize*paperConfig.viewboxRatio},snapDist:{drag:0}}, function(ft, events) {
                    
                    var bbox = shape.getBBox();
                    var calWidth = getWidth(bbox.width, bbox.height)/ paperConfig.viewboxRatio;
                    defaultData = {
                        x: bbox.cx,
                        cx: (bbox.cx - bbox.width / 2).toFixed(2),
                        cy: bbox.cy.toFixed(2),
                        width: calWidth.toFixed(2),  
                        height:(((h/paperConfig.viewboxRatio)*2)+g/paperConfig.viewboxRatio).toFixed(2),
                        rotate: ft.attrs.rotate.toFixed(2), 
                        gap: g, 
                        viewportRatio: paperConfig.viewboxRatio

                    }
                    $('#drawingData').html( `Drawing Data: cx= ${((defaultData.cx/paperConfig.viewboxRatio)-paperConfig.offset).toFixed(2)} ft, cy: ${ ((paperConfig.height -paperConfig.offset)-(defaultData.cy /paperConfig.viewboxRatio)).toFixed(2)} ft, width: ${defaultData.width-10} ft,  height: ${defaultData.height} ft, rotate: ${defaultData.rotate} deg, gap: ${defaultData.gap/paperConfig.viewboxRatio} ft, 1 feet: ${defaultData.viewportRatio} px`)
                });
                ft.attrs.rotate=angle;
                ft.apply();
            });
        });

        $('#'+containerId).mouseup(function (e) {
            $('#'+containerId).unbind('mousemove');
            var BBox = shape.getBBox();
            if (BBox.width == 0 && BBox.height == 0) shape.remove();
        });     
    }

    function getSnapToGridPoint(value, gridSize){
        return Math.round(value/ gridSize)*gridSize;
    }

    function drawFreeform(w,containerId){
        isCorridorDrawn = false;
        $('#'+containerId).unbind('mousedown');
        $('#'+containerId).unbind('mousemove');
        $('#'+containerId).unbind('mouseup');

        $('#'+containerId).mousedown(function (e) {
        // Prevent text edit cursor while dragging in webkit browsers
            $('#'+containerId).unbind('mousedown');
            $('#'+containerId).unbind('mousedown');    
            e.originalEvent.preventDefault();
            var offset = $("#svg_paper").offset();
            mouseDownX = e.pageX - offset.left-20;
            mouseDownY = e.pageY - offset.top-25;
            if(isCorridorDrawn == true) return false
            
            shape = DrawFreeform(mouseDownX, mouseDownY, w);                    
            var ft = paper.freeTransform(shape);
           
            $('#'+containerId).mousemove(function (e) {
                ft.unplug();
                var offset = $('#'+containerId).offset(),
                upX = e.pageX - offset.left,
                upY = e.pageY - offset.top,
                width = getDistaanceBetween(mouseDownX,mouseDownY+27,upX,upY); //upX - mouseDownX,
                height = upY - mouseDownY,
                //angle=getAngle(mouseDownX,mouseDownY+27,upX,upY)	
                updatePath = `M ${mouseDownX},${mouseDownY}  L ${mouseDownX+width},${mouseDownY}`
                
                shape.attr({path: updatePath})
                //paper.image("https://niranjankala.github.io/svg-editor/assets/Pagasus_POC_Site_3.svg", mouseDownX, mouseDownY, width, h);
                ft = paper.freeTransform(shape, { }, function(ft, events) {
                    var bbox = shape.getBBox();
                    var calWidth = getWidth(bbox.width, bbox.height)/ paperConfig.viewboxRatio;
                    // defaultData = {
                    //     x: bbox.cx,
                    //     cx: (bbox.cx - bbox.width / 2).toFixed(2),
                    //     cy: bbox.cy.toFixed(2),
                    //     width: calWidth.toFixed(2),  
                    //     height:(((h/paperConfig.viewboxRatio)*2)+g).toFixed(2),
                    //     rotate: ft.attrs.rotate.toFixed(2), 
                    //     gap: g, 
                    //     viewportRatio: paperConfig.viewboxRatio

                    // }
                    //$('#drawingData').html( `Drawing Data: cx= ${(defaultData.cx/paperConfig.viewboxRatio).toFixed(2)} ft, cy: ${(defaultData.cy /paperConfig.viewboxRatio).toFixed(2)} ft, width: ${defaultData.width} ft,  height: ${defaultData.height} ft, rotate: ${defaultData.rotate} deg, gap: ${defaultData.gap} 1 feet: ${defaultData.viewportRatio} px`)
                });
                //ft.attrs.rotate=angle;
                ft.apply();
            });
        });

        $('#'+containerId).mouseup(function (e) {
            $('#'+containerId).unbind('mousemove');
            var BBox = shape.getBBox();
            if (BBox.width == 0 && BBox.height == 0) shape.remove();
        });   
        
    }

    // Delete corridor
    $("#del").click(function (e) {
        isCorridorDrawn = false;
        paper.remove();
        $('#drawingData').html('<p> Drawing Data: </p>')
        drawShape(corridorConfig.x,corridorConfig.y,corridorConfig.w,corridorConfig.h,corridorConfig.g, 'svg_paper')
    });

    $("#rotate90").click(function (e) {
        var ft = paper.freeTransform(shape);
        ft.attrs.rotate=90;
        ft.apply();
    });

    $("#next").click(function (e) {
        isNext = true;
        var ft = paper.freeTransform(shape);
        ft.unplug();
        shape.remove();
        paper.image("https://global-uploads.webflow.com/5b44edefca321a1e2d0c2aa6/5c9101995ef96ffcb1b71f02_Dimensions-Guide-Layout-Kitchens-Galley-Two-Row-Kitchen-Dimensions.svg", defaultData.cx, defaultData.cy, 430, 300);
    });

    drawShape(corridorConfig.x,corridorConfig.y,corridorConfig.w,corridorConfig.h,corridorConfig.g, 'svg_paper');

    $("#freeform_drawing").click(function (e) {
        var ft = paper.freeTransform(shape);
        ft.unplug();
        shape.remove();
        isCorridorDrawn = false;
        $('#drawingData').html('<p> Drawing Data: </p>');
        drawFreeform(10,'svg_paper')
    });
    

    
    
//});
