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
      if(this.position.x > closest.x){
        displacement = -70;
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
      ctx.rect(this.tooltip.x, this.tooltip.y, 50, 20);
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
