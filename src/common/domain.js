import Variables from './variables/variables';
import Storage from './store/storage';

export class Domain {
  // context matching pattern
  context = [];
  constructor() {
    // if class has init method, call it
    Variables?.init();
    Storage?.init();
  }
}
