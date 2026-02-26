/**
 * Advanced Dashboard - Day 2 JavaScript
 * Interactive features and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Advanced Dashboard loaded successfully!');
    
    // Initialize all interactive features
    initializeNavigation();
    initializeCards();
    initializeSidebar();
    initializeAnimations();
    initializeResponsiveFeatures();
    // initialize additional features after DOM ready
    initializePerformanceMonitoring();
    initializeKeyboardNavigation();
    initializeThemeSwitcher();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a, .sidebar-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Add active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Initialize card animations and interactions
 */
function initializeCards() {
    const cards = document.querySelectorAll('.card');
    
    // Staggered animation on load
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Add hover effects
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Initialize sidebar interactions
 */
function initializeSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
            this.style.backgroundColor = 'var(--primary-color)';
            this.style.color = 'white';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.backgroundColor = '';
            this.style.color = '';
        });
        
        link.addEventListener('click', function() {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.card, .chart-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

/**
 * Initialize responsive features
 */
function initializeResponsiveFeatures() {
    // Handle mobile menu toggle (if needed)
    const createMobileMenu = () => {
        const nav = document.querySelector('.nav');
        const navMenu = document.querySelector('.nav-menu');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-color);
        `;
        
        nav.appendChild(mobileMenuBtn);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
        });
        
        // Show/hide mobile menu button based on screen size
        const checkScreenSize = () => {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
                navMenu.style.display = navMenu.classList.contains('mobile-open') ? 'flex' : 'none';
            } else {
                mobileMenuBtn.style.display = 'none';
                navMenu.style.display = 'flex';
            }
        };
        
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    };
    
    createMobileMenu();
}

/**
 * Add loading states and performance monitoring
 */
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`📊 Page loaded in ${Math.round(loadTime)}ms`);
        
        // Add performance metrics to dashboard
        const performanceCard = document.createElement('div');
        performanceCard.className = 'card card-info';
        performanceCard.innerHTML = `
            <div class="card-icon">⚡</div>
            <h3>Performance</h3>
            <p class="metric">${Math.round(loadTime)}ms</p>
            <p class="metric-change positive">Page load time</p>
        `;
        
        // Insert performance card into dashboard
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (dashboardGrid) {
            dashboardGrid.appendChild(performanceCard);
        }
    });
}

/**
 * Add keyboard navigation support
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Handle keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.querySelector('.sidebar-nav a[href="#dashboard"]')?.click();
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('.sidebar-nav a[href="#users"]')?.click();
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('.sidebar-nav a[href="#reports"]')?.click();
                    break;
            }
        }
    });
}

/**
 * Add theme switching functionality
 */
function initializeThemeSwitcher() {
    // Create theme toggle button with accessibility and persistence
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.setAttribute('title', 'Toggle dark mode');

    // Apply persisted theme (if any)
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '☀️';
        themeToggle.setAttribute('aria-pressed', 'true');
    } else {
        document.body.classList.remove('dark-theme');
        themeToggle.innerHTML = '🌙';
        themeToggle.setAttribute('aria-pressed', 'false');
    }

    document.body.appendChild(themeToggle);

    // Toggle theme with persistence
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        themeToggle.innerHTML = isDark ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Keyboard activation support
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeToggle.click();
        }
    });
}

// (Now initialized on DOMContentLoaded)

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeCards,
        initializeSidebar,
        initializeAnimations
    };
}
