import { KeyCombinationsModule as K } from './key-combinations.module';

let e: KeyboardEvent;

/* convertToKeyCombination */
test('convertToKeyCombination "keydown +" should equal "+"', () => {
  e = new KeyboardEvent('keydown', {shiftKey: true, key: '+'});
  expect(K.convertToKeyCombination(e)).toBe('+');
});
test('convertToKeyCombination "keydown Shift Control Alt Enter" should equal "Control+Shift+Alt+Enter"', () => {
  e = new KeyboardEvent('keydown', {ctrlKey: true, shiftKey: true, altKey: true, key: 'Enter'});
  expect(K.convertToKeyCombination(e)).toBe('Control+Shift+Alt+Enter');
});
test('convertToKeyCombination "keydown n" should equal "n"', () => {
  e = new KeyboardEvent('keydown', {key: 'n'});
  expect(K.convertToKeyCombination(e)).toBe('n');
});
test('convertToKeyCombination "keypress n" should equal "n"', () => {
  e = new KeyboardEvent('keypress', {key: 'n'});
  expect(K.convertToKeyCombination(e)).toBe('n');
});
test('convertToKeyCombination "keyup n" should equal "n"', () => {
  e = new KeyboardEvent('keyup', {key: 'n'});
  expect(K.convertToKeyCombination(e)).toBe('n');
});

/* listActiveModifiers */
test('listActiveModifiers "keydown Control Shift" should equal ["Control", "Shift"]', () => {
  e = new KeyboardEvent('keydown', {ctrlKey: true, shiftKey: true});
  expect(K.listActiveModifiers(e)).toEqual(['Control', 'Shift']);
});
test('listActiveModifiers "keydown should equal []', () => {
  e = new KeyboardEvent('keydown', {});
  expect(K.listActiveModifiers(e)).toEqual([]);
});
test('listActiveModifiers "keypress Meta" should equal ["Meta"]', () => {
  e = new KeyboardEvent('keypress', {metaKey: true});
  expect(K.listActiveModifiers(e)).toEqual(['Meta']);
});
test('listActiveModifiers "keyup Control Shift Alt Meta" should equal ["Control", "Shift", "Alt", "Meta"]', () => {
  e = new KeyboardEvent('keyup', {ctrlKey: true, shiftKey: true, altKey: true, metaKey: true});
  expect(K.listActiveModifiers(e)).toEqual(['Control', 'Shift', 'Alt', 'Meta']);
});

/* isModifier */
test('isModifier "keydown a" should equal false', () => {
  e = new KeyboardEvent('keydown', {key: 'a'});
  expect(K.isModifier(e)).toBe(false);
});
test('isModifier "keydown Control a" should equal false', () => {
  e = new KeyboardEvent('keydown', {ctrlKey: false, key: 'a'});
  expect(K.isModifier(e)).toBe(false);
});
test('isModifier "keydown Control" should equal true', () => {
  e = new KeyboardEvent('keydown', {ctrlKey: true, key: 'Control'});
  expect(K.isModifier(e)).toBe(true);
});
test('isModifier "keyup Control" should equal true', () => {
  e = new KeyboardEvent('keyup', {ctrlKey: true, key: 'Control'});
  expect(K.isModifier(e)).toBe(true);
});