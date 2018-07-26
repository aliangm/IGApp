export function formatBudget(budget) {
	if (budget == null) {
		return ''
	}

	return String(budget).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatBudgetWithDollar(budget) {
  return '$' + formatBudget(budget);
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

export function extractNumberFromBudget(budget) {
  return parseInt(budget.toString().replace(/\D+/g, '')) || 0;
}