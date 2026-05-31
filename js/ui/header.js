class Header {
  constructor(container) {
    this.container = container;
  }

  render(name) {
    throw new Error('1');
  }

  hide() {
    throw new Error('2');
  }

  show() {
    throw new Error('3');
  }
}

export default Header;