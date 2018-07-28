module.exports = {
  base: '/hzfe-questions-and-answers/',
  title: 'HZFE奶库',
  description: '前端面试题库',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  serviceWorker: true,
  themeConfig: {
    repo: 'HZFE/hzfe-questions-and-answers',
    repoLabel: 'GITHUB',
    editLinks: true,
    nav: [
      { text: 'HZFE', link: 'https://hzfe.org' }
    ],
    sidebar: 'auto',
    lastUpdated: 'Last Updated'
  }
}