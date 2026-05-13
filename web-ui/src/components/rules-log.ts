import type { AppliedRule } from '../bridge.ts';

export function renderRulesLog(container: HTMLElement, rules: AppliedRule[], warnings: string[]): void {
  const hasRules = rules.length > 0;
  const hasWarnings = warnings.length > 0;

  if (!hasRules && !hasWarnings) {
    container.innerHTML = '';
    return;
  }

  let html = '<div class="rules-log">';

  if (hasRules) {
    html += `<h3>✓ Применённые правила</h3><div class="rules-log__list">`;
    html += rules.map(r => `
      <div class="rule-item rule-item--applied">
        <span class="rule-item__icon">✓</span>
        <span>${r.message}</span>
      </div>
    `).join('');
    html += `</div>`;
  }

  if (hasWarnings) {
    html += `<h3 style="margin-top:1rem;">⚠ Предупреждения</h3><div class="rules-log__list">`;
    html += warnings.map(w => `
      <div class="rule-item rule-item--warning">
        <span class="rule-item__icon">⚠</span>
        <span>${w}</span>
      </div>
    `).join('');
    html += `</div>`;
  }

  html += '</div>';
  container.innerHTML = html;
}
