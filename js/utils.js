// js/utils.js

/**
 * Formats a result for display.
 */
function formatResult(result) {
    return `Result: ${result}`;
}
  
/**
 * Formats a history entry.
 * @param {string} expression - The evaluated expression.
 * @param {*} result - The result.
 * @returns {string} - A formatted history string.
 */
function formatHistoryEntry(expression, result) {
    return `${expression} = ${result}`;
}
  
/**
 * Returns a step-by-step explanation for a given expression.
 * This function uses math.js's parser to generate a sequence of computation steps.
 * @param {string} expression - The math expression.
 * @returns {string} - The step-by-step explanation.
 */
function getStepByStepExplanation(expression) {
    try {
      // Parse the expression into an expression tree
      const node = math.parse(expression);
      const steps = [];
      // Recursively evaluate the node to generate steps.
      const finalResult = evaluateNode(node, steps);
      steps.push(`Final result: ${finalResult}`);
      return steps.join('\n');
    } catch (error) {
      return 'Unable to provide step-by-step explanation.';
    }
}
  
/**
 * Recursively evaluates a math.js node and records each computation step.
 * @param {Object} node - A math.js expression tree node.
 * @param {string[]} steps - An array of step strings.
 * @returns {*} - The computed value of the node.
 */
function evaluateNode(node, steps) {
    // For a ConstantNode, return its value and show the constant.
    if (node.type === 'ConstantNode') {
      const val = node.value;
      steps.push(`Constant: ${node.toString()} = ${val}`);
      return val;
    }
    // For a SymbolNode, return its name (useful for constants like pi or e)
    else if (node.type === 'SymbolNode') {
      const name = node.name;
      steps.push(`Symbol: ${name}`);
      return name;
    }
    // For a ParenthesisNode, evaluate its content.
    else if (node.type === 'ParenthesisNode') {
      steps.push(`Evaluating parenthesis: (${node.content.toString()})`);
      return evaluateNode(node.content, steps);
    }
    // For an OperatorNode, handle unary and binary operators.
    else if (node.type === 'OperatorNode') {
      // Unary operator (e.g., -3)
      if (node.args.length === 1) {
        const argVal = evaluateNode(node.args[0], steps);
        const exprStr = `${node.op}${node.args[0].toString()}`;
        const result = math.evaluate(exprStr);
        steps.push(`Evaluating: ${exprStr} = ${result}`);
        return result;
      }
      // Binary operator (e.g., 2 + 3)
      else if (node.args.length === 2) {
        const leftVal = evaluateNode(node.args[0], steps);
        const rightVal = evaluateNode(node.args[1], steps);
        const exprStr = `${node.args[0].toString()} ${node.op} ${node.args[1].toString()}`;
        const result = math.evaluate(exprStr);
        steps.push(`Evaluating: ${exprStr} = ${result}`);
        return result;
      }
    }
    // For a FunctionNode (e.g., sin(x))
    else if (node.type === 'FunctionNode') {
      // Evaluate each argument and collect their string representations.
      const argValues = node.args.map(arg => evaluateNode(arg, steps));
      const argStrs = node.args.map(arg => arg.toString());
      const exprStr = `${node.name}(${argStrs.join(', ')})`;
      let result;
      try {
        // Try calling the function from math.js
        result = math[node.name](...argValues);
      } catch (e) {
        // Fallback: evaluate using a string expression
        result = math.evaluate(`${node.name}(${argValues.join(',')})`);
      }
      steps.push(`Evaluating: ${exprStr} = ${result}`);
      return result;
    }
    // If node type isn't explicitly handled, return its string representation.
    steps.push(`Unhandled node: ${node.toString()}`);
    return node.toString();
}
  
/**
 * Returns a placeholder Laplace transform for the given expression.
 */
function laplaceTransform(expression) {
    // Placeholder: simply return "L{expression}"
    return `L{${expression}}`;
}
  
/**
 * Returns a placeholder inverse Laplace transform.
 */
function inverseLaplaceTransform(expression) {
    return `L⁻¹{${expression}}`;
}
  
/**
 * Solves a first order ODE y' = f(x,y) using Euler's method.
 * Expects:
 *  - eqn: a string representing f(x,y), e.g., "x + y"
 *  - x0, y0: initial condition (numbers)
 *  - h: step size
 *  - n: number of steps
 * Returns an array of {x, y} objects.
 */
function solveODE(eqn, x0, y0, h, n) {
    const solution = [];
    let x = x0;
    let y = y0;
    solution.push({ x, y });
    for (let i = 0; i < n; i++) {
      const scope = { x, y };
      const f = math.evaluate(eqn, scope);
      y = y + h * f;
      x = x + h;
      solution.push({ x, y });
    }
    return solution;
}
  
/**
 * Calculates the Wronskian of two functions f(x) and g(x).
 * Expects f and g as strings. Uses math.derivative for derivatives.
 */
function calculateWronskian(fStr, gStr, xVal) {
    const fVal = math.evaluate(fStr, { x: xVal });
    const gVal = math.evaluate(gStr, { x: xVal });
    const fPrime = math.derivative(fStr, 'x').toString();
    const gPrime = math.derivative(gStr, 'x').toString();
    const fPrimeVal = math.evaluate(fPrime, { x: xVal });
    const gPrimeVal = math.evaluate(gPrime, { x: xVal });
    return fVal * gPrimeVal - gVal * fPrimeVal;
}
  
// Expose new functions
window.formatResult = formatResult;
window.formatHistoryEntry = formatHistoryEntry;
window.getStepByStepExplanation = getStepByStepExplanation;
window.laplaceTransform = laplaceTransform;
window.inverseLaplaceTransform = inverseLaplaceTransform;
window.solveODE = solveODE;
window.calculateWronskian = calculateWronskian;
