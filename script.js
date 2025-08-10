(() => {
    const exprEl = document.getElementById('expr');
    const resultEl = document.getElementById('result');
    const keypad = document.querySelector('.keypad');
    const historyList = document.getElementById('historyList');
    const historyPreview = document.getElementById('historyPreview');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const themeToggle = document.getElementById('themeToggle');
  
    let expr = '';
    let history = JSON.parse(localStorage.getItem('calc_history') || '[]');
    let theme = localStorage.getItem('calc_theme') || 'light';
  
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  
    function render(){
      exprEl.textContent = expr || '0';
      historyPreview.textContent = history.length ? history[0].expr + ' = ' + history[0].res : '';
      renderHistory();
    }
  
    function renderHistory(){
      historyList.innerHTML = '';
      history.slice(0,50).forEach((h, i) => {
        const li = document.createElement('li');
        li.textContent = `${h.expr} = ${h.res}`;
        li.title = 'Klik untuk menggunakan lagi';
        li.addEventListener('click', () => {
          expr = h.expr;
          render();
        });
        historyList.appendChild(li);
      });
    }
  
    function safeEvaluate(s){
      // hanya izinkan karakter angka, operator dasar, titik, dan spasi
      if(!/^[0-9+\-*/().\s]+$/.test(s)){
        throw new Error('Invalid characters');
      }
      // evaluasi dengan Function setelah validasi
      // HATI-HATI: masih bukan sandbox sempurna, tapi cukup untuk kalkulator sederhana
      // Hilangkan pembagian simbol visual jika ada
      return Function('return (' + s + ')')();
    }
  
    function calculate(){
      try{
        const val = safeEvaluate(expr.replace(/÷/g,'/').replace(/×/g,'*'));
        resultEl.textContent = val;
        history.unshift({expr: expr, res: val});
        localStorage.setItem('calc_history', JSON.stringify(history));
        render();
      }catch(e){
        resultEl.textContent = 'Error';
      }
    }
  
    keypad.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button');
      if(!btn) return;
      const v = btn.dataset.value;
      const action = btn.dataset.action;
  
      if(action === 'clear'){
        expr = '';
        resultEl.textContent = '';
        render();
        return;
      }
      if(action === 'delete'){
        expr = expr.slice(0,-1);
        render();
        return;
      }
      if(action === 'equals'){
        calculate();
        return;
      }
  
      // insert value
      expr += v;
      render();
    });
  
    // keyboard support
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      if(key === 'Enter' || key === '='){
        e.preventDefault(); calculate(); return;
      }
      if(key === 'Backspace'){
        expr = expr.slice(0,-1); render(); return;
      }
      if(key === 'Escape'){
        expr = ''; resultEl.textContent = ''; render(); return;
      }
      // accept digits and operators
      if(/^[0-9+\-*/().]$/.test(key)){
        expr += key; render(); return;
      }
    });
  
    clearHistoryBtn.addEventListener('click', () => {
      history = [];
      localStorage.removeItem('calc_history');
      render();
    });
  
    themeToggle.addEventListener('click', () => {
      theme = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
      localStorage.setItem('calc_theme', theme);
    });
  
   
    render();
  })();