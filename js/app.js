import WeatherService from './data/weatherApi.js';
import WelcomeScreen from './ui/welcome.js';
import Header from './ui/header.js';
import WeatherCard from './ui/weatherCard.js';

class App {
  constructor() {
    this.container = document.getElementById('app');
    this.weatherService = new WeatherService();
    this.welcomeScreen = null;
    this.header = null;
    this.weatherCard = null;
    this.userName = '';
    this.mainContainer = null;
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

    // Поиск города
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';

    const cityInput = document.createElement('input');
    cityInput.type = 'text';
    cityInput.placeholder = 'Введите город';
    cityInput.id = 'city-input';

    const searchBtn = document.createElement('button');
    searchBtn.textContent = 'Узнать погоду';
    searchBtn.id = 'search-btn';

    const errorMsg = document.createElement('p');
    errorMsg.className = 'error-message';
    errorMsg.style.display = 'none';

    searchBox.append(cityInput, searchBtn, errorMsg);

    // Контейнер для карточки погоды
    const weatherContainer = document.createElement('div');
    weatherContainer.id = 'weather-container';
    this.weatherCard = new WeatherCard(weatherContainer);

    this.mainContainer.append(searchBox, weatherContainer);
    this.container.appendChild(this.mainContainer);

    // Обработчики
    const handleSearch = async () => {
      const city = cityInput.value.trim();
      if (!city) return;

      errorMsg.style.display = 'none';
      searchBtn.disabled = true;
      searchBtn.textContent = 'Загрузка...';

      try {
        const data = await this.weatherService.getWeather(city);
        this.weatherCard.render(data);
      } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
        this.weatherCard.clear();
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