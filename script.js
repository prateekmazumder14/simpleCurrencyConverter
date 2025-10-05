// script.js

// In dev, we’ll run FastAPI at 8080. In prod, we’ll use Firebase rewrite (/api → Cloud Run).
const API_BASE =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : '/api';

document.addEventListener('DOMContentLoaded', () => {
  const applyBtn = document.querySelector('[data-apply]');
  const resultWrap = document.querySelector('.result-wrap');

  applyBtn.addEventListener('click', async () => {
    const amount = Number(document.querySelector('#Amount').value || 1);
    const base = document.querySelector('#Base').value;
    const target = document.querySelector('#Target').value;

    try {
      const url = `${API_BASE}/convert?from=${encodeURIComponent(base)}&to=${encodeURIComponent(target)}&amount=${amount}`;
      const res = await fetch(url);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error ${res.status}: ${txt}`);
      }
      const data = await res.json(); // { rate, converted }

      const text = `${amount} ${base} = ${data.converted.toFixed(2)} ${target}`;
      resultWrap.querySelector('p').textContent = text;
      resultWrap.classList.remove('hidden');
    } catch (err) {
      console.error(err);
      resultWrap.querySelector('p').textContent = 'Conversion failed. Try again.';
      resultWrap.classList.remove('hidden');
    }
  });
});
