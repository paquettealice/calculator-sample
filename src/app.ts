/**
 * Created by Alice Paquette on 12/27/2017
 */

/** Variables **/
namespace calcApp {
  // For hotkeys
  export const allowedKeys = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    '(', ')', '+', '-', '*', '/', 'Backspace', 'Delete'
  ];
  // Elements
  export const keypadButtons = document.querySelectorAll('button.kpad-btn');
  export const resultDiv = document.getElementById('result');
  export const expressionDiv = document.getElementById('expression');
  // A tiny version of a redux store
  export const store = {
    expression: {
      dispatch: (action: string, payload?: string) => {
        const oldState = this.expressionDiv.textContent;
        let newState = oldState;

        switch (action) {
          case 'write':
            newState = oldState + payload;
            break;
          case 'delete':
            newState = this.expressionDiv.textContent.slice(0, -1);
            break;
          case 'clear':
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
}

/** MAIN ------------------------- **/
document.addEventListener('keydown', (e: KeyboardEvent) => {
  // if (calcApp.allowedKeys.includes(e.key)) {
    // calcApp.store.expression.dispatch('write', e.key);
    // console.log('allowed! ' + e.key);
  // }
  console.log(e);
});

calcApp.expressionDiv.addEventListener('change', expressionChanged);

for (let button of calcApp.keypadButtons) {
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
  // Everything else is written into the expression
  else {
    calcApp.store.expression.dispatch('write', e.target.value);
  }
}

function expressionChanged(e: CustomEvent) {
  console.log('expression changed!');
  let result = Calc.resolveExpression(e.detail);
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
namespace Calc {
  // Matches any parentheses that themselves contain no parentheses
  const matchDeepestParentheses = /\(([^()]+)\)/g;
  // Matches a binary multiplication or division operation (e.g. x*y)
  const matchMultiplicationDivision = /(^|[-+*/])(-?[\d.]+([*/])-?[.\d]+)/g;
  // Matches a binary addition or subtraction operation (e.g. x+y)
  const matchAdditionSubtraction = /(?:^-)?[\d.]+([-+])-?[.\d]+/g;
  // Matches consecutive pluses (+) and/or minuses (-)
  const matchConsecutivePlusesMinuses = /[-+]{2,}/g;
  // Matches a valid result (a resolved expression)
  const matchValidResult = /^-?\d+[.]?\d+$/;

  /* Resolvers
   * These recursive functions match operations and resolve them until there's nothing left. The result bubbles up to a
   * higher level (parenthesis > multiplication/division > addition/subtraction) until the entire expression has been
   * flattened and resolved.
   * Note: Separating multiplication and division is not necessary because regex matches from left to right by default.
   */
  export function resolveExpression(expression: string): string {
    console.log(expression);
    let flattenedExpression = resolveParentheses(expression);
    console.log(flattenedExpression);
    return resolveAdditionSubtraction(resolveMultiplicationDivision(flattenedExpression));
  }

  export function resolveParentheses(expression: string): string {
    console.log('resolveParentheses');
    console.log(expression);
    let newExpression;
    let parenthesisFound = false;

    newExpression = expression.replace(matchDeepestParentheses, (match, innerExpression) => {
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

  export function resolveMultiplicationDivision(expression: string): string {
    console.log('resolve multi div');
    console.log(expression);
    let newExpression;
    let multiplicationDivisionFound = false;

    newExpression = expression.replace(matchMultiplicationDivision, (match, savedGroup, operation, operator) => {
      console.log('m-match found! ' + operation);
      multiplicationDivisionFound = true;

      return savedGroup + (operator === '*' ? multiply(operation) : divide(operation));
    });

    if (multiplicationDivisionFound) {
      newExpression = resolveMultiplicationDivision(newExpression);
    }
    return newExpression;
  }

  export function resolveAdditionSubtraction(expression: string): string {
    console.log('resolve add sub');
    console.log(expression);
    let newExpression = cleanUpSuperfluousOperators(expression);
    let additionSubtractionFound = false;

    newExpression = newExpression.replace(matchAdditionSubtraction, (operation, operator) => {
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


  /* Utility */
  // This function tests whether a result is valid or not by testing for the standard decimal format
  // Its criterias differ from float in the sense that the string has to be directly translatable to a number
  // For example, parseFloat('35+') would give '35', but would yield false with this function.
  export function testForNumber(result: string): boolean {
    return matchValidResult.test(result);
  }
  // This function replaces any amount of consecutive pluses (+) and minuses (-) by the appropriate operator
  // i.e. +-+-- would be replaced by a minus (-) because it has an impair number of minuses (-)
  export function cleanUpSuperfluousOperators(expression: string): string {
    let newExpression;
    newExpression = expression.replace(matchConsecutivePlusesMinuses, (operators) => {
      return (operators.match(/-/g) || []).length%2 === 1 ? '-' : '+';
    });
    return newExpression;
  }


  /* Basic operations
   * Note: They will throw an error if the result is NaN */
  export function add(operation: string): string {
    console.log('add ' + operation);
    const terms = operation.split('+');
    let result = parseFloat(terms[0]);

    for (let term of terms.slice(1)) {
      result = result+parseFloat(term);
    }

    if (isNaN(result)) { throw new Error(`(add) invalid operation: '${operation}'`) }
    else { return result.toString() }
  }

  export function subtract(operation: string): string {
    console.log('sub ' + operation);
    const terms = operation.split('-');
    let result = parseFloat(terms[0]);

    for (let term of terms.slice(1)) {
      result = result-parseFloat(term);
    }

    if (isNaN(result)) { throw new Error(`(subtract) invalid operation: '${operation}'`) }
    else { return result.toString() }
  }

  export function multiply(operation: string): string {
    console.log('mul ' + operation);
    const terms = operation.split('*');
    let result = parseFloat(terms[0]);

    for (let term of terms.slice(1)) {
      console.log(term);
      result = result*parseFloat(term);
    }

    if (isNaN(result)) { throw new Error(`(multiply) invalid operation: '${operation}'`) }
    else { return result.toString() }
  }

  export function divide(operation: string): string {
    console.log('div ' + operation);
    const terms = operation.split('/');
    let result = parseFloat(terms[0]);

    for (let term of terms.slice(1)) {
      result = result/parseFloat(term);
    }

    if (isNaN(result)) { throw new Error(`(divide) invalid operation: '${operation}'`) }
    else { return result.toString() }
  }

}
