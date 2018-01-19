/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Alice Paquette on 12/27/2017
 */

Object.defineProperty(exports, "__esModule", { value: true });
/* -- Modules ----------- */
const calculations_module_1 = __webpack_require__(1);
const key_combinations_module_1 = __webpack_require__(2);
(() => {
    /*** Variables ***/
    /* -- Keyboard Shortcuts and Keypad Functionality -------------
     * Shortcuts work by listening to the keydown event, converting it into a key combination, and binding that to
     * a value (via 'keyBindings'); that value is then associated to a button (via keypadButtons),
     * which is then clicked programmatically. Finally, the value of the clicked button is evaluated and either
     * executed as a function or written to the expression as a character. */
    /* Hash table for key combinations and keypad button values ( keyCombination: keypadButtonValue ) */
    const keyBindings = {
        '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
        '.': '.', '(': '(', ')': ')', '+': '+', '-': '-', '*': '*', 'x': '*', 'X': '*', '/': '/',
        'Delete': 'delete', 'Backspace': 'delete', 'Control+Delete': 'allclear', 'Control+Backspace': 'allclear',
        'Enter': 'wrap'
    };
    /* Hash table for keypad button values and keypad buttons ( keypadButtonValue: keypadButton ) */
    const keypadButtons = {};
    document.querySelectorAll('button.kpad-btn').forEach(button => {
        keypadButtons[button.value] = button;
    });
    /* Calculator display functionality ------------ */
    const resultDiv = document.getElementById('result');
    const expressionDiv = document.getElementById('expression');
    let composing = false; // True if there was a user input in the last second
    let timeoutId; // The ID of the current Window.timeout used to determine if the user is composing
    /* -- A tiny version of a redux store ------------ */
    const store = {
        expression: {
            dispatch: (action, payload) => {
                const oldState = expressionDiv.textContent || '';
                let newState = oldState;
                switch (action) {
                    case 'write':
                        newState = oldState + payload;
                        break;
                    case 'delete':
                        newState = oldState.slice(0, -1);
                        break;
                    case 'wrap':
                        if (oldState !== '') {
                            newState = `(${oldState})`;
                        }
                        break;
                    case 'allclear':
                        newState = '';
                        break;
                }
                expressionDiv.textContent = newState;
                expressionDiv.dispatchEvent(new CustomEvent('change', { detail: newState }));
            }
        },
        result: {
            dispatch: (action, payload) => {
                switch (action) {
                    case 'update':
                        resultDiv.textContent = payload;
                        break;
                }
            }
        }
    };
    /*** Functions ***/
    /* -- Event Handlers --------- */
    /* Expression changes */
    function expressionChanged(e) {
        let result;
        let resultIsValid = true;
        if (e.detail !== '') {
            try {
                result = calculations_module_1.CalculationsModule.resolveExpression(e.detail);
                resultIsValid = calculations_module_1.CalculationsModule.isDecimalFormat(result);
            }
            catch (e) {
                resultIsValid = false;
            }
        }
        else
            result = '-';
        /* Update the result state or notify the user of an invalid expression */
        if (resultIsValid) {
            store.result.dispatch('update', result);
            /* If the result is valid, we want the display to show it immediately. Because of this, the 'invalid' class is
             * removed immediately instead of in the callback to startOrResetComposingTimer, as below. */
            startOrResetComposingTimer();
            animateElement(resultDiv, 100);
            expressionDiv.classList.remove('invalid');
        }
        else {
            /* If the result is invalid, we want to wait a second before updating the display. Because of this, the 'invalid'
             * class is added in the callback of startOrResetComposingTimer. */
            startOrResetComposingTimer(() => {
                expressionDiv.classList.add('invalid');
            });
        }
    }
    /* Keypad button clicks */
    function keypadButtonClicked(e) {
        animateElement(e.target, 100);
        /* Check if it's a function, execute it if so */
        if (e.target.classList.contains('kpad-fn')) {
            switch (e.target.value) {
                case 'delete':
                    store.expression.dispatch('delete');
                    break;
                case 'wrap':
                    store.expression.dispatch('wrap');
                    break;
                case 'allclear':
                    store.expression.dispatch('allclear');
                    break;
            }
        }
        else
            store.expression.dispatch('write', e.target.value);
    }
    /* -- Animation and styling ---------- **/
    /* Adds the class 'highlight' to a button for a user-defined amount of time (in ms) for the purposes of animation. */
    function animateElement(el, timeout = 200) {
        el.classList.add('animate');
        window.setTimeout(() => {
            el.classList.remove('animate');
        }, timeout);
    }
    /* Starts the timer if it's not running, resets it if it is, and calls 'callback' when/if the timer ends. */
    function startOrResetComposingTimer(callback) {
        clearTimeout(timeoutId);
        composing = true;
        timeoutId = window.setTimeout(() => {
            composing = false;
            if (callback)
                callback();
        }, 1000);
    }
    /*** MAIN ------------------------- ***/
    /* -- Add Listeners ---------- */
    /* Expression changes */
    expressionDiv.addEventListener('change', expressionChanged);
    /* Keypad button clicks */
    Object.keys(keypadButtons).forEach(k => {
        keypadButtons[k].addEventListener('click', keypadButtonClicked);
    });
    /* Keydown */
    document.addEventListener('keydown', (e) => {
        const keybindFunction = keyBindings[key_combinations_module_1.KeyCombinationsModule.convertToKeyCombination(e)];
        if (keybindFunction) {
            keypadButtons[keybindFunction].click();
            e.preventDefault(); /* Prevent browser keyboard shortcuts from conflicting with the app's */
        }
    });
    /* Check for OS and browser to fix scrollbar issues on Firefox Quantum on Windows */
    if (navigator.appVersion.indexOf("Win") != -1)
        document.getElementById('app-container').classList.add('windows');
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
        document.getElementById('app-container').classList.add('firefox');
    /*** ------------------------------- ***/
})();
//# sourceMappingURL=app.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @author Created by Alice Paquette on 12/30/2017
 * @fileOverview This module can be used to parse and calculate basic mathematical expressions.
 * The expressions are restricted to the following: parentheses '()', multiplication '*', division '/',
 * addition '+', subtraction '-'.
 */

Object.defineProperty(exports, "__esModule", { value: true });
var CalculationsModule;
(function (CalculationsModule) {
    /* Matches the content of any parentheses that contain no parentheses */
    const matchDeepestParentheses = /\(([^()]+)\)/g;
    /* Matches the leftmost binary multiplication or division */
    const matchMultiplicationDivision = /(^|[-+*/])(-?[\d.]+([*/])-?[.\d]+)/;
    /* Matches the leftmost binary addition or subtraction operation (e.g. x+y) */
    const matchAdditionSubtraction = /(?:^-|^\+)?[\d.]+([-+])-?[.\d]+/;
    /* Matches consecutive pluses (+) and/or minuses (-) */
    const matchConsecutivePlusesMinuses = /[-+]{2,}/g;
    /* Matches the relatively common 'parenthesis multiplication' (e.g. 3(1+1) == 3*(1+1) or (-2)(-5) == -2*-5) */
    const matchParenthesisMultiplications = /(?:([\d)])\(|\)([\d(]))/g;
    /* Matches a string in the numeric format F8.2 or Infinity */
    const matchDecimalFormat = /^(-?\d+(\.\d+)?|Infinity)$/;
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
        let flattenedExpression = resolveParentheses(expression);
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
        let newExpression = convertParenthesisMultiplications(expression);
        let parenthesisFound = false;
        newExpression = newExpression.replace(matchDeepestParentheses, (match, innerExpression) => {
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
        let newExpression;
        let multiplicationDivisionFound = false;
        newExpression = expression.replace(matchMultiplicationDivision, (match, savedGroup, operation, operator) => {
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
     * Note: This will resolve any addition or subtraction regardless of other operators (multiplication, division, or
     * otherwise) without following the order of operations.
     * Example: '-5-3+2-4' -> '-8+2-4' -> '-6-4' -> '-10'
     *
     * @param {string} expression - The mathematical expression to resolve.
     * @returns {string} - The resolved mathematical expression.
     */
    function resolveAdditionSubtraction(expression) {
        let newExpression = cleanupExtraOperators(expression);
        let additionSubtractionFound = false;
        newExpression = newExpression.replace(matchAdditionSubtraction, (operation, operator) => {
            additionSubtractionFound = true;
            return sum(operation);
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
     * Note: 'Infinity' will return true.
     * Valid strings: '35', '-35', '0.35', '-0.35', '0', '-0'
     * Invalid strings: '--35', '35+', '+35', '35.', '.35'
     * @see http://www.gnu.org/software/pspp/manual/html_node/Basic-Numeric-Formats.html
     *
     * @param {string} str - The string to test.
     * @returns {boolean} - True if the string matches the F8.2 numeric format, '[-]123.456'.
     */
    function isDecimalFormat(str) {
        return matchDecimalFormat.test(str);
    }
    CalculationsModule.isDecimalFormat = isDecimalFormat;
    /**
     * Tests whether the provided string matches the F8.2 numeric format, '[-]123.456', and if so, returns it as a float.
     * Its criteria are less forgiving than parseFloat, as superfluous operators and omitted zeros will lead to a
     * failed test.
     * Note: 'Infinity' will return Infinity.
     * Valid strings: '35', '-35', '0.35', '-0.35', '0', '-0'
     * Invalid strings: '--35', '35+', '+35', '35.', '.35'
     * @see http://www.gnu.org/software/pspp/manual/html_node/Basic-Numeric-Formats.html
     *
     * @param {string} str - The string to parse.
     * @returns {number} - A float if the string passes the test, NaN otherwise.
     */
    function parseDecimalFormat(str) {
        return isDecimalFormat(str) ? parseFloat(str) : NaN;
    }
    CalculationsModule.parseDecimalFormat = parseDecimalFormat;
    /**
     * Replaces two or more consecutive Plus '+' and Minus '-' signs by the appropriate operator based on the number of
     * Minus (-) signs, trims leading Plus '+' signs if necessary, then returns the resulting string.
     * Example: '--5+-+6--2' -> '+5-6+2' -> '5-6+2'
     *
     * @param {string} expression - The string to clean up.
     * @returns {string} - The cleaned up string.
     */
    function cleanupExtraOperators(expression) {
        let newExpression;
        newExpression = expression.replace(matchConsecutivePlusesMinuses, (operators) => {
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
     * @param {string} expression - The string to converted.
     * @returns {string} - The converted string.
     */
    function convertParenthesisMultiplications(expression) {
        return expression.replace(matchParenthesisMultiplications, (match, leftTerm, rightTerm) => {
            return leftTerm ? `${leftTerm}*(` : `)*${rightTerm}`;
        });
    }
    CalculationsModule.convertParenthesisMultiplications = convertParenthesisMultiplications;
    /**
     * Returns an error with a customized message for invalid operations.
     * @param {string} operation - The invalid operation.
     * @returns {Error} - The error.
     */
    function InvalidOperationError(operation) {
        return new Error(`Invalid Operation: '${operation}'`);
    }
    /* Basic Math Operations -------------- */
    /**
     * Parses an expression with Addition(s) and/or Subtraction(s) and returns the result as a string.
     * Unlike Multiplying and Dividing, Adding and Subtracting have been combined into this function.
     * This is done by replacing any Minus '-' by the equivalent '+-' and treating every operation like an Addition.
     * Example: '5+3-2' -> '5+3+-2' -> '6'
     *
     * @param {string} operation - The operation to resolve.
     * @returns {string} - The result of the operation.
     * @throws An Error with the provided invalid string if the operation's result is NaN.
     */
    function sum(operation) {
        const op = operation.replace(/-/g, '+-');
        /* We need to add a '0' at the beginning if the first character is an operator to
         * make sure the split and subsequent parseFloat do not result in NaN.
         * Without the '0': '-5-3' --split--> ['', '5', '3'] --parseDecimalFormat--> NaN-5-3 = NaN
         * With the '0': '0-5-3' --split--> ['0', '5', '3'] --parseDecimalFormat--> 0-5-3 = -8  */
        const terms = (/^\+/.test(op) ? `0${op}` : op).split('+');
        let result = parseDecimalFormat(terms[0]);
        for (let term of terms.slice(1)) {
            result = result + parseDecimalFormat(term);
        }
        if (isNaN(result))
            throw InvalidOperationError(operation);
        else {
            return result.toString();
        }
    }
    CalculationsModule.sum = sum;
    /**
     * Parses the provided operation for Multiplication(s) '*', resolves it, then returns the result as a string.
     * The provided string needs to be in the correct format, i.e. 'x*y*z...'.
     * Example: '5*3*2' -> '30'
     *
     * @param {string} operation - The operation to resolve.
     * @returns {string} - The result of the operation.
     * @throws An Error with the provided invalid string if the operation's result is NaN.
     */
    function multiply(operation) {
        if (operation.indexOf('*') === -1)
            throw InvalidOperationError(operation);
        const terms = operation.split('*');
        let result = parseDecimalFormat(terms[0]);
        for (let term of terms.slice(1)) {
            result = result * parseDecimalFormat(term);
        }
        if (isNaN(result))
            throw InvalidOperationError(operation);
        else
            return result.toString();
    }
    CalculationsModule.multiply = multiply;
    /**
     * Parses the provided operation for Division(s) '/', resolves it, then returns the result as a string.
     * The provided string needs to be in the correct format, i.e. 'x/y/z...', or an exception will be thrown.
     * Example: '10/2/2' -> '2.5'
     *
     * @param {string} operation - The operation to resolve.
     * @returns {string} - The result of the operation.
     * @throws An Error with the provided invalid string if the operation's result is NaN.
     */
    function divide(operation) {
        if (operation.indexOf('/') === -1)
            throw InvalidOperationError(operation);
        const terms = operation.split('/');
        let result = parseDecimalFormat(terms[0]);
        for (let term of terms.slice(1)) {
            result = result / parseDecimalFormat(term);
        }
        if (isNaN(result))
            throw InvalidOperationError(operation);
        else
            return result.toString();
    }
    CalculationsModule.divide = divide;
})(CalculationsModule = exports.CalculationsModule || (exports.CalculationsModule = {}));
//# sourceMappingURL=calculations.module.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @author Created by Alice Paquette on 12/31/2017
 * @fileOverview This module is used to track and exploit key combinations for use with keyboard shortcuts.
 */

Object.defineProperty(exports, "__esModule", { value: true });
var KeyCombinationsModule;
(function (KeyCombinationsModule) {
    /**
     * @constant
     * @type {string[]}
     * These are KeyboardEvent.keys (not KeyboardEvent.code) that A) are not modifiers, and B) do not output a character
     * when modified by Shift. This is relevant for localization and differing keyboard layouts. For example, if a
     * function depends on the user inputting '$', 'Shift + $' would make no sense as '$' might be produced through a
     * different key combination in a different keyboard layout or locale.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
     */
    const nonCharacterKeys = [
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Backspace', 'Delete',
        'Enter', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Space', 'CapsLock', 'Tab'
    ];
    /**
     * Converts a KeyboardEvent into a key combination string in the format 'Modifier+Key'.
     * Shift is filtered out for any shift-dependent character (e.g. symbols and capital letters).
     *
     * @param {KeyboardEvent} e - The event to convert.
     * @returns {string} - A string in the format 'Modifier+Key'.
     */
    function convertToKeyCombination(e) {
        let payload = '';
        let mods = listActiveModifiers(e);
        if (!isModifier(e)) {
            // Remove shift if the KeyboardEvent.key is shift dependent
            if (e.shiftKey && !nonCharacterKeys.includes(e.key)) {
                mods.splice(mods.indexOf('Shift'));
            }
            payload = `${mods.join('+')}${mods.length > 0 ? '+' : ''}${e.key}`;
        }
        return payload;
    }
    KeyCombinationsModule.convertToKeyCombination = convertToKeyCombination;
    /**
     * Returns all active modifiers for a KeyboardEvent as an array of strings. The strings correspond to each
     * modifier's KeyboardEvent.key attribute.
     *
     * @param {KeyboardEvent} e - The event to analyze.
     * @returns {string[]} - An array of active modifiers, e.g. ['Control', 'Shift']
     */
    function listActiveModifiers(e) {
        let payload = [];
        if (e.ctrlKey)
            payload.push('Control');
        if (e.shiftKey)
            payload.push('Shift');
        if (e.altKey)
            payload.push('Alt');
        if (e.metaKey)
            payload.push('Meta');
        return payload;
    }
    KeyCombinationsModule.listActiveModifiers = listActiveModifiers;
    /**
     * Checks whether the source of the provided KeyboardEvent is a modifier.
     *
     * @param {KeyboardEvent} e - The event to analyze.
     * @returns {boolean} - True if the source of the event is a modifier.
     */
    function isModifier(e) {
        return e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta';
    }
    KeyCombinationsModule.isModifier = isModifier;
})(KeyCombinationsModule = exports.KeyCombinationsModule || (exports.KeyCombinationsModule = {}));
//# sourceMappingURL=key-combinations.module.js.map

/***/ })
/******/ ]);