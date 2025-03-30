// js/mathEngine.js

/**
 * Evaluates a math expression and returns the result.
 * Uses math.js for evaluation.
 * @param {string} expression - The math expression to evaluate.
 * @returns {*} - The result of the evaluation, or an empty string if the input is empty.
 */
function evaluateExpression(expression) {
    // Return empty string if input is empty
    if (expression.trim() === '') {
      return '';
    }
    try {
      return math.evaluate(expression);
    } catch (error) {
      console.error('Error evaluating expression:', error);
      throw new Error('Invalid expression');
    }
}
  
window.evaluateExpression = evaluateExpression;
