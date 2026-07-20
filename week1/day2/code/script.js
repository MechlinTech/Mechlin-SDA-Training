document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       Smooth Scrolling
    ========================================== */

    const navLinks = document.querySelectorAll(".nav-menu a, .sidebar-nav a");

    navLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            console.log("Clicked:", this.textContent);

        });

    });

    /* ==========================================
       Card Loading Animation
    ========================================== */

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(20px)";

        setTimeout(() => {

            card.style.transition = "all .6s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 200);

    });

    /* ==========================================
       Sidebar Hover
    ========================================== */

    const sidebarLinks = document.querySelectorAll(".sidebar-nav a");

    sidebarLinks.forEach(link => {

        link.addEventListener("mouseenter", function () {

            this.style.transform = "translateX(10px)";

        });

        link.addEventListener("mouseleave", function () {

            this.style.transform = "translateX(0)";

        });

    });

});