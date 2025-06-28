class TakuoDashGame {
    constructor() {
        this.score = 0;
        this.time = 0;
        this.distance = 0;
        this.goalDistance = 2000; // ゴールまでの距離を2倍に
        this.isPlaying = false;
        this.isJumping = false;
        this.isSliding = false;
        this.gameSpeed = 10; // さらに初期速度を上げる
        this.baseSpeed = 10; // 基本速度を保存
        this.obstacles = [];
        this.items = [];
        this.bestTime = localStorage.getItem('takuoBestTime') || null;
        this.isSlowedDown = false;
        
        this.initElements();
        this.setupEventListeners();
        this.updateBestTime();
    }

    initElements() {
        this.startScreen = document.getElementById('start-screen');
        this.gameArea = document.getElementById('game-area');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.player = document.getElementById('player');
        this.obstaclesContainer = document.getElementById('obstacles');
        this.itemsContainer = document.getElementById('items');
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.distanceElement = document.getElementById('distance');
        this.goalDistanceElement = document.getElementById('goal-distance');
        if (this.goalDistanceElement) {
            this.goalDistanceElement.textContent = this.goalDistance;
        }
        this.bestTimeElement = document.getElementById('best-time');
        this.finalTimeElement = document.getElementById('final-time');
        this.finalScoreElement = document.getElementById('final-score');
        this.gameOverMessage = document.getElementById('game-over-message');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.goalElement = document.getElementById('goal');
    }

    setupEventListeners() {
        document.getElementById('start-button').addEventListener('click', () => this.startGame());
        document.getElementById('restart-button').addEventListener('click', () => this.startGame());
        
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        if (!this.isPlaying) {
            if (e.code === 'Space') {
                this.startGame();
            }
            return;
        }

        if ((e.code === 'ArrowUp' || e.code === 'KeyW') && !this.isJumping && !this.isSliding) {
            this.jump();
        } else if ((e.code === 'ArrowDown' || e.code === 'KeyS') && !this.isJumping && !this.isSliding) {
            this.slide();
        }
    }

    handleKeyUp(e) {
        if ((e.code === 'ArrowDown' || e.code === 'KeyS') && this.isSliding) {
            this.stopSlide();
        }
    }

    startGame() {
        this.score = 0;
        this.time = 0;
        this.distance = 0;
        this.gameSpeed = 10; // さらに初期速度を上げる
        this.baseSpeed = 10;
        this.obstacles = [];
        this.items = [];
        this.isPlaying = true;
        this.isSlowedDown = false;
        this.goalApproachingEffectStarted = false;
        this.comboCount = 0;
        this.lastItemTime = 0;
        
        this.startScreen.style.display = 'none';
        this.gameOverScreen.style.display = 'none';
        this.gameArea.style.display = 'block';
        
        this.obstaclesContainer.innerHTML = '';
        this.itemsContainer.innerHTML = '';
        
        // ゴールを初期位置に戻す
        this.goalElement.style.display = 'none';
        this.goalElement.style.right = '-200px';
        
        this.updateScore();
        this.startTime = Date.now();
        this.gameLoop();
        this.spawnLoop();
        this.startBackgroundEffects();
    }

    jump() {
        this.isJumping = true;
        this.player.classList.add('jumping');
        
        setTimeout(() => {
            this.isJumping = false;
            this.player.classList.remove('jumping');
        }, 600);
    }

    slide() {
        this.isSliding = true;
        this.player.classList.add('sliding');
    }

    stopSlide() {
        this.isSliding = false;
        this.player.classList.remove('sliding');
    }

    gameLoop() {
        if (!this.isPlaying) return;

        this.updateTime();
        this.updateDistance();
        this.moveObstacles();
        this.moveItems();
        this.moveGoal();
        this.checkCollisions();
        this.updateGameSpeed();
        this.checkGoal();

        requestAnimationFrame(() => this.gameLoop());
    }

    spawnLoop() {
        if (!this.isPlaying) return;

        // 障害物の出現頻度を大幅に上げる
        if (Math.random() < 0.06) {
            this.spawnObstacle();
        }

        // アイテムの出現頻度も大幅に上げる
        if (Math.random() < 0.04) {
            this.spawnItem();
        }

        // 複数の障害物を同時に出現させる頻度を上げる
        if (Math.random() < 0.02) {
            setTimeout(() => this.spawnObstacle(), 200);
            if (Math.random() < 0.5) {
                setTimeout(() => this.spawnObstacle(), 400);
            }
        }

        // たまにアイテムも連続で出現
        if (Math.random() < 0.015) {
            setTimeout(() => this.spawnItem(), 300);
        }

        // スピードが速いときはさらに頻繁に生成
        const spawnBoost = this.gameSpeed > 20 ? 0.02 : 0;
        if (Math.random() < spawnBoost) {
            this.spawnObstacle();
        }

        setTimeout(() => this.spawnLoop(), 80); // ループ間隔も短縮
    }

    spawnObstacle() {
        const types = ['student', 'desk', 'cone', 'principal', 'broom', 'puddle'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const obstacle = document.createElement('div');
        obstacle.className = `obstacle obstacle-${type}`;
        
        // 障害物の初期位置にランダム性を追加
        const initialPosition = -100 - Math.random() * 50;
        obstacle.style.right = initialPosition + 'px';
        
        if (type === 'student') {
            // 生徒の追加要素を作成
            const hair = document.createElement('div');
            hair.className = 'student-hair';
            obstacle.appendChild(hair);
            
            const arm = document.createElement('div');
            arm.className = 'student-arm';
            obstacle.appendChild(arm);
        } else if (type === 'cone') {
            // コーンの反射板を追加
            const stripe = document.createElement('div');
            stripe.className = 'cone-stripe';
            obstacle.appendChild(stripe);
        } else if (type === 'principal') {
            // 校長先生の追加要素
            const glasses = document.createElement('div');
            glasses.className = 'principal-glasses';
            obstacle.appendChild(glasses);
            
            const tie = document.createElement('div');
            tie.className = 'principal-tie';
            obstacle.appendChild(tie);
        } else if (type === 'broom') {
            // ほうきの柄を追加
            const handle = document.createElement('div');
            handle.className = 'broom-handle';
            obstacle.appendChild(handle);
        }
        
        this.obstaclesContainer.appendChild(obstacle);
        this.obstacles.push({
            element: obstacle,
            type: type,
            position: initialPosition
        });
    }

    spawnItem() {
        const types = ['coffee', 'paper', 'energy', 'coin', 'clock'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const item = document.createElement('div');
        item.className = `item item-${type}`;
        
        // アイテムの初期位置にもランダム性を追加
        const initialPosition = -50 - Math.random() * 30;
        item.style.right = initialPosition + 'px';
        
        if (type === 'coffee') {
            item.textContent = '☕';
        } else if (type === 'paper') {
            item.textContent = '📝';
        } else if (type === 'energy') {
            item.textContent = '⚡';
        } else if (type === 'coin') {
            item.textContent = '💰';
        } else if (type === 'clock') {
            item.textContent = '⏰';
        }
        
        this.itemsContainer.appendChild(item);
        this.items.push({
            element: item,
            type: type,
            position: initialPosition
        });
    }

    moveObstacles() {
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.position += this.gameSpeed;
            obstacle.element.style.right = obstacle.position + 'px';
            
            if (obstacle.position > 850) {
                obstacle.element.remove();
                return false;
            }
            return true;
        });
    }

    moveItems() {
        this.items = this.items.filter(item => {
            item.position += this.gameSpeed;
            item.element.style.right = item.position + 'px';
            
            if (item.position > 850) {
                item.element.remove();
                return false;
            }
            return true;
        });
    }

    checkCollisions() {
        const playerRect = this.player.getBoundingClientRect();
        
        // 障害物との衝突チェック
        for (const obstacle of this.obstacles) {
            const obstacleRect = obstacle.element.getBoundingClientRect();
            
            if (this.isColliding(playerRect, obstacleRect)) {
                // スライディング中は低い障害物を避けられる
                if (this.isSliding && (obstacle.type === 'cone' || obstacle.type === 'desk')) {
                    continue;
                }
                // ジャンプ中は地面の障害物を避けられる
                if (this.isJumping && obstacle.type !== 'student') {
                    continue;
                }
                
                // 障害物に当たった場合、スピードダウンして続行
                this.hitObstacle(obstacle);
                obstacle.element.remove();
                this.obstacles = this.obstacles.filter(o => o !== obstacle);
                break;
            }
        }
        
        // アイテムとの衝突チェック
        this.items = this.items.filter(item => {
            const itemRect = item.element.getBoundingClientRect();
            
            if (this.isColliding(playerRect, itemRect)) {
                // コンボシステム
                const currentTime = Date.now();
                if (currentTime - this.lastItemTime < 2000) {
                    this.comboCount++;
                } else {
                    this.comboCount = 1;
                }
                this.lastItemTime = currentTime;

                let baseScore = 0;
                let effectText = '';
                let effectColor = '#FFD700';

                if (item.type === 'coffee') {
                    baseScore = 100;
                    this.gameSpeed += 3.0; // コーヒーで超大幅加速！
                    this.showSpeedBoost();
                    this.addSuperSpeedEffect();
                    effectText = 'COFFEE BOOST!';
                } else if (item.type === 'paper') {
                    baseScore = 50;
                    effectText = 'PAPERWORK!';
                } else if (item.type === 'energy') {
                    baseScore = 150;
                    this.gameSpeed += 5.0; // エナジードリンクで超加速！
                    this.showEffect('HYPER SPEED!', '#FFD700');
                    this.addSuperSpeedEffect();
                    effectText = 'ENERGY DRINK!';
                    effectColor = '#FF69B4';
                } else if (item.type === 'coin') {
                    baseScore = 200;
                    effectText = 'MONEY!';
                    effectColor = '#FFD700';
                } else if (item.type === 'clock') {
                    baseScore = 75;
                    // 時間ボーナス（速度を一時的に通常に戻す）
                    this.gameSpeed = this.baseSpeed;
                    this.isSlowedDown = false;
                    effectText = 'TIME BONUS!';
                    effectColor = '#00CED1';
                }

                // コンボボーナス適用
                const comboMultiplier = 1 + (this.comboCount - 1) * 0.5;
                const finalScore = Math.floor(baseScore * comboMultiplier);
                this.score += finalScore;

                // コンボエフェクト表示
                if (this.comboCount > 1) {
                    this.showComboEffect(this.comboCount, finalScore);
                } else {
                    this.showFloatingScore(finalScore, effectText, effectColor, item.element);
                }
                
                this.updateScore();
                item.element.remove();
                return false;
            }
            return true;
        });
    }

    isColliding(rect1, rect2) {
        return rect1.left < rect2.right &&
               rect1.right > rect2.left &&
               rect1.top < rect2.bottom &&
               rect1.bottom > rect2.top;
    }

    updateTime() {
        this.time = (Date.now() - this.startTime) / 1000;
        this.timeElement.textContent = this.time.toFixed(1);
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    updateGameSpeed() {
        if (this.isSlowedDown) return;
        
        // 時間経過で徐々にスピードアップ
        if (this.time > 5) {
            this.baseSpeed = 10 + (this.time - 5) * 0.3; // 激速スピードアップ
            this.gameSpeed = this.baseSpeed;
        }
        // 最大速度制限
        if (this.gameSpeed > 30) {
            this.gameSpeed = 30;
            this.baseSpeed = 30;
        }
        
        // スピードに応じた視覚効果を更新
        this.updateSpeedEffects();
    }

    updateSpeedEffects() {
        // 背景色をスピードに応じて変化
        const speedRatio = this.gameSpeed / 30;
        const hue = 200 + (speedRatio * 60); // 青から紫に変化
        const saturation = 20 + (speedRatio * 30);
        const lightness = 70 + (speedRatio * 10);
        
        this.gameArea.style.background = `linear-gradient(to bottom, 
            hsl(${hue}, ${saturation}%, ${lightness}%) 0%, 
            hsl(${hue + 20}, ${saturation + 10}%, ${lightness - 10}%) 100%)`;
        
        // 高速時の画面エフェクト
        if (this.gameSpeed > 20) {
            this.gameArea.classList.add('hyper-speed');
            if (this.gameSpeed > 25) {
                this.gameArea.classList.add('ultra-speed');
            }
        } else {
            this.gameArea.classList.remove('hyper-speed', 'ultra-speed');
        }
    }

    updateDistance() {
        this.distance += this.gameSpeed * 0.1; // 速度に応じて距離を増加
        this.distanceElement.textContent = Math.floor(this.distance);
        
        // プログレスバーの更新
        const progress = Math.min((this.distance / this.goalDistance) * 100, 100);
        this.progressFill.style.width = progress + '%';
        this.progressText.textContent = Math.floor(progress) + '%';
        
        // ゴールが近づいたら表示と特別エフェクト
        if (this.distance >= this.goalDistance - 300) {
            this.goalElement.style.display = 'flex';
            
            // ゴール接近エフェクトを追加
            if (this.distance >= this.goalDistance - 100 && !this.goalApproachingEffectStarted) {
                this.startGoalApproachingEffect();
                this.goalApproachingEffectStarted = true;
            }
        }
    }

    moveGoal() {
        if (this.goalElement.style.display === 'flex') {
            const goalPosition = (this.goalDistance - this.distance) * 10;
            this.goalElement.style.right = -200 + goalPosition + 'px';
        }
    }

    checkGoal() {
        if (this.distance >= this.goalDistance) {
            this.goalReached();
        }
    }

    hitObstacle(obstacle) {
        // スピードを半分に
        this.gameSpeed = this.baseSpeed * 0.3;
        this.isSlowedDown = true;
        
        // ダメージエフェクト
        this.showHitEffect();
        
        // スコア減少
        this.score = Math.max(0, this.score - 50);
        this.updateScore();
        
        // 2秒後に通常速度に回復
        setTimeout(() => {
            this.gameSpeed = this.baseSpeed;
            this.isSlowedDown = false;
        }, 2000);
    }

    showHitEffect() {
        const hit = document.createElement('div');
        hit.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 0, 0, 0.3);
            animation: hitFlash 0.5s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        this.gameArea.appendChild(hit);

        setTimeout(() => hit.remove(), 500);
    }

    showSpeedBoost() {
        this.showEffect('SPEED UP!', '#FFD700');
    }

    showEffect(text, color) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            color: ${color};
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            animation: boostEffect 1s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        effect.textContent = text;
        this.gameArea.appendChild(effect);

        setTimeout(() => effect.remove(), 1000);
    }

    addSuperSpeedEffect() {
        // 画面全体にスピードエフェクトを追加
        this.gameArea.classList.add('super-speed');
        
        // 追加の視覚効果
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const line = document.createElement('div');
                line.style.cssText = `
                    position: absolute;
                    top: ${Math.random() * 100}%;
                    left: 100%;
                    width: ${100 + Math.random() * 200}px;
                    height: 2px;
                    background: linear-gradient(to left, transparent, rgba(255,255,100,0.8), transparent);
                    animation: superSpeedLine 0.3s linear;
                    pointer-events: none;
                    z-index: 999;
                `;
                this.gameArea.appendChild(line);
                setTimeout(() => line.remove(), 300);
            }, i * 50);
        }
        
        setTimeout(() => {
            this.gameArea.classList.remove('super-speed');
        }, 2000);
    }

    updateBestTime() {
        if (this.bestTime) {
            this.bestTimeElement.textContent = parseFloat(this.bestTime).toFixed(1) + '秒';
        } else {
            this.bestTimeElement.textContent = '-';
        }
    }

    goalReached() {
        // 大派手な祝福エフェクトを追加
        this.showVictoryFireworks();
        
        setTimeout(() => {
            this.isPlaying = false;
            this.gameArea.style.display = 'none';
            this.gameOverScreen.style.display = 'block';
            
            this.finalTimeElement.textContent = this.time.toFixed(1);
            this.finalScoreElement.textContent = this.score;
            
            // ゴール達成メッセージ
            this.gameOverMessage.textContent = '🎉✨ 無事にたくお先生の家に到着しました！ ✨🎉';
            this.gameOverMessage.style.color = '#27ae60';
            this.gameOverMessage.style.textShadow = '0 0 10px rgba(39, 174, 96, 0.8)';
            
            // ベストタイムの更新
            if (!this.bestTime || this.time < parseFloat(this.bestTime)) {
                this.bestTime = this.time.toFixed(1);
                localStorage.setItem('takuoBestTime', this.bestTime);
                this.updateBestTime();
                this.gameOverMessage.textContent += ' 🏆 新記録達成！🏆';
            }
        }, 2000);
    }

    showVictoryFireworks() {
        // 画面全体に虹色フラッシュ効果
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, 
                rgba(255,0,255,0.3) 0%, 
                rgba(0,255,255,0.3) 25%, 
                rgba(255,255,0,0.3) 50%, 
                rgba(255,0,0,0.3) 75%, 
                rgba(0,255,0,0.3) 100%);
            animation: victoryFlash 2s ease-in-out;
            pointer-events: none;
            z-index: 2000;
        `;
        this.gameArea.appendChild(flash);

        // 大量の花火パーティクルを生成
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createFireworkParticle();
            }, i * 100);
        }

        // 紙吹雪エフェクト
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfetti();
            }, i * 50);
        }

        // 大きな祝福メッセージ
        const victoryText = document.createElement('div');
        victoryText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            font-weight: bold;
            color: #FFD700;
            text-shadow: 
                0 0 20px rgba(255, 215, 0, 1),
                0 0 40px rgba(255, 105, 180, 0.8),
                0 0 60px rgba(0, 191, 255, 0.6);
            animation: victoryText 2s ease-out;
            pointer-events: none;
            z-index: 2001;
            text-align: center;
        `;
        victoryText.innerHTML = '🏠✨ GOAL! ✨🏠<br>🎉 おかえりなさい！🎉';
        this.gameArea.appendChild(victoryText);

        setTimeout(() => {
            flash.remove();
            victoryText.remove();
        }, 2000);
    }

    createFireworkParticle() {
        const particle = document.createElement('div');
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const colors = ['#FF69B4', '#00CED1', '#FFD700', '#FF6347', '#98FB98', '#DDA0DD'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: 8px;
            height: 8px;
            background: ${color};
            border-radius: 50%;
            animation: firework 1.5s ease-out forwards;
            pointer-events: none;
            z-index: 1999;
            box-shadow: 0 0 10px ${color};
        `;
        this.gameArea.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
    }

    createConfetti() {
        const confetti = document.createElement('div');
        const x = Math.random() * 100;
        const emojis = ['🎉', '🎊', '✨', '🌟', '💫', '⭐', '🎆', '🎇', '🏆', '👏'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        confetti.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: -50px;
            font-size: ${20 + Math.random() * 20}px;
            animation: confetti-fall 3s linear forwards;
            pointer-events: none;
            z-index: 1998;
        `;
        confetti.textContent = emoji;
        this.gameArea.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }

    startGoalApproachingEffect() {
        // 画面の縁が光る効果
        this.gameArea.classList.add('goal-approaching');
        
        // 音楽的な視覚効果
        this.showEffect('🏠 もうすぐ家！ 🏠', '#FFD700');
        
        // キラキラエフェクトを画面全体に
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createApproachingSparkle();
            }, i * 200);
        }
    }

    createApproachingSparkle() {
        const sparkle = document.createElement('div');
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const sparkles = ['✨', '⭐', '🌟', '💫'];
        const sparkleEmoji = sparkles[Math.floor(Math.random() * sparkles.length)];
        
        sparkle.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            font-size: ${15 + Math.random() * 15}px;
            animation: approaching-sparkle 2s ease-out forwards;
            pointer-events: none;
            z-index: 1500;
        `;
        sparkle.textContent = sparkleEmoji;
        this.gameArea.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
    }

    startBackgroundEffects() {
        // 常時背景パーティクル生成
        this.backgroundParticleLoop();
    }

    backgroundParticleLoop() {
        if (!this.isPlaying) return;

        // スピードに応じてパーティクル密度を調整
        const particleDensity = Math.min(this.gameSpeed / 10, 3);
        
        if (Math.random() < 0.3 * particleDensity) {
            this.createBackgroundParticle();
        }

        // 空に雲や鳥を追加
        if (Math.random() < 0.02) {
            this.createSkyElement();
        }

        // スピードライン効果
        if (this.gameSpeed > 15 && Math.random() < 0.4) {
            this.createSpeedLine();
        }

        setTimeout(() => this.backgroundParticleLoop(), 100);
    }

    createBackgroundParticle() {
        const particle = document.createElement('div');
        const y = Math.random() * 60; // 上部60%に配置
        const particles = ['✨', '⭐', '💫', '🌟', '🔆', '💎'];
        const emoji = particles[Math.floor(Math.random() * particles.length)];
        
        particle.style.cssText = `
            position: absolute;
            right: -20px;
            top: ${y}%;
            font-size: ${8 + Math.random() * 12}px;
            animation: background-particle-move ${2 + Math.random() * 2}s linear forwards;
            pointer-events: none;
            z-index: 10;
            opacity: ${0.3 + Math.random() * 0.4};
        `;
        particle.textContent = emoji;
        this.gameArea.appendChild(particle);
        
        setTimeout(() => particle.remove(), 4000);
    }

    createSkyElement() {
        const element = document.createElement('div');
        const y = Math.random() * 40; // 上部40%（空の部分）
        const skyElements = ['☁️', '🌤️', '🦅', '✈️', '🎈'];
        const emoji = skyElements[Math.floor(Math.random() * skyElements.length)];
        
        element.style.cssText = `
            position: absolute;
            right: -30px;
            top: ${y}%;
            font-size: ${15 + Math.random() * 20}px;
            animation: sky-element-move ${4 + Math.random() * 3}s linear forwards;
            pointer-events: none;
            z-index: 5;
            opacity: 0.7;
        `;
        element.textContent = emoji;
        this.gameArea.appendChild(element);
        
        setTimeout(() => element.remove(), 7000);
    }

    createSpeedLine() {
        const line = document.createElement('div');
        const y = 20 + Math.random() * 60;
        const width = 50 + Math.random() * 100;
        
        line.style.cssText = `
            position: absolute;
            right: -${width}px;
            top: ${y}%;
            width: ${width}px;
            height: ${1 + Math.random() * 2}px;
            background: linear-gradient(to left, 
                transparent 0%, 
                rgba(255, 255, 255, 0.8) 50%, 
                transparent 100%);
            animation: speed-line-move 0.3s linear forwards;
            pointer-events: none;
            z-index: 8;
        `;
        this.gameArea.appendChild(line);
        
        setTimeout(() => line.remove(), 300);
    }

    showFloatingScore(score, text, color, element) {
        const rect = element.getBoundingClientRect();
        const gameRect = this.gameArea.getBoundingClientRect();
        
        const floatingScore = document.createElement('div');
        floatingScore.style.cssText = `
            position: absolute;
            left: ${rect.left - gameRect.left}px;
            top: ${rect.top - gameRect.top}px;
            font-size: 24px;
            font-weight: bold;
            color: ${color};
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            animation: floating-score 2s ease-out forwards;
            pointer-events: none;
            z-index: 1500;
        `;
        floatingScore.innerHTML = `+${score}<br><small>${text}</small>`;
        this.gameArea.appendChild(floatingScore);
        
        setTimeout(() => floatingScore.remove(), 2000);
    }

    showComboEffect(comboCount, score) {
        const comboEffect = document.createElement('div');
        const comboColor = comboCount >= 5 ? '#FF1493' : comboCount >= 3 ? '#FF69B4' : '#FFD700';
        
        comboEffect.style.cssText = `
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: ${2 + comboCount * 0.3}rem;
            font-weight: bold;
            color: ${comboColor};
            text-shadow: 
                0 0 10px ${comboColor},
                0 0 20px ${comboColor},
                0 0 30px ${comboColor};
            animation: combo-effect 1.5s ease-out forwards;
            pointer-events: none;
            z-index: 1600;
            text-align: center;
        `;
        
        let comboText = '';
        if (comboCount >= 10) comboText = '🔥 LEGENDARY COMBO! 🔥';
        else if (comboCount >= 7) comboText = '⚡ INCREDIBLE! ⚡';
        else if (comboCount >= 5) comboText = '💫 AMAZING! 💫';
        else if (comboCount >= 3) comboText = '✨ GREAT! ✨';
        else comboText = '👍 COMBO! 👍';
        
        comboEffect.innerHTML = `
            ${comboText}<br>
            <span style="font-size: 0.7em;">x${comboCount} COMBO</span><br>
            <span style="font-size: 0.6em; color: #FFD700;">+${score} POINTS!</span>
        `;
        
        this.gameArea.appendChild(comboEffect);
        
        // コンボ数に応じて画面エフェクト
        if (comboCount >= 5) {
            this.addComboScreenEffect();
        }
        
        setTimeout(() => comboEffect.remove(), 1500);
    }

    addComboScreenEffect() {
        const screenEffect = document.createElement('div');
        screenEffect.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, 
                rgba(255, 20, 147, 0.3) 0%, 
                rgba(255, 105, 180, 0.2) 50%, 
                transparent 100%);
            animation: combo-screen-flash 1s ease-out;
            pointer-events: none;
            z-index: 1550;
        `;
        this.gameArea.appendChild(screenEffect);
        
        setTimeout(() => screenEffect.remove(), 1000);
    }

    gameOver() {
        this.isPlaying = false;
        this.gameArea.style.display = 'none';
        this.gameOverScreen.style.display = 'block';
        
        this.finalTimeElement.textContent = this.time.toFixed(1);
        this.finalScoreElement.textContent = this.score;
        
        // メッセージの選択
        const messages = [
            '生徒に捕まってしまいました！',
            '障害物にぶつかってしまいました！',
            '今日も残業確定です...',
            'もう少しで家に着けたのに！'
        ];
        this.gameOverMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
        this.gameOverMessage.style.color = '#e74c3c';
        
        // ベストタイムの更新
        if (!this.bestTime || this.time > parseFloat(this.bestTime)) {
            this.bestTime = this.time.toFixed(1);
            localStorage.setItem('takuoBestTime', this.bestTime);
            this.updateBestTime();
            this.gameOverMessage.textContent += ' 新記録達成！';
        }
    }
}

// ゲームの初期化
document.addEventListener('DOMContentLoaded', () => {
    const game = new TakuoDashGame();
    console.log('たくお先生の帰宅ダッシュゲームを初期化しました！');
});