// 遅延を作る関数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAsyncExample1() {
    const output = document.getElementById('async-output-1');
    output.classList.add('show');
    output.textContent = '';
    
    async function greetWithDelay() {
        output.textContent += 'こんにちは！\n';
        
        await delay(2000);
        output.textContent += '2秒経ちました\n';
        
        await delay(1000);
        output.textContent += 'さらに1秒経ちました\n';
        
        return '挨拶完了！';
    }
    
    const result = await greetWithDelay();
    output.textContent += result + '\n';
}

async function runErrorHandlingExample() {
    const output = document.getElementById('error-output');
    output.classList.add('show');
    output.textContent = '';
    
    async function fetchDataWithErrorHandling() {
        try {
            output.textContent += 'データ取得開始...\n';
            
            const data1 = await Promise.resolve('データ1取得成功');
            output.textContent += data1 + '\n';
            
            output.textContent += 'データ2を取得中...\n';
            const data2 = await Promise.reject(new Error('データ2取得失敗'));
            output.textContent += data2 + '\n';
            
        } catch (error) {
            output.textContent += 'エラーをキャッチ: ' + error.message + '\n';
        } finally {
            output.textContent += '処理終了\n';
        }
    }
    
    await fetchDataWithErrorHandling();
}

async function fetchData(name, delay) {
    await new Promise(resolve => setTimeout(resolve, delay));
    return `${name}のデータ`;
}

async function runParallelExample() {
    const output = document.getElementById('parallel-output');
    output.classList.add('show');
    output.textContent = '逐次実行開始...\n';
    
    const start = Date.now();
    
    const data1 = await fetchData('API1', 1000);
    output.textContent += `${data1} (1秒経過)\n`;
    
    const data2 = await fetchData('API2', 1000);
    output.textContent += `${data2} (2秒経過)\n`;
    
    const data3 = await fetchData('API3', 1000);
    output.textContent += `${data3} (3秒経過)\n`;
    
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    output.textContent += `完了！合計時間: ${elapsed}秒\n`;
}

async function runParallelExample2() {
    const output = document.getElementById('parallel-output');
    output.classList.add('show');
    output.textContent = '並列実行開始...\n';
    
    const start = Date.now();
    
    output.textContent += '3つのAPIを同時に呼び出し中...\n';
    
    const [data1, data2, data3] = await Promise.all([
        fetchData('API1', 1000),
        fetchData('API2', 1000),
        fetchData('API3', 1000)
    ]);
    
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    output.textContent += `取得完了: [${data1}, ${data2}, ${data3}]\n`;
    output.textContent += `完了！合計時間: ${elapsed}秒（並列実行で高速化！）\n`;
}

async function runFileProcessingExample() {
    const output = document.getElementById('file-output');
    output.classList.add('show');
    output.textContent = '';
    
    // 模擬ファイル
    const files = [
        { name: 'document1.txt' },
        { name: 'document2.txt' },
        { name: 'document3.txt' }
    ];
    
    async function readFile(file) {
        await delay(100);
        return `${file.name}の内容`;
    }
    
    async function processContent(content) {
        await delay(200);
        return content.toUpperCase();
    }
    
    async function saveResult(filename, content) {
        await delay(100);
        output.textContent += `保存完了: ${filename}\n`;
    }
    
    async function processFiles(files) {
        const results = [];
        
        for (const file of files) {
            try {
                output.textContent += `処理中: ${file.name}\n`;
                
                const content = await readFile(file);
                const processed = await processContent(content);
                await saveResult(file.name, processed);
                
                results.push({
                    file: file.name,
                    status: 'success'
                });
                
            } catch (error) {
                results.push({
                    file: file.name,
                    status: 'error',
                    error: error.message
                });
            }
        }
        
        return results;
    }
    
    const results = await processFiles(files);
    output.textContent += '\n処理結果:\n';
    output.textContent += JSON.stringify(results, null, 2);
}

async function runAnimationExample() {
    const box = document.getElementById('animated-box');
    box.textContent = '📦';
    box.style.transform = 'translate(0, 0)';
    
    async function animateBox(element, direction, distance) {
        return new Promise(resolve => {
            element.style.transition = 'transform 0.5s ease';
            
            const currentTransform = element.style.transform || 'translate(0, 0)';
            const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            let currentX = 0, currentY = 0;
            
            if (match) {
                currentX = parseFloat(match[1]) || 0;
                currentY = parseFloat(match[2]) || 0;
            }
            
            switch(direction) {
                case 'right':
                    currentX += distance;
                    break;
                case 'down':
                    currentY += distance;
                    break;
                case 'left':
                    currentX -= distance;
                    break;
                case 'up':
                    currentY -= distance;
                    break;
            }
            
            element.style.transform = `translate(${currentX}px, ${currentY}px)`;
            
            setTimeout(resolve, 500);
        });
    }
    
    await animateBox(box, 'right', 200);
    await animateBox(box, 'down', 100);
    await animateBox(box, 'left', 200);
    await animateBox(box, 'up', 100);
    
    box.textContent = '✅';
}