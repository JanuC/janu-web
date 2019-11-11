
// 该js文件用于创建代码高亮自定义指令

import Hljs from 'highlight.js'
import 'highlight.js/styles/gruvbox-light.css'

let Highlight = {}

Highlight.install = function(Vue) {
  // 创建自定义指令
  Vue.directive('highlight',{
    // 被绑定元素插入父节点是调用
    inserted: function(el) {
      let blocks = el.querySelectorAll('pre code')
      blocks.forEach(item => {
        Hljs.highlightBlock(item)
      })
    },
    // 指令在所有组件的 VNode 及其 子VNode 全部更新后调用
    componentUpdated: function(el) {
      let blocks = el.querySelectorAll('pre code')
      blocks.forEach(item => {
        Hljs.highlightBlock(item)
      })
    }
  })
}

export default Highlight