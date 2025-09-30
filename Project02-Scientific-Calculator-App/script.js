const display = document.getElementById("calc-display");
const clearBtn = document.getElementById("clear-btn");
const sciToggle = document.getElementById("sci-toggle");
const sciPanel = document.getElementById("sci-panel");
const backspaceBtn = document.getElementById("backspace-btn");
const equalsBtn = document.getElementById("equals-btn");
const historyEl = document.getElementById('history');

let currentInput = "";
let history = [];
let justEvaluated = false;

function updateDisplay() {
  display.value = currentInput;
  // AC ↔ C switch
  if (currentInput.length === 0) {
    clearBtn.textContent = "AC";
  } else {
    clearBtn.textContent = "C";
  }
}

// press a character (number, operator, or function text)
function press(value) {
  // if we just evaluated and user types a number, start fresh
  if (justEvaluated && /^[0-9.]$/.test(value)) {
    currentInput = "";
  }
  justEvaluated = false;
  currentInput += value;
  updateDisplay();
}

// calculate the expression
function calculate() {
  // Check if the expression ends with an operator (excluding % for percentage handling)
  const lastChar = currentInput.trim().slice(-1);
  const operators = ['+', '-', '*', '/'];
  if (operators.includes(lastChar)) {
    return; // Do nothing if the last character is an operator (other than %)
  }

  // Handle percentage calculation
  if (currentInput.includes('%')) {
    const parts = currentInput.split('%');
    const num1 = parseFloat(parts[0].trim());
    if (!isNaN(num1)) {
      if (parts.length === 1 || (parts.length === 2 && parts[1].trim() === '')) {
        // e.g., "9%" -> 9 * 0.01
        currentInput = String(num1 * 0.01);
      } else if (parts.length === 2) {
        // e.g., "9%2" -> (9 / 100) * 2
        const num2 = parseFloat(parts[1].trim());
        if (!isNaN(num2)) {
          currentInput = String((num1 / 100) * num2);
        } else {
          currentInput = "Error";
        }
      } else {
        currentInput = "Error";
      }
      addToHistory(currentInput, currentInput);
      updateDisplay();
      justEvaluated = true;
      setTimeout(() => {
        currentInput = "";
        updateDisplay();
      }, 500);
      return;
    } else {
      currentInput = "Error";
      updateDisplay();
      justEvaluated = true;
      setTimeout(() => {
        currentInput = "";
        updateDisplay();
      }, 500);
      return;
    }
  }

  try {
    // Build an expression for JS eval by replacing special tokens
    let expr = currentInput
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      // function mappings: sin( -> Math.sin( etc.
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")  // log base 10
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/\^2/g, "**2")
      // constants
      .replace(/π/g, "Math.PI")
      // replace standalone 'e' carefully: use boundary so it won't replace 'e' in function names
      .replace(/\be\b/g, "Math.E");

    // Evaluate
    let result = eval(expr);
    // Save to history before updating currentInput
    addToHistory(currentInput, String(result));
    // convert result to string and show
    currentInput = String(result);
    updateDisplay();
    justEvaluated = true;
    // Clear input after 0.5 seconds
    setTimeout(() => {
      currentInput = "";
      updateDisplay();
    }, 500);
  } catch (err) {
    // show error and reset
    currentInput = "Error";
    updateDisplay();
    justEvaluated = true;
    // Clear error after 0.5 seconds
    setTimeout(() => {
      currentInput = "";
      updateDisplay();
    }, 500);
  }
}

function addToHistory(expr, res) {
  history.push({ expr, res });
  const contentEl = document.querySelector('.history-content');
  contentEl.innerHTML = '';
  const reversedHistory = [...history].reverse();
  reversedHistory.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('history-item');
    div.textContent = `${item.expr} = ${item.res}`;
    contentEl.appendChild(div);
  });
}
function clearHistory() {
  history = [];
  const contentEl = document.querySelector('.history-content');
  contentEl.innerHTML = '';
}

// wire up buttons (both .btn and .sci-btn)
document.querySelectorAll(".btn, .sci-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action; // e.g. clear, backspace, equals, sci-toggle
    const val = btn.dataset.value;     // e.g. "7", "+", "sin("

    if (action === "clear") {
      // AC (clear all) when AC, otherwise C acts as backspace (we also support both)
      currentInput = "";
      updateDisplay();
      return;
    }

    if (action === "backspace") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
      return;
    }

    if (action === "equals" || action === "equals-btn") {
      calculate();
      return;
    }

    if (action === "sci-toggle") {
      sciPanel.classList.toggle("hidden");
      return;
    }

    if (action === "clear-history") {
      clearHistory();
      return;
    }

    // if it's a sci-btn (no data-action, but has dataset.value) it will insert its data-value
    if (typeof val !== "undefined") {
      press(val);
      return;
    }

    // fallback: if button had text content but no dataset (shouldn't happen now), use text
    let txt = btn.textContent.trim();
    if (txt) press(txt);
  });
});

// keyboard support
document.addEventListener("keydown", (e) => {
  const k = e.key;

  if ((/^[0-9]$/).test(k) || k === ".") {
    press(k);
    return;
  }

  if (["+", "-", "*", "/", "%"].includes(k)) {
    press(k);
    return;
  }

  if (k === "Enter") {
    e.preventDefault();
    calculate();
    return;
  }

  if (k === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
    return;
  }

  if (k === "Escape" || k.toLowerCase() === "c") {
    currentInput = "";
    updateDisplay();
    return;
  }

  if (k === "(" || k === ")") {
    press(k);
    return;
  }
});
updateDisplay();