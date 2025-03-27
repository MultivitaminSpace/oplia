const { Engine, Render, Runner, Bodies, Composite, Events, Body } = Matter;
let totalVitamins = 0;
const counter = document.getElementById("vitaminCounter");
const canvas = document.getElementById("world");
const engine = Engine.create();
let render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#f0f0f0'
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);
let ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });
let leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
let rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
Composite.add(engine.world, [ground, leftWall, rightWall]);

window.addEventListener("resize", () => { location.reload(); });

const sounds = [document.getElementById("pop1"), document.getElementById("pop2"), document.getElementById("pop3")];

function createEmojiDataURL(emoji) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 32, 32);
    return canvas.toDataURL();
}

function spawnFruit(emoji) {
    const size = 40;
    const x = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
    const fruit = Bodies.circle(x, 0, size / 2, {
        render: {
            sprite: {
                texture: createEmojiDataURL(emoji),
                xScale: 1.0,
                yScale: 1.0
            }
        },
        restitution: 1.05
    });
    fruit.birthTime = Date.now();
    fruit.vitaminValue = Math.floor(Math.random() * 5) + 1;
    Composite.add(engine.world, fruit);
    totalVitamins += fruit.vitaminValue;
    counter.textContent = `Efficiency: ${totalVitamins}`;
    const s = sounds[Math.floor(Math.random() * sounds.length)];
    s.currentTime = 0;
    s.play();
}

const itemsDiv = document.getElementById("items");
itemsDiv.innerHTML = "";
const emojiList = ['🙇\u200d♀️', '🙌', '📈', '💰', '💡', '🕒', '📎', '🖥️', '🔥', '🎯', '💯', '💬', '🤯', '🚀', '💼', '🫡', '😓', '💳', '👔', '🕴️', '🏢', '🧑\u200d💻', '🤝', '🙏', '🧾', '🙇\u200d♂️', '🫠', '😵\u200d💫', '🔋', '🔒', '🏆', '📅', '💩', '😤', '🧠', '📢', '🥇', '♾️', '💵', '💦', '🖇️', '📊'];
emojiList.forEach(emoji => {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.style.margin = "8px";
    span.style.cursor = "pointer";
    span.style.fontSize = "36px";
    span.addEventListener("mouseenter", () => {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => spawnFruit(emoji), i * 60);
        }
    });
    itemsDiv.appendChild(span);
});

Events.on(engine, 'afterUpdate', () => {
    const bodies = Composite.allBodies(engine.world);
    if (bodies.length > 50) {
        bodies.forEach(b => {
            if (!b.isStatic) Body.applyForce(b, b.position, {
                x: (Math.random() - 0.5) * 0.002,
                y: (Math.random() - 0.5) * -0.005
            });
        });
    }
    const now = Date.now();
    bodies.forEach(b => {
        if (b.birthTime && now - b.birthTime > 20000) {
            Composite.remove(engine.world, b);
            totalVitamins -= b.vitaminValue || 0;
            if (totalVitamins < 0) totalVitamins = 0;
            counter.textContent = `Efficiency: ${totalVitamins}`;
            const s = sounds[Math.floor(Math.random() * sounds.length)];
            s.currentTime = 0;
            s.play();
        }
    });
});