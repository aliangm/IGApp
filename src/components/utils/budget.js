export function formatNumber(budget) {
  if (budget == null) {
    return '';
  }

  return String(budget).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatBudget(budget) {
  return '$' + formatNumber(budget);
}

export function formatBudgetShortened(budget) {
  if (budget >= 1000000000) {
    return (budget / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (budget >= 1000000) {
    return (budget / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (budget >= 1000) {
    return (budget / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return budget;
}