document.addEventListener('DOMContentLoaded', function() {
    const comparisonRows = document.querySelectorAll('.comparison-row:not(.header)');
    
    comparisonRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f9f9f9';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    const editionCards = document.querySelectorAll('.edition-card');
    
    editionCards.forEach(card => {
        card.addEventListener('click', function() {
            const isBedrock = this.classList.contains('bedrock');
            const edition = isBedrock ? 'Bedrock Edition' : 'Java Edition';
            
            showModal(edition, isBedrock);
        });
    });
    
    function showModal(edition, isBedrock) {
        const existingModal = document.querySelector('.modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${edition}の特徴</h2>
                ${isBedrock ? getBedrockDetails() : getJavaDetails()}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.style.cssText = `
            display: block;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background-color: #fefefe;
            margin: 10% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 600px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        const closeBtn = modal.querySelector('.close');
        closeBtn.style.cssText = `
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        `;
        
        closeBtn.onclick = function() {
            modal.remove();
        };
        
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.remove();
            }
        };
    }
    
    function getBedrockDetails() {
        return `
            <div class="edition-details">
                <h3>主な利点</h3>
                <ul>
                    <li><strong>クロスプラットフォーム:</strong> PC、モバイル、コンソール間でのプレイが可能</li>
                    <li><strong>パフォーマンス:</strong> C++で書かれており、低スペックデバイスでも快適</li>
                    <li><strong>マーケットプレイス:</strong> 公式のスキン、テクスチャ、ワールドを購入可能</li>
                    <li><strong>Realms Plus:</strong> 公式サーバーサービスが利用可能</li>
                </ul>
                
                <h3>注意点</h3>
                <ul>
                    <li>Java版のような高度なMODは使用不可</li>
                    <li>レッドストーンの挙動が一部異なる</li>
                    <li>一部のテクニカルな機能が制限されている</li>
                </ul>
                
                <h3>こんな人におすすめ</h3>
                <p>カジュアルにマルチプレイを楽しみたい方、様々なデバイスでプレイしたい方</p>
            </div>
        `;
    }
    
    function getJavaDetails() {
        return `
            <div class="edition-details">
                <h3>主な利点</h3>
                <ul>
                    <li><strong>MOD対応:</strong> Forge、Fabricなどを使った無限のカスタマイズ</li>
                    <li><strong>サーバー:</strong> 自由度の高いカスタムサーバーの構築</li>
                    <li><strong>スナップショット:</strong> 最新機能をいち早く体験</li>
                    <li><strong>コマンド:</strong> より高度なコマンドとデータパック</li>
                </ul>
                
                <h3>注意点</h3>
                <ul>
                    <li>PCのみ対応（Windows、Mac、Linux）</li>
                    <li>他のプラットフォームとのクロスプレイ不可</li>
                    <li>より高いPCスペックが必要</li>
                </ul>
                
                <h3>こんな人におすすめ</h3>
                <p>MODを使いたい方、テクニカルなプレイを楽しみたい方、コミュニティサーバーで遊びたい方</p>
            </div>
        `;
    }
    
    const smoothScroll = function(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
    
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.edition-card, .rec-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    animateOnScroll();
});