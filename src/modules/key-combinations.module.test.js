"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var key_combinations_module_1 = require("./key-combinations.module");
var e;
/* convertToKeyCombination */
test('convertToKeyCombination "keydown +" should equal "+"', function () {
    e = new KeyboardEvent('keydown', { shiftKey: true, key: '+' });
    expect(key_combinations_module_1.KeyCombinationsModule.convertToKeyCombination(e)).toBe('+');
});
test('convertToKeyCombination "keydown Shift Control Alt Enter" should equal "Control+Shift+Alt+Enter"', function () {
    e = new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true, altKey: true, key: 'Enter' });
    expect(key_combinations_module_1.KeyCombinationsModule.convertToKeyCombination(e)).toBe('Control+Shift+Alt+Enter');
});
test('convertToKeyCombination "keydown n" should equal "n"', function () {
    e = new KeyboardEvent('keydown', { key: 'n' });
    expect(key_combinations_module_1.KeyCombinationsModule.convertToKeyCombination(e)).toBe('n');
});
test('convertToKeyCombination "keypress n" should equal "n"', function () {
    e = new KeyboardEvent('keypress', { key: 'n' });
    expect(key_combinations_module_1.KeyCombinationsModule.convertToKeyCombination(e)).toBe('n');
});
test('convertToKeyCombination "keyup n" should equal "n"', function () {
    e = new KeyboardEvent('keyup', { key: 'n' });
    expect(key_combinations_module_1.KeyCombinationsModule.convertToKeyCombination(e)).toBe('n');
});
/* listActiveModifiers */
test('listActiveModifiers "keydown Control Shift" should equal ["Control", "Shift"]', function () {
    e = new KeyboardEvent('keydown', { ctrlKey: true, shiftKey: true });
    expect(key_combinations_module_1.KeyCombinationsModule.listActiveModifiers(e)).toEqual(['Control', 'Shift']);
});
test('listActiveModifiers "keydown should equal []', function () {
    e = new KeyboardEvent('keydown', {});
    expect(key_combinations_module_1.KeyCombinationsModule.listActiveModifiers(e)).toEqual([]);
});
test('listActiveModifiers "keypress Meta" should equal ["Meta"]', function () {
    e = new KeyboardEvent('keypress', { metaKey: true });
    expect(key_combinations_module_1.KeyCombinationsModule.listActiveModifiers(e)).toEqual(['Meta']);
});
test('listActiveModifiers "keyup Control Shift Alt Meta" should equal ["Control", "Shift", "Alt", "Meta"]', function () {
    e = new KeyboardEvent('keyup', { ctrlKey: true, shiftKey: true, altKey: true, metaKey: true });
    expect(key_combinations_module_1.KeyCombinationsModule.listActiveModifiers(e)).toEqual(['Control', 'Shift', 'Alt', 'Meta']);
});
/* isModifier */
test('isModifier "keydown a" should equal false', function () {
    e = new KeyboardEvent('keydown', { key: 'a' });
    expect(key_combinations_module_1.KeyCombinationsModule.isModifier(e)).toBe(false);
});
test('isModifier "keydown Control a" should equal false', function () {
    e = new KeyboardEvent('keydown', { ctrlKey: false, key: 'a' });
    expect(key_combinations_module_1.KeyCombinationsModule.isModifier(e)).toBe(false);
});
test('isModifier "keydown Control" should equal true', function () {
    e = new KeyboardEvent('keydown', { ctrlKey: true, key: 'Control' });
    expect(key_combinations_module_1.KeyCombinationsModule.isModifier(e)).toBe(true);
});
test('isModifier "keyup Control" should equal true', function () {
    e = new KeyboardEvent('keyup', { ctrlKey: true, key: 'Control' });
    expect(key_combinations_module_1.KeyCombinationsModule.isModifier(e)).toBe(true);
});
