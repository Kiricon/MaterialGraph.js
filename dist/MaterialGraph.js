var Graph = function(canvas, dataset) {
    this.canvas = canvas;
    this.dataset = dataset;
    this.points = [];
    this.drawPoints = [];
    this.position = {
        x: 0,
        y: 0
    };
    this.min = 0;
    this.max = 0;
    this.highlight = "";
    this.point = {};
    this.ratio = 1;
    this.realWidth;
    this.tooltip = {x: this.canvas.width/2, y: this.canvas.height/2, radius: 0, oldx: 0};


    this.init();      //Instantiate the graph it self.
    this.convert();   //Convert the dataset to usable pixel points
    //this.draw();      //Draw up the graph using the converted points and mouse locations.
    var self = this;
    var timer=setInterval(function(){self.draw();},20);
    this.listen();    //Listen for Mouse or Touch Events
}

//########## INSTANTIATE THE GRAPH AND MAKE IT HIGH RESOLUTION ######
Graph.prototype.init = function() {
    var ctx = this.canvas.getContext("2d");
    this.makeHighRes();
}

//######### LISTEN FOR MOUSE EVENTS ON THE GRAPH ######
Graph.prototype.listen = function() {
    var self = this;
    this.canvas.addEventListener('mousemove', function(evt) {
        self.position = self.getMousePos(evt);
      //  self.draw();
    }, false);

    this.canvas.addEventListener('touchmove', function(evt) {
        self.position = self.getMousePos(evt);
      //  self.draw();
    }, false);

    this.canvas.addEventListener('touchstart', function(evt) {
        self.position = self.getMousePos(evt);
      //  self.draw();
    }, false);
}


//### Convert the dataset in to usable points on the graph ####//
Graph.prototype.convert = function(){
  var padding = this.canvas.width /10;
  var largestX = 0;
  var largestY = 0;

  this.dataset.forEach(function(value){
    if(value.x > largestX){
      largestX = value.x;
    }

    if(value.y > largestY){
      largestY = value.y;
    }
  });

  var smallestX = largestX;
  var smallestY = largestY;

  this.dataset.forEach(function(value){
    if(value.x < smallestX){
      smallestX = value.x;
    }

    if(value.y < smallestY){
      smallestY = value.y;
    }
  });

  var diffX = Math.abs(largestX - smallestX);
  var diffY = Math.abs(largestY - smallestY);

  //var NewMax = this.canvas.Width * this.ratio;
  var NewMax = this.canvas.width - padding;
  var NewMin = padding;
  this.min = NewMin;
  this.max = NewMax;
  if(diffX > diffY){
    var OldMax = largestX;
    var OldMin = smallestX;
  }else{
    var OldMax = largestY;
    var OldMin = smallestY;
  }

  var OldRange = (OldMax - OldMin);
  var NewRange = (NewMax - NewMin);
  var self = this;
  this.dataset.forEach(function(value, index){
    var obj = {
      x: Math.round((((value.x - OldMin) * NewRange) / OldRange) + NewMin),
      y: Math.round((self.canvas.width-20) - ((((value.y - OldMin) * NewRange) / OldRange) + NewMin))
    };
    self.drawPoints.push(obj);
    if(self.drawPoints[index-1]){
    var prevobj = {x:self.drawPoints[index -1].x, y: self.drawPoints[index-1].y};
    self.points.push(prevobj);
  }else{
    console.log('this happens');
    self.points.push({x: 0, y:0});
  }
  });
  this.points[0] = {x:this.drawPoints[0].x, y:this.drawPoints[0].y};
  console.log(this.points);
  console.log(this.drawPoints);
}

Graph.prototype.drawAxis = function(){
  ctx = this.canvas.getContext('2d');
  var padding = this.canvas.width /10;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(padding/2, this.canvas.height-(padding/2));
  ctx.lineTo(this.canvas.width, this.canvas.height-(padding/2));
  ctx.moveTo(padding/2, 0);
  ctx.lineTo(padding/2, this.canvas.height-(padding/2));
  ctx.strokeStyle = "#777777";
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.fillText("X", (padding/4), this.canvas.height-(padding/2)+3);
  ctx.fillText("Y", (padding/2)-5, this.canvas.height-(padding/4)+5);
  ctx.fill();
  ctx.restore();


}

Graph.prototype.draw = function(e) {
    var canvas = this.canvas
    var ctx = canvas.getContext("2d");
    var point = "";
    var i = 0;
    var divisible = this.realWidth / this.points.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Simple stuff to fill out our canvas
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFF";



    ctx.beginPath();
    ctx.save();
    var self = this;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    var i = 0;
    while(i < this.points.length){
    if(this.points[i].x == this.drawPoints[i].x && this.points[i].y == this.drawPoints[i].y){
      ctx.lineTo(this.points[i].x, this.points[i].y);
      if(i == this.points.length-1){
        this.position = {x: 1, y:1};
      }
    }else{
        var xdiff = Math.abs(this.drawPoints[i].x - this.points[i].x);
        var ydiff = Math.abs(this.drawPoints[i].y - this.points[i].y);
        //console.log(xdiff);
        if(xdiff > 2){
        xdiff = xdiff/6;
        }
        if(ydiff > 2){
        ydiff = ydiff /6;
        }
        if(this.points[i].x < this.drawPoints[i].x){
          this.points[i].x +=xdiff;
        }else if(this.points[i].x > this.drawPoints[i].x){
          this.points[i].x -=xdiff;
        }

        if(this.points[i].y < this.drawPoints[i].y){
          this.points[i].y +=ydiff;
        }else if(this.points[i].y > this.drawPoints[i].y){
          this.points[i].y -=ydiff;
        }
        ctx.lineTo(this.points[i].x, this.points[i].y);
        i = this.points.length+1;
      }
      i++;
    }
    ctx.strokeStyle = '#00C853';
    ctx.lineWidth = 2 * this.ratio;
    ctx.shadowColor = '#999';
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.stroke();
    ctx.restore();

    if(this.position.x){
      var closest = closest(this.position.x, this.points);
      if(closest.x != this.tooltip.oldx){
        this.tooltip.oldx = closest.x;
        this.tooltip.radius = 0;
      }
      //Draw Line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(closest.x, 0);
      ctx.lineTo(closest.x, canvas.height);
      ctx.strokeStyle = "#777777";
      ctx.stroke();
      ctx.restore();
      //Draw cirlce
      ctx.save();
      ctx.beginPath();
      ctx.arc(closest.x, closest.y, this.tooltip.radius*this.ratio, 0, 2 * Math.PI, false);
      if(this.tooltip.radius < 5){
        this.tooltip.radius += 0.25;
      }
      ctx.fillStyle = "#00C853";
      ctx.shadowColor = '#999';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fill();
      ctx.restore();
      //Make the axis and labels
      this.drawAxis();
      //Make the tooltip
      this.drawTooltip(closest);
    }

    function closest(num, arr) {
                    var curr = arr[0];
                    var diff = Math.abs (num - curr.x);
                    for (var val = 0; val < arr.length; val++) {
                        var newdiff = Math.abs (num - arr[val].x);
                        if (newdiff < diff) {
                            diff = newdiff;
                            curr = arr[val];
                            curr.index = val;
                        }
                    }
                    return curr;
                }
};

Graph.prototype.drawTooltip = function(closest){
  //Draw tooltip
  var ctx = this.canvas.getContext("2d");
  if(closest.index == undefined){
    closest.index = 0;
  }
  var toolTipText = "X:"+this.dataset[closest.index].x+" Y:"+this.dataset[closest.index].y;
  ctx.font = "15px Arial";
  var toolTip = ctx.measureText(toolTipText).width +15;
  //console.log(toolTip);
  var displacement = 20*this.ratio;
  if(this.position.x > closest.x){
    displacement = -(20 + toolTip)*this.ratio;
  }
  var rest = {x: closest.x+displacement, y: closest.y-10};
  var dif = {x: Math.abs(this.tooltip.x - rest.x)/15, y: Math.abs(this.tooltip.y - rest.y)/15};
  if(this.tooltip.x != rest.x ){
    if(rest.x > this.tooltip.x){
      this.tooltip.x += dif.x;
    }else{
      this.tooltip.x -= dif.x;
    }
  }

  if(this.tooltip.y != rest.y ){
    if(rest.y > this.tooltip.y){
      this.tooltip.y += dif.y;
    }else{
      this.tooltip.y -= dif.y;
    }
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(this.tooltip.x, this.tooltip.y, toolTip*this.ratio, 20*this.ratio);
  ctx.fillStyle = "#cccccc";
  ctx.shadowColor = '#999';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.fill();
  ctx.restore();


  //Draw up the text for the tooltip.
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.font = "15px Arial";
  ctx.fillText(toolTipText,this.tooltip.x+5,this.tooltip.y+15);
  ctx.fill();
  ctx.restore();
}

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
