'use client';
import { useEffect } from 'react';
import { landingHtml } from './landing-html';
import { initLanding } from './landing-script';
import { initFx } from './fx';
import { initScenarios } from './scenarios';

// Paste your Google Play listing URL here (the main download button uses it).
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=mentorlinkbd.com';

export default function Landing() {
  useEffect(() => {
    const stopLanding = initLanding(PLAY_STORE_URL);
    const stopFx = initFx();
    const stopScn = initScenarios();
    // Every download button goes to the Play Store listing.
    document.querySelectorAll<HTMLAnchorElement>('a[href="#get"], a#play').forEach((a) => {
      a.href = PLAY_STORE_URL;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
    return () => { stopLanding(); stopFx(); stopScn(); };
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: landingHtml }} />;
}
