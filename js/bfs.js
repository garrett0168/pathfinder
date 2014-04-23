var BFS = function()
{

}

BFS.prototype.backtracePath = function(city)
{
  var path = [city];
  while (city.parent) 
  {
    city = city.parent;
    path.push(city);
  }
  return path.reverse();
}

BFS.prototype.run = function(cities, startCity, endCity)
{
  for(i = 0; i < cities.length; i += 1) 
  {
    cities[i].visited = false;
    cities[i].distance = Number.POSITIVE_INFINITY;
    cities[i].parent = null;
  }

  var i, Q = [], u;
 
  startCity.visited = true;
  startCity.distance = 0;
  startCity.parent = null;
 
  Q.push(startCity);
 
  while (Q.length > 0) 
  {
    u = Q.splice(0, 1)[0];
    if(u == endCity)
    {
      return this.backtracePath(u);
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

  return [];
}