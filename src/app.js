/**
 * Created by Alice Paquette on 12/27/2017
 */
'use strict';
(function () {
    /*** Variables ***/
    /* -- Modules ----------- */
    var Calc = CalculationsModule;
    var KC = KeyCombinationsModule;
    /* -- Keyboard Shortcuts and Keypad Functionality -------------
     * Shortcuts work by listening to the keydown event, converting it into a key combination, and binding that to
     * a value (via 'keyBindings'); that value is then associated to a button (via keypadButtons),
     * which is then clicked programmatically. Finally, the value of the clicked button is evaluated and either
     * executed as a function or written to the expression as a character. */
    /* Hash table for key combinations and keypad button values ( keyCombination: keypadButtonValue ) */
    var keyBindings = {
        '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
        '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
        '.': '.', '(': '(', ')': ')', '+': '+', '-': '-',
        '*': '*', '/': '/', 'Delete': 'delete', 'Backspace': 'delete',
        'Control+Delete': 'allclear', 'Control+Backspace': 'allclear', 'Enter': 'wrap'
    };
    /* Hash table for keypad button values and keypad buttons ( keypadButtonValue: keypadButton ) */
    var keypadButtons = {};
    document.querySelectorAll('button.kpad-btn').forEach(function (button) {
        keypadButtons[button.value] = button;
    });
    /* Calculator display functionality ------------ */
    var resultDiv = document.getElementById('result');
    var expressionDiv = document.getElementById('expression');
    var composing = false; // True if there was a user input in the last second
    var timeoutId; // The ID of the current Window.timeout used to determine if the user is composing
    /* -- A tiny version of a redux store ------------ */
    var store = {
        expression: {
            dispatch: function (action, payload) {
                var oldState = expressionDiv.textContent || '';
                var newState = oldState;
                switch (action) {
                    case 'write':
                        newState = oldState + payload;
                        break;
                    case 'delete':
                        newState = oldState.slice(0, -1);
                        break;
                    case 'wrap':
                        if (oldState !== '') {
                            newState = "(" + oldState + ")";
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
            dispatch: function (action, payload) {
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
        var result;
        var resultIsValid = true;
        if (e.detail !== '') {
            try {
                result = Calc.resolveExpression(e.detail);
                resultIsValid = Calc.isDecimalFormat(result);
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
            // resultDiv.classList.remove('invalid');
        }
        else {
            /* If the result is invalid, we want to wait a second before updating the display. Because of this, the 'invalid'
             * class is added in the callback to startOrResetComposingTimer. */
            startOrResetComposingTimer(function () {
                // store.result.dispatch('update', 'NaN');
                expressionDiv.classList.add('invalid');
                // resultDiv.classList.add('invalid');
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
    function animateElement(el, timeout) {
        if (timeout === void 0) { timeout = 200; }
        el.classList.add('animate');
        window.setTimeout(function () {
            el.classList.remove('animate');
        }, timeout);
    }
    /* Starts the timer if it's not running, resets it if it is, and calls 'callback' when/if the timer ends. */
    function startOrResetComposingTimer(callback) {
        clearTimeout(timeoutId);
        composing = true;
        timeoutId = window.setTimeout(function () {
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
    Object.keys(keypadButtons).forEach(function (k) {
        keypadButtons[k].addEventListener('click', keypadButtonClicked);
    });
    /* Keydown */
    document.addEventListener('keydown', function (e) {
        var keybindFunction = keyBindings[KC.convertToKeyCombination(e)];
        if (keybindFunction) {
            keypadButtons[keybindFunction].click();
        }
    });
    /*** ------------------------------- ***/
})();
