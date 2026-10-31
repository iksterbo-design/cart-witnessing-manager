import { App } from './app';

// Render the app
const container = document.getElementById('app');
if (container) {
  container.innerHTML = '';
  container.appendChild(App());
}
