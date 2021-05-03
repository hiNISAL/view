import View from './View.js';

const app = new View({
  el: '#app',
  data: {
    title: '123',
    user: {
      age: 1,
      name: 2,
    },
  },
});

window.app = app;
