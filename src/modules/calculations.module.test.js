import { CalculationsModule as C } from './calculations.module';
/* resolveExpression */
test('resolveExpression "48/2(9+3)" should equal "288"', () => {
    expect(C.resolveExpression('48/2(9+3)')).toBe('288');
});
test('resolveExpression "(2+5)*(2/0)" should equal "7*Infinity"', () => {
    expect(C.resolveExpression('(2+5)*(2/0)')).toBe('7*Infinity');
});
test('resolveExpression "(1-1)/0" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(C.resolveExpression('(1-1)/0'));
    });
});
/* resolveParentheses */
test('resolveParentheses "48/2(9+3)" should equal "48/2*12"', () => {
    expect(C.resolveParentheses('48/2(9+3)')).toBe('48/2*12');
});
test('resolveParentheses "-1((3+5*3)*3)(2+5)" should equal "-1*54*7"', () => {
    expect(C.resolveParentheses('-1((3+5*3)*3)(2+5)')).toBe('-1*54*7');
});
test('resolveParentheses "0" should equal "0"', () => {
    expect(C.resolveParentheses('0')).toBe('0');
});
/* resolveMultiplicationDivision */
test('resolveMultiplicationDivision "-2+2*4/2*-6" should equal "-2+-24"', () => {
    expect(C.resolveMultiplicationDivision('-2+2*4/2*-6')).toBe('-2+-24');
});
test('resolveMultiplicationDivision "-2+2" should equal "-2+2"', () => {
    expect(C.resolveMultiplicationDivision('-2+2')).toBe('-2+2');
});
test('resolveMultiplicationDivision "-2+2*-0" should equal "-2+0"', () => {
    expect(C.resolveMultiplicationDivision('-2+2*-0')).toBe('-2+0');
});
test('resolveMultiplicationDivision "-2" should equal "-2"', () => {
    expect(C.resolveMultiplicationDivision('-2')).toBe('-2');
});
/* resolveAdditionSubtraction */
test('resolveAdditionSubtraction "-1+1*1" should equal "0*1"', () => {
    expect(C.resolveAdditionSubtraction('-1+1*1')).toBe('0*1');
});
test('resolveAdditionSubtraction "---2+--+--2" should equal "0"', () => {
    expect(C.resolveAdditionSubtraction('---2+--+--2')).toBe('0');
});
test('resolveAdditionSubtraction "0" should equal "0"', () => {
    expect(C.resolveAdditionSubtraction('0')).toBe('0');
});
test('resolveAdditionSubtraction "-2" should equal "-2"', () => {
    expect(C.resolveAdditionSubtraction('-2')).toBe('-2');
});
/* isDecimalFormat */
test('isDecimalFormat "0" should equal true', () => {
    expect(C.isDecimalFormat('0')).toBe(true);
});
test('isDecimalFormat "-0" should equal true', () => {
    expect(C.isDecimalFormat('-0')).toBe(true);
});
test('isDecimalFormat "0.0" should equal true', () => {
    expect(C.isDecimalFormat('0.0')).toBe(true);
});
test('isDecimalFormat "+0" should equal false', () => {
    expect(C.isDecimalFormat('+0')).toBe(false);
});
test('isDecimalFormat "0." should equal false', () => {
    expect(C.isDecimalFormat('0.')).toBe(false);
});
test('isDecimalFormat "0*0" should equal false', () => {
    expect(C.isDecimalFormat('0*0')).toBe(false);
});
test('isDecimalFormat "0-0" should equal false', () => {
    expect(C.isDecimalFormat('0-0')).toBe(false);
});
test('isDecimalFormat "0abc" should equal false', () => {
    expect(C.isDecimalFormat('0abc')).toBe(false);
});
test('isDecimalFormat "abc" should equal false', () => {
    expect(C.isDecimalFormat('abc')).toBe(false);
});
/* parseDecimalFormat */
test('parseDecimalFormat "0" should equal 0', () => {
    expect(C.parseDecimalFormat('0')).toBe(0);
});
test('parseDecimalFormat "-0" should equal 0', () => {
    expect(C.parseDecimalFormat('-0')).toBe(-0);
});
test('parseDecimalFormat "0.0" should equal 0', () => {
    expect(C.parseDecimalFormat('0.0')).toBe(0);
});
test('parseDecimalFormat "Infinity" should equal Infinity', () => {
    expect(C.parseDecimalFormat('Infinity')).toBe(Infinity);
});
test('parseDecimalFormat "+0" should equal NaN', () => {
    expect(C.parseDecimalFormat('+0')).toBe(NaN);
});
test('parseDecimalFormat "0." should equal NaN', () => {
    expect(C.parseDecimalFormat('0.')).toBe(NaN);
});
test('parseDecimalFormat "0*0" should equal NaN', () => {
    expect(C.parseDecimalFormat('0*0')).toBe(NaN);
});
test('parseDecimalFormat "0-0" should equal NaN', () => {
    expect(C.parseDecimalFormat('0-0')).toBe(NaN);
});
test('parseDecimalFormat "0abc" should equal NaN', () => {
    expect(C.parseDecimalFormat('0abc')).toBe(NaN);
});
test('parseDecimalFormat "abc" should equal NaN', () => {
    expect(C.parseDecimalFormat('abc')).toBe(NaN);
});
/* cleanupExtraOperators */
test('cleanupExtraOperators "--+5--5" should equal "5+5"', () => {
    expect(C.cleanupExtraOperators('--+5--5')).toBe('5+5');
});
test('cleanupExtraOperators "5" should equal "5"', () => {
    expect(C.cleanupExtraOperators('5')).toBe('5');
});
test('cleanupExtraOperators "5+5" should equal "5+5"', () => {
    expect(C.cleanupExtraOperators('5+5')).toBe('5+5');
});
/* convertParenthesisMultiplications */
test('convertParenthesisMultiplications "()()" should equal "()*()"', () => {
    expect(C.convertParenthesisMultiplications('()()')).toBe('()*()');
});
test('convertParenthesisMultiplications "5()" should equal "5*()"', () => {
    expect(C.convertParenthesisMultiplications('5()')).toBe('5*()');
});
test('convertParenthesisMultiplications "(5)" should equal "(5)"', () => {
    expect(C.convertParenthesisMultiplications('(5)')).toBe('(5)');
});
test('convertParenthesisMultiplications "-(5)" should equal "-(5)"', () => {
    expect(C.convertParenthesisMultiplications('-(5)')).toBe('-(5)');
});
/* sum */
test('sum "1+2" should equal "3"', () => {
    expect(C.sum('1+2')).toBe('3');
});
test('sum "+1+2" should equal "3"', () => {
    expect(C.sum('+1+2')).toBe('3');
});
test('sum "-1+2" should equal "1"', () => {
    expect(C.sum('-1+2')).toBe('1');
});
test('sum "-1-2" should equal "-3"', () => {
    expect(C.sum('-1-2')).toBe('-3');
});
test('sum "-1+0" should equal "-1"', () => {
    expect(C.sum('-1+0')).toBe('-1');
});
test('sum "+0" should equal "0"', () => {
    expect(C.sum('+0')).toBe('0');
});
test('sum "-0" should equal "0"', () => {
    expect(C.sum('-0')).toBe('0');
});
test('sum "1" should equal "1"', () => {
    expect(C.sum('1')).toBe('1');
});
test('sum "0-1" should equal "-1"', () => {
    expect(C.sum('0-1')).toBe('-1');
});
test('sum "--1+1" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(C.sum('--1+1'));
    }).toThrow(/Invalid Operation/);
});
test('sum "--1" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(C.sum('--1'));
    }).toThrow(/Invalid Operation/);
});
test('sum "++1" should throw "Invalid Operation"', () => {
    expect(() => {
        C.sum('++1');
    }).toThrow(/Invalid Operation/);
});
test('sum "2*1+1" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(C.sum('2*1+1'));
    }).toThrow(/Invalid Operation/);
});
/* multiply */
test('multiply "1*0" should equal "0"', () => {
    expect(C.multiply('1*0')).toBe('0');
});
test('multiply "0*1" should equal "0"', () => {
    expect(C.multiply('0*1')).toBe('0');
});
test('multiply "0*0" should equal "0"', () => {
    expect(C.multiply('0*0')).toBe('0');
});
test('multiply "-0*0" should equal "0"', () => {
    expect(C.multiply('-0*0')).toBe('0');
});
test('multiply "0*-0" should equal "0"', () => {
    expect(C.multiply('0*-0')).toBe('0');
});
/* divide */
test('divide "1/0" should equal "Infinity"', () => {
    expect(C.divide('1/0')).toBe('Infinity');
});
test('divide "0/1" should equal "0"', () => {
    expect(C.divide('0/1')).toBe('0');
});
test('divide "0/0" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(C.divide('0/0'));
    }).toThrow(/Invalid Operation/);
});
test('divide "0/-0" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(C.divide('0/-0'));
    }).toThrow(/Invalid Operation/);
});
test('divide "-0/0" should throw "Invalid Operation"', () => {
    expect(() => {
        console.log(C.divide('-0/0'));
    }).toThrowError(Error);
});
