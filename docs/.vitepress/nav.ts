export const nav = () => {
  return [
    { 
      text: 'js',
      link: '/js'
    },
    { 
      text: 'vue',
      link: '/vue'
    },
    { 
      text: 'react',
      items: [
        { text: 'react的一些内置Hooks', link: '/react/hooks' },
      ]
    },
    { 
      text: 'node',
      link: '/node'
    },
    { 
      text: '设计模式',
      link: '/design-pattern'
    },
    { 
      text: '算法',
      link: '/algo'
    },
  ]
}
