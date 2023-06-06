export const nav = () => {
  return [
    // { 
    //   text: 'Js',
    //   link: '/js'
    // },
    { 
      text: 'Vue',
      items: [
        { text: 'Vue3基础', link: '/vue3/composition-api' },
      ]
    },
    { 
      text: 'React',
      items: [
        { text: 'React的一些内置Hooks', link: '/react/hooks' },
      ]
    },
    { 
      text: 'Vite',
      items: [
        { text: 'Vite项目打包成app遇到的问题', link: '/vite/打包成app遇到的问题' },
      ]
    },
    { 
      text: 'Flutter',
      items: [
        { text: 'Flutter基础', link: '/flutter/init' },
      ]
    },
    // { 
    //   text: 'Node',
    //   link: '/node'
    // },
    // { 
    //   text: '设计模式',
    //   link: '/design-pattern'
    // },
    // { 
    //   text: '算法',
    //   link: '/algo'
    // },
    {
      text: 'interview',
      link: '/interview/html'
    },
    { 
      text: 'other',
      items: [
        { text: 'navicat安装', link: '/other/NavicatPremium安装破解' },
      ]
    }
  ]
}
