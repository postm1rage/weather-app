// Экран приветствия. Показывает поле ввода имени и кнопку «Далее».
// При подтверждении вызывает переданный колбэк onComplete с именем.
class WelcomeScreen {
  /**
   * @param {HTMLElement} container - контейнер для вставки экрана.
   * @param {function} onComplete - будет вызвана с именем, когда пользователь нажмёт «Далее» или Enter.
   */
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
  }

  // Создаёт форму приветствия.
  render() {
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'welcome';

    const title = document.createElement('h1');
    title.textContent = 'Добро пожаловать в Weather App';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Введите ваше имя';
    input.id = 'welcome-name';

    const button = document.createElement('button');
    button.textContent = 'Далее';
    button.id = 'welcome-btn';

    wrapper.append(title, input, button);
    this.container.appendChild(wrapper);

    button.addEventListener('click', () => {
      const name = input.value.trim();
      if (name) {
        this.onComplete(name);
      }
    });

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const name = input.value.trim();
        if (name) {
          this.onComplete(name);
        }
      }
    });
  }

  // Убирает экран приветствия из DOM.
  hide() {
    this.container.innerHTML = '';
  }
}

export default WelcomeScreen;