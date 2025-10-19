export function formatCurrency(value: string) {
  return '$ ' + parseFloat(value).toFixed(2);
}
