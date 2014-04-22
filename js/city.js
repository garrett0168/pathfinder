var City = function(name, id, x, y) 
{
  this.name = name;
  this.id = id;
  this.x = x;
  this.y = y;

  this.roads = [];
};

City.prototype.distanceTo = function(otherCity)
{
  var xDiff = otherCity.x - this.x;
  var yDiff = otherCity.y - this.y;
  return Math.sqrt(xDiff*xDiff + yDiff*yDiff);
}

City.prototype.isConnectedTo = function(otherCity)
{
  var road = _.find(this.roads, function(road) {
    return road.isConnectedTo(otherCity);
  });
  return !_.isUndefined(road);
}