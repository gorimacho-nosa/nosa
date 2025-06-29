// 実行例のコード
const examples = {
    1: function() {
        const output = [];
        
        function greet(name, callback) {
            output.push('こんにちは、' + name + 'さん！');
            callback();
        }
        
        function afterGreeting() {
            output.push('挨拶が終わりました！');
        }
        
        greet('太郎', afterGreeting);
        return output.join('\n');
    },
    
    2: function() {
        const output = [];
        
        function calculate(num1, num2, callback) {
            const result = num1 + num2;
            callback(result);
        }
        
        calculate(5, 3, function(result) {
            output.push('計算結果は: ' + result);
        });
        
        return output.join('\n');
    },
    
    3: function() {
        const output = [];
        output.push('1. 処理開始');
        
        setTimeout(function() {
            const outputElement = document.getElementById('output-3');
            outputElement.textContent += '\n2. 3秒後に実行されました！';
        }, 3000);
        
        output.push('3. この行は先に実行されます');
        return output.join('\n');
    },
    
    4: function() {
        const output = [];
        const numbers = [1, 2, 3, 4, 5];
        
        const doubled = numbers.map(function(num) {
            return num * 2;
        });
        output.push('2倍: [' + doubled.join(', ') + ']');
        
        const evens = numbers.filter(function(num) {
            return num % 2 === 0;
        });
        output.push('偶数: [' + evens.join(', ') + ']');
        
        numbers.forEach(function(num, index) {
            output.push(index + '番目: ' + num);
        });
        
        return output.join('\n');
    }
};

// 実行ボタンのイベントリスナー
document.addEventListener('DOMContentLoaded', function() {
    // コード実行ボタン
    const runButtons = document.querySelectorAll('.run-code');
    runButtons.forEach(button => {
        button.addEventListener('click', function() {
            const exampleNumber = this.getAttribute('data-example');
            const outputElement = document.getElementById('output-' + exampleNumber);
            
            outputElement.classList.add('show');
            outputElement.textContent = '実行中...\n';
            
            setTimeout(() => {
                const result = examples[exampleNumber]();
                outputElement.textContent = result;
            }, 100);
        });
    });
    
    // イベントリスナーの例
    let clickCount = 0;
    const demoButton = document.getElementById('demo-button');
    const clickCountElement = document.getElementById('click-count');
    
    if (demoButton) {
        demoButton.addEventListener('click', function() {
            clickCount++;
            clickCountElement.textContent = 'クリック回数: ' + clickCount;
        });
    }
    
    // インタラクティブデモ
    const operationType = document.getElementById('operation-type');
    const demoInput = document.getElementById('demo-input');
    const runDemo = document.getElementById('run-demo');
    const demoCodeDisplay = document.getElementById('demo-code-display');
    const demoOutput = document.getElementById('demo-output');
    
    function updateDemoCode() {
        const type = operationType.value;
        const value = demoInput.value;
        
        let code = '';
        
        switch(type) {
            case 'math':
                code = `// 数値を処理するコールバック
function processNumber(num, callback) {
    const result = num * num;
    callback(result);
}

processNumber(${value}, function(result) {
    console.log('${value}の二乗は: ' + result);
});`;
                break;
                
            case 'string':
                code = `// 文字列を処理するコールバック
function processString(str, callback) {
    const upperCase = str.toUpperCase();
    const length = str.length;
    callback(upperCase, length);
}

processString('${value}', function(upper, len) {
    console.log('大文字: ' + upper);
    console.log('文字数: ' + len);
});`;
                break;
                
            case 'timer':
                code = `// タイマーを使ったコールバック
console.log('処理開始...');

setTimeout(function() {
    console.log('${value}秒後に実行されました！');
}, ${value}000);

console.log('この行は先に実行されます');`;
                break;
        }
        
        demoCodeDisplay.textContent = code;
    }
    
    if (operationType && demoInput && runDemo) {
        operationType.addEventListener('change', updateDemoCode);
        demoInput.addEventListener('input', updateDemoCode);
        
        runDemo.addEventListener('click', function() {
            const type = operationType.value;
            const value = demoInput.value;
            
            demoOutput.innerHTML = '';
            
            switch(type) {
                case 'math':
                    const num = parseFloat(value) || 0;
                    function processNumber(num, callback) {
                        const result = num * num;
                        callback(result);
                    }
                    processNumber(num, function(result) {
                        demoOutput.textContent = value + 'の二乗は: ' + result;
                    });
                    break;
                    
                case 'string':
                    function processString(str, callback) {
                        const upperCase = str.toUpperCase();
                        const length = str.length;
                        callback(upperCase, length);
                    }
                    processString(value, function(upper, len) {
                        demoOutput.textContent = '大文字: ' + upper + '\n文字数: ' + len;
                    });
                    break;
                    
                case 'timer':
                    const seconds = parseFloat(value) || 1;
                    demoOutput.textContent = '処理開始...\nこの行は先に実行されます';
                    setTimeout(function() {
                        demoOutput.textContent += '\n' + seconds + '秒後に実行されました！';
                    }, seconds * 1000);
                    break;
            }
        });
        
        // 初期表示
        updateDemoCode();
    }
    
    // スムーズスクロール
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});