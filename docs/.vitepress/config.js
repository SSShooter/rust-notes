export default {
  title: 'Rust Notes',
  description: 'Just Rust Notes.',
  themeConfig: {
    nav: [
      { text: 'Rust', link: '/rust/' },
      { text: 'GitHub', link: 'https://github.com/ssshooter' },
    ],
    sidebar: {
      '/rust/': [
        {
          text: 'Rust',
          items: [
            { text: '基本概念', link: '/rust/common-concepts' },
            { text: 'Ownership', link: '/rust/ownership' },
            { text: 'Struct', link: '/rust/struct' },
            { text: '枚举和 Match', link: '/rust/match' },
            { text: '项目管理', link: '/rust/project-management' },
            { text: '数据集合', link: '/rust/common-collection' },
            { text: '错误处理', link: '/rust/error-handling' },
            { text: 'Generic', link: '/rust/generic' },
            { text: 'Trait', link: '/rust/trait' },
          ],
        },
      ],
    },
  },
}
