import WeatherService from './data/weatherApi.js';
import WelcomeScreen from './ui/welcome.js';
import Header from './ui/header.js';
import WeatherCard from './ui/weatherCard.js';
import CityList from './ui/cityList.js';
import SearchPanel from './ui/searchPanel.js';

class App {
  constructor() {
    this.container = document.getElementById('app');
    this.weatherService = new WeatherService();
    this.welcomeScreen = null;
    this.header = null;
    this.weatherCard = null;
    this.cityList = null;
    this.searchPanel = null;
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

    const searchPanelContainer = document.createElement('div');
    const weatherContainer = document.createElement('div');
    weatherContainer.id = 'weather-container';
    const cityListContainer = document.createElement('div');
    cityListContainer.id = 'city-list-container';

    this.searchPanel = new SearchPanel(
      searchPanelContainer,
      (city) => this.handleSearch(city),
      () => {
        if (this.currentCityData) {
          this.cityList.addCity(this.currentCityData);
          this.cityList.render();
          this.searchPanel.hideSaveButton();
          this.searchPanel.clearInput();
          this.searchPanel.showError('Город сохранён!');
          setTimeout(() => this.searchPanel.hideError(), 3000);
        }
      }
    );

    this.weatherCard = new WeatherCard(weatherContainer);
    this.cityList = new CityList(cityListContainer);

    this.mainContainer.append(searchPanelContainer, weatherContainer, cityListContainer);
    this.container.appendChild(this.mainContainer);

    this.searchPanel.render();
  }

  async handleSearch(city) {
    if (!city) return;

    this.searchPanel.hideError();
    this.searchPanel.setLoading(true);
    this.searchPanel.hideSaveButton();

    try {
      const data = await this.weatherService.getWeather(city);
      this.weatherCard.render(data);
      this.currentCityData = data;
      this.searchPanel.showSaveButton();
    } catch (err) {
      this.searchPanel.showError(err.message);
      this.weatherCard.clear();
      this.currentCityData = null;
    } finally {
      this.searchPanel.setLoading(false);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App().init();
});