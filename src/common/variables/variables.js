let instance = null;
export default class Variables {
  // singleton
  constructor() {
    if (instance) return instance;
    instance = this;
  }
}
