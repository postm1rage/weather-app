class Header {
  constructor(container) {
    this.container = container;
    this.onChangeName = null;
    this.onToggleTheme = null;
  }

  render(name) {
    this.container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'header';

    const greeting = document.createElement('span');
    greeting.textContent = `Привет, ${name}!`;
    greeting.className = 'greeting';

    const themeBtn = document.createElement('button');
    themeBtn.textContent = 'Тёмная тема';
    themeBtn.className = 'btn-theme';

    const changeBtn = document.createElement('button');
    changeBtn.textContent = 'Сменить имя';
    changeBtn.className = 'btn-change-name';

    header.append(greeting, themeBtn, changeBtn);
    this.container.appendChild(header);

    changeBtn.addEventListener('click', () => {
      this.hide();
      if (this.onChangeName) {
        this.onChangeName();
      }
    });

    themeBtn.addEventListener('click', () => {
      if (this.onToggleTheme) {
        this.onToggleTheme();
      }
    });
  }

  updateThemeButton(isDark) {
    const btn = this.container.querySelector('.btn-theme');
    if (btn) {
      btn.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
    }
  }

  hide() {
    this.container.innerHTML = '';
  }

  show() {
  }
}

export default Header;