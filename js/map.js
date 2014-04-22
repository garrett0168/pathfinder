var Map = function(totalCities)
{
  this.totalCities = totalCities;
  this.gridSize = this.totalCities*5;
  this.grid = new Array(this.gridSize);
  for(var i = 0; i < this.gridSize; i++)
  {
    this.grid[i] = new Array(this.gridSize);
  }

  this.cities = [];
  this.roads = [];
};

Map.prototype.randomlyGenerateCitiesAndRoads = function()
{
  // build the cities
  for(var i = 0; i < this.totalCities; i++)
  {
    var x, y;
    do {
      x = Math.floor(Math.random() * this.gridSize);
      y = Math.floor(Math.random() * this.gridSize);
    } while(!_.isUndefined(this.grid[x][y]));

    var city = new City(chance.city(), i, x, y);
    this.grid[x][y] = city;
    this.cities.push(city);
  }

  // build the roads
  var MAX_ROADS = Math.floor(this.totalCities / 10);
  for(var i = 0; i < this.totalCities; i++)
  {
    var city = this.cities[i];
    // Each city has random number roads connecting it to nearby cities. Each road is represented as a line connecting two circles (cities). 
    // The map should look like a fish net. For each city, there is a high possibility of direct connection to the nearby city and low possibility of the direct connection to the remote city.
    var sortedNearbyCities = _.sortBy(this.cities, function(otherCity) { return city.distanceTo(otherCity); });
    _.remove(sortedNearbyCities, function(c) { return c.id == city.id; });

    var maxRoadsToCreate = randomInt(1, MAX_ROADS);
    var roadsCreated = 0;
    for(var j = 0; j < this.totalCities; j++)
    {
      var cityToConnect = sortedNearbyCities[j];
      if(cityToConnect.id == city.id)
      {
        continue;
      }
      var prob = (this.totalCities - j - 1.0) / this.totalCities;
      if(Math.random() < prob)
      {
        if(!city.isConnectedTo(cityToConnect))
        {
          var newRoad = new Road(city, cityToConnect);
          this.roads.push(newRoad);
        }
        roadsCreated++;
      }
      if(roadsCreated > maxRoadsToCreate)
      {
        break;
      }
    }
  }
}

Map.prototype.backtracePath = function(city)
{
  var path = [city];
  while (city.parent) 
  {
    city = city.parent;
    path.push(city);
  }
  return path.reverse();
}

Map.prototype.resetCityAndRoads = function()
{
  for(i = 0; i < this.cities.length; i += 1) 
  {
    this.cities[i].visited = false;
    this.cities[i].distance = Number.POSITIVE_INFINITY;
    this.cities[i].parent = null;
  }
  for(i = 0; i < this.roads.length; i+= 1)
  {
    this.roads[i].highlighted = false;
  }
}

Map.prototype.findShortestPath = function(startCity, endCity)
{
  if(startCity == null || endCity == null)
  {
    return;
  }

  var i, Q = [], u;
 
  this.resetCityAndRoads();
 
  startCity.visited = true;
  startCity.distance = 0;
  startCity.parent = null;
 
  Q.push(startCity);
 
  while (Q.length > 0) 
  {
    u = Q.splice(0, 1)[0];
    if(u == endCity)
    {
      var citiesToVisit = this.backtracePath(u);
      for(var k = 0; k < citiesToVisit.length - 1; k++)
      {
        var currentCity = citiesToVisit[k];
        var nextCity = citiesToVisit[k+1];
        var road = _.find(currentCity.roads, function(r) { return r.isConnectedTo(nextCity); });
        if(!road)
        {
          console.error("Something bad happened...");
          break;
        }
        road.highlighted = true;
      }

      return true;
    }

    for (i = 0; i < u.roads.length; i += 1) 
    {
      var otherCity = u.roads[i].otherCity(u);
      if(otherCity.visited === false) 
      {
        otherCity.visited = true;
        otherCity.distance = u.distance + 1;
        otherCity.parent = u;
        Q.push(otherCity);
      }
    }
    u.visited = true;
  }

  return false;
}