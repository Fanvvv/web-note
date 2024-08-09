export const nav = () => {
  return [
    { 
      text: '重学Js',
      link: '/JS/events'
    },
    { 
      text: 'Vue',
      items: [
        { text: 'Vue3基础', link: '/vue3/composition-api' },
        { text: 'minivue3', link: '/vue3/minivue3/minivue3-v2vsv3' },
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
    { 
      text: 'Java',
      items: [
        { text: 'Maven', link: '/java/maven' },
        { text: 'SpringBoot', link: '/java/SpringBoot基础' },
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
