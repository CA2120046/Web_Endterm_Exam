document.addEventListener('DOMContentLoaded', () => {
    // Remove loader handling code
    // const loader = document.querySelector('.loader-wrapper');
    // if (loader) {
    //     setTimeout(() => {
    //         loader.style.opacity = '0';
    //         setTimeout(() => {
    //             loader.style.display = 'none';
    //         }, 500);
    //     }, 2000);
    // }

    // Add tilt effect to all cards (including team member cards)
    const cards = document.querySelectorAll('.card, .team-member-card, .project-info');
    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });

    // Scroll animation code
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.card, .description, .about-card, .team-member-card, .project-info').forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // Select all team member cards
    const teamCards = document.querySelectorAll('.team-member-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
});
