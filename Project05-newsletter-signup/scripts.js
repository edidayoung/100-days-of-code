document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('newsletter-form');
      const emailInput = document.getElementById('email-input');
      const submitButton = document.getElementById('submit-button');
      const buttonText = document.getElementById('button-text');
      const errorMessage = document.getElementById('error-message');
      const successMessage = document.getElementById('success-message');
      const successText = document.getElementById('success-text');
      const closeSuccessButton = document.getElementById('close-success');

      // Email validation function
      function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }

      // Show error message
      function showError() {
        errorMessage.classList.add('active');
        emailInput.style.borderColor = 'var(--error-color)';
      }

      // Hide error message
      function hideError() {
        errorMessage.classList.remove('active');
        emailInput.style.borderColor = 'var(--text-dark)';
      }

      // Show loading state
      function showLoading() {
        buttonText.innerHTML = '<span class="spinner"></span>Subscribing...';
        submitButton.disabled = true;
      }

      // Hide loading state
      function hideLoading() {
        buttonText.textContent = 'Subscribe';
        submitButton.disabled = false;
      }

      // Show success message
      function showSuccess(email) {
        successText.textContent = `Thank you for subscribing with ${email}! This is a dummy text - you haven't subscribed to anything. Rest assured your data is safe.`;
        successMessage.classList.add('active');
      }

      // Hide success message
      function hideSuccess() {
        successMessage.classList.remove('active');
        form.reset();
      }

      // Form submission handler
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!isValidEmail(email)) {
          showError();
          return;
        }
        
        hideError();
        showLoading();
        
        // Simulate API call with timeout
        setTimeout(() => {
          hideLoading();
          showSuccess(email);
        }, 1500);
      });

      // Real-time email validation
      emailInput.addEventListener('input', function() {
        if (isValidEmail(this.value.trim())) {
          hideError();
        }
      });

      // Close success message
      closeSuccessButton.addEventListener('click', hideSuccess);
    });
