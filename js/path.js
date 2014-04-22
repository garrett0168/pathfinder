var PathApp = function()
{
  this.TOTAL_CITIES = parseInt(window.location.hash.substr(1));
  if(_.isNaN(this.TOTAL_CITIES))
  {
    this.TOTAL_CITIES = 100;
  }
  this.CITY_RADIUS = 10;
  this.svgContainer = null;
  this.visiblePopover = null;
  this.selectedCity = null;

  this.startCity = null;
  this.endCity = null;

  this.map = new Map(this.TOTAL_CITIES);
  this.map.randomlyGenerateCitiesAndRoads();
};

PathApp.prototype.setStartCity = function()
{
  this.startCity = this.selectedCity;
  this.map.resetCityAndRoads();
  this.refreshSvg();
}

PathApp.prototype.setEndCity = function()
{
  this.endCity = this.selectedCity;
  this.map.resetCityAndRoads();
  this.refreshSvg();
}

PathApp.prototype.refreshSvg = function()
{
  this.updateCityDisplayInfo();
  this.updateRoadsAndCities();
}

PathApp.prototype.cityRadius = function(city)
{
  if(this.startCity === city || this.endCity === city)
  {
    return this.CITY_RADIUS + 5;
  }
  else
  {
    return this.CITY_RADIUS; 
  }
}

PathApp.prototype.initializeSvg = function()
{
  var self = this;
  this.svgContainer = d3.select("#map").append("svg")
                                       .attr("width", (this.TOTAL_CITIES * 5 * this.CITY_RADIUS) + "px")
                                       .attr("height", (this.TOTAL_CITIES * 5 * this.CITY_RADIUS) + "px");

  this.svgContainer.selectAll("circle").on("mouseenter", function (d, i) { 
    $(this).attr("r", self.CITY_RADIUS + 5);
  });
  this.svgContainer.selectAll("circle").on("mouseleave", function (d, i) { 
    $(this).attr("r", self.cityRadius(self.map.cities[i]));
  });
}

PathApp.prototype.updateCityDisplayInfo = function()
{
  if(this.startCity)
  {
    $('#startCityInfo').html('<b>Start City: </b>' + this.startCity.name);
  }
  else
  {
    $('#startCityInfo').html('');
  }

  if(this.endCity)
  {
    $('#endCityInfo').html('<b>End City: </b>' + this.endCity.name);
  }
  else
  {
    $('#endCityInfo').html('');
  }
}

PathApp.prototype.createPopovers = function()
{
  var self = this;
  $('circle').popover();
  $('circle').on('click', function(e) {
    // don't fall through
    e.stopPropagation();
    // check if the one clicked is now shown
    if ($(this).data('bs.popover').tip().hasClass('in')) 
    {
      // if another was showing, hide it
      self.visiblePopover && self.visiblePopover.popover('hide');
      // then store the current popover
      self.visiblePopover = $(this);

      self.selectedCity = self.map.cities[$(this).attr('city-id')];
    } 
    else 
    {
      // if it was hidden, then nothing must be showing
      self.visiblePopover = '';
    }
  });

  $("body").on('click', function () {
    $("circle").popover('hide');
    self.visiblePopover = '';
  });
}

PathApp.prototype.updateRoadsAndCities = function()
{
  var self = this;
  // Draw roads first
  var roads = this.svgContainer.selectAll("line")
                          .data(this.map.roads);

  roads.enter().append("svg:line");

  var roadsAttributes = roads
                       .attr("x1", function (r) { return (r.city1.x * 10) + 5; })
                       .attr("y1", function (r) { return (r.city1.y * 10) + 5; })
                       .attr("x2", function (r) { return (r.city2.x * 10) + 5; })
                       .attr("y2", function (r) { return (r.city2.y * 10) + 5; })
                       .attr("stroke-width", function (r) { 
                          if(r.highlighted === true)
                          {
                            return 4;
                          }
                          else
                          {
                            return 2;
                          }
                        })
                       .attr("stroke", function (r) {
                          if(r.highlighted === true)
                          {
                            return "yellow";
                          }
                          else
                          {
                            return "black";
                          }
                       });

  // Next draw cities 
  var cities = this.svgContainer.selectAll("circle")
                            .data(this.map.cities);

  cities.enter().append("svg:circle")
                .append("svg:title")
                .text(function(d) { return "City " + d.id; });

  var popoverHtml = $('#popoverTemplate').html();
  cities.attr("id", function (c) { return "city" + c.id; })
        .attr("city-id", function (c) { return c.id; })
        .attr("data-title", function (c) { return c.name; })
        .attr("data-html", function (c) { return "true"; })
        .attr("data-trigger", function (c) { return "click"; })
        .attr("data-container", function (c) { return "body"; })
        .attr("data-toggle", function (c) { return "popover"; })
        .attr("data-content", function (c) { return popoverHtml; })
        .attr("cx", function (c) { return (c.x * 10) + 5; })
        .attr("cy", function (c) { return (c.y * 10) + 5; })
        .attr("r", function (c) { 
          return self.cityRadius(c);
        })
        .attr("stroke", "black")
        .attr("class", function (c) {
          if(self.startCity == c)
          {
            return "startCity";
          }
          else if(self.endCity == c)
          {
            return "endCity";
          }
          else
          {
            return "";
          }
        });
}

PathApp.prototype.findShortestPath = function()
{
  if(this.map.findShortestPath(this.startCity, this.endCity))
  {
    $('#message').text("Shortest path was found between " + this.startCity.name + " and " + this.endCity.name);
    this.refreshSvg();
  }
  else
  {
    $('#message').text("No path found");
  }
}

$(document).ready(function() {
  var pathApp = new PathApp();
  pathApp.initializeSvg();

  pathApp.refreshSvg();
  pathApp.createPopovers();

  $('body').on('click', '#setStartCity', function(e) {
    pathApp.setStartCity();
  });

  $('body').on('click', '#setEndCity', function(e) {
    pathApp.setEndCity();
  });

  $('#findShortestPath').click(function() {
    pathApp.findShortestPath();
  });
});