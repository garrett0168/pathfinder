var Dijkstra = function()
{

}

Dijkstra.prototype.run = function(cities, startCity, endCity)
{
  var visited = new Array(cities.length);
  var distance = new Array(cities.length);
  var predecessors = [];
  var MAX_VALUE = Number.MAX_VALUE;
  
  // Acts as priority queue
  var findMin = function(distance, visitedNodes) 
  {
    var x = MAX_VALUE, y = -1, i;

    for (i = 0; i < distance.length; i++) 
    {
      if (!visitedNodes[i] && distance[i] < x) 
      {
        y = i;
        x = distance[i];
      }
    }
    return y;
  }

  var idxStart = startCity.id, i, j;

  // Setup
  for (var i = 0; i < cities.length ; i++) 
  {
    distance[i] = Number.MAX_VALUE;
    visited[i] = false;
    predecessors[i] = null;
  }

  // Start at the first city
  distance[startCity.id] = 0;

  // Run Dijkstra's
  for (i = 0 ; i < distance.length; i++) 
  {
    var next = findMin(distance, visited);
    if(next == -1)
    {
      return [];
    }

    var currentCity = cities[next];
    visited[next] = true;

    // Visit neighboring cities
    for(j = 0; j < currentCity.roads.length; j++) 
    {
      var road = currentCity.roads[j];
      var otherCity = road.otherCity(currentCity);
      var otherCityLength = Number(road.length()) + Number(distance[next]);

      if(distance[otherCity.id] > otherCityLength) 
      {
        distance[otherCity.id] = otherCityLength;
        predecessors[otherCity.id] = next;
      }
    }
  }

  var citiesToVisit = [];
  var startId = startCity.id;
  var endId = endCity.id;

  while(endId != startId) 
  {
    citiesToVisit.splice(0, 0, cities[endId]);
    endId = predecessors[endId];
  }
  citiesToVisit.splice(0, 0, startCity);

  return citiesToVisit;
}