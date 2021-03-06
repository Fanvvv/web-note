export const nav = () => {
  return [
    // { 
    //   text: 'Js',
    //   link: '/js'
    // },
    { 
      text: 'Vue',
      items: [
        { text: 'Vue3相关', link: '/vue3/composition-api' },
      ]
    },
    { 
      text: 'React',
      items: [
        { text: 'React的一些内置Hooks', link: '/react/hooks' },
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
      text: '面试',
      link: '/interview/html'
    }
  ]
}
