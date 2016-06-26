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

      //Make the tooltip
      this.drawTooltip(closest);
      this.drawAxis();
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
