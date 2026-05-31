import WeatherService from './data/weatherApi.js';
import WelcomeScreen from './ui/welcome.js';
import Header from './ui/header.js';
import WeatherCard from './ui/weatherCard.js';
import CityList from './ui/cityList.js';
import SearchPanel from './ui/searchPanel.js';
import Stats from './ui/stats.js';

class App {
  constructor() {
    this.container = document.getElementById('app');
    this.weatherService = new WeatherService();
    this.welcomeScreen = null;
    this.header = null;
    this.weatherCard = null;
    this.cityList = null;
    this.searchPanel = null;
    this.stats = null;
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

    // Панель управления
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls';

    // Сортировка
    const sortLabel = document.createElement('label');
    sortLabel.textContent = 'Сортировать по:';
    const sortSelect = document.createElement('select');
    sortSelect.innerHTML = `
      <option value="">Без сортировки</option>
      <option value="city">Город</option>
      <option value="temp">Температура</option>
      <option value="humidity">Влажность</option>
      <option value="windSpeed">Ветер</option>
    `;
    sortSelect.addEventListener('change', () => {
      const field = sortSelect.value;
      if (field) {
        this.cityList.sortBy(field);
      } else {
        this.cityList.sortField = null;
        this.cityList.applyFiltersAndSort();
      }
    });

    // Фильтр по температуре
    const filterGroup = document.createElement('span');
    filterGroup.className = 'filter-group';

    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Температура от';
    const filterMin = document.createElement('input');
    filterMin.type = 'number';
    filterMin.placeholder = 'Мин';
    const filterMaxLabel = document.createElement('span');
    filterMaxLabel.textContent = 'до';
    filterMaxLabel.style.margin = '0 4px';
    const filterMax = document.createElement('input');
    filterMax.type = 'number';
    filterMax.placeholder = 'Макс';

    filterGroup.append(filterLabel, filterMin, filterMaxLabel, filterMax);

    const applyFilter = () => {
      const min = filterMin.value !== '' ? Number(filterMin.value) : null;
      const max = filterMax.value !== '' ? Number(filterMax.value) : null;
      this.cityList.filterByTemp(min, max);
    };

    filterMin.addEventListener('keyup', applyFilter);
    filterMax.addEventListener('keyup', applyFilter);

    controlsContainer.append(sortLabel, sortSelect, filterGroup);

    const statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';

    this.searchPanel = new SearchPanel(
      searchPanelContainer,
      (city) => this.handleSearch(city),
      () => {
        if (this.currentCityData) {
          this.cityList.addCity(this.currentCityData);
          this.searchPanel.hideSaveButton();
          this.searchPanel.clearInput();
          this.searchPanel.showError('Город сохранён!');
          setTimeout(() => this.searchPanel.hideError(), 3000);
        }
      }
    );

    this.weatherCard = new WeatherCard(weatherContainer);
    this.cityList = new CityList(cityListContainer);
    this.stats = new Stats(statsContainer);

    this.cityList.onUpdate = (cities) => {
      this.stats.render(cities);
    };

    this.mainContainer.append(
      searchPanelContainer,
      weatherContainer,
      controlsContainer,
      cityListContainer,
      statsContainer
    );

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