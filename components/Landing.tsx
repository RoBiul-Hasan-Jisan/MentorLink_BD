'use client';
import { useEffect } from 'react';
import { landingHtml } from './landing-html';
import { initLanding } from './landing-script';
import { initFx } from './fx';

// Paste your Google Play listing URL here (the main download button uses it).
const PLAY_STORE_URL = '#get';

export default function Landing() {
  useEffect(() => {
    const stopLanding = initLanding(PLAY_STORE_URL);
    const stopFx = initFx();
    return () => { stopLanding(); stopFx(); };
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: landingHtml }} />;
}
