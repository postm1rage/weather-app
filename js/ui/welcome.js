class WelcomeScreen {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
  }

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

  hide() {
    this.container.innerHTML = '';
  }
}

export default WelcomeScreen;