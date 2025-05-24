document.addEventListener("DOMContentLoaded", () => {
  // Role selection
  const roleOptions = document.querySelectorAll(".role-option")
  if (roleOptions.length > 0) {
    roleOptions.forEach((option) => {
      option.addEventListener("click", function () {
        roleOptions.forEach((opt) => opt.classList.remove("selected"))
        this.classList.add("selected")
      })
    })
  }

  // Password toggle
  const togglePassword = document.getElementById("togglePassword")
  const passwordInput = document.getElementById("password")

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)

      const icon = this.querySelector("i")
      icon.classList.toggle("fa-eye")
      icon.classList.toggle("fa-eye-slash")
    })
  }

  // Login form handling
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Clear previous errors
      clearErrors()

      // Get form data
      const email = document.getElementById("email").value.trim()
      const password = document.getElementById("password").value.trim()
      const selectedRole = document.querySelector(".role-option.selected")

      // Validate inputs
      if (!validateInputs(email, password, selectedRole)) {
        return
      }

      const role = selectedRole.dataset.role

      try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]')
        submitBtn.disabled = true
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...'

        // Make API request
        const response = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Login failed")
        }

        const data = await response.json()

        // Store auth data
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("userRole", data.role)
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", email)

        // Redirect to dashboard
        window.location.href = "dashboard.html"
      } catch (error) {
        console.error("Login error:", error)
        showError(error.message || "Invalid email or password")
      } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]')
        submitBtn.disabled = false
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In'
      }
    })
  }

  // Register form handling
  const registerForm = document.getElementById("registerForm")
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Clear previous errors
      clearErrors()

      // Get form data
      const name = document.getElementById("name").value.trim()
      const email = document.getElementById("email").value.trim()
      const password = document.getElementById("password").value.trim()
      const phone = document.getElementById("phone").value.trim()
      const address = document.getElementById("address").value.trim()
      const selectedRole = document.querySelector(".role-option.selected")
      const terms = document.getElementById("terms")

      // Validate inputs
      if (!validateRegisterInputs(name, email, password, phone, address, selectedRole, terms)) {
        return
      }

      const role = selectedRole.dataset.role

      try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]')
        submitBtn.disabled = true
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...'

        // Make API request
        const response = await fetch("http://localhost:8080/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            phone,
            address,
            role,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Registration failed")
        }

        const data = await response.json()

        // Store auth data
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("userRole", data.role)
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", email)

        // Redirect to dashboard
        window.location.href = "dashboard.html"
      } catch (error) {
        console.error("Registration error:", error)
        showError(error.message || "Registration failed. Please try again.")
      } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]')
        submitBtn.disabled = false
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account'
      }
    })
  }

  // Helper functions
  function validateInputs(email, password, selectedRole) {
    let isValid = true

    if (!email) {
      showFieldError("email", "Email is required")
      isValid = false
    } else if (!isValidEmail(email)) {
      showFieldError("email", "Please enter a valid email")
      isValid = false
    }

    if (!password) {
      showFieldError("password", "Password is required")
      isValid = false
    } else if (password.length < 8) {
      showFieldError("password", "Password must be at least 8 characters")
      isValid = false
    }

    if (!selectedRole) {
      showError("Please select a role")
      isValid = false
    }

    return isValid
  }

  function validateRegisterInputs(name, email, password, phone, address, selectedRole, terms) {
    let isValid = true

    if (!name) {
      showFieldError("name", "Name is required")
      isValid = false
    }

    if (!email) {
      showFieldError("email", "Email is required")
      isValid = false
    } else if (!isValidEmail(email)) {
      showFieldError("email", "Please enter a valid email")
      isValid = false
    }

    if (!password) {
      showFieldError("password", "Password is required")
      isValid = false
    } else if (password.length < 8) {
      showFieldError("password", "Password must be at least 8 characters")
      isValid = false
    }

    if (!phone) {
      showFieldError("phone", "Phone number is required")
      isValid = false
    }

    if (!address) {
      showFieldError("address", "Address is required")
      isValid = false
    }

    if (!selectedRole) {
      showError("Please select a role")
      isValid = false
    }

    if (terms && !terms.checked) {
      showError("You must agree to the Terms of Service and Privacy Policy")
      isValid = false
    }

    return isValid
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId)
    const errorElement = document.getElementById(`${fieldId}Error`)

    if (field && errorElement) {
      field.parentElement.parentElement.classList.add("has-error")
      errorElement.textContent = message
      errorElement.style.display = "block"
    }
  }

  function showError(message) {
    // For general errors, show in password error element as fallback
    const passwordError = document.getElementById("passwordError")
    if (passwordError) {
      passwordError.textContent = message
      passwordError.style.display = "block"

      // Add shake animation
      passwordError.classList.add("shake")
      setTimeout(() => {
        passwordError.classList.remove("shake")
      }, 500)
    } else {
      alert(message)
    }
  }

  function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message")
    const formGroups = document.querySelectorAll(".form-group")

    errorElements.forEach((element) => {
      element.textContent = ""
      element.style.display = "none"
    })

    formGroups.forEach((group) => {
      group.classList.remove("has-error")
    })
  }
})
