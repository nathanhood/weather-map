/* global google:true */
/* global _:true */
/* jshint unused:false */
/* global moment:true */
/* jshint camelcase:false */
/* global AmCharts:true */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    initMap(36, -86, 3);
    // $('#get').click(show);
    $('#get').click(getZip);
  }

  function getZip(){
    var zip = $('#zip').val().trim();
    weatherApi(zip);
    geoCode(zip);
  }

  function weatherApi(zip){
    var url = 'http://api.wunderground.com/api/a32c1c536b032b2d/forecast10day/q/'+zip+'.json?callback=?';
    $.getJSON(url, function(data){
      $('#chartdiv').append(`<div class=graph data-zip=${zip}></div>`);
      createChart(zip);// initializing graph
      // pushing data into object charts[zip]. .forEach accesses information for each forecast(f) and pushes f object into charts[zip]. Creates array of objects.
      data.forecast.simpleforecast.forecastday.forEach(f=>charts[zip].dataProvider.push({day: f.date.weekday,
      tempHigh: f.high.fahrenheit, tempLow: f.low.fahrenheit}));
      charts[zip].validateData();// revalidates data in charts object. ESSENTIAL.
    });
  }


  // var chartData = []; //inspect where this used to be in chart function.
  var charts = [];

  function createChart(zip){
    let graph = $(`.graph[data-zip=${zip}]`)[0]; // jQuery returns array. Must indicate array index.
    charts[zip] = AmCharts.makeChart(graph, { // attach 'graph'(created div from above) variable into AmCharts.makeChart.
        'type': 'serial',
        'theme': 'dark',
        'pathToImages': 'http://www.amcharts.com/lib/3/images/',
        'titles': [{
          'text': zip,
          'size': 20
        }],
        'legend': {
            'useGraphSettings': true
        },
        'dataProvider': [],
        'valueAxes': [{
            'id':'v1', //name of axis.
            'axisColor': '#FF6600',
            'axisThickness': 2,
            'gridAlpha': 0,
            'axisAlpha': 1,
            'position': 'left',
            'minimum': 20, //added min and max for y-axis since ratins will be from 0 to 100
            'maximum': 110
        }],
        'graphs': [{
            'valueAxis': 'v1',
            'lineColor': '#FF6600',
            'bullet': 'round',
            'bulletBorderThickness': 1,
            'hideBulletsCount': 30,
            'title': 'High (F)',
            'valueField': 'tempHigh', //should be able to change to 'audience' variable name
    		'fillAlphas': 0
        }, {
            'valueAxis': 'v1', // same axis for both
            'lineColor': '#FCD202',
            'bullet': 'square',
            'bulletBorderThickness': 1,
            'hideBulletsCount': 30,
            'title': 'Low (F)',
            'valueField': 'tempLow', //should be able to change to 'critics' variable name
    		'fillAlphas': 0
        }],
        'chartCursor': {
            'cursorPosition': 'mouse'
        },
        'categoryField': 'day',
        'categoryAxis': {
            'labelRotation': 30, //added this to tilt the names on the x-axis.
            // 'parseDates': false, //had to change to false for the graph to register with new x-axis and fewer charts.
            'axisColor': '#DADADA',
            'minorGridEnabled': true
        }
      });
      $('#zip').val(''); // resets input box. 
    }



  //google maps code below...
  var map;

  function initMap(lat, lng, zoom){
    let styles = [{'featureType':'landscape','stylers':[{'hue':'#F1FF00'},{'saturation':-27.4},{'lightness':9.4},{'gamma':1}]},{'featureType':'road.highway','stylers':[{'hue':'#0099FF'},{'saturation':-20},{'lightness':36.4},{'gamma':1}]},{'featureType':'road.arterial','stylers':[{'hue':'#00FF4F'},{'saturation':0},{'lightness':0},{'gamma':1}]},{'featureType':'road.local','stylers':[{'hue':'#FFB300'},{'saturation':-38},{'lightness':11.2},{'gamma':1}]},{'featureType':'water','stylers':[{'hue':'#00B6FF'},{'saturation':4.2},{'lightness':-63.4},{'gamma':1}]},{'featureType':'poi','stylers':[{'hue':'#9FFF00'},{'saturation':0},{'lightness':0},{'gamma':1}]}];
    let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    //three types of maps: road map, satellite, hybrid.
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }


  function geoCode(zip){ //locates geographic information on vacation spot/location name
    // let zip = $('#zip').val().trim(); //takes value selected in select box
    let geocoder = new google.maps.Geocoder(); //

    //geocode is essentially a google search in this context for the word selected.
    geocoder.geocode({address: zip}, function(results, status)/* callback function */{

      let name = results[0].formatted_address; //accessing returned object information
      let lat = location.coordinates = results[0].geometry.location.lat();//accessing latitude and longitude
      let lng = location.coordinates = results[0].geometry.location.lng();//what is .lat() and .lng()?
      addMarker(lat, lng, name);
      let latLng = new google.maps.LatLng(lat, lng);
      map.setCenter(latLng);//this sets the zoom of whatever you search for.
      map.setZoom(4);
    });
  }

  function addMarker(lat, lng, name){ //creates pin on map
    let latLng = new google.maps.LatLng(lat, lng); //plugs in lat and lng
    new google.maps.Marker({map: map, position: latLng, title: name}); //title is hove window. can add custom icon - icon:'./media/flag.png'.
  }

})();
