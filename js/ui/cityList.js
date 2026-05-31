class CityList {
  constructor(container) {
    this.container = container;
    this.cities = [];
  }

  addCity(cityData) {
    throw new Error('Not implemented');
  }

  removeCity(name) {
    throw new Error('Not implemented');
  }

  sortBy(field) {
    throw new Error('Not implemented');
  }

  filterByTemp(min, max) {
    throw new Error('Not implemented');
  }

  render() {
    throw new Error('Not implemented');
  }

  hide() {
    throw new Error('Not implemented');
  }

  show() {
    throw new Error('Not implemented');
  }
}

export default CityList;