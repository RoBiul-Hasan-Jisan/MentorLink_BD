'use client';
import { useEffect } from 'react';
import { landingHtml } from './landing-html';
import { initLanding } from './landing-script';

// Paste your Google Play listing URL here (the main download button uses it).
const PLAY_STORE_URL = '#get';

export default function Landing() {
  useEffect(() => initLanding(PLAY_STORE_URL), []);
  return <div dangerouslySetInnerHTML={{ __html: landingHtml }} />;
}
