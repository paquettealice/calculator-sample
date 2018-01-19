"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculations_module_1 = require("./calculations.module");
/* resolveExpression */
test('resolveExpression "48/2(9+3)" should equal "288"', () => {
    expect(calculations_module_1.CalculationsModule.resolveExpression('48/2(9+3)')).toBe('288');
});
test('resolveExpression "(2+5)*(2/0)" should equal "7*Infinity"', () => {
    expect(calculations_module_1.CalculationsModule.resolveExpression('(2+5)*(2/0)')).toBe('7*Infinity');
});
test('resolveExpression "(1-1)/0" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(calculations_module_1.CalculationsModule.resolveExpression('(1-1)/0'));
    });
});
/* resolveParentheses */
test('resolveParentheses "48/2(9+3)" should equal "48/2*12"', () => {
    expect(calculations_module_1.CalculationsModule.resolveParentheses('48/2(9+3)')).toBe('48/2*12');
});
test('resolveParentheses "-1((3+5*3)*3)(2+5)" should equal "-1*54*7"', () => {
    expect(calculations_module_1.CalculationsModule.resolveParentheses('-1((3+5*3)*3)(2+5)')).toBe('-1*54*7');
});
test('resolveParentheses "0" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.resolveParentheses('0')).toBe('0');
});
/* resolveMultiplicationDivision */
test('resolveMultiplicationDivision "-2+2*4/2*-6" should equal "-2+-24"', () => {
    expect(calculations_module_1.CalculationsModule.resolveMultiplicationDivision('-2+2*4/2*-6')).toBe('-2+-24');
});
test('resolveMultiplicationDivision "-2+2" should equal "-2+2"', () => {
    expect(calculations_module_1.CalculationsModule.resolveMultiplicationDivision('-2+2')).toBe('-2+2');
});
test('resolveMultiplicationDivision "-2+2*-0" should equal "-2+0"', () => {
    expect(calculations_module_1.CalculationsModule.resolveMultiplicationDivision('-2+2*-0')).toBe('-2+0');
});
test('resolveMultiplicationDivision "-2" should equal "-2"', () => {
    expect(calculations_module_1.CalculationsModule.resolveMultiplicationDivision('-2')).toBe('-2');
});
/* resolveAdditionSubtraction */
test('resolveAdditionSubtraction "-1+1*1" should equal "0*1"', () => {
    expect(calculations_module_1.CalculationsModule.resolveAdditionSubtraction('-1+1*1')).toBe('0*1');
});
test('resolveAdditionSubtraction "---2+--+--2" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.resolveAdditionSubtraction('---2+--+--2')).toBe('0');
});
test('resolveAdditionSubtraction "0" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.resolveAdditionSubtraction('0')).toBe('0');
});
test('resolveAdditionSubtraction "-2" should equal "-2"', () => {
    expect(calculations_module_1.CalculationsModule.resolveAdditionSubtraction('-2')).toBe('-2');
});
test('resolveAdditionSubtraction "12+3-0.2-0.3" should equal "14.5"', () => {
    expect(calculations_module_1.CalculationsModule.resolveAdditionSubtraction('12+3-0.2-0.3')).toBe('14.5');
});
test('resolveAdditionSubtraction "12+3-1-1" should equal "13"', () => {
    expect(calculations_module_1.CalculationsModule.resolveAdditionSubtraction('12+3-1-1')).toBe('13');
});
/* isDecimalFormat */
test('isDecimalFormat "0" should equal true', () => {
    expect(calculations_module_1.CalculationsModule.isDecimalFormat('0')).toBe(true);
});
test('isDecimalFormat "-0" should equal true', () => {
    expect(calculations_module_1.CalculationsModule.isDecimalFormat('-0')).toBe(true);
});
test('isDecimalFormat "0.0" should equal true', () => {
    expect(calculations_module_1.CalculationsModule.isDecimalFormat('0.0')).toBe(true);
});
test('isDecimalFormat "+0" should equal false', () => {
    expect(calculations_module_1.CalculationsModule.isDecimalFormat('+0')).toBe(false);
});
test('isDecimalFormat "0." should equal false', () => {
    expect(calculations_module_1.CalculationsModule.isDecimalFormat('0.')).toBe(false);
});
test('isDecimalFormat "0*0" should equal false', () => {
    expect(calculations_module_1.CalculationsModule.isDecimalFormat('0*0')).toBe(false);
});
test('isDecimalFormat "0-0" should equal false', () => {
    expect(calculations_module_1.CalculationsModule.isDecimalFormat('0-0')).toBe(false);
});
test('isDecimalFormat "0abc" should equal false', () => {
    expect(calculations_module_1.CalculationsModule.isDecimalFormat('0abc')).toBe(false);
});
test('isDecimalFormat "abc" should equal false', () => {
    expect(calculations_module_1.CalculationsModule.isDecimalFormat('abc')).toBe(false);
});
/* parseDecimalFormat */
test('parseDecimalFormat "0" should equal 0', () => {
    expect(calculations_module_1.CalculationsModule.parseDecimalFormat('0')).toBe(0);
});
test('parseDecimalFormat "-0" should equal 0', () => {
    expect(calculations_module_1.CalculationsModule.parseDecimalFormat('-0')).toBe(-0);
});
test('parseDecimalFormat "0.0" should equal 0', () => {
    expect(calculations_module_1.CalculationsModule.parseDecimalFormat('0.0')).toBe(0);
});
test('parseDecimalFormat "Infinity" should equal Infinity', () => {
    expect(calculations_module_1.CalculationsModule.parseDecimalFormat('Infinity')).toBe(Infinity);
});
test('parseDecimalFormat "+0" should equal NaN', () => {
    expect(calculations_module_1.CalculationsModule.parseDecimalFormat('+0')).toBe(NaN);
});
test('parseDecimalFormat "0." should equal NaN', () => {
    expect(calculations_module_1.CalculationsModule.parseDecimalFormat('0.')).toBe(NaN);
});
test('parseDecimalFormat "0*0" should equal NaN', () => {
    expect(calculations_module_1.CalculationsModule.parseDecimalFormat('0*0')).toBe(NaN);
});
test('parseDecimalFormat "0-0" should equal NaN', () => {
    expect(calculations_module_1.CalculationsModule.parseDecimalFormat('0-0')).toBe(NaN);
});
test('parseDecimalFormat "0abc" should equal NaN', () => {
    expect(calculations_module_1.CalculationsModule.parseDecimalFormat('0abc')).toBe(NaN);
});
test('parseDecimalFormat "abc" should equal NaN', () => {
    expect(calculations_module_1.CalculationsModule.parseDecimalFormat('abc')).toBe(NaN);
});
/* cleanupExtraOperators */
test('cleanupExtraOperators "--+5--5" should equal "5+5"', () => {
    expect(calculations_module_1.CalculationsModule.cleanupExtraOperators('--+5--5')).toBe('5+5');
});
test('cleanupExtraOperators "5" should equal "5"', () => {
    expect(calculations_module_1.CalculationsModule.cleanupExtraOperators('5')).toBe('5');
});
test('cleanupExtraOperators "5+5" should equal "5+5"', () => {
    expect(calculations_module_1.CalculationsModule.cleanupExtraOperators('5+5')).toBe('5+5');
});
/* convertParenthesisMultiplications */
test('convertParenthesisMultiplications "()()" should equal "()*()"', () => {
    expect(calculations_module_1.CalculationsModule.convertParenthesisMultiplications('()()')).toBe('()*()');
});
test('convertParenthesisMultiplications "5()" should equal "5*()"', () => {
    expect(calculations_module_1.CalculationsModule.convertParenthesisMultiplications('5()')).toBe('5*()');
});
test('convertParenthesisMultiplications "(5)" should equal "(5)"', () => {
    expect(calculations_module_1.CalculationsModule.convertParenthesisMultiplications('(5)')).toBe('(5)');
});
test('convertParenthesisMultiplications "-(5)" should equal "-(5)"', () => {
    expect(calculations_module_1.CalculationsModule.convertParenthesisMultiplications('-(5)')).toBe('-(5)');
});
test('convertParenthesisMultiplications "-(5+3)2" should equal "-(5+3)*2"', () => {
    expect(calculations_module_1.CalculationsModule.convertParenthesisMultiplications('-(5+3)2')).toBe('-(5+3)*2');
});
/* sum */
test('sum "1+2" should equal "3"', () => {
    expect(calculations_module_1.CalculationsModule.sum('1+2')).toBe('3');
});
test('sum "+1+2" should equal "3"', () => {
    expect(calculations_module_1.CalculationsModule.sum('+1+2')).toBe('3');
});
test('sum "-1+2" should equal "1"', () => {
    expect(calculations_module_1.CalculationsModule.sum('-1+2')).toBe('1');
});
test('sum "-1-2" should equal "-3"', () => {
    expect(calculations_module_1.CalculationsModule.sum('-1-2')).toBe('-3');
});
test('sum "-1+0" should equal "-1"', () => {
    expect(calculations_module_1.CalculationsModule.sum('-1+0')).toBe('-1');
});
test('sum "+0" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.sum('+0')).toBe('0');
});
test('sum "-0" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.sum('-0')).toBe('0');
});
test('sum "1" should equal "1"', () => {
    expect(calculations_module_1.CalculationsModule.sum('1')).toBe('1');
});
test('sum "0-1" should equal "-1"', () => {
    expect(calculations_module_1.CalculationsModule.sum('0-1')).toBe('-1');
});
test('sum "--1+1" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(calculations_module_1.CalculationsModule.sum('--1+1'));
    }).toThrow(/Invalid Operation/);
});
test('sum "--1" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(calculations_module_1.CalculationsModule.sum('--1'));
    }).toThrow(/Invalid Operation/);
});
test('sum "++1" should throw "Invalid Operation"', () => {
    expect(() => {
        calculations_module_1.CalculationsModule.sum('++1');
    }).toThrow(/Invalid Operation/);
});
test('sum "2*1+1" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(calculations_module_1.CalculationsModule.sum('2*1+1'));
    }).toThrow(/Invalid Operation/);
});
/* multiply */
test('multiply "1*0" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.multiply('1*0')).toBe('0');
});
test('multiply "0*1" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.multiply('0*1')).toBe('0');
});
test('multiply "0*0" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.multiply('0*0')).toBe('0');
});
test('multiply "-0*0" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.multiply('-0*0')).toBe('0');
});
test('multiply "0*-0" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.multiply('0*-0')).toBe('0');
});
/* divide */
test('divide "1/0" should equal "Infinity"', () => {
    expect(calculations_module_1.CalculationsModule.divide('1/0')).toBe('Infinity');
});
test('divide "0/1" should equal "0"', () => {
    expect(calculations_module_1.CalculationsModule.divide('0/1')).toBe('0');
});
test('divide "0/0" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(calculations_module_1.CalculationsModule.divide('0/0'));
    }).toThrow(/Invalid Operation/);
});
test('divide "0/-0" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(calculations_module_1.CalculationsModule.divide('0/-0'));
    }).toThrow(/Invalid Operation/);
});
test('divide "-0/0" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(calculations_module_1.CalculationsModule.divide('-0/0'));
    }).toThrowError(Error);
});
//# sourceMappingURL=calculations.module.test.js.map