(() => {
  // Pega aquí la URL pública de la aplicación cuando esté disponible.
  const APP_URL = '';
  const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const params = new URLSearchParams(window.location.search);
  const campaign = {};

  trackingKeys.forEach((key) => {
    const value = params.get(key);
    if (value) campaign[key] = value;
  });

  if (Object.keys(campaign).length) {
    sessionStorage.setItem('kora-discover-campaign', JSON.stringify(campaign));
  }

  let storedCampaign = {};
  try {
    storedCampaign = JSON.parse(sessionStorage.getItem('kora-discover-campaign') || '{}');
  } catch (_) {
    storedCampaign = {};
  }

  const showPendingMessage = () => {
    let notice = document.querySelector('[data-app-pending-notice]');
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'app-pending-notice';
      notice.dataset.appPendingNotice = '';
      notice.setAttribute('role', 'status');
      notice.textContent = 'La nueva versión de KORΛ DISCOVER estará disponible próximamente.';
      document.body.appendChild(notice);
    }

    notice.classList.add('is-visible');
    window.clearTimeout(showPendingMessage.timeoutId);
    showPendingMessage.timeoutId = window.setTimeout(() => notice.classList.remove('is-visible'), 2400);
  };

  document.querySelectorAll('[data-app-link]').forEach((link) => {
    if (APP_URL) {
      const destination = new URL(APP_URL);
      Object.entries(storedCampaign).forEach(([key, value]) => destination.searchParams.set(key, value));
      destination.searchParams.set('ref', 'kora-discover');
      link.href = destination.toString();
    } else {
      link.href = '#app-pendiente';
    }

    link.addEventListener('click', (event) => {
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'TryKora', {
          source_page: document.body.dataset.page || 'home',
          destination: APP_URL ? 'prototype' : 'pending'
        });
      }

      if (!APP_URL) {
        event.preventDefault();
        showPendingMessage();
        return;
      }

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'StartTrial', {
          content_name: 'KORΛ DISCOVER',
          content_category: 'prototype'
        });
      }
    });
  });

  const shareButton = document.querySelector('[data-share]');
  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      const payload = {
        title: document.title,
        text: 'Descubre música local y artistas emergentes con KORΛ DISCOVER.',
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(payload);
        } else {
          await navigator.clipboard.writeText(window.location.href);
          const original = shareButton.querySelector('[data-share-label]')?.textContent;
          const label = shareButton.querySelector('[data-share-label]');
          if (label) label.textContent = 'Enlace copiado';
          window.setTimeout(() => { if (label) label.textContent = original || 'Compartir'; }, 1800);
        }

        if (typeof window.fbq === 'function') {
          window.fbq('trackCustom', 'ShareLanding', { source_page: document.body.dataset.page || 'home' });
        }
      } catch (_) {
        // El usuario puede cerrar el diálogo de compartir sin completar la acción.
      }
    });
  }
})();
