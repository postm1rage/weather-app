// Панель поиска города: текстовое поле, кнопка «Узнать погоду» и кнопка «Сохранить город».
// Управляет состоянием загрузки, ошибками, видимостью кнопки сохранения.
class SearchPanel {
  /**
   * @param {HTMLElement} container - контейнер для вставки панели.
   * @param {function} onSearch - вызывается при поиске, получает название города.
   * @param {function} onSave - вызывается при клике на «Сохранить город».
   */
  constructor(container, onSearch, onSave) {
    this.container = container;
    this.onSearch = onSearch;
    this.onSave = onSave;
  }

  // Создаёт DOM-элементы панели и навешивает обработчики.
  render() {
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'search-box';

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Введите город';

    this.button = document.createElement('button');
    this.button.textContent = 'Узнать погоду';

    this.errorMsg = document.createElement('p');
    this.errorMsg.className = 'error-message';
    this.errorMsg.style.display = 'none';

    this.saveBtn = document.createElement('button');
    this.saveBtn.textContent = 'Сохранить город';
    this.saveBtn.style.display = 'none';
    this.saveBtn.addEventListener('click', () => {
      this.onSave();
    });

    wrapper.append(this.input, this.button, this.saveBtn, this.errorMsg);
    this.container.appendChild(wrapper);

    this.button.addEventListener('click', () => {
      this.onSearch(this.input.value.trim());
    });

    this.input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.onSearch(this.input.value.trim());
      }
    });
  }

  // Показывает кнопку «Сохранить город».
  showSaveButton() {
    this.saveBtn.style.display = 'inline-block';
  }

  // Скрывает кнопку «Сохранить город».
  hideSaveButton() {
    this.saveBtn.style.display = 'none';
  }

  /**
   * Показывает сообщение об ошибке.
   * @param {string} message - текст ошибки.
   */
  showError(message) {
    this.errorMsg.textContent = message;
    this.errorMsg.style.display = 'block';
  }

  // Скрывает сообщение об ошибке.
  hideError() {
    this.errorMsg.style.display = 'none';
  }

  /**
   * Переключает кнопку поиска в состояние загрузки.
   * @param {boolean} isLoading - true, если идёт загрузка.
   */
  setLoading(isLoading) {
    this.button.disabled = isLoading;
    this.button.textContent = isLoading ? 'Загрузка...' : 'Узнать погоду';
  }

  // Очищает поле ввода города.
  clearInput() {
    this.input.value = '';
  }
}

export default SearchPanel;