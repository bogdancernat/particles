var canvas = document.createElement('canvas')
, context = canvas.getContext('2d')
, particles = {}
, maxParticles = 400
, particlesPerStage = 15
;

resize();
clearCanvas();

window.onresize = function () {
    resize();
    clearCanvas();
};

window.onload = function () {
    start();
};

function animate () {
    requestAnimationFrame(animate);
    clearCanvas();
    createParticles();

    for (var key in particles) {
        particles[key].draw();
    }
}

function createParticles () {
    for (var i = 0; i < particlesPerStage; i++) {
        if (Object.keys(particles).length >= maxParticles) {
            return;
        }

        var p = new Particle(canvas.width / 2, canvas.height / 2);
        particles[p.id] = p;
    }
}

function start() {
    document.body.appendChild(canvas);
    animate();
}


function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function clearCanvas() {
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "lighter";
}

function Particle(x, y) {
    var particleScope = this;

    this.radius = 3;
    this.radiusChangeRate = Math.random() / 5;

    // this.maxSpeed = Math.random() * 2;
    this.maxSpeed = 0.9;
    this.maxLife = Math.floor(Math.random() * 14);
    this.x = x;
    this.y = y;

    this.vxDirection = (Math.random() < 0.3 ? -1 : 1);
    this.vx = (Math.random() * this.maxSpeed) * this.vxDirection;

    this.vyDirection = (Math.random() < 0.3 ? -1 : 1);
    this.vy = (Math.random() * this.maxSpeed) * this.vyDirection;

    this.color = (new window.RColor()).get(false, 0.7, Math.random());
    // this.timeOfDeath = (+new Date()) + Math.floor(Math.random() * this.maxLife) * 1000;

    this.id = tools.guid();

    this.draw = function () {
        // if (+new Date() >= particleScope.timeOfDeath) {
        //     return particleScope.remove();
        // }

        drawCircle({
            x: particleScope.x,
            y: particleScope.y,
            radius: particleScope.radius,
            color: particleScope.color
        }, 1);

        particleScope.update();
    };

    this.update = function () {
        if (Math.random() < 0.007) {
            particleScope.vxDirection *= -1;
            particleScope.vx *= particleScope.vxDirection;
        }

        if (Math.random() < 0.007) {
            particleScope.vyDirection *= -1;
            particleScope.vy *= particleScope.vyDirection; 
        }

        particleScope.radius -= particleScope.radiusChangeRate;
        
        if (particleScope.radius < 0) {
            return particleScope.remove();
        }

        particleScope.x += particleScope.vx;
        particleScope.y += particleScope.vy;
    };

    this.remove = function () {
        delete particles[particleScope.id];
    };
}

function drawCircle(point, alpha) {
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(' + point.color[0] + ',' + point.color[1] + ',' + point.color[2] + ',' + alpha + ')';
    
    context.beginPath();
    context.arc(point.x, point.y, point.radius, 0, Math.PI * 2, true);
    context.stroke();
    context.fillStyle = 'rgba(' + point.color[0] + ',' + point.color[1] + ',' + point.color[2] + ',' + alpha + ')';
    context.fill();
    context.closePath();
}