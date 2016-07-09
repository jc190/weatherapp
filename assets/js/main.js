$(document).ready(function() {
  var WeatherApp = {
    domElement: $('.content'),
    setURL: function() {
      return 'https://api.wunderground.com/api/d6e60545aff9ea3a/conditions/q/'
             + this.coords.lat + ',' + this.coords.long + '.json';
    },
    coords: {
      lat: '',
      long: ''
    },
    html: function() {
      return '<div class="weather-card-header">'
        + '<h1 class="weather-icon">' + this.weather.icon + '</h1></div>'
        + '<h3 id="location" class="location">' + this.weather.location + '</h3>'
        + '<p id="weather-date">' + this.weather.date + '</p>'
        + '<h1 class="temp"><span id="weather-temp">' + this.weather.temp + '</span>'
        + '<span id="weather-deg">&degF</span></h1>'
        + '<h4>Current Conditions:</h4><p id="weather-condition">' + this.weather.condition + '</p>'
        + '<h4>Wind:</h4><p id="weather-wind">' + this.weather.wind + '</p>'
        + '<h4>Precipitation:</h4><p id="weather-precip">' + this.weather.precip + '</p>'
        + '<p class="card-footer"><a id="weather-link" href="' + this.weather.link + '">Full Report</a></p>';
    },
    weather: {
      setIcon: function(weatherCondition) {
        if (/cloud/gi.test(weatherCondition)) {
          $('bg-img').css('backgound', 'url(\'http://jtcstudio.com/images/cloudy.jpg\')');
          return '<span class="typcn typcn-weather-cloudy"></span>';
        }
        if (/rain/gi.test(weatherCondition)) {
          $('bg-img').css('backgound', 'url(\'http://jtcstudio.com/images/rain.jpg\')');
          return '<span class="typcn typcn-weather-shower"></span>';
        }
        if (/clear/gi.test(weatherCondition)) {
          $('bg-img').css('backgound', 'url(\'http://jtcstudio.com/images/sunny.jpg\')');
          return '<span class="typcn typcn-weather-sunny"></span>';
        }
        if (/storm/gi.test(weatherCondition)) {
          $('bg-img').css('backgound', 'url(\'http://jtcstudio.com/images/linghtning.jpg\')');
          return '<span class="typcn typcn-weather-stormy"></span>';
        }
        if (/snow/gi.test(weatherCondition)) {
          $('bg-img').css('backgound', 'url(\'http://jtcstudio.com/images/snow.jpg\')');
          return '<span class="typcn typcn-weather-snow"></span>';
        }
      },
      icon: '',
      location: '',
      date: '',
      temp: '',
      condition: '',
      wind: '',
      precip: '',
      link: ''
    },
    updateCoords: function(position) {
      this.coords.lat = Math.round(position.coords.latitude * 100) / 100;
      this.coords.long = Math.round(position.coords.longitude * 100) / 100;
    },
    updateWeather: function(data) {
      console.log(data);
      this.weather.icon = this.weather.setIcon(data['current_observation']['weather']);
      this.weather.location = data['current_observation']['display_location']['full'];
      this.weather.date = data['current_observation']['observation_time_rfc822'];
      this.weather.temp = data['current_observation']['temp_f'];
      this.weather.condition = data['current_observation']['weather'];
      this.weather.wind = data['current_observation']['wind_string'];
      this.weather.precip = data['current_observation']['precip_today_string'];
      this.weather.link = data['current_observation']['forecast_url'];
      console.log(this.weather);
    },
    init: function() {
      if (!navigator.geolocation) {
        this.domElement.html('<h1>Geolocation is not supported by your browser</h1>');
        return;
      }
      navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this));
    },
    success: function(position) {
      this.updateCoords(position);
      $.ajax({
        url: this.setURL(),
        dataType: 'jsonp',
        success: function(data) {
          console.log(data);
          console.log(this.weather);
          this.updateWeather(data);
          console.log(this.weather);
          this.domElement.html(this.html());
        }.bind(this)
      });
    },
    error: function() {
      this.domElement.html('<h3>Oops something went wrong... Try again shortly.</h3>');
    }
  };

  WeatherApp.init();
});
