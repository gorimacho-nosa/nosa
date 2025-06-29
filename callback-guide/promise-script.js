function runPromiseExample1() {
    const output = document.getElementById('promise-output-1');
    output.classList.add('show');
    output.textContent = '処理を開始します...\n';
    
    const myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = true;
            
            if (success) {
                resolve('処理が成功しました！');
            } else {
                reject('エラーが発生しました');
            }
        }, 1000);
    });
    
    myPromise
        .then(result => {
            output.textContent += '成功: ' + result + '\n';
        })
        .catch(error => {
            output.textContent += '失敗: ' + error + '\n';
        });
}

function runPromiseExample2() {
    const output = document.getElementById('promise-output-2');
    output.classList.add('show');
    output.textContent = '';
    
    Promise.resolve('即座に成功！')
        .then(result => {
            output.textContent += result + '\n';
            
            return Promise.reject('即座に失敗！');
        })
        .catch(error => {
            output.textContent += error + '\n';
        });
}

function runChainExample() {
    const output = document.getElementById('chain-output');
    output.classList.add('show');
    output.textContent = '処理を開始します...\n';
    
    function step1() {
        return new Promise(resolve => {
            setTimeout(() => resolve('ステップ1完了'), 1000);
        });
    }
    
    function step2(prevResult) {
        return new Promise(resolve => {
            setTimeout(() => resolve(prevResult + ' → ステップ2完了'), 1000);
        });
    }
    
    function step3(prevResult) {
        return new Promise(resolve => {
            setTimeout(() => resolve(prevResult + ' → ステップ3完了'), 1000);
        });
    }
    
    step1()
        .then(result => {
            output.textContent += result + '\n';
            return step2(result);
        })
        .then(result => {
            output.textContent += result + '\n';
            return step3(result);
        })
        .then(result => {
            output.textContent += '最終結果: ' + result + '\n';
        });
}

function runErrorExample() {
    const output = document.getElementById('error-output');
    output.classList.add('show');
    output.textContent = '';
    
    function riskyOperation(shouldFail) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldFail) {
                    reject(new Error('処理に失敗しました'));
                } else {
                    resolve('処理成功！');
                }
            }, 1000);
        });
    }
    
    riskyOperation(true)
        .then(result => {
            output.textContent += '成功: ' + result + '\n';
            return '次の処理へ';
        })
        .then(result => {
            output.textContent += result + '\n';
        })
        .catch(error => {
            output.textContent += 'エラーをキャッチ: ' + error.message + '\n';
            return 'エラーから復帰';
        })
        .then(result => {
            output.textContent += '処理継続: ' + result + '\n';
        });
}

function runPromiseAllExample() {
    const output = document.getElementById('promise-all-output');
    output.classList.add('show');
    output.textContent = '3つの非同期処理を開始します...\n';
    
    const startTime = Date.now();
    
    const promise1 = new Promise(resolve => 
        setTimeout(() => {
            output.textContent += 'データ1取得完了 (1秒後)\n';
            resolve('データ1');
        }, 1000)
    );
    const promise2 = new Promise(resolve => 
        setTimeout(() => {
            output.textContent += 'データ2取得完了 (2秒後)\n';
            resolve('データ2');
        }, 2000)
    );
    const promise3 = new Promise(resolve => 
        setTimeout(() => {
            output.textContent += 'データ3取得完了 (1.5秒後)\n';
            resolve('データ3');
        }, 1500)
    );
    
    Promise.all([promise1, promise2, promise3])
        .then(results => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            output.textContent += `すべて完了: [${results.join(', ')}]\n`;
            output.textContent += `合計時間: ${elapsed}秒（並列実行のため最も遅い処理の時間）`;
        });
}

function runPromiseRaceExample() {
    const output = document.getElementById('promise-race-output');
    output.classList.add('show');
    output.textContent = '競争開始！どちらが先に完了するか...\n';
    
    const slow = new Promise(resolve => 
        setTimeout(() => {
            output.textContent += '遅い処理が完了（3秒）\n';
            resolve('遅い処理');
        }, 3000)
    );
    const fast = new Promise(resolve => 
        setTimeout(() => {
            output.textContent += '速い処理が完了（1秒）\n';
            resolve('速い処理');
        }, 1000)
    );
    
    Promise.race([slow, fast])
        .then(result => {
            output.textContent += '最初に完了: ' + result + '\n';
            output.textContent += '（他の処理はバックグラウンドで継続中...）';
        });
}