class SearchPanel {
  constructor(container, onSearch, onSave) {
    this.container = container;
    this.onSearch = onSearch;
    this.onSave = onSave;
  }

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

  showSaveButton() {
    this.saveBtn.style.display = 'inline-block';
  }

  hideSaveButton() {
    this.saveBtn.style.display = 'none';
  }

  showError(message) {
    this.errorMsg.textContent = message;
    this.errorMsg.style.display = 'block';
  }

  hideError() {
    this.errorMsg.style.display = 'none';
  }

  setLoading(isLoading) {
    this.button.disabled = isLoading;
    this.button.textContent = isLoading ? 'Загрузка...' : 'Узнать погоду';
  }

  clearInput() {
    this.input.value = '';
  }
}

export default SearchPanel;