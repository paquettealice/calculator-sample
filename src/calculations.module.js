/**
 * @author Created by Alice Paquette on 12/30/2017
 * @fileOverview This module can be used to parse and calculate basic mathematical expressions.
 * The expressions are restricted to the following: parentheses '()', multiplication '*', division '/',
 * addition '+', subtraction '-'.
 */
'use strict';
var CalculationsModule;
(function (CalculationsModule) {
    /* Matches the content of any parentheses that contain no parentheses */
    var matchDeepestParentheses = /\(([^()]+)\)/g;
    /* Matches the leftmost binary multiplication or division */
    var matchMultiplicationDivision = /(^|[-+*/])(-?[\d.]+([*/])-?[.\d]+)/;
    /* Matches the leftmost binary addition or subtraction operation (e.g. x+y) */
    var matchAdditionSubtraction = /(?:^-|^\+)?[\d.]+([-+])-?[.\d]+/g;
    /* Matches consecutive pluses (+) and/or minuses (-) */
    var matchConsecutivePlusesMinuses = /[-+]{2,}/g;
    /* Matches the relatively common 'parenthesis multiplication' (e.g. 3(1+1) == 3*(1+1) or (-2)(-5) == -2*-5) */
    var matchParenthesisMultiplications = /([\d)])\(/g;
    /* Matches a valid result (a resolved expression) */
    var matchValidResult = /^-?\d+(.\d+)?$/;
    /* Resolvers -------------
     * These functions take basic mathematical expressions and resolve them by following the order of operations.
     * Valid operations: parentheses '()', multiplication '*', division '/', addition '+', and subtraction '-'.
     */
    /**
     * Receives and prepares the expression for parsing, then sends it down the pipe of resolvers. The resulting
     * flattened and partially resolved expression is then resolved one last time before being returned.
     *
     * @param {string} expression - The mathematical expression to resolve.
     * @returns {string} - The resolved mathematical expression.
     */
    function resolveExpression(expression) {
        var flattenedExpression = resolveParentheses(convertParenthesisMultiplications(expression));
        return resolveAdditionSubtraction(resolveMultiplicationDivision(flattenedExpression));
    }
    CalculationsModule.resolveExpression = resolveExpression;
    /**
     * 1. Parentheses
     * Flattens the expression by resolving every parentheses contained within, starting with the deepest parentheses and
     * working up from there. Naked operations (not inside a parenthesis) remain untouched.
     * This function calls itself until no parentheses are left.
     * Example:  '2+((2+5)*3)' -> '2+(7*3)' -> '2+21' -> return '2+21'
     *
     * @param {string} expression - The mathematical expression to flatten.
     * @returns {string} - The flattened mathematical expression.
     */
    function resolveParentheses(expression) {
        var newExpression;
        var parenthesisFound = false;
        newExpression = expression.replace(matchDeepestParentheses, function (match, innerExpression) {
            parenthesisFound = true;
            /* Resolve multiplication and division first, then addition and subtraction */
            return resolveAdditionSubtraction(resolveMultiplicationDivision(innerExpression));
        });
        /* Call this function again if necessary */
        if (parenthesisFound) {
            newExpression = resolveParentheses(newExpression);
        }
        return newExpression;
    }
    CalculationsModule.resolveParentheses = resolveParentheses;
    /**
     * 2. Multiplication and Division
     * Resolves the leftmost binary multiplication or division. This function calls itself until no valid operation
     * is left.
     * Example: '6/2*3/2' -> '3*3/2' -> '9/2' -> '4.5'
     *
     * @param {string} expression - The mathematical expression to resolve.
     * @returns {string} - The resolved mathematical expression.
     */
    function resolveMultiplicationDivision(expression) {
        var newExpression;
        var multiplicationDivisionFound = false;
        newExpression = expression.replace(matchMultiplicationDivision, function (match, savedGroup, operation, operator) {
            multiplicationDivisionFound = true;
            return savedGroup + (operator === '*' ? multiply(operation) : divide(operation));
        });
        /* Call this function again if necessary */
        if (multiplicationDivisionFound) {
            newExpression = resolveMultiplicationDivision(newExpression);
        }
        return newExpression;
    }
    CalculationsModule.resolveMultiplicationDivision = resolveMultiplicationDivision;
    /**
     * 3. Addition and Subtraction
     * Resolves the leftmost binary addition or subtraction. This function calls itself until no valid operation
     * remains.
     * Example: '-5-3+2-4' -> '-8+2-4' -> '-6-4' -> '-10'
     *
     * @param {string} expression - The mathematical expression to resolve.
     * @returns {string} - The resolved mathematical expression.
     */
    function resolveAdditionSubtraction(expression) {
        var newExpression = cleanupExtraOperators(expression);
        var additionSubtractionFound = false;
        newExpression = newExpression.replace(matchAdditionSubtraction, function (operation, operator) {
            additionSubtractionFound = true;
            return operator === '+' ? add(operation) : subtract(operation);
        });
        /* Call this function again if necessary */
        if (additionSubtractionFound) {
            newExpression = resolveAdditionSubtraction(newExpression);
        }
        return newExpression;
    }
    CalculationsModule.resolveAdditionSubtraction = resolveAdditionSubtraction;
    /* Utility --------------- */
    /**
     * Tests whether the provided string matches the F8.2 numeric format, '[-]123.456'. Its criteria are less forgiving
     * than parseFloat, as superfluous operators and omitted zeros will lead to a failed test.
     * Valid strings: '35', '-35', '0.35', '-0.35', '0', '-0'
     * Invalid strings: '--35', '35+', '+35', '35.', '.35'
     * @see http://www.gnu.org/software/pspp/manual/html_node/Basic-Numeric-Formats.html
     *
     * @param {string} str - The string to test.
     * @returns {boolean} - True if the string matches the F8.2 numeric format, '[-]123.456'.
     */
    function isDecimalFormat(str) {
        return matchValidResult.test(str);
    }
    CalculationsModule.isDecimalFormat = isDecimalFormat;
    /**
     * Replaces two or more consecutive Plus '+' and Minus '-' signs by the appropriate operator based on the number of
     * Minus (-) signs, trims leading Plus '+' signs if necessary, then returns the resulting string.
     * Example: '--5+-+6--2' -> '+5-6+2' -> '5-6+2'
     *
     * @param {string} expression - The string to clean up.
     * @returns {string} - The cleaned up string.
     */
    function cleanupExtraOperators(expression) {
        var newExpression;
        newExpression = expression.replace(matchConsecutivePlusesMinuses, function (operators) {
            return (operators.match(/-/g) || []).length % 2 === 1 ? '-' : '+';
        });
        /* Trim leading Plus '+' sign if necessary */
        return newExpression[0] === '+' ? newExpression.slice(1) : newExpression;
    }
    CalculationsModule.cleanupExtraOperators = cleanupExtraOperators;
    /**
     * Replaces all instances of the relatively common 'implicit parenthesis multiplication' with an 'explicit'
     * Multiplication '*' sign then returns the resulting string.
     * Example: '-5(3+3)(-2)' -> '-5*(3+3)*(-2)'
     *
     * @param {string} expression - The string that will
     * @returns {string}
     */
    function convertParenthesisMultiplications(expression) {
        return expression.replace(matchParenthesisMultiplications, function (match, leftTerm) {
            return leftTerm + "*(";
        });
    }
    CalculationsModule.convertParenthesisMultiplications = convertParenthesisMultiplications;
    /* Basic Math Operations -------------- */
    /**
     * Parses the provided operation for Additions '+', resolves it, then returns the result as a string.
     * The provided string needs to be in the correct format, i.e. 'x+y+z...', or an exception will be thrown.
     * Example: '5+3+2' -> '10'
     *
     * @param {string} operation - The operation to resolve.
     * @returns {string} - The result of the operation.
     * @throws An Error with the provided invalid string if the operation's result is NaN.
     */
    function add(operation) {
        var terms = operation.split('+');
        var result = parseFloat(terms[0]);
        for (var _i = 0, _a = terms.slice(1); _i < _a.length; _i++) {
            var term = _a[_i];
            result = result + parseFloat(term);
        }
        if (isNaN(result)) {
            throw new Error("(add) Invalid operation: '" + operation + "'");
        }
        else {
            return result.toString();
        }
    }
    CalculationsModule.add = add;
    /**
     * Parses the provided operation for Subtraction(s) '-', resolves it, then returns the result as a string.
     * The provided string needs to be in the correct format, i.e. 'x-y-z...', or an exception will be thrown.
     * Example: '-5-3-2' -> '-10'
     *
     * @param {string} operation - The operation to resolve.
     * @returns {string} - The result of the operation.
     * @throws An Error with the provided invalid string if the operation's result is NaN.
     */
    function subtract(operation) {
        /* For subtraction, we need to add a '0' at the beginning if the first term is negative to
         * make sure the split and subsequent parseFloat do not result in NaN.
         * Without the '0': '-5-3' --split--> ['', '5', '3'] --parseFloat--> NaN-5-3 = NaN
         * With the '0': '0-5-3' --split--> ['0', '5', '3'] --parseFloat--> 0-5-3 = -8  */
        var terms = (operation[0] === '-' ? "0" + operation : operation).split('-');
        var result = parseFloat(terms[0]);
        for (var _i = 0, _a = terms.slice(1); _i < _a.length; _i++) {
            var term = _a[_i];
            result = result - parseFloat(term);
        }
        if (isNaN(result))
            throw new Error("(subtract) Invalid operation: '" + operation + "'");
        else
            return result.toString();
    }
    CalculationsModule.subtract = subtract;
    /**
     * Parses the provided operation for Multiplication(s) '-', resolves it, then returns the result as a string.
     * The provided string needs to be in the correct format, i.e. 'x*y*z...', or an exception will be thrown.
     * Example: '5*3*2' -> '30'
     *
     * @param {string} operation - The operation to resolve.
     * @returns {string} - The result of the operation.
     * @throws An Error with the provided invalid string if the operation's result is NaN.
     */
    function multiply(operation) {
        var terms = operation.split('*');
        var result = parseFloat(terms[0]);
        for (var _i = 0, _a = terms.slice(1); _i < _a.length; _i++) {
            var term = _a[_i];
            result = result * parseFloat(term);
        }
        if (isNaN(result))
            throw new Error("(multiply) Invalid operation: '" + operation + "'");
        else
            return result.toString();
    }
    CalculationsModule.multiply = multiply;
    /**
     * Parses the provided operation for Division(s) '-', resolves it, then returns the result as a string.
     * The provided string needs to be in the correct format, i.e. 'x/y/z...', or an exception will be thrown.
     * Example: '10/2/2' -> '2.5'
     *
     * @param {string} operation - The operation to resolve.
     * @returns {string} - The result of the operation.
     * @throws An Error with the provided invalid string if the operation's result is NaN.
     */
    function divide(operation) {
        var terms = operation.split('/');
        var result = parseFloat(terms[0]);
        for (var _i = 0, _a = terms.slice(1); _i < _a.length; _i++) {
            var term = _a[_i];
            result = result / parseFloat(term);
        }
        if (isNaN(result))
            throw new Error("(divide) Invalid operation: '" + operation + "'");
        else
            return result.toString();
    }
    CalculationsModule.divide = divide;
})(CalculationsModule || (CalculationsModule = {}));
