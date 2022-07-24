import { nav } from './nav'
import { vue3, interview, flutter } from './sidebar'

export default {
  title: 'Web-Notes',
  description: '一些学习笔记.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: 'logo.png' }]
  ],
  themeConfig: {
    siteTitle: 'Web-Notes',
    logo: '/logo.png',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Fan'
    },
    nav: nav(),
    sidebar: {
      '/vue3/': vue3(),
      '/interview/': interview(),
      '/flutter': flutter()
    }
  }
}
