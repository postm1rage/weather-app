class Header {
  constructor(container) {
    this.container = container;
  }

  render(name) {
    this.container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'header';

    const greeting = document.createElement('span');
    greeting.textContent = `Привет, ${name}!`;
    greeting.className = 'greeting';

    const changeBtn = document.createElement('button');
    changeBtn.textContent = 'Сменить имя';
    changeBtn.className = 'btn-change-name';

    header.append(greeting, changeBtn);
    this.container.appendChild(header);

    changeBtn.addEventListener('click', () => {
      this.hide();
      if (this.onChangeName) {
        this.onChangeName();
      }
    });
  }

  hide() {
    this.container.innerHTML = '';
  }

  show() {

  }
}

export default Header;