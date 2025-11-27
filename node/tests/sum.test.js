// בדיקה פשוטה לוודא ש-Jest עובד
function sum(a, b) {
  return a + b;
}

test('sum adds numbers correctly', () => {
  expect(sum(2, 3)).toBe(5);
});