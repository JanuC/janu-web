<template>
  <div class="editor">
    <div class="toolbar" ref="toolbar"></div>
    <div class="text" ref="editor"></div>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "Editorbar",
  data() {
    return {
      editor: null,
      info_: null,
      flag: true,
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: ['editorVal'],
  watch: {
    editorVal(val) {
      if(this.flag) {
        this.editor.txt.html(val)
        this.flag = false
      }
    }
  },
  mounted() {
    this.seteditor();
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      // 自定义菜单配置
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "video", // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ];

      this.editor.customConfig.zIndex = 1;
      this.editor.customConfig.onchange = html => {
        // console.log(html);

        this.info_ = html; //绑定当前的值
        this.$emit("change", this.info_); //将值同步给父组件
      };
      // this.editor.txt.html(props.value)
      // 创建富文本编辑器
      // console.log(this.editorVal);
      
      this.editor.create();
    }
  }
};
</script>

<style lang="css" >
.editor {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.toolbar {
  /* height: 5%; */
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  height: 95%;
}
</style>