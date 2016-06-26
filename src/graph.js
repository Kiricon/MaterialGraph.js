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
    this.tooltip = {x: 0, y: 0, radius: 0, oldx: 0};


    this.init();      //Instantiate the graph it self.
    this.convert();   //Convert the dataset to usable pixel points
    this.listen();    //Listen for Mouse or Touch Events
    //this.draw();      //Draw up the graph using the converted points and mouse locations.
    var self = this;
    var timer=setInterval(function(){self.draw();},20);
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
