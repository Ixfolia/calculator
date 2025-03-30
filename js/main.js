// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.buttons button');
  const angleRadios = document.querySelectorAll('input[name="angle"]');
  const historyList = document.getElementById('historyList');
  const stepsText = document.getElementById('stepsText');
  const memoryDisplay = document.getElementById('memoryDisplay');

  let memory = 0;

  // Angle mode toggle
  angleRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      math.config({ angles: radio.value === 'deg' ? 'deg' : 'rad' });
    });
  });
  math.config({ angles: 'rad' }); // default

  // Memory buttons
  document.getElementById('mc').addEventListener('click', () => {
    memory = 0;
    updateMemoryDisplay();
  });
  document.getElementById('mr').addEventListener('click', () => {
    display.value += memory;
  });
  document.getElementById('mPlus').addEventListener('click', () => {
    try {
      let result = evaluateExpression(display.value);
      memory += result;
      updateMemoryDisplay();
    } catch (error) {
      display.value = 'Error';
    }
  });
  document.getElementById('mMinus').addEventListener('click', () => {
    try {
      let result = evaluateExpression(display.value);
      memory -= result;
      updateMemoryDisplay();
    } catch (error) {
      display.value = 'Error';
    }
  });
  function updateMemoryDisplay() {
    memoryDisplay.textContent = `Memory: ${memory}`;
  }

  // Control buttons: clear and backspace
  document.getElementById('clear').addEventListener('click', () => {
    display.value = '';
  });
  document.getElementById('backspace').addEventListener('click', () => {
    display.value = display.value.slice(0, -1);
  });

  // Derivative button handler
  document.getElementById('derivative').addEventListener('click', () => {
    try {
      const expr = display.value;
      const deriv = math.derivative(expr, 'x').toString();
      display.value = deriv;
      const entry = `d/dx(${expr}) = ${deriv}`;
      addHistoryEntry(entry);
      stepsText.textContent = `Computed derivative: ${deriv}`;
    } catch (error) {
      display.value = 'Error: ' + error.message;
    }
  });

  // Handle basic calculator button clicks (ignore control buttons)
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const btnId = button.id;
      if (btnId === 'clear' || btnId === 'backspace' || btnId === 'equals' || btnId === 'derivative') {
        return;
      }
      const value = button.getAttribute('data-value');
      if (value !== null) {
        display.value += value;
      }
    });
  });

  // Equals button handler
  document.getElementById('equals').addEventListener('click', () => {
    try {
      const expr = display.value;
      const result = evaluateExpression(expr);
      display.value = result;
      const entry = formatHistoryEntry(expr, result);
      addHistoryEntry(entry);
      stepsText.textContent = getStepByStepExplanation(expr);
    } catch (error) {
      display.value = 'Error: ' + error.message;
    }
  });

  // Differential Equations Tools
  // Laplace Transform
  document.getElementById('laplace').addEventListener('click', () => {
    const expr = display.value;
    try {
      const laplaceResult = laplaceTransform(expr);
      display.value = laplaceResult;
      addHistoryEntry(`Laplace{${expr}} = ${laplaceResult}`);
      stepsText.textContent = `Computed Laplace transform: ${laplaceResult}`;
    } catch (error) {
      display.value = 'Error: ' + error.message;
    }
  });
  // Inverse Laplace Transform
  document.getElementById('invlaplace').addEventListener('click', () => {
    const expr = display.value;
    try {
      const invLaplaceResult = inverseLaplaceTransform(expr);
      display.value = invLaplaceResult;
      addHistoryEntry(`L⁻¹{${expr}} = ${invLaplaceResult}`);
      stepsText.textContent = `Computed inverse Laplace transform: ${invLaplaceResult}`;
    } catch (error) {
      display.value = 'Error: ' + error.message;
    }
  });
  // Solve ODE using Euler's Method
  document.getElementById('solveODE').addEventListener('click', () => {
    const eqn = display.value; // expects an expression for f(x,y)
    const x0 = parseFloat(prompt("Enter initial x value:", "0"));
    const y0 = parseFloat(prompt("Enter initial y value:", "1"));
    const h = parseFloat(prompt("Enter step size:", "0.1"));
    const n = parseInt(prompt("Enter number of steps:", "10"), 10);
    try {
      const sol = solveODE(eqn, x0, y0, h, n);
      let solStr = sol.map(point => `x=${point.x.toFixed(2)}, y=${point.y.toFixed(2)}`).join(" | ");
      display.value = solStr;
      addHistoryEntry(`ODE: y'=${eqn}, y(${x0})=${y0} => ${solStr}`);
      stepsText.textContent = `Solved ODE using Euler's method:\n${solStr}`;
    } catch (error) {
      display.value = 'Error: ' + error.message;
    }
  });
  // Wronskian Calculator
  document.getElementById('wronskian').addEventListener('click', () => {
    const fStr = prompt("Enter first function f(x):", "x^2");
    const gStr = prompt("Enter second function g(x):", "2*x");
    const xVal = parseFloat(prompt("Enter the value of x:", "1"));
    try {
      const wronskianValue = calculateWronskian(fStr, gStr, xVal);
      display.value = wronskianValue;
      addHistoryEntry(`Wronskian at x=${xVal} for [${fStr}], [${gStr}] = ${wronskianValue}`);
      stepsText.textContent = `Computed Wronskian: ${wronskianValue}`;
    } catch (error) {
      display.value = 'Error: ' + error.message;
    }
  });

  // Keyboard support: only allow single-letter inputs.
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    // Only allow single characters that are letters (a-z or A-Z)
    if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
      e.preventDefault(); // prevent default insertion
      display.value += key;
    } else if (key === 'Enter') {
      e.preventDefault();
      document.getElementById('equals').click();
    } else if (key === 'Backspace') {
      e.preventDefault();
      display.value = display.value.slice(0, -1);
    } else if (key === 'Escape') {
      e.preventDefault();
      display.value = '';
    }
  });

  // Add an entry to the history panel
  function addHistoryEntry(entry) {
    const li = document.createElement('li');
    li.textContent = entry;
    historyList.prepend(li);
  }
});
