// Canvas animation
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

// Store timestamp for frame rate control
let lastTime = 0;
const FPS = 60;
const frameDelay = 1000/FPS;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Debounce resize event
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 250);
});
resizeCanvas();

const particles = [];
const particleCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 20000)); // Adjust particle count based on screen size

for(let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1, // Reduced particle size
        speedX: (Math.random() * 1.5 - 0.75), // Reduced speed range
        speedY: (Math.random() * 1.5 - 0.75)
    });
}

function animate(currentTime) {
    // Control frame rate
    if (currentTime - lastTime < frameDelay) {
        requestAnimationFrame(animate);
        return;
    }
    lastTime = currentTime;

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw semi-transparent background
    ctx.fillStyle = 'rgba(10, 25, 47, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Batch particle drawing
    ctx.fillStyle = '#FBF017FF';
    particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Improved boundary checking
        if(particle.x < 0) {
            particle.x = 0;
            particle.speedX *= -1;
        } else if(particle.x > canvas.width) {
            particle.x = canvas.width;
            particle.speedX *= -1;
        }
        
        if(particle.y < 0) {
            particle.y = 0;
            particle.speedY *= -1;
        } else if(particle.y > canvas.height) {
            particle.y = canvas.height;
            particle.speedY *= -1;
        }
    });

    // Add connection lines between nearby particles
    drawConnections();

    requestAnimationFrame(animate);
}

// Add connection lines between nearby particles
function drawConnections() {
    const maxDistance = 150; // Maximum distance for connection
    
    ctx.strokeStyle = 'rgba(100, 255, 218, 0.15)'; // Matches your theme color
    ctx.lineWidth = 0.5;

    for(let i = 0; i < particles.length; i++) {
        for(let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Start animation when page is visible
if (!document.hidden) {
    animate();
}

// Pause animation when page is not visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        lastTime = 0;
        animate();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Handle loader
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 2000);
    }

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

function handleTilt(e) {
    const card = e.currentTarget;
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    
    // Calculate mouse position relative to card center
    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;
    
    // Calculate rotation (max 10 degrees)
    const rotateX = (mouseY / (cardRect.height / 2)) * -10;
    const rotateY = (mouseX / (cardRect.width / 2)) * 10;
    
    // Apply transform with perspective
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
}