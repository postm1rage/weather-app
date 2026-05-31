import WeatherService from './data/weatherApi.js';
import WelcomeScreen from './ui/welcome.js';
import Header from './ui/header.js';
import WeatherCard from './ui/weatherCard.js';
import CityList from './ui/cityList.js';

class App {
  constructor() {
    this.container = document.getElementById('app');
    this.weatherService = new WeatherService();
    this.cityList = new CityList();
    this.welcomeScreen = null;
    this.header = null;
    this.weatherCard = null;
    this.userName = '';
    this.mainContainer = null;
    this.currentCityData = null;
  }

  init() {
    this.header = new Header(this.container);
    this.header.onChangeName = () => {
      this.welcomeScreen.render();
      if (this.mainContainer) {
        this.mainContainer.remove();
        this.mainContainer = null;
      }
    };

    this.welcomeScreen = new WelcomeScreen(this.container, (name) => {
      this.userName = name;
      this.welcomeScreen.hide();
      this.header.render(name);
      this.showMainScreen();
    });

    this.welcomeScreen.render();
  }

  showMainScreen() {
    this.mainContainer = document.createElement('div');
    this.mainContainer.className = 'main-screen';

    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';

    const cityInput = document.createElement('input');
    cityInput.type = 'text';
    cityInput.placeholder = 'Введите город';

    const searchBtn = document.createElement('button');
    searchBtn.textContent = 'Узнать погоду';

    const errorMsg = document.createElement('p');
    errorMsg.className = 'error-message';
    errorMsg.style.display = 'none';

    searchBox.append(cityInput, searchBtn, errorMsg);

    const weatherContainer = document.createElement('div');
    weatherContainer.id = 'weather-container';
    this.weatherCard = new WeatherCard(weatherContainer);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Сохранить город';
    saveBtn.style.display = 'none';
    saveBtn.addEventListener('click', () => {
      if (this.currentCityData) {
        this.cityList.addCity(this.currentCityData);
        saveBtn.style.display = 'none';
        cityInput.value = '';
        errorMsg.style.display = 'none';
        errorMsg.textContent = 'Город сохранён!';
        errorMsg.style.display = 'block';
      }
    });

    this.mainContainer.append(searchBox, weatherContainer, saveBtn);
    this.container.appendChild(this.mainContainer);

    const handleSearch = async () => {
      const city = cityInput.value.trim();
      if (!city) return;

      errorMsg.style.display = 'none';
      searchBtn.disabled = true;
      searchBtn.textContent = 'Загрузка...';

      try {
        const data = await this.weatherService.getWeather(city);
        this.weatherCard.render(data);
        this.currentCityData = data;
        saveBtn.style.display = 'inline-block';
      } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
        this.weatherCard.clear();
        saveBtn.style.display = 'none';
      } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Узнать погоду';
      }
    };

    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App().init();
});