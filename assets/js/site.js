(() => {
  const appUrl = 'https://renzofernando.github.io/KORA-C3/';
  const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const params = new URLSearchParams(window.location.search);
  const campaign = {};

  trackingKeys.forEach((key) => {
    const value = params.get(key);
    if (value) campaign[key] = value;
  });

  if (Object.keys(campaign).length) {
    sessionStorage.setItem('cora-discover-campaign', JSON.stringify(campaign));
  }

  let storedCampaign = {};
  try {
    storedCampaign = JSON.parse(sessionStorage.getItem('cora-discover-campaign') || '{}');
  } catch (_) {
    storedCampaign = {};
  }

  document.querySelectorAll('[data-app-link]').forEach((link) => {
    const destination = new URL(appUrl);
    Object.entries(storedCampaign).forEach(([key, value]) => destination.searchParams.set(key, value));
    destination.searchParams.set('ref', 'cora-discover');
    link.href = destination.toString();

    link.addEventListener('click', () => {
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'TryCora', {
          source_page: document.body.dataset.page || 'home',
          destination: 'prototype'
        });
      }
    });
  });

  const shareButton = document.querySelector('[data-share]');
  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      const payload = {
        title: document.title,
        text: 'Descubre música local y artistas emergentes con Cora Discover.',
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
