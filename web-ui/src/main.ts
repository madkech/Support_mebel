import './styles/base.css';
import './styles/form.css';
import './styles/results.css';
import './styles/scheme.css';
import { renderInputForm } from './components/input-form.ts';
import { App } from './app.ts';

function init(): void {
  const formContainer = document.getElementById('form-container');
  const resultsContainer = document.getElementById('results-container');

  if (!formContainer || !resultsContainer) {
    console.error('Required containers not found');
    return;
  }

  const app = new App(formContainer, resultsContainer);

  renderInputForm(formContainer, () => {
    app.calculate();
  });

  app.run();
}

document.addEventListener('DOMContentLoaded', init);
