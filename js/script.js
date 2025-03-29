document.getElementById('solveBtn').addEventListener('click', () => {
    const inputField = document.getElementById('mathInput');
    const resultDiv = document.getElementById('result');
    const expression = inputField.value;
  
    try {
      // Evaluate the math expression using math.js
      const result = math.evaluate(expression);
      resultDiv.textContent = `Result: ${result}`;
    } catch (error) {
      resultDiv.textContent = 'Error: Invalid expression';
    }
  });
  