module.exports = {
  base: '/hzfe-questions-and-answers/',
  title: 'HZFE奶库',
  description: '前端面试题库',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['meta', { name: 'msapplication-TileImage', content: `/icons/msapplication-icon-144x144.png` }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: true,
  themeConfig: {
    repo: 'HZFE/hzfe-questions-and-answers',
    repoLabel: 'GITHUB',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    nav: [
      { text: 'HZFE', link: 'https://hzfe.org' }
    ],
    sidebar: 'auto',
    lastUpdated: '上次更新'
  }
}