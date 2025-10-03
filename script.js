// Simple scientific calculator logic
(() => {
  const exprEl = document.getElementById('expr');
  const resultEl = document.getElementById('result');
  const angleToggle = document.getElementById('angleToggle');
  const buttons = document.querySelectorAll('[data-fn]');

  let expr = '';
  let lastAns = 0;
  let parenOpen = 0;

  function updateDisplay(){
    exprEl.value = expr || '0';
  }

  function setResult(v){
    resultEl.textContent = String(v);
  }

  function pushToken(t){
    expr += t;
    updateDisplay();
  }

  function clearAll(){ expr=''; parenOpen=0; setResult(0); updateDisplay(); }
  function back(){ if(!expr) return; const ch = expr.slice(-1); expr = expr.slice(0,-1); if(ch==='(') parenOpen--; if(ch===')') parenOpen++; updateDisplay(); }

  function toggleSign(){
    // naive: wrap last number with (-1*)
    if(!expr) return;
    expr = expr.replace(/(\d+(?:\.\d+)?)$/,'(-$1)');
    updateDisplay();
  }

  function factorial(n){
    if(n<0) return NaN;
    if(n===0) return 1;
    let f=1; for(let i=1;i<=n;i++) f*=i; return f;
  }

  function toRadiansIfNeeded(x){
    return angleToggle.checked ? x * Math.PI/180 : x; // checkbox means Degrees ON
  }

  function safeEval(input){
    // Replace user-friendly tokens with JS Math equivalents
    let s = input
      .replace(/×/g,'*')
      .replace(/÷/g,'/')
      .replace(/−/g,'-')
      .replace(/π/g, 'Math.PI')
      .replace(/e\^/g,'Math.exp(')
      .replace(/([0-9\.\)])\s*%/g,'($1/100)')
      .replace(/(\d+)\!/g, 'fact($1)')
      .replace(/ans/gi, '('+lastAns+')')
      .replace(/mod/g,'%')
      ;

    // functions mapping
    s = s.replace(/\b(sin|cos|tan|asin|acos|atan)\s*\(/g, (m, name) => {
      if(['sin','cos','tan'].includes(name)){
        return `Math.${name}(toR(${''}`;
      }
      return `Math.${name}(`;
    });

    // close opened e^( -> Math.exp(
    // custom helpers will be provided in eval scope

    try{
      // eslint-disable-next-line no-new-func
      const f = new Function('Math','fact','toR','toD','ans','return ('+s+');');
      return f(Math,factorial,(x)=>toRadiansIfNeeded(x),(x)=>x,lastAns);
    }catch(e){
      return e;
    }
  }

  function compute(){
    if(!expr) return;
    // handle implicit functions like sin30 -> sin(30)
    let normalized = expr.replace(/(sin|cos|tan|asin|acos|atan|ln|log|sqrt|exp)\s*([^\s\(\)]+)\b/g, '$1($2)');
    // map ln -> Math.log, log -> Math.log10, sqrt -> Math.sqrt, exp -> Math.exp
    normalized = normalized.replace(/\bln\(/g,'Math.log(')
      .replace(/\blog\(/g,'Math.log10(')
      .replace(/\bsqrt\(/g,'Math.sqrt(')
      .replace(/\bexp\(/g,'Math.exp(')
      .replace(/(\d+)\!/g, (m,p1)=>`factorial(${p1})`);

    // handle degree -> radians for trig
    // We'll replace Math.sin(Math.toR(x)) earlier by wrapping when evaluating

    try{
      const scope = {
        Math,
        factorial: factorial,
        toR: (x)=> toRadiansIfNeeded(x),
        toD: (x)=> x,
        ans: lastAns
      };
      // Build a function that evaluates with scope
      const fnBody = 'with(this){ return ('+normalized+'); }';
      const f = new Function(fnBody).bind(scope);
      const val = f();
      lastAns = val;
      setResult(val);
    }catch(err){
      setResult('Error');
    }
  }

  buttons.forEach(b => {
    b.addEventListener('click', ()=>{
      const k = b.dataset.fn;
      if(/^[0-9\.]$/.test(k)) return pushToken(k);
      switch(k){
        case 'clear': clearAll(); break;
        case 'back': back(); break;
        case 'paren': if(parenOpen%2===0){ pushToken('('); parenOpen++; } else { pushToken(')'); parenOpen--; } break;
        case 'plus': pushToken('+'); break;
        case 'minus': pushToken('−'); break;
        case 'multiply': pushToken('×'); break;
        case 'divide': pushToken('÷'); break;
        case 'dot': pushToken('.'); break;
        case 'pi': pushToken('π'); break;
        case 'ans': pushToken('ans'); break;
        case 'sin': pushToken('sin('); break;
        case 'cos': pushToken('cos('); break;
        case 'tan': pushToken('tan('); break;
        case 'asin': pushToken('asin('); break;
        case 'acos': pushToken('acos('); break;
        case 'atan': pushToken('atan('); break;
        case 'ln': pushToken('ln('); break;
        case 'log10': pushToken('log('); break;
        case 'exp': pushToken('exp('); break;
        case 'sqrt': pushToken('sqrt('); break;
        case 'pow': pushToken('**'); break;
        case 'fact': pushToken('!'); break;
        case 'mod': pushToken('mod'); break;
        case 'percent': pushToken('%'); break;
        case 'neg': toggleSign(); break;
        case 'equals': compute(); break;
      }
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (ev)=>{
    if(ev.key>= '0' && ev.key <= '9') { pushToken(ev.key); ev.preventDefault(); return; }
    if(ev.key === '.') { pushToken('.'); ev.preventDefault(); return; }
    if(ev.key === 'Enter') { compute(); ev.preventDefault(); return; }
    if(ev.key === 'Backspace') { back(); ev.preventDefault(); return; }
    const map = {'+':'plus','-':'minus','*':'multiply','/':'divide'};
    if(map[ev.key]){ pushToken(ev.key); ev.preventDefault(); return; }
  });

  // init
  clearAll();
})();