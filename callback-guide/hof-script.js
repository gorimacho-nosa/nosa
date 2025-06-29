function runFunctionAsArgExample() {
    const output = document.getElementById('arg-output');
    output.classList.add('show');
    output.textContent = '';
    
    function processArray(array, processor) {
        const result = [];
        for (const item of array) {
            result.push(processor(item));
        }
        return result;
    }
    
    const numbers = [1, 2, 3, 4, 5];
    
    const doubled = processArray(numbers, x => x * 2);
    output.textContent += '2倍: [' + doubled.join(', ') + ']\n';
    
    const squared = processArray(numbers, x => x * x);
    output.textContent += '平方: [' + squared.join(', ') + ']\n';
    
    const strings = processArray(numbers, x => `数字: ${x}`);
    output.textContent += '文字列: [' + strings.map(s => `"${s}"`).join(', ') + ']\n';
}

function runFilterExample() {
    const output = document.getElementById('filter-output');
    output.classList.add('show');
    output.textContent = '';
    
    function customFilter(array, condition) {
        const result = [];
        for (const item of array) {
            if (condition(item)) {
                result.push(item);
            }
        }
        return result;
    }
    
    const people = [
        { name: '太郎', age: 25 },
        { name: '花子', age: 30 },
        { name: '次郎', age: 18 },
        { name: '三郎', age: 40 }
    ];
    
    const adults = customFilter(people, person => person.age >= 20);
    output.textContent += '成人:\n';
    adults.forEach(p => output.textContent += `  ${p.name} (${p.age}歳)\n`);
    
    const roNames = customFilter(people, person => person.name.endsWith('郎'));
    output.textContent += '\n「郎」で終わる名前:\n';
    roNames.forEach(p => output.textContent += `  ${p.name}\n`);
}

function runFunctionFactoryExample() {
    const output = document.getElementById('factory-output');
    output.classList.add('show');
    output.textContent = '';
    
    function createMultiplier(multiplier) {
        return function(number) {
            return number * multiplier;
        };
    }
    
    const double = createMultiplier(2);
    const triple = createMultiplier(3);
    const times10 = createMultiplier(10);
    
    output.textContent += 'double(5): ' + double(5) + '\n';
    output.textContent += 'triple(5): ' + triple(5) + '\n';
    output.textContent += 'times10(5): ' + times10(5) + '\n\n';
    
    function createTaxCalculator(taxRate) {
        return function(price) {
            const tax = price * taxRate;
            return {
                price: price,
                tax: tax,
                total: price + tax
            };
        };
    }
    
    const calculateJapanTax = createTaxCalculator(0.1);
    const result = calculateJapanTax(1000);
    output.textContent += '税込計算:\n';
    output.textContent += JSON.stringify(result, null, 2);
}

function runClosureExample() {
    const output = document.getElementById('closure-output');
    output.classList.add('show');
    output.textContent = '';
    
    function createCounter(initialValue = 0) {
        let count = initialValue;
        
        return {
            increment: function() {
                count++;
                return count;
            },
            decrement: function() {
                count--;
                return count;
            },
            reset: function() {
                count = initialValue;
                return count;
            },
            getValue: function() {
                return count;
            }
        };
    }
    
    const counter1 = createCounter();
    const counter2 = createCounter(100);
    
    output.textContent += 'Counter1: ' + counter1.increment() + '\n';
    output.textContent += 'Counter1: ' + counter1.increment() + '\n';
    output.textContent += 'Counter2: ' + counter2.increment() + '\n';
    output.textContent += 'Counter1: ' + counter1.getValue() + '\n';
    output.textContent += 'Counter2: ' + counter2.getValue() + '\n';
}

function runChainExample() {
    const output = document.getElementById('chain-output');
    output.classList.add('show');
    output.textContent = '';
    
    const products = [
        { name: 'ノートPC', price: 120000, category: 'electronics' },
        { name: 'マウス', price: 3000, category: 'electronics' },
        { name: '机', price: 25000, category: 'furniture' },
        { name: '椅子', price: 15000, category: 'furniture' },
        { name: 'キーボード', price: 8000, category: 'electronics' }
    ];
    
    const result = products
        .filter(p => p.category === 'electronics')
        .sort((a, b) => a.price - b.price)
        .map(p => ({
            商品名: p.name,
            価格: `¥${p.price.toLocaleString()}`
        }));
    
    output.textContent += '電子機器（価格順）:\n';
    result.forEach(item => {
        output.textContent += `  ${item.商品名}: ${item.価格}\n`;
    });
}

function runPipeExample() {
    const output = document.getElementById('pipe-output');
    output.classList.add('show');
    output.textContent = '';
    
    function pipe(...functions) {
        return function(initialValue) {
            return functions.reduce((value, func) => func(value), initialValue);
        };
    }
    
    const addOne = x => x + 1;
    const double = x => x * 2;
    const square = x => x * x;
    
    const pipeline = pipe(addOne, double, square);
    
    output.textContent += '5 → +1 → ×2 → 二乗 = ' + pipeline(5) + '\n\n';
    
    const trim = s => s.trim();
    const toLowerCase = s => s.toLowerCase();
    const removeSpaces = s => s.replace(/\s+/g, '-');
    
    const slugify = pipe(trim, toLowerCase, removeSpaces);
    
    output.textContent += 'Slugify: "' + slugify('  Hello World  ') + '"';
}

function runMemoizeExample() {
    const output = document.getElementById('memoize-output');
    output.classList.add('show');
    output.textContent = '';
    
    function memoize(func) {
        const cache = new Map();
        
        return function(...args) {
            const key = JSON.stringify(args);
            
            if (cache.has(key)) {
                output.textContent += 'キャッシュから取得: ' + key + '\n';
                return cache.get(key);
            }
            
            output.textContent += '計算実行: ' + key + '\n';
            const result = func.apply(this, args);
            cache.set(key, result);
            return result;
        };
    }
    
    function slowCalculation(n) {
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += n;
        }
        return result;
    }
    
    const fastCalculation = memoize(slowCalculation);
    
    const start1 = performance.now();
    output.textContent += '結果: ' + fastCalculation(5) + '\n';
    const time1 = (performance.now() - start1).toFixed(2);
    output.textContent += '初回実行時間: ' + time1 + 'ms\n\n';
    
    const start2 = performance.now();
    output.textContent += '結果: ' + fastCalculation(5) + '\n';
    const time2 = (performance.now() - start2).toFixed(2);
    output.textContent += '2回目実行時間: ' + time2 + 'ms（高速化！）\n';
}

// デバウンス関数の実装
function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 検索ボックスの設定
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchOutput = document.getElementById('search-output');
    
    if (searchInput && searchOutput) {
        const search = debounce(function(query) {
            if (query) {
                searchOutput.textContent = `検索中: "${query}"`;
                searchOutput.style.color = '#667eea';
            } else {
                searchOutput.textContent = '検索キーワードを入力してください';
                searchOutput.style.color = '#64748b';
            }
        }, 500);
        
        searchInput.addEventListener('input', (e) => {
            search(e.target.value);
        });
        
        // 初期メッセージ
        searchOutput.textContent = '検索キーワードを入力してください';
    }
});

function runCurryExample() {
    const output = document.getElementById('curry-output');
    output.classList.add('show');
    output.textContent = '';
    
    function curry(func) {
        return function curried(...args) {
            if (args.length >= func.length) {
                return func.apply(this, args);
            }
            return function(...nextArgs) {
                return curried(...args, ...nextArgs);
            };
        };
    }
    
    function add(a, b, c) {
        return a + b + c;
    }
    
    const curriedAdd = curry(add);
    
    output.textContent += 'curriedAdd(1)(2)(3): ' + curriedAdd(1)(2)(3) + '\n';
    output.textContent += 'curriedAdd(1, 2)(3): ' + curriedAdd(1, 2)(3) + '\n';
    output.textContent += 'curriedAdd(1)(2, 3): ' + curriedAdd(1)(2, 3) + '\n\n';
    
    const add5 = curriedAdd(5);
    const add5and10 = add5(10);
    output.textContent += 'add5and10(7): ' + add5and10(7) + '\n';
}

function runComposeExample() {
    const output = document.getElementById('compose-output');
    output.classList.add('show');
    output.textContent = '';
    
    function compose(...functions) {
        return function(initialValue) {
            return functions.reduceRight((value, func) => func(value), initialValue);
        };
    }
    
    const addTax = price => price * 1.1;
    const addShipping = price => price + 500;
    const formatPrice = price => `¥${Math.round(price).toLocaleString()}`;
    
    const calculateTotal = compose(
        formatPrice,
        addShipping,
        addTax
    );
    
    output.textContent += '商品価格: ¥1,000\n';
    output.textContent += '↓ 税金10%追加\n';
    output.textContent += '¥1,100\n';
    output.textContent += '↓ 送料¥500追加\n';
    output.textContent += '¥1,600\n';
    output.textContent += '↓ フォーマット\n';
    output.textContent += '合計: ' + calculateTotal(1000);
}