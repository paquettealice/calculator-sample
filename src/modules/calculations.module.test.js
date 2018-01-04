"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var calculations_module_1 = require("./calculations.module");
/* resolveExpression */
test('resolveExpression "48/2(9+3)" to equal "288"', function () {
    expect(calculations_module_1.CalculationsModule.resolveExpression('48/2(9+3)')).toBe('288');
});
/* resolveParentheses */
test('resolveParentheses "48/2(9+3)" to equal "48/2*12"', function () {
    expect(calculations_module_1.CalculationsModule.resolveParentheses('48/2(9+3)')).toBe('48/2*12');
});
test('resolveParentheses "-1((3+5*3)*3)(2+5)" to equal "-1*54*7"', function () {
    expect(calculations_module_1.CalculationsModule.resolveParentheses('-1((3+5*3)*3)(2+5)')).toBe('-1*54*7');
});
test('resolveParentheses "0" to equal "0"', function () {
    expect(calculations_module_1.CalculationsModule.resolveParentheses('0')).toBe('0');
});
/* resolveMultiplicationDivision */
test('resolveMultiplicationDivision "-2+2*4/2*-6" to equal "-2+-24"', function () {
    expect(calculations_module_1.CalculationsModule.resolveMultiplicationDivision('-2+2*4/2*-6')).toBe('-2+-24');
});
test('resolveMultiplicationDivision "-2+2" to equal "-2+2"', function () {
    expect(calculations_module_1.CalculationsModule.resolveMultiplicationDivision('-2+2')).toBe('-2+2');
});
test('resolveMultiplicationDivision "-2+2*-0" to equal "-2+0"', function () {
    expect(calculations_module_1.CalculationsModule.resolveMultiplicationDivision('-2+2*-0')).toBe('-2+0');
});
test('resolveMultiplicationDivision "-2" to equal "-2"', function () {
    expect(calculations_module_1.CalculationsModule.resolveMultiplicationDivision('-2')).toBe('-2');
});
/* sum */
test('sum "1+2" to equal "3"', function () { expect(calculations_module_1.CalculationsModule.sum('1+2')).toBe('3'); });
test('sum "+1+2" to equal "3"', function () { expect(calculations_module_1.CalculationsModule.sum('+1+2')).toBe('3'); });
test('sum "-1+2" to equal "1"', function () { expect(calculations_module_1.CalculationsModule.sum('-1+2')).toBe('1'); });
test('sum "-1-2" to equal "-3"', function () { expect(calculations_module_1.CalculationsModule.sum('-1-2')).toBe('-3'); });
test('sum "-1+0" to equal "-1"', function () { expect(calculations_module_1.CalculationsModule.sum('-1+0')).toBe('-1'); });
test('sum "+0" to equal "0"', function () { expect(calculations_module_1.CalculationsModule.sum('+0')).toBe('0'); });
test('sum "-0" to equal "0"', function () { expect(calculations_module_1.CalculationsModule.sum('-0')).toBe('0'); });
test('sum "1" to equal "1"', function () { expect(calculations_module_1.CalculationsModule.sum('1')).toBe('1'); });
test('sum "0-1" to equal "-1"', function () { expect(calculations_module_1.CalculationsModule.sum('0-1')).toBe('-1'); });
test('sum "--1+1" to throw an InvalidOperationError', function () {
    expect(function () {
        console.log(calculations_module_1.CalculationsModule.sum('--1+1'));
    }).toThrow(/Invalid Operation/);
});
test('sum "--1" to throw an InvalidOperationError', function () {
    expect(function () {
        console.log(calculations_module_1.CalculationsModule.sum('--1'));
    }).toThrow(/Invalid Operation/);
});
test('sum "++1" to throw an InvalidOperationError', function () {
    expect(function () {
        console.log(calculations_module_1.CalculationsModule.sum('++1'));
    }).toThrow(/Invalid Operation/);
});
/* multiply */
test('multiply "1*0" to equal "0"', function () {
    expect(calculations_module_1.CalculationsModule.multiply('1*0')).toBe('0');
});
test('multiply "0*1" to equal "0"', function () {
    expect(calculations_module_1.CalculationsModule.multiply('0*1')).toBe('0');
});
test('multiply "0*0" to equal "0"', function () {
    expect(calculations_module_1.CalculationsModule.multiply('0*0')).toBe('0');
});
test('multiply "-0*0" to equal "0"', function () {
    expect(calculations_module_1.CalculationsModule.multiply('-0*0')).toBe('0');
});
test('multiply "0*-0" to equal "0"', function () {
    expect(calculations_module_1.CalculationsModule.multiply('0*-0')).toBe('0');
});
/* divide */
test('divide "1/0" to equal "Infinity"', function () {
    expect(calculations_module_1.CalculationsModule.divide('1/0')).toBe('Infinity');
});
test('divide "0/1" to equal "0"', function () {
    expect(calculations_module_1.CalculationsModule.divide('0/1')).toBe('0');
});
test('divide "0/0" to throw an InvalidOperationError', function () {
    expect(function () {
        console.log(calculations_module_1.CalculationsModule.divide('0/0'));
    }).toThrow(/Invalid Operation/);
});
test('divide "0/-0" to throw an InvalidOperationError', function () {
    expect(function () {
        console.log(calculations_module_1.CalculationsModule.divide('0/-0'));
    }).toThrow(/Invalid Operation/);
});
test('divide "-0/0" to throw an InvalidOperationError', function () {
    expect(function () {
        console.log(calculations_module_1.CalculationsModule.divide('-0/0'));
    }).toThrow(/Invalid Operation/);
});
