describe("Map", function() {
  var map;
  var city1, city2, city3, city4, city5;
  var road1, road2, road3, road4;

  beforeEach(function() {
    map = new Map(1);
    city1 = new City("city1", 1, 0, 0);
    city2 = new City("city2", 2, 10, 10);
    city3 = new City("city3", 3, 0, 10);
    city4 = new City("city4", 4, 10, 0);
    city5 = new City("city4", 5, 20, 0);

    road1 = new Road(city1, city3);
    road2 = new Road(city3, city2);
    road3 = new Road(city2, city4);
    road4 = new Road(city4, city5);

    map.cities = [city1, city2, city3, city4, city5];
    map.roads = [road1, road2, road3, road4];
  });

  describe("shortest path (breadth first search)", function() {
    it("can find the shortest path", function() {
      var hasPath = map.findShortestPath(city1, city4);
      expect(hasPath).toBe(true);
    });

    it("will highlight the roads", function() {
      map.findShortestPath(city1, city4);

      expect(road1.highlighted).toBe(true);
      expect(road2.highlighted).toBe(true);
      expect(road3.highlighted).toBe(true);
      expect(road4.highlighted).toBe(false);
    });

    it("should visit all the cities", function() {
      map.findShortestPath(city1, city4);

      expect(city1.visited).toBe(true);
      expect(city2.visited).toBe(true);
      expect(city3.visited).toBe(true);
      expect(city4.visited).toBe(true);
      expect(city5.visited).toBe(false);
    });
  });
});
