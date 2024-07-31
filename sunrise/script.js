// JavaScript

// Import the time_is_widget.js library
time_is_widget.init({
    New_Haven__Connecticut_z161: {
        template: "TIME",
        time_format: "hours:minutes",
        coords: "41.3081500,-72.9281600"
    },
    New_Haven__Connecticut_z161_sun: {
        template:
            "SUN",
        sun_format:
            "srhour:srminute",
        coords:
            "41.3081500,-72.9281600"
    },
    New_Haven__Connecticut_z161_sunset: {
        template:
            "SUN",
        sun_format:
            "sshour:ssminute",
        coords:
            "41.3081500,-72.9281600"
    }
});

        // Function to update drop sizes based on font size
        function updateDropSizes() {
            const link = document.querySelector('.drip-link');
            const fontSize = parseFloat(window.getComputedStyle(link).fontSize);
            const drops = document.querySelectorAll('.blood-drop');
            
            drops.forEach(drop => {
                drop.style.width = `${fontSize * 0.4}px`;
                drop.style.height = `${fontSize * 0.8}px`;
            });
        }

        // Initial update
        updateDropSizes();

        // Update on window resize
        window.addEventListener('resize', updateDropSizes);