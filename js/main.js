// Main JavaScript for homepage functionality
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      hamburger.classList.toggle("active")
    })
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]')
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Contact form submission
  const contactForm = document.querySelector(".contact-form form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Get form data
      const formData = new FormData(this)
      const name = formData.get("name") || this.querySelector('input[type="text"]').value
      const email = formData.get("email") || this.querySelector('input[type="email"]').value
      const message = formData.get("message") || this.querySelector("textarea").value

      // Simple validation
      if (!name || !email || !message) {
        alert("Por favor, completa todos los campos.")
        return
      }

      // Simulate form submission
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
      submitBtn.disabled = true

      setTimeout(() => {
        alert("¡Mensaje enviado correctamente! Te contactaremos pronto.")
        this.reset()
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }, 2000)
    })
  }

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar")
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    })
  }

  // Animate stats on scroll
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStats(entry.target)
      }
    })
  }, observerOptions)

  const statsSection = document.querySelector(".hero-stats")
  if (statsSection) {
    observer.observe(statsSection)
  }

  function animateStats(statsContainer) {
    const statNumbers = statsContainer.querySelectorAll(".stat-number")

    statNumbers.forEach((stat) => {
      const finalValue = stat.textContent
      const isNumber = !isNaN(Number.parseInt(finalValue))

      if (isNumber) {
        const target = Number.parseInt(finalValue)
        let current = 0
        const increment = target / 50

        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          stat.textContent = Math.floor(current) + (finalValue.includes("+") ? "+" : "")
        }, 30)
      }
    })
  }
})

// Add CSS for mobile menu
const style = document.createElement("style")
style.textContent = `
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: var(--shadow);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: var(--white);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 2rem 0;
            transition: var(--transition);
            box-shadow: var(--shadow-lg);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-link {
            padding: 1rem 0;
            font-size: 1.125rem;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`
document.head.appendChild(style)


// document.addEventListener("DOMContentLoaded", () => {
//   // Mobile menu toggle
//   const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
//   const mainNav = document.querySelector(".main-nav")

//   if (mobileMenuToggle && mainNav) {
//     mobileMenuToggle.addEventListener("click", () => {
//       mainNav.classList.toggle("show")
//     })
//   }

//   // Smooth scrolling for anchor links
//   document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//     anchor.addEventListener("click", function (e) {
//       e.preventDefault()

//       const targetId = this.getAttribute("href")
//       if (targetId === "#") return

//       const targetElement = document.querySelector(targetId)
//       if (targetElement) {
//         window.scrollTo({
//           top: targetElement.offsetTop - 80,
//           behavior: "smooth",
//         })

//         // Update active nav link
//         document.querySelectorAll(".main-nav a").forEach((link) => {
//           link.classList.remove("active")
//         })
//         this.classList.add("active")

//         // Close mobile menu if open
//         if (mainNav.classList.contains("show")) {
//           mainNav.classList.remove("show")
//         }
//       }
//     })
//   })

//   // Active nav link on scroll
//   window.addEventListener("scroll", () => {
//     const sections = document.querySelectorAll("section")
//     const navLinks = document.querySelectorAll(".main-nav a")

//     let currentSection = ""

//     sections.forEach((section) => {
//       const sectionTop = section.offsetTop - 100
//       const sectionHeight = section.clientHeight

//       if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
//         currentSection = "#" + section.getAttribute("id")
//       }
//     })

//     navLinks.forEach((link) => {
//       link.classList.remove("active")
//       if (link.getAttribute("href") === currentSection) {
//         link.classList.add("active")
//       }
//     })
//   })

//   // Form submission handling
//   const contactForm = document.querySelector(".contact-form")
//   if (contactForm) {
//     contactForm.addEventListener("submit", function (e) {
//       e.preventDefault()

//       // Get form data
//       const name = this.querySelector("#name").value
//       const email = this.querySelector("#email").value
//       const message = this.querySelector("#message").value

//       // Simple validation
//       if (!name || !email || !message) {
//         alert("Please fill in all fields")
//         return
//       }

//       // Here you would normally send the data to a server
//       // For now, just show a success message
//       alert("Thank you for your message! We will get back to you soon.")
//       this.reset()
//     })
//   }
// })
