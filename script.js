// 模拟宝藏地图API
class TreasureMap {
    static getInitialClue() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("在古老的图书馆里找到了第一个线索...");
            }, 1000);
        });
    }

    static decodeAncientScript(clue) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!clue) {
                    reject("没有线索可以解码!");
                }
                resolve("解码成功!宝藏在一座古老的神庙中...");
            }, 1500);
        });
    }

    static searchTemple(location) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                if (random < 0.5) {
                    reject("糟糕!遇到了神庙守卫!");
                }
                resolve("找到了一个神秘的箱子...");
            }, 2000);
        });
    }

    static openTreasureBox() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("恭喜!你找到了传说中的宝藏!");
            }, 1000);
        });
    }

    // 新增：与神秘老人交谈获取额外线索
    static talkToMysteriousOldMan() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("从神秘老人那里得知了一个隐藏通道的秘密线索...");
            }, 1200);
        });
    }

    // 新增：当探索隐藏通道时主角可能会受伤的情况
    static exploreHiddenPassage() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                if (random < 0.3) {
                    reject("哎呀!在隐藏通道里遇到了陷阱，主角受伤了!");
                } else if (random < 0.6) {
                    resolve("成功通过隐藏通道，不过主角受了点小伤，离宝藏更近了...");
                } else {
                    resolve("顺利通过隐藏通道，离宝藏更近了...");
                }
            }, 1800);
        });
    }
}

const canvas = document.getElementById('treasureCanvas');
const ctx = canvas.getContext('2d');
const statusMessage = document.getElementById('statusMessage');
const restartButton = document.getElementById('restartButton');

let currentStep = 0;
let stepTexts = [];
let stepRectangles = [];

// 用于在动画过程中显示不同的提示信息
let stepMessages = [
    "主角正在寻找初始线索...",
    "主角与神秘老人交谈获取额外线索...",
    "主角解码古代文字，寻找宝藏位置...",
    "主角探索隐藏通道，小心陷阱...",
    "主角在古老神庙中搜索神秘箱子...",
    "主角打开宝藏箱，看看有什么惊喜！"
];

// 主角相关属性
let hero = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    speed: 5
};

function drawHero() {
    ctx.beginPath();
    ctx.rect(hero.x, hero.y, hero.width, hero.height);
    ctx.fillStyle = 'green';
    ctx.fill();
}

function moveHero(event) {
    switch (event.keyCode) {
        case 37: // 左箭头键
            hero.x -= hero.speed;
            break;
        case 38: // 上箭头键
            hero.y -= hero.speed;
            break;
        case 39: // 右箭头键
            hero.x += hero.speed;
            break;
        case 40: // 下箭头键
            hero.y += hero.speed;
            break;
    }

    // 限制主角在画布内移动
    if (hero.x < 0) {
        hero.x = 0;
    } else if (hero.x > canvas.width - hero.width) {
    hero.x = canvas.width - hero.width;
    }

    if (hero.y < 0) {
        hero.y = 0;
    } else if (hero.y > canvas.height - hero.height) {
        hero.y = canvas.height - hero.height;
    }

    drawTreasureHuntAnimation();
}

async function drawTreasureHuntAnimation() {
    try {
        // 获取初始线索
        statusMessage.textContent = stepMessages[0];
        let initialClue = await TreasureMap.getInitialClue();
        stepTexts.push(initialClue);
        drawStep(0, initialClue);

        // 与神秘老人交谈获取额外线索
        statusMessage.textContent = stepMessages[1];
        let extraClue = await TreasureMap.talkToMysteriousOldMan();
        stepTexts.push(extraClue);
        drawStep(1, extraClue);

        // 解码古代文字
        statusMessage.textContent = stepMessages[2];
        let decodedLocation = await TreasureMap.decodeAncientScript(initialClue);
        stepTexts.push(decodedLocation);
        drawStep(2, decodedLocation);

        // 探索隐藏通道
        statusMessage.textContent = stepMessages[3];
        let passageResult = await TreasureMap.exploreHiddenPassage();
        stepTexts.push(passageResult);
        drawStep(3, passageResult);

        // 在神庙中搜索
        statusMessage.textContent = stepMessages[4];
        let box = await TreasureMap.searchTemple(decodedLocation);
        stepTexts.push(box);
        drawStep(4, box);

        // 打开宝藏箱
        statusMessage.textContent = stepMessages[5];
        let treasure = await TreasureMap.openTreasureBox();
        stepTexts.push(treasure);
        drawStep(5, treasure);

        // 显示重新开始按钮
        restartButton.style.display = 'block';
    } catch (error) {
        statusMessage.textContent = `任务失败: ${error}`;
        restartButton.style.display = 'block';
    }
}

function drawStep(stepIndex, text) {
    const stepWidth = canvas.width / 6;
    const stepHeight = canvas.height / 10;
    const x = stepIndex * stepWidth;
    const y = canvas.height - stepHeight;

    // 绘制矩形框
    ctx.beginPath();
    ctx.rect(x, y, stepWidth, stepHeight);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // 绘制文本
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(text, x + 10, y + 20);

    stepRectangles.push({ x, y, width: stepWidth, height: stepHeight });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stepRectangles.forEach((rect, index) => {
        if (index <= currentStep) {
            ctx.beginPath();
            ctx.rect(rect.x, rect.y, rect.width, rect.height);
            ctx.fillStyle = 'lightblue';
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            ctx.fillText(stepTexts[index], rect.x + 10, rect.y + 20);
        }
    });

    drawHero();

    currentStep++;
    if (currentStep < stepRectangles.length) {
        requestAnimationFrame(animate);
    }
}

function restartAnimation() {
    currentStep = 0;
    stepTexts = [];
    stepRectangles = [];
    statusMessage.textContent = '';
    restartButton.style.display = 'none';
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;
    drawTreasureHuntAnimation().then(() => {
        animate();
    });
}

document.addEventListener('keydown', moveHero);
restartButton.addEventListener('click', restartAnimation);
drawTreasureHuntAnimation().then(() => {
    animate();
});