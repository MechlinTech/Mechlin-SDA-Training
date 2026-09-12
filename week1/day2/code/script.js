// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// Card loading animation
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });
});


// Sidebar hover effect
const sidebarLinks = document.querySelectorAll(".sidebar-nav a");

sidebarLinks.forEach(link => {
    link.addEventListener("mouseenter", () => {
        link.style.transform = "translateX(8px)";
    });

    link.addEventListener("mouseleave", () => {
        link.style.transform = "translateX(0)";
    });
});