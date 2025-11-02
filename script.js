const canvas = document.getElementById('background-canvas');

if (canvas) {
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const circles = [];
    
    function createCircle() {
        const circle = {
            x: Math.random() * canvas.width,
            y: canvas.height,
            radius: Math.random() * 10 + 5,
            speed: Math.random() * 3 + 13,
            opacity: 1
        };
        circles.push(circle);
    }
    
    function updateCircles() {
        circles.forEach((circle, index) => {
            circle.y -= circle.speed;
            circle.opacity -= 0.005;
            if (circle.opacity <= 0) {
                circles.splice(index, 1);
            }
        });
    }
    
    function drawCircles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach(circle => {
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(9, 255, 0, ${circle.opacity})`; // Green color
            ctx.fill();
        });
    }
    
    function animate() {
        updateCircles();
        drawCircles();
        requestAnimationFrame(animate);
    }
    
    setInterval(createCircle, 40); // Create a new circle every 500ms
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Tooltip functionality
document.addEventListener('DOMContentLoaded', () => {
    const tooltips = document.querySelectorAll('.tooltip');
    const navItems = document.querySelectorAll('.topbar li');

    navItems.forEach(item => {
        const tooltip = item.querySelector('.tooltip');
        if (tooltip) {
            item.addEventListener('mouseenter', (e) => {
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY - 30 + 'px';
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });

            item.addEventListener('mousemove', (e) => {
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY - 30 + 'px';
            });

            item.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        }
    });

    // Time Display
});

// Make site title clickable - opens about:blank with current page embedded
const siteTitle = document.getElementById('site-title');
if (siteTitle) {
    siteTitle.style.cursor = 'pointer';
    siteTitle.addEventListener('click', () => {
        const currentUrl = window.location.href;
        const newWindow = window.open('about:blank', '_blank');
        if (newWindow) {
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <link rel="icon" type="image/x-icon" href="https://login.classlink.com/favicon.ico">
                    <title>Login</title>
                    <style>
                        body, html {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }
                        iframe {
                            width: 100%;
                            height: 100%;
                            border: none;
                        }
                    </style>
                </head>
                <body>
                    <iframe src="${currentUrl}" style="width: 100%; height: 100vh; border: none;"></iframe>
                </body>
                </html>
            `);
            newWindow.document.close();
        }
    });
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const day = days[now.getDay()];

    const formattedTime = `${hours}:${minutes} ${day}`;
    document.getElementById("clock").textContent = formattedTime;
}

setInterval(updateClock, 1000);
updateClock();

// --- Weather Fetch ---
async function getWeather() {
    try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch"
        );
        const data = await response.json();

        const currentHour = new Date().getHours();
        const temp = data.hourly.temperature_2m[currentHour];

        document.getElementById("weather").textContent = `Temp: ${temp}°F`;
    } catch (err) {
        document.getElementById("weather").textContent = "Weather Error";
        console.log(err);
    }
}

getWeather();
setInterval(getWeather, 600000); // update every 10 minutes

// Page loading spinner for navigation
document.addEventListener('DOMContentLoaded', () => {
    // Random loading messages
    const loadingMessages = [
        "Loading...",
        "Preparing the arcade...",
        "Gathering games...",
        "Almost there...",
        "Setting up fun...",
        "Loading awesome content...",
        "Getting ready...",
        "Preparing your experience...",
        "Just a moment...",
        "Loading magic...",
        "Almost ready...",
        "Hang tight...",
        "Building the fun...",
        "Preparing games...",
        "Loading content...",
        "Setting things up..."
    ];
    
    let messageInterval = null;
    let currentMessageIndex = 0;
    let overlayShowTime = null;
    let pageLoaded = false;
    let hideTimeout = null;
    
    // Create page loading overlay if it doesn't exist
    let pageLoadingOverlay = document.getElementById('page-loading-overlay');
    let pageLoadingText = null;
    
    function createLoadingOverlay() {
        if (!pageLoadingOverlay) {
            pageLoadingOverlay = document.createElement('div');
            pageLoadingOverlay.id = 'page-loading-overlay';
            pageLoadingOverlay.className = 'page-loading-overlay';
            pageLoadingOverlay.innerHTML = `
                <div class="page-loading-content">
                    <div class="loading-spinner"></div>
                    <div class="page-loading-text">${loadingMessages[0]}</div>
                </div>
            `;
            document.body.appendChild(pageLoadingOverlay);
        }
        // Always get the text element reference (in case overlay already existed)
        pageLoadingText = pageLoadingOverlay.querySelector('.page-loading-text');
    }
    
    function startMessageCycle() {
        // Clear any existing interval
        if (messageInterval) {
            clearInterval(messageInterval);
        }
        
        // Pick a random starting message
        currentMessageIndex = Math.floor(Math.random() * loadingMessages.length);
        if (pageLoadingText) {
            pageLoadingText.textContent = loadingMessages[currentMessageIndex];
        }
        
        // Cycle through messages every 3 seconds
        messageInterval = setInterval(() => {
            if (pageLoadingOverlay && pageLoadingOverlay.classList.contains('show') && pageLoadingText) {
                // Pick a random different message
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * loadingMessages.length);
                } while (newIndex === currentMessageIndex && loadingMessages.length > 1);
                
                currentMessageIndex = newIndex;
                pageLoadingText.style.opacity = '0';
                
                setTimeout(() => {
                    pageLoadingText.textContent = loadingMessages[currentMessageIndex];
                    pageLoadingText.style.opacity = '1';
                }, 150);
            }
        }, 3000);
    }
    
    function stopMessageCycle() {
        if (messageInterval) {
            clearInterval(messageInterval);
            messageInterval = null;
        }
    }
    
    function hideLoadingOverlay() {
        if (!pageLoadingOverlay || !pageLoadingOverlay.classList.contains('show')) {
            return;
        }
        
        const now = Date.now();
        const minDisplayTime = 2000; // 2 seconds
        
        if (!overlayShowTime) {
            // Overlay was shown but time wasn't tracked (shouldn't happen normally)
            overlayShowTime = now;
        }
        
        const timeShown = now - overlayShowTime;
        
        if (timeShown >= minDisplayTime) {
            // Minimum time has passed, hide immediately
            pageLoadingOverlay.classList.remove('show');
            stopMessageCycle();
            overlayShowTime = null;
            pageLoaded = false;
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        } else {
            // Minimum time hasn't passed yet, wait for the remaining time
            const remainingTime = minDisplayTime - timeShown;
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
            hideTimeout = setTimeout(() => {
                if (pageLoadingOverlay && pageLoadingOverlay.classList.contains('show')) {
                    pageLoadingOverlay.classList.remove('show');
                    stopMessageCycle();
                }
                overlayShowTime = null;
                pageLoaded = false;
                hideTimeout = null;
            }, remainingTime);
        }
    }
    
    createLoadingOverlay();

    // Check if overlay should be shown (from previous page navigation)
    let fromNavigation = false;
    if (typeof Storage !== 'undefined') {
        const storedShowTime = sessionStorage.getItem('overlayShowTime');
        if (storedShowTime) {
            overlayShowTime = parseInt(storedShowTime, 10);
            pageLoadingOverlay.classList.add('show');
            startMessageCycle();
            sessionStorage.removeItem('overlayShowTime'); // Remove after reading
            fromNavigation = true;
        }
    }
    
    // Show loading overlay on initial page load (if not from navigation)
    if (!fromNavigation) {
        const showTime = Date.now();
        overlayShowTime = showTime;
        pageLoadingOverlay.classList.add('show');
        startMessageCycle();
    }

    // Intercept all navigation link clicks
    const navLinks = document.querySelectorAll('.topbar a[href], .content a[href]');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Only intercept internal links (same domain)
        if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('//')) {
            link.addEventListener('click', (e) => {
                // Don't intercept if it's an external link or special link
                if (href.startsWith('mailto:') || href.startsWith('tel:')) {
                    return;
                }
                
                // Show loading overlay
                const showTime = Date.now();
                overlayShowTime = showTime;
                pageLoaded = false;
                
                // Store in sessionStorage so it persists across page navigation
                if (typeof Storage !== 'undefined') {
                    sessionStorage.setItem('overlayShowTime', showTime.toString());
                }
                
                pageLoadingOverlay.classList.add('show');
                startMessageCycle();
                
                // Set minimum display timer (2 seconds)
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                }
                
                // Let the default navigation happen
                // The overlay will remain visible until the new page loads
            });
        }
    });
    
    // Hide loading overlay when page is fully loaded
    window.addEventListener('load', () => {
        pageLoaded = true;
        hideLoadingOverlay();
    });
    
    // Also handle if page is already loaded
    if (document.readyState === 'complete') {
        pageLoaded = true;
        // If overlay is shown, ensure it stays for minimum 2 seconds
        if (pageLoadingOverlay && pageLoadingOverlay.classList.contains('show')) {
            hideLoadingOverlay();
        }
    }
});