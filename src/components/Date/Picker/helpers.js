export function isValidDate(value) {
  const date = new Date(value);
  // Check if date is invalid

  return !isNaN(date.getTime());
}
