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
            speed: Math.random() * 3 + 2,
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
            ctx.fillStyle = `rgba(128, 0, 128, ${circle.opacity})`; // Purple color
            ctx.fill();
        });
    }
    
    function animate() {
        updateCircles();
        drawCircles();
        requestAnimationFrame(animate);
    }
    
    setInterval(createCircle, 500); // Create a new circle every 500ms
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

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
