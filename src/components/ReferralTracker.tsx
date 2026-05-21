'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReferralTracker() {
  const searchParams = useSearchParams();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    
    const ref = searchParams.get('ref');
    if (!ref) return;

    try {
      const cleanRef = ref.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (!cleanRef || cleanRef.length < 3) return;

      document.cookie = `affiliate_ref=${cleanRef}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      localStorage.setItem('affiliate_ref', cleanRef);
      localStorage.setItem('affiliate_ref_ts', Date.now().toString());

      fetch('/api/affiliate/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanRef }),
      }).catch(() => {});

      tracked.current = true;
    } catch {}
  }, [searchParams]);

  return null;
}
