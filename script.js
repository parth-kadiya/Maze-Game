const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let cellSize = 25; 
// canvas.width = gridSize * cellSize;
// canvas.height = gridSize * cellSize;
let path = [{ x: 0, y: 0 }];
const maze = [
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
];

let player = { x: 0, y: 0 };
const goal = { x: 19, y: 19 };

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw maze walls
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            ctx.fillStyle = maze[y][x] ? "#000" : "#fff";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    // Draw trail as a single line
    if (path.length > 1) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(path[0].x * cellSize + cellSize / 2, path[0].y * cellSize + cellSize / 2); // Start at the center of the first position
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x * cellSize + cellSize / 2, path[i].y * cellSize + cellSize / 2); // Draw path through centers of cells
        }
        ctx.stroke();
    }

    // Draw goal as a small circle
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(goal.x * cellSize + cellSize / 2, goal.y * cellSize + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw player as a small circle
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(player.x * cellSize + cellSize / 2, player.y * cellSize + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
}

// UPDATED: Button movement with immediate response
function movePlayer(dx, dy) {
    // Cancel any ongoing animation
    if(animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    let nx = player.x + dx;
    let ny = player.y + dy;

    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && maze[ny][nx] === 0) {
        player.x = nx;
        player.y = ny;
        path.push({ x: player.x, y: player.y });
        
        // Immediate redraw without animation
        drawMaze();

        if (nx === goal.x && ny === goal.y) {
            hideControls();
            fadeOutMaze(() => {
                showWinMessage();
                showLogoWithAnimation(triggerFireworks);
            });
        }
    }
}

// UPDATED: Click handler with edge detection
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    
    // Add 2px buffer for edge clicks
    const buffer = 2;
    const scaleX = canvas.width / (rect.width - buffer*2);
    const scaleY = canvas.height / (rect.height - buffer*2);
    
    const mouseX = (event.clientX - rect.left - buffer) * scaleX;
    const mouseY = (event.clientY - rect.top - buffer) * scaleY;

    // Change Math.round to Math.floor for better cell detection
    const targetX = Math.floor(mouseX / cellSize);
    const targetY = Math.floor(mouseY / cellSize);

    if(targetX >= 0 && targetX < gridSize && 
       targetY >= 0 && targetY < gridSize && 
       maze[targetY][targetX] === 0) {
        movePlayerSmoothly(targetX, targetY);
    }
});

// UPDATED: Animation speed optimization
let animationFrameId = null;
const baseSpeed = 2; // Speed multiplier for long paths

function movePlayerSmoothly(targetX, targetY) {
    
    if (player.x !== targetX && player.y !== targetY) {
        return;
    }
    
    const newPath = findPath(player.x, player.y, targetX, targetY);
    if (!newPath) return;

   
    if (getStraightSegmentLength(newPath) !== newPath.length) {
        return; 
    }

    // Cancel any existing animation
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    const originalPath = [...path];
    let currentStep = 0;
    const totalSteps = newPath.length;
    
    const animate = () => {
        if (currentStep >= totalSteps) {
            animationFrameId = null;
            return;
        }
        
        const skipFrames = Math.floor(totalSteps / 30);
        const stepsToMove = Math.min(baseSpeed + skipFrames, totalSteps - currentStep);
        
        const [x, y] = newPath[currentStep + stepsToMove - 1];
        player.x = x;
        player.y = y;
        path = [...originalPath, ...newPath.slice(0, currentStep + stepsToMove).map(([x, y]) => ({ x, y }))];
        
        drawMaze();
        currentStep += stepsToMove;
        
        if (currentStep < totalSteps) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            animationFrameId = null;
        }
        
        if (x === goal.x && y === goal.y) {
            hideControls();
            fadeOutMaze(() => {
                showWinMessage();
                showLogoWithAnimation(triggerFireworks);
            });
        }
    };
    
    animate();
}

function hideControls() {
    document.querySelector(".controls-container").style.display = "none";
}


// UPDATED: findPath function
function findPath(startX, startY, targetX, targetY) {
    const queue = [[startX, startY, []]]; // Store path history
    
    const visited = new Set();
    const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
    
    while(queue.length > 0) {
        const [x, y, currentPath] = queue.shift();
        
        if(x === targetX && y === targetY) {
            return currentPath.concat([[x, y]]);
        }
        
        for(const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            const key = `${nx},${ny}`;
            
            if(nx >= 0 && nx < gridSize && 
               ny >= 0 && ny < gridSize &&
               maze[ny][nx] === 0 &&
               !visited.has(key)) {
                visited.add(key);
                queue.push([nx, ny, currentPath.concat([[x, y]])]);
            }
        }
    }
    return null;
}

function getStraightSegmentLength(pathArray) {
    if (pathArray.length < 2) return pathArray.length;
    
    let dx = pathArray[1][0] - pathArray[0][0];
    let dy = pathArray[1][1] - pathArray[0][1];
    let count = 2; 

    
    for (let i = 2; i < pathArray.length; i++) {
        let ndx = pathArray[i][0] - pathArray[i - 1][0];
        let ndy = pathArray[i][1] - pathArray[i - 1][1];
        if (ndx === dx && ndy === dy) {
            count++;
        } else {
            break; 
        }
    }
    return count;
}


document.addEventListener("keydown", (e) => {
    const keyActions = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0]
    };

    if (keyActions[e.key]) {
        e.preventDefault(); // Prevent scrolling
        movePlayer(keyActions[e.key][0], keyActions[e.key][1]);
    }
});

drawMaze();

function fadeOutMaze(callback) {
    let cheeringAudio = new Audio("cheering.mp3");
    cheeringAudio.play();

    let opacity = 1;
    function fade() {
        ctx.globalAlpha = opacity;  // Instead of filling black, reduce canvas opacity
        drawMaze();  // Redraw maze with reduced opacity
        ctx.globalAlpha = 1; // Reset opacity

        opacity -= 0.02;
        if (opacity > 0) {
            requestAnimationFrame(fade);
        } else {
            callback();
        }
    }
    fade();
}


let logoImage = new Image();
logoImage.src = "Sildoo.jpg"; 


function showLogoWithAnimation() {
    document.getElementById("winLogo").style.display = "block";
    triggerFireworks();
}



function triggerFireworks() {
    let particles = [];

    // Load and play the cheering sound


    function createFirework(x, y) {
        for (let i = 0; i < 316; i++) {
            particles.push({
                x: x,
                y: y,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 - 2,
                alpha: 1,
                color: `hsl(${Math.random() * 360}, 100%, 60%)`
            });
        }
    }

   function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   

    // Draw fireworks
    particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
    });

    particles = particles.filter((p) => p.alpha > 0);
    particles.forEach((p) => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.globalAlpha = 1;

    if (particles.length > 0) {
        requestAnimationFrame(animateFireworks);
    }
}


    // Fireworks appear around the logo
    let logoX = canvas.width / 2;
    let logoY = canvas.height / 2;
    createFirework(logoX - 160, logoY - 160);
    createFirework(logoX + 160, logoY - 160);
    createFirework(logoX - 160, logoY + 160);
    createFirework(logoX + 160, logoY + 160);

    animateFireworks();
}

function showWinMessage() {
    document.getElementById("winMessage").style.display = "block";
    showBackToLoginButton();  
}


function showBackToLoginButton() {
    document.getElementById("backToLogin").style.display = "block";
}

function redirectToLogin() {
    window.location.href = "https://streamgo.in/FUTURA-MAX-AND-LEMAX-FY26-Strategy-Connect/"; 
}

function resizeCanvas() {
    const container = document.querySelector('.canvas-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate cell size as integer to avoid sub-pixel rendering
    cellSize = Math.floor(Math.min(containerWidth / gridSize, containerHeight / gridSize));
    
    // Set actual canvas dimensions
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
    
    // Prevent CSS scaling
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    
    drawMaze();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();