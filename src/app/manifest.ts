import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Deepotsav — Premium Diwali Gifting',
    short_name: 'Deepotsav',
    description: 'Create and share personalized interactive Diwali celebrations with diyas, rangoli, fireworks, and heartfelt greetings.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A1A',
    theme_color: '#D4AF37',
    orientation: 'portrait',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
