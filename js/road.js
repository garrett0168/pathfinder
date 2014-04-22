var Road = function(city1, city2) 
{
  this.city1 = city1;
  this.city2 = city2;

  city1.roads.push(this);
  city2.roads.push(this);
};

Road.prototype.isConnectedTo = function(city)
{
  return this.city1.id == city.id || this.city2.id == city.id;
}

Road.prototype.otherCity = function(firstCity)
{
  if(this.city1 == firstCity)
  {
  	return this.city2;
  }
  if(this.city2 == firstCity)
  {
  	return this.city1;
  }
  return null;
}