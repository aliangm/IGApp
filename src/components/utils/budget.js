export function formatBudget(budget) {
	if (budget == null) {
		return ''
	}

	return String(budget).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}