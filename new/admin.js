// GAS + スプレッドシート版 管理ページ
(function() {
  const cfg = window.IKENBAKO_CONFIG || {};
  const BASE = cfg.GAS_BASE_URL || '';
  const ADMIN_KEY = cfg.ADMIN_KEY || '';

  // シンプルなパスワードゲート（同じ値をADMIN_KEYとして使用）
  const input = prompt('パスワードを入力してください');
  if (!input || input !== ADMIN_KEY) {
    alert('パスワードが違います');
    try { window.close(); } catch (e) {}
    return;
  }
  document.getElementById('content').style.display = 'block';

  const opinionContainer = document.getElementById('opinion-container');
  const repliedContainer = document.getElementById('replied-container');

  function alertError(err) { console.error(err); alert('エラーが発生しました。時間をおいて再度お試しください。'); }

  function formatTime(iso) {
    if (!iso) return '';
    try { const d = new Date(iso); return d.toLocaleString(); } catch (_) { return iso; }
  }

  async function fetchList(filter) {
    if (!BASE) { alert('設定が未完了です（config.js の GAS_BASE_URL を設定）'); return []; }
    const url = `${BASE}?action=list&filter=${encodeURIComponent(filter)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    return [];
  }

  async function showOpinions() {
    opinionContainer.innerHTML = '';
    try {
      const opinions = await fetchList('unreplied');
      opinions.forEach(op => {
        const opinionDiv = document.createElement('div');
        opinionDiv.className = 'opinion-div';
        if (op.imageUrl) {
          const img = document.createElement('img');
          img.className = 'thumb';
          img.src = op.imageUrl;
          img.alt = '添付画像';
          opinionDiv.appendChild(img);
        }
        const opinionP = document.createElement('p');
        opinionP.className = 'opinion-p';
        opinionP.textContent = '意見：' + op.opinion;

        const replyForm = document.createElement('form');
        replyForm.className = 'reply-form';
        const replyLabel = document.createElement('label');
        replyLabel.textContent = '返信：';
        const replyTextarea = document.createElement('textarea');
        replyTextarea.name = 'reply';
        replyTextarea.rows = '3';
        replyTextarea.cols = '30';
        replyTextarea.value = op.reply || '';
        const replyButton = document.createElement('button');
        replyButton.type = 'submit';
        replyButton.textContent = '送信';
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = '削除';

        deleteButton.addEventListener('click', async function() {
          if (!confirm('本当にこの意見を削除しますか？')) return;
          try {
            const form = new URLSearchParams();
            form.set('action', 'delete');
            form.set('id', op.id);
            form.set('adminKey', ADMIN_KEY);
            const res = await fetch(BASE, { method: 'POST', body: form });
            const data = await res.json();
            if (data && data.status === 'ok') {
              opinionDiv.remove();
            } else { alertError(data); }
          } catch (e) { alertError(e); }
        });

        replyForm.addEventListener('submit', async function(event) {
          event.preventDefault();
          const reply = replyTextarea.value.trim();
          try {
            const form = new URLSearchParams();
            form.set('action', 'reply');
            form.set('id', op.id);
            form.set('reply', reply);
            form.set('adminKey', ADMIN_KEY);
            const res = await fetch(BASE, { method: 'POST', body: form });
            const data = await res.json();
            if (data && data.status === 'ok') {
              opinionDiv.remove();
              showReplied();
            } else { alertError(data); }
          } catch (e) { alertError(e); }
        });

        replyForm.appendChild(replyLabel);
        replyForm.appendChild(replyTextarea);
        replyForm.appendChild(replyButton);
        replyForm.appendChild(deleteButton);
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = '投稿: ' + formatTime(op.createdAt);
  opinionDiv.appendChild(opinionP);
        opinionDiv.appendChild(replyForm);
  opinionDiv.appendChild(meta);
        opinionContainer.appendChild(opinionDiv);
      });
    } catch (e) { alertError(e); }
  }

  async function showReplied() {
    repliedContainer.innerHTML = '';
    try {
      const opinions = await fetchList('replied');
      opinions.forEach(op => {
        const opinionDiv = document.createElement('div');
        opinionDiv.className = 'opinion-div';
        if (op.imageUrl) {
          const img = document.createElement('img');
          img.className = 'thumb';
          img.src = op.imageUrl;
          img.alt = '添付画像';
          opinionDiv.appendChild(img);
        }
        const opinionP = document.createElement('p');
        opinionP.className = 'opinion-p';
        opinionP.textContent = '意見：' + op.opinion;
        const replyP = document.createElement('p');
        replyP.className = 'reply-p';
        replyP.textContent = '返信：' + (op.reply || '');
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = '投稿: ' + formatTime(op.createdAt) + ' / 返信: ' + formatTime(op.repliedAt);
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = '削除';

        deleteButton.addEventListener('click', async function() {
          if (!confirm('本当にこの意見と返信を削除しますか？')) return;
          try {
            const form = new URLSearchParams();
            form.set('action', 'delete');
            form.set('id', op.id);
            form.set('adminKey', ADMIN_KEY);
            const res = await fetch(BASE, { method: 'POST', body: form });
            const data = await res.json();
            if (data && data.status === 'ok') {
              opinionDiv.remove();
            } else { alertError(data); }
          } catch (e) { alertError(e); }
        });

        opinionDiv.appendChild(opinionP);
        opinionDiv.appendChild(replyP);
        opinionDiv.appendChild(deleteButton);
  opinionDiv.appendChild(meta);
  repliedContainer.appendChild(opinionDiv);
      });
    } catch (e) { alertError(e); }
  }

  window.addEventListener('load', function() {
    showOpinions();
    showReplied();
  });
})();
  