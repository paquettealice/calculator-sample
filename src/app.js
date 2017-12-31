/**
 * Created by Alice Paquette on 12/27/2017
 */
/** Variables **/
var calcApp;
(function (calcApp) {
    // For hotkeys
    calcApp.allowedKeys = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.',
        '(', ')', '+', '-', '*', '/', 'Backspace', 'Delete'
    ];
    // Elements
    calcApp.keypadButtons = document.querySelectorAll('button.kpad-btn');
    calcApp.resultDiv = document.getElementById('result');
    calcApp.expressionDiv = document.getElementById('expression');
    // A tiny version of a redux store
    calcApp.store = {
        expression: {
            dispatch: function (action, payload) {
                var oldState = calcApp.expressionDiv.textContent;
                var newState = oldState;
                switch (action) {
                    case 'write':
                        newState = oldState + payload;
                        break;
                    case 'delete':
                        newState = calcApp.expressionDiv.textContent.slice(0, -1);
                        break;
                    case 'clear':
                        newState = '';
                        break;
                }
                calcApp.expressionDiv.textContent = newState;
                calcApp.expressionDiv.dispatchEvent(new CustomEvent('change', { detail: newState }));
            }
        },
        result: {
            dispatch: function (action, payload) {
                switch (action) {
                    case 'update':
                        calcApp.resultDiv.textContent = payload;
                        break;
                }
            }
        }
    };
})(calcApp || (calcApp = {}));
/** MAIN ------------------------- **/
document.addEventListener('keydown', function (e) {
    if (calcApp.allowedKeys.includes(e.key)) {
        console.log('allowed! ' + e.key);
        if (e.key === 'Backspace' || e.key === 'Delete') {
            calcApp.store.expression.dispatch('delete');
        }
        else {
            calcApp.store.expression.dispatch('write', e.key);
        }
    }
    console.log(e);
});
calcApp.expressionDiv.addEventListener('change', expressionChanged);
for (var _i = 0, _a = calcApp.keypadButtons; _i < _a.length; _i++) {
    var button = _a[_i];
    button.addEventListener('click', keypadButtonClicked);
}
/** Event Listeners **/
function keypadButtonClicked(e) {
    console.log(e.target.classList.contains('kpad-fn'));
    // For the AC and DEL buttons
    if (e.target.classList.contains('kpad-fn')) {
        switch (e.target.value) {
            case 'ac':
                calcApp.store.expression.dispatch('clear');
                break;
            case 'del':
                calcApp.store.expression.dispatch('delete');
                break;
        }
    }
    else {
        calcApp.store.expression.dispatch('write', e.target.value);
    }
}
function expressionChanged(e) {
    console.log('expression changed!');
    var result = Calc.resolveExpression(e.detail);
    // Calculate new result
    console.log('Final result: ' + result);
    // console.log(findDeepestParentheses(e.detail));
    // Update the result state if the result is valid
    if (result == '') {
        calcApp.store.result.dispatch('update', '0');
    }
    else if (Calc.testForNumber(result)) {
        calcApp.store.result.dispatch('update', result);
    }
    else {
    }
}
/** Calculations **/
var Calc;
(function (Calc) {
    // Matches any parentheses that themselves contain no parentheses
    var matchDeepestParentheses = /\(([^()]+)\)/g;
    // Matches a binary multiplication or division operation (e.g. x*y)
    var matchMultiplicationDivision = /(^|[-+*/])(-?[\d.]+([*/])-?[.\d]+)/g;
    // Matches a binary addition or subtraction operation (e.g. x+y)
    var matchAdditionSubtraction = /(?:^-)?[\d.]+([-+])-?[.\d]+/g;
    // Matches consecutive pluses (+) and/or minuses (-)
    var matchConsecutivePlusesMinuses = /[-+]{2,}/g;
    // Matches a valid result (a resolved expression)
    var matchValidResult = /^-?\d+[.]?\d+$/;
    /* Resolvers
     * These recursive functions match operations and resolve them until there's nothing left. The result bubbles up to a
     * higher level (parenthesis > multiplication/division > addition/subtraction) until the entire expression has been
     * flattened and resolved.
     * Note: Separating multiplication and division is not necessary because regex matches from left to right by default.
     */
    function resolveExpression(expression) {
        console.log(expression);
        var flattenedExpression = resolveParentheses(expression);
        console.log(flattenedExpression);
        return resolveAdditionSubtraction(resolveMultiplicationDivision(flattenedExpression));
    }
    Calc.resolveExpression = resolveExpression;
    function resolveParentheses(expression) {
        console.log('resolveParentheses');
        console.log(expression);
        var newExpression;
        var parenthesisFound = false;
        newExpression = expression.replace(matchDeepestParentheses, function (match, innerExpression) {
            console.log('p-match found! ' + innerExpression);
            parenthesisFound = true;
            // Resolve multiplication and division first, then addition and subtraction
            return resolveAdditionSubtraction(resolveMultiplicationDivision(innerExpression));
        });
        if (parenthesisFound) {
            newExpression = resolveParentheses(newExpression);
        }
        return newExpression;
    }
    Calc.resolveParentheses = resolveParentheses;
    function resolveMultiplicationDivision(expression) {
        console.log('resolve multi div');
        console.log(expression);
        var newExpression;
        var multiplicationDivisionFound = false;
        newExpression = expression.replace(matchMultiplicationDivision, function (match, savedGroup, operation, operator) {
            console.log('m-match found! ' + operation);
            multiplicationDivisionFound = true;
            return savedGroup + (operator === '*' ? multiply(operation) : divide(operation));
        });
        if (multiplicationDivisionFound) {
            newExpression = resolveMultiplicationDivision(newExpression);
        }
        return newExpression;
    }
    Calc.resolveMultiplicationDivision = resolveMultiplicationDivision;
    function resolveAdditionSubtraction(expression) {
        console.log('resolve add sub');
        console.log(expression);
        var newExpression = cleanUpSuperfluousOperators(expression);
        var additionSubtractionFound = false;
        newExpression = newExpression.replace(matchAdditionSubtraction, function (operation, operator) {
            console.log('a-match found! ' + operation);
            console.log(operator);
            additionSubtractionFound = true;
            return operator === '+' ? add(operation) : subtract(operation);
        });
        if (additionSubtractionFound) {
            newExpression = resolveAdditionSubtraction(newExpression);
        }
        return newExpression;
    }
    Calc.resolveAdditionSubtraction = resolveAdditionSubtraction;
    /* Utility */
    // This function tests whether a result is valid or not by testing for the standard decimal format
    // Its criterias differ from float in the sense that the string has to be directly translatable to a number
    // For example, parseFloat('35+') would give '35', but would yield false with this function.
    function testForNumber(result) {
        return matchValidResult.test(result);
    }
    Calc.testForNumber = testForNumber;
    // This function replaces any amount of consecutive pluses (+) and minuses (-) by the appropriate operator
    // i.e. +-+-- would be replaced by a minus (-) because it has an impair number of minuses (-)
    function cleanUpSuperfluousOperators(expression) {
        var newExpression;
        newExpression = expression.replace(matchConsecutivePlusesMinuses, function (operators) {
            return (operators.match(/-/g) || []).length % 2 === 1 ? '-' : '+';
        });
        return newExpression;
    }
    Calc.cleanUpSuperfluousOperators = cleanUpSuperfluousOperators;
    /* Basic operations
     * Note: They will throw an error if the result is NaN */
    function add(operation) {
        console.log('add ' + operation);
        var terms = operation.split('+');
        var result = parseFloat(terms[0]);
        for (var _i = 0, _a = terms.slice(1); _i < _a.length; _i++) {
            var term = _a[_i];
            result = result + parseFloat(term);
        }
        if (isNaN(result)) {
            throw new Error("(add) invalid operation: '" + operation + "'");
        }
        else {
            return result.toString();
        }
    }
    Calc.add = add;
    function subtract(operation) {
        console.log('sub ' + operation);
        var terms = operation.split('-');
        var result = parseFloat(terms[0]);
        for (var _i = 0, _a = terms.slice(1); _i < _a.length; _i++) {
            var term = _a[_i];
            result = result - parseFloat(term);
        }
        if (isNaN(result)) {
            throw new Error("(subtract) invalid operation: '" + operation + "'");
        }
        else {
            return result.toString();
        }
    }
    Calc.subtract = subtract;
    function multiply(operation) {
        console.log('mul ' + operation);
        var terms = operation.split('*');
        var result = parseFloat(terms[0]);
        for (var _i = 0, _a = terms.slice(1); _i < _a.length; _i++) {
            var term = _a[_i];
            console.log(term);
            result = result * parseFloat(term);
        }
        if (isNaN(result)) {
            throw new Error("(multiply) invalid operation: '" + operation + "'");
        }
        else {
            return result.toString();
        }
    }
    Calc.multiply = multiply;
    function divide(operation) {
        console.log('div ' + operation);
        var terms = operation.split('/');
        var result = parseFloat(terms[0]);
        for (var _i = 0, _a = terms.slice(1); _i < _a.length; _i++) {
            var term = _a[_i];
            result = result / parseFloat(term);
        }
        if (isNaN(result)) {
            throw new Error("(divide) invalid operation: '" + operation + "'");
        }
        else {
            return result.toString();
        }
    }
    Calc.divide = divide;
})(Calc || (Calc = {}));
