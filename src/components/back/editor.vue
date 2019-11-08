<template>
  <div class="editor">
    <div class="toolbar" ref="toolbar"></div>
    <div class="text" ref="editor"></div>
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  
  name: 'Editorbar',
  data() {
    return {
      editor: null,
      info_: null
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: -1
    }
  },
  watch: {
    isClear(boo) {
      if(boo) {
        // 清空文本域内容
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value(val) {
      // 同步文本域
      this.editor.txt.html(val)
    },
    length(num) {
      if(num) {
        this.editor.$textElem.attr('contenteditable', true)
      }else {
        this.editor.$textElem.attr('contenteditable', false)
      }
      
    }
  },
  mounted() {
      this.seteditor()
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar,this.$refs.editor)
      this.editor.customConfig.zIndex = 1
      this.editor.customConfig.onchange = (html) => {
        this.info_ = html //绑定当前的值
        this.$emit('change',this.info_) //将值同步给父组件
      }
    // 创建富文本编辑器
    this.editor.create()
    }
  }
}
</script>

<style lang="css" >
  .editor {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .toolbar {
    border: 1px solid #ccc;
  }
  .text {
    border: 1px solid #ccc;
    height: 100%;
  }
</style>