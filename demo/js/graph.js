var Graph = function(ticker, canvas){
  this.ticker = ticker;
  this.canvas = canvas; 
  this.graph = {
    history: [], points:[], max:"", min:"", previousClose: "", previousPoint: ""
  };
  this.time = "month";
  this.position = {x: 0, y: 0};
  this.highlight = "";
  this.point = {};
  this.display = "";
  this.ratio = 1;
  this.realWidth;


  this.init();
  this.listen();
}


Graph.prototype.init = function () {
  var ctx = this.canvas.getContext("2d");

  this.canvas.width = 700;
  this.canvas.height = 500;
  this.canvas.style.width = 700+"px";
  this.canvas.style.height= 500+"px";
  this.makeHighRes();
  /*
  setInterval(function(){
      this.refresh();
    }, 10000); */
    this.getHistory();
}
Graph.prototype.listen = function () {
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

Graph.prototype.getMousePos = function(evt) {
  evt.preventDefault();
        var rect = this.canvas.getBoundingClientRect();
        if(window.event.touches){
          return {
            x: (window.event.touches[0].pageX - rect.left) * this.ratio,
            y: (window.event.touches[0].pageY - rect.top) * this.ratio
          };
        }else{
        return {
          x: (evt.clientX - rect.left) * this.ratio,
          y: (evt.clientY - rect.top) * this.ratio
        };
      }
}

Graph.prototype.getHistory = function () {

    var day = 1;
    var date = new Date();
    var weekDate = new Date();
    weekDate.setDate(weekDate.getDate() - 7);
    var monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() -1);
    var tmonthDate = new Date();
    tmonthDate.setMonth(tmonthDate.getMonth() - 3);
    var smonthDate = new Date();
    smonthDate.setMonth(smonthDate.getMonth() - 6);
    var currentDate = date.getFullYear()+"-"+("0" + (date.getMonth() + 1)).slice(-2)+"-"+date.getDate();
    var lastYear = (date.getFullYear()-1)+"-"+("0" + (date.getMonth() + 1)).slice(-2)+"-"+date.getDate();
    var lastMonth = monthDate.getFullYear()+"-"+("0" + (monthDate.getMonth() + 1)).slice(-2)+"-"+monthDate.getDate();
    var last3Month = tmonthDate.getFullYear()+"-"+("0" + (tmonthDate.getMonth() + 1)).slice(-2)+"-"+tmonthDate.getDate();
    var last6Month = smonthDate.getFullYear()+"-"+("0" + (smonthDate.getMonth() + 1)).slice(-2)+"-"+smonthDate.getDate();
    var lastWeek = weekDate.getFullYear()+"-"+(weekDate.getMonth()+1)+"-"+weekDate.getDate();
    var timeFrame = "";
    if(this.time == "week"){
      day = 7;
    }else if(this.time == "month"){
      var timeFrame = lastMonth;
    }else if(this.time == "3month"){
      var timeFrame = last3Month;
    }else if(this.time == "6month"){
      var timeFrame = last6Month;
    }else if(this.time == "year"){
      var timeFrame = lastYear;
    }
    if(this.time == "day" || this.time == "week"){
      var self = this;
      window.finance_charts_json_callback = function(json) {
        json.series.forEach(function(value, index){
          self.graph.history.push(parseFloat(value.close));
        });
         self.graph.previousClose = json.meta.previous_close;

          self.graph.max = Math.max.apply( Math, self.graph.history);
          self.graph.min = Math.min.apply( Math, self.graph.history);
          self.realWidth = self.canvas.width*self.ratio - ((self.graph.max.toFixed(2).toString().length+1)*12*self.ratio);
          self.graph.history.forEach(function(value, index){
            self.graph.points.push(((value - self.graph.min) / (self.graph.max - self.graph.min)) * ((self.canvas.height-( self.canvas.height/10 )) - ( self.canvas.height/10 )) + ( self.canvas.height/10 ));
          });
          self.graph.previousPoint = ((json.meta.previous_close- self.graph.min) / (self.graph.max - self.graph.min)) * ((self.canvas.height-( self.canvas.height/10 )) - ( self.canvas.height/10 )) + ( self.canvas.height/10 );
         // console.log(self.graph);
          self.draw();
        };

        var scriptEl = document.createElement('script');
        scriptEl.setAttribute('src',
            "http://chartapi.finance.yahoo.com/instrument/1.1/"+this.symbol+"/chartdata;type=close;range="+day+"d/json/");
        document.body.appendChild(scriptEl);
    }else{
        var self = this;
        this.getJson("https://query.yahooapis.com/v1/public/yql?q=select%20Close%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22"+this.ticker+"%22%20and%20startDate%20%3D%20%22"+timeFrame+"%22%20and%20endDate%20%3D%20%22"+currentDate+"%22%0A&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", function(data){
          data.query.results.quote.forEach( function(value, index){
            self.graph.history.push(value.Close);
          });
          self.graph.max = Math.max.apply( Math, self.graph.history);
          self.graph.min = Math.min.apply( Math, self.graph.history);
          self.realWidth = self.canvas.width*self.ratio - ((self.graph.max.toFixed(2).toString().length+1)*12*self.ratio);
          self.graph.history.forEach( function(value, index){
            self.graph.points.push(((value - self.graph.min) / (self.graph.max - self.graph.min)) * ((self.canvas.height-( self.canvas.height/10 )) - ( self.canvas.height/10 )) + ( self.canvas.height/10 ));
          });
          self.draw();
        });
      }

}


Graph.prototype.draw = function(e) {
  var canvas = this.canvas //get canvas info
    //var canvas = createHiDPICanvas($(window).width(), $(window).height() - 100, 4);
    var ctx = canvas.getContext("2d");
    var point = "";
    /*
    var pos = this.getMousePos(canvas, e);
    console.log(pos);
    */
    if(this.time == "day" || this.time == "week"){
      var i = 0;
    }else {
      var i = this.realWidth;
    }
    if(this.time == "day"){
      var divisible = this.realWidth / 390;
    }else{
    var divisible = this.realWidth / this.graph.points.length;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Simple stuff to fill out our canvas
    //ctx.fillStyle = "#212121";
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    //ctx.fillStyle = "#212121";
    ctx.fillStyle = "#FFF"
    ctx.beginPath();
    ctx.save();
    if(this.time == "day" || this.time == "week"){
      ctx.moveTo(0, canvas.height - this.graph.previousPoint);
      ctx.lineTo(this.realWidth, canvas.height - this.graph.previousPoint);
      ctx.strokeStyle = '#9E9E9E';
      ctx.lineWidth = 2 * this.ratio;
      ctx.setLineDash([5 *this.ratio]);
      ctx.stroke();
      ctx.restore();
      ctx.beginPath();
      //ctx.moveTo(0, canvas.height - this.graph.points[0]);
    }else{
    ctx.moveTo(this.realWidth, canvas.height - this.graph.points[this.graph.points.length -1]);
    ctx.lineTo(0, canvas.height - this.graph.points[this.graph.points.length -1]);
    //ctx.strokeStyle = '#9E9E9E';
    ctx.strokeStyle = "#212121";
    ctx.lineWidth = 2 *this.ratio;
    ctx.setLineDash([5 *this.ratio]);
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();

  //  ctx.moveTo(this.realWidth, (canvas.height -this.graph.points[0]));
  //  console.log(this.graph.points);
    //console.log(this.graph.points[0]+" "+this.graph.points[1]);
    }
    var self = this;
    this.graph.points.forEach( function(value, index){
    //  value = value * this.ratio;
      if(self.highlight == index){
        self.point = {x: i, y: self.canvas.height - value};
      //  console.log('this happend');
      }
      if(self.time == "day" || self.time == "week"){
        ctx.lineTo(i, self.canvas.height - value);
        i += divisible;
      }else{
      ctx.lineTo(i, canvas.height - value);
      i -= divisible;
      }

    });
    if(this.time == "day" || this.time == "week"){
      if(this.graph.previousPoint < this.graph.points[this.graph.points.length -1]){
        ctx.strokeStyle = '#00C853';
        ctx.fillStyle = '#00C853';
      }else if(this.graph.previousPoint > this.graph.points[this.graph.points.length -1]){
        ctx.strokeStyle = '#F44336';
        ctx.fillStyle = '#F44336';
      }
    }else{
      if(this.graph.points[0] > this.graph.points[this.graph.points.length -1]){
        ctx.strokeStyle = '#00C853';
        ctx.fillStyle = '#00C853';
      }else if(this.graph.points[0] < this.graph.points[this.graph.points.length -1]){
        ctx.strokeStyle = '#F44336';
        ctx.fillStyle = '#F44336';
      }
    }

    ctx.lineWidth = 2 * this.ratio;
    //ctx.shadowColor = '#777';
    //ctx.shadowBlur = 5 * this.ratio;
    ctx.stroke();
    ctx.restore();

    if(this.point){
    //console.log(this.point);
    ctx.beginPath();
    ctx.save();
    ctx.arc(this.point.x, this.point.y, 5 * this.ratio, 0, 2 * Math.PI, false);
    ctx.shadowColor = '#777';
    ctx.shadowBlur = 10 * this.ratio;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    }

    ctx.beginPath();
    ctx.save();
    var x = 0;
    var increment = Math.round(canvas.height / 8);
    x += increment;
    while(x <= canvas.height-(canvas.height /10)){
      var value = ((x - (canvas.height/10)) / (canvas.height - (canvas.height/10))) * (this.graph.max - this.graph.min) + this.graph.min;
    //  console.log(value);
      value = parseFloat(value);
      ctx.font = (15 * this.ratio)+"px Arial";
      //ctx.fillStyle = 'white';
      ctx.fillStyle = "#212121";
      var y = value.toFixed(2).toString().length;
      var size = 12 * this.ratio;
    //  console.log(y);
      ctx.fillText("$"+value.toFixed(2) ,canvas.width - (y*size), canvas.height - x);
      x += increment;
    }
    ctx.stroke();
    ctx.restore();

    if(this.position.x){
      if(this.time == "week"){
      var temp = this.graph.history[Math.round(this.position.x/(this.realWidth / this.graph.history.length))];
      this.highlight = Math.round(this.position.x/(this.realWidth / this.graph.history.length)) -1;
    }else if(this.time == "day"){
      var temp = this.graph.history[Math.round(this.position.x/(this.realWidth / 390))];
      this.highlight = Math.round(this.position.x/(this.realWidth / 390)) -1;
    }else{
      var temp = this.graph.history[this.graph.history.length - Math.round(this.position.x/(this.realWidth / this.graph.history.length))];
      this.highlight = this.graph.history.length - Math.round(this.position.x/(this.realWidth / this.graph.history.length));
    }
      if(temp){
        this.display = parseFloat(temp);
        this.display = this.display.toFixed(2);
      }
      ctx.beginPath();
      ctx.save();
      ctx.moveTo(this.position.x, canvas.height);
      ctx.lineTo(this.position.x, 0);
      //ctx.strokeStyle = '#9E9E9E';
      ctx.strokeStyle = "#212121";
      ctx.lineWidth = 1;
    /*  if(this.display){
        ctx.font = "30px Arial";
        ctx.fillStyle = 'white';
        ctx.fillText("$"+this.display ,canvas.width /2, 100);
      } */
      ctx.stroke();
      ctx.restore();
    }
};

Graph.prototype.getJson = function(url, callback){
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var myArr = JSON.parse(xmlhttp.responseText);
          return callback(myArr);
      }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

Graph.prototype.getJsonp = function(url, callback){
  var script = document.createElement('script');
  script.src = url;
  document.getElementByTagName('head')[0].appendChild(script);
}
