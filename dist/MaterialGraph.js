var Graph = function(canvas, dataset) {
    this.canvas = canvas;
    this.dataset = dataset;
    this.points = [];
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


    this.init();      //Instantiate the graph it self.
    this.convert();   //Convert the dataset to usable pixel points
    this.listen();    //Listen for Mouse or Touch Events
    this.draw();      //Draw up the graph using the converted points and mouse locations.
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
        self.draw();
    }, false);

    this.canvas.addEventListener('touchmove', function(evt) {
        self.position = self.getMousePos(evt);
        self.draw();
    }, false);

    this.canvas.addEventListener('touchstart', function(evt) {
        self.position = self.getMousePos(evt);
        self.draw();
    }, false);
}


//### Convert the dataset in to usable points on the graph ####//
Graph.prototype.convert = function(){
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
  var NewMax = this.canvas.width -20;
  var NewMin = 20;
  this.min = NewMin;
  this.max = NewMax;
  if(diffX > diffY){
    var OldMax = largestX;
    var OldMin = smallestX;
  }else{
    var OldMax = largestY;
    var OldMin = smallestY;
  }
  console.log(NewMax+" "+NewMin);
  var OldRange = (OldMax - OldMin);
  var NewRange = (NewMax - NewMin);
  var self = this;
  this.dataset.forEach(function(value){
    var obj = {
      x: (((value.x - OldMin) * NewRange) / OldRange) + NewMin,
      y: (self.canvas.width-20) - ((((value.y - OldMin) * NewRange) / OldRange) + NewMin)
    };
    self.points.push(obj);
  });

  console.log(this.points);

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
    for(var i =0; i < this.points.length; i++){
      ctx.lineTo(this.points[i].x, this.points[i].y);
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
      ctx.arc(closest.x, closest.y, 5, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#00C853";
      ctx.shadowColor = '#999';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fill();
      ctx.restore();
      //Draw tooltip
      var displacement = 20;
      if(this.position.x < closest.x){
        displacement = -70;
      }
      ctx.save();
      ctx.beginPath();
      ctx.rect(closest.x+displacement, closest.y-10, 50, 20);
      ctx.fillStyle = "#cccccc";
      ctx.shadowColor = '#999';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 10;
      ctx.shadowOffsetY = 10;
      ctx.fill();
    //ctx.stroke();
      ctx.restore();
    }

    function closest(num, arr) {
                    var curr = arr[0];
                    var diff = Math.abs (num - curr.x);
                    for (var val = 0; val < arr.length; val++) {
                        var newdiff = Math.abs (num - arr[val].x);
                        if (newdiff < diff) {
                            diff = newdiff;
                            curr = arr[val];
                        }
                    }
                    return curr;
                }
};

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
