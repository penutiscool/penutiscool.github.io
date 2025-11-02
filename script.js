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
            ctx.fillStyle = `rgba(9, 255, 0, ${circle.opacity})`; // Purple color
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
                    <title>Penuts Arcade</title>
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