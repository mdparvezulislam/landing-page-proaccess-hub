export const initPixel = (pixelId: string) => {
  if (!pixelId || typeof window === 'undefined') return;

  const win = window as any;
  if (win.fbq) return;

  win.fbq = function() {
    win.fbq.callMethod ? win.fbq.callMethod.apply(win.fbq, arguments) : win.fbq.queue.push(arguments);
  };
  if (!win._fbq) win._fbq = win.fbq;
  win.fbq.push = win.fbq;
  win.fbq.loaded = true;
  win.fbq.version = '2.0';
  win.fbq.queue = [];

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }

  win.fbq('init', pixelId);
  win.fbq('track', 'PageView');
};

export const trackPageView = () => {
  const win = window as any;
  if (win.fbq) win.fbq('track', 'PageView');
};

export const trackViewContent = (data?: any) => {
  const win = window as any;
  if (win.fbq) win.fbq('track', 'ViewContent', data);
};

export const trackInitiateCheckout = (data?: any) => {
  const win = window as any;
  if (win.fbq) win.fbq('track', 'InitiateCheckout', data);
};

export const trackPurchase = (data?: any) => {
  const win = window as any;
  if (win.fbq) win.fbq('track', 'Purchase', data);
};

export const trackAddToCart = (data?: any) => {
  const win = window as any;
  if (win.fbq) win.fbq('track', 'AddToCart', data);
};
