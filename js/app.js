import WeatherService from './data/weatherApi.js';
import WelcomeScreen from './ui/welcome.js';
import Header from './ui/header.js';
import WeatherCard from './ui/weatherCard.js';
import CityList from './ui/cityList.js';
import SearchPanel from './ui/searchPanel.js';
import Stats from './ui/stats.js';
import ControlsPanel from './ui/controlsPanel.js';

// Главный координатор приложения.
// Создаёт компоненты, связывает их через колбэки,
// управляет переходами между экраном приветствия и основным экраном.
class App {
  constructor() {
    this.container = document.getElementById('app');
    this.weatherService = new WeatherService();   // слой данных
    this.welcomeScreen = null;
    this.header = null;
    this.weatherCard = null;
    this.cityList = null;
    this.searchPanel = null;
    this.stats = null;
    this.controlsPanel = null;
    this.userName = '';
    this.mainContainer = null;       // контейнер основного экрана
    this.currentCityData = null;     // последний успешно полученный город
    this.isDarkTheme = false;        // состояние темы
  }

  // Точка входа. Инициализирует шапку и экран приветствия.
  init() {
    this.header = new Header(this.container);
    this.header.onChangeName = () => {
      this.welcomeScreen.render();
      if (this.mainContainer) {
        this.mainContainer.remove();
        this.mainContainer = null;
      }
    };
    this.header.onToggleTheme = () => {
      this.isDarkTheme = !this.isDarkTheme;
      if (this.isDarkTheme) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      this.header.updateThemeButton(this.isDarkTheme);
    };

    this.welcomeScreen = new WelcomeScreen(this.container, (name) => {
      this.userName = name;
      this.welcomeScreen.hide();
      this.header.render(name);
      this.header.updateThemeButton(this.isDarkTheme);
      this.showMainScreen();
    });

    this.welcomeScreen.render();
  }

  // Строит основной экран: поиск, карточка погоды, панель управления, таблица городов, статистика.
  showMainScreen() {
    this.mainContainer = document.createElement('div');
    this.mainContainer.className = 'main-screen';

    const searchPanelContainer = document.createElement('div');
    const weatherContainer = document.createElement('div');
    weatherContainer.id = 'weather-container';

    const controlsContainer = document.createElement('div');
    const cityListContainer = document.createElement('div');
    cityListContainer.id = 'city-list-container';
    const statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';

    // Панель сортировки и фильтрации
    this.controlsPanel = new ControlsPanel(
      controlsContainer,
      (field) => {
        if (field) {
          this.cityList.sortBy(field);
        } else {
          this.cityList.sortField = null;
          this.cityList.applyFiltersAndSort();
        }
      },
      (min, max) => {
        this.cityList.filterByTemp(min, max);
      }
    );

    // Панель поиска и сохранения
    this.searchPanel = new SearchPanel(
      searchPanelContainer,
      (city) => this.handleSearch(city),
      () => {
        if (this.currentCityData) {
          const added = this.cityList.addCity(this.currentCityData);
          if (added) {
            this.searchPanel.hideSaveButton();
            this.searchPanel.clearInput();
            this.controlsPanel.resetFilter();   // сбрасываем поля фильтра, т.к. они сброшены и в CityList
            this.searchPanel.showError('Город сохранён!');
            setTimeout(() => this.searchPanel.hideError(), 3000);
          } else {
            this.searchPanel.showError('Этот город уже сохранён!');
            setTimeout(() => this.searchPanel.hideError(), 3000);
          }
        }
      }
    );

    this.weatherCard = new WeatherCard(weatherContainer);
    this.cityList = new CityList(cityListContainer);
    this.stats = new Stats(statsContainer);

    // Автоматическое обновление статистики при изменении списка городов
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
    this.controlsPanel.render();
  }

  /**
   * Обработчик поиска города. Запрашивает погоду, отображает карточку,
   * управляет видимостью кнопки сохранения.
   * @param {string} city - название города.
   */
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