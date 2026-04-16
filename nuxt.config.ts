export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#000000' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'msapplication-TileColor', content: '#000000' },
        { name: 'msapplication-navbutton-color', content: '#000000' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
      ],
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
  },

  css: ['@/assets/styles/index.scss', '@/assets/styles/variables.scss'],

  imports: {
    dirs: [
      '~/composables'
    ]
  }
})
