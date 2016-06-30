///###### This is where we will store our helper functions ######//



//####### Get the mouse postion on the canvas ########
Graph.prototype.getMousePos = function(evt) {
    evt.preventDefault();
    var rect = this.canvas.getBoundingClientRect();
    if (window.event.touches) {
        return {
            x: (window.event.touches[0].pageX - rect.left) * this.ratio,
            y: (window.event.touches[0].pageY - rect.top) * this.ratio
        };
    } else {
        return {
            x: (evt.clientX - rect.left) * this.ratio,
            y: (evt.clientY - rect.top) * this.ratio
        };
    }
}


//########### Make the graph high resolution ###########
Graph.prototype.makeHighRes = function() {
    var ctx = this.canvas.getContext('2d');
    // finally query the various pixel ratios
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;
    var ratio = devicePixelRatio / backingStoreRatio;
    // upscale canvas if the two ratios don't match
    if (devicePixelRatio !== backingStoreRatio) {

        var oldWidth = this.canvas.width;
        var oldHeight = this.canvas.height;
        this.canvas.width = Math.round(oldWidth * ratio);
        this.canvas.height = Math.round(oldHeight * ratio);
        this.canvas.style.width = oldWidth + 'px';
        this.canvas.style.height = oldHeight + 'px';
        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        ctx.save();
        ctx.scale(ratio, ratio);
        this.ratio = ratio;
        ctx.restore();
    }
}


//########## Used to parse a string in to an element using jquery notation ########//
Graph.prototype.readElementString = function(data){
  var string = data; // The reason why we do this is because now string has all the methods prototyped to it
  var type = string.charAt(0);
  var name = string.substr(1);
  if(type == "#"){
    var element = document.getElementById(name);
  }else if(type == "."){
    var element = document.getElementsByClassName(name)[0];
  }else{
    var element = document.getElementsByTagName(string)[0];
  }

  return element;
}
