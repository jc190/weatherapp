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
    convertTemp: function(tempNum, tempType) {
      if (tempType === 'F') {
        this.weather.temp = Math.round((((tempNum - 32) / 1.8) * 10)) / 10;
        this.weather.tempType = 'C';
      }
      if (tempType === 'C') {
        this.weather.temp = Math.round(((tempNum * 1.8 + 32) * 10)) / 10;
        this.weather.tempType = 'F';
      }
      this.domElement.html(this.html());
      $('#deg-type').on('click', function(event) {
        event.preventDefault();
        this.convertTemp(this.weather.temp, this.weather.tempType);
      }.bind(this));
    },
    html: function() {
      return '<div class="weather-card-header">'
        + '<h1 class="weather-icon">' + this.weather.icon + '</h1></div>'
        + '<h3 id="location" class="location">' + this.weather.location + '</h3>'
        + '<p id="weather-date">' + this.weather.date + '</p>'
        + '<h1 class="temp"><span id="weather-temp">' + this.weather.temp + '</span>'
        + '<span id="weather-deg">&deg<a id="deg-type" href="#">' + this.weather.tempType + '</a></span></h1>'
        + '<h4>Current Conditions:</h4><p id="weather-condition">' + this.weather.condition + '</p>'
        + '<h4>Wind:</h4><p id="weather-wind">' + this.weather.wind + '</p>'
        + '<h4>Precipitation:</h4><p id="weather-precip">' + this.weather.precip + '</p>'
        + '<p class="card-footer"><a id="weather-link" href="' + this.weather.link + '">Full Report</a></p>';
    },
    weather: {
      setIcon: function(weatherCondition) {
        if (/cloud|overcast/gi.test(weatherCondition)) {
          $('.bg-img').css('background-image', 'url(\'assets/images/cloudy.jpg\')');
          return '<span class="typcn typcn-weather-cloudy"></span>';
        }
        if (/rain/gi.test(weatherCondition)) {
          $('.bg-img').css('background-image', 'url(\'assets/images/rain.jpg\')');
          return '<span class="typcn typcn-weather-shower"></span>';
        }
        if (/clear/gi.test(weatherCondition)) {
          $('.bg-img').css('background-image', 'url(\'assets/images/sunny.jpg\')');
          return '<span class="typcn typcn-weather-sunny"></span>';
        }
        if (/storm/gi.test(weatherCondition)) {
          $('.bg-img').css('background-image', 'url(\'assets/images/lightning.jpg\')');
          return '<span class="typcn typcn-weather-stormy"></span>';
        }
        if (/snow/gi.test(weatherCondition)) {
          $('.bg-img').css('background-image', 'url(\'assets/images/snow.jpg\')');
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
      link: '',
      tempType: 'F'
    },
    updateCoords: function(position) {
      this.coords.lat = Math.round(position.coords.latitude * 100) / 100;
      this.coords.long = Math.round(position.coords.longitude * 100) / 100;
    },
    updateWeather: function(data) {
      this.weather.icon = this.weather.setIcon(data['current_observation']['weather']);
      this.weather.location = data['current_observation']['display_location']['full'];
      this.weather.date = data['current_observation']['observation_time_rfc822'];
      this.weather.temp = data['current_observation']['temp_f'];
      this.weather.condition = data['current_observation']['weather'];
      this.weather.wind = data['current_observation']['wind_string'];
      this.weather.precip = data['current_observation']['precip_today_string'];
      this.weather.link = data['current_observation']['forecast_url'];
    },
    init: function() {
      if (!navigator.geolocation) {
        this.domElement.html('<h3 class="weather-error">Geolocation is not supported by your browser</h3>');
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
          this.updateWeather(data);
          this.domElement.html(this.html());
          $('#deg-type').on('click', function(event) {
            event.preventDefault();
            this.convertTemp(this.weather.temp, this.weather.tempType);
          }.bind(this));
        }.bind(this)
      });
    },
    error: function(PositionError) {
      this.domElement.html('<h3 class="weather-error">Oops something went wrong... Try again shortly.</h3> <p>'
                          + PositionError.code +': ' + PositionError.message + '</p>');
    }
  };
  WeatherApp.init();
});
