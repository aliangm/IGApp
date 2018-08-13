import sumBy from 'lodash/sumBy';

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

export function extractNumberFromBudget(budget, defaultValue = 0) {
  return parseInt(budget.toString().replace(/\D+/g, '')) || defaultValue;
}

export function getPlanBudgetsData(planBudgets) {
  const {committedBudgets} = seperateCommittedAndSuggested(planBudgets);

  const sumBudgets = {};
  committedBudgets.forEach(month => {
    Object.keys(month).forEach(channel => {
      if (!sumBudgets[channel]) {
        sumBudgets[channel] = 0;
      }
      sumBudgets[channel] += month[channel];
    });
  });

  const totalCost = sumBy(Object.keys(sumBudgets), key => sumBudgets[key]);

  return {
    committedBudgets,
    sumBudgets,
    totalCost
  };
}

export function seperateCommittedAndSuggested(planBudgets) {
  const committedBudgets = Array(planBudgets.length);
  const suggestedBudgets = Array(planBudgets.length);

  planBudgets.forEach((month, index) => {
    const committedMonth = {};
    const suggestedMonth = {};
    Object.keys(month).map((key) => {
      const committedBudget = month[key].committedBudget;
      committedMonth[key] = committedBudget || 0;
      suggestedMonth[key] = month[key].secondaryValue;
    });

    committedBudgets[index] = committedMonth;
    suggestedBudgets[index] = suggestedMonth;
  });

  return {committedBudgets, suggestedBudgets};
}