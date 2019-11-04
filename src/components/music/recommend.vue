<template>
  <div class="musicContent" >
    <div class="category">
      <span>{{categoryStr}}</span>
      <button class="categoryBtn" @click="createCategory(showCatefory)">选择分类</button>
      <div class="choice" v-show="showCatefory" ref="choice">
        <div class="all">
          <a href="javascript: void(0)" @click="updatePlaylist('全部')">全部风格</a>
        </div>
        <div class="box1"></div>
        <dl class="dl" v-for="(item,index) in dtArr" :key="index" height="300px" ref="dl">
            <dt>{{item}}</dt>
            <dd ref="dd">
              <a href="javascript:void(0)" class="dd-a" :class="{categorybgc: items.name === categoryStr}"  v-for="(items,indexs) in newddArr(index)" :key="indexs" @click="updatePlaylist(items.name)" >{{items.name}}</a>
            </dd>
        </dl>
      </div>
      <span class="hot">热门</span>
      
    </div>
    <div class="musicMain">
      <div class="loadingImg" v-show="loadingImg">
        <img src="/static/image/loading1.gif">
      </div>
      <ul>
        <li v-for="(item,index) in playlistArr" :key="index" @click="playlistMsg(item.id)">
          <img v-lazy='item.coverImgUrl'>
          <p>{{item.name}}</p>
          <span><i class="fa fa-headphones" aria-hidden="true"></i>  {{item.playCount}}</span>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const address = "http://v2.janulog.com:80";
export default {
  data() {
    return {
      dtArr: [],// 存放dt标签中的数据
      ddArr:[],// 存放dd标签中的数据
      showCatefory: false,// 显示选择分类
      playlistArr: [],//歌单列表
      categoryStr: '',// 当前显示的 歌单分类
      loadingImg: true,//控制加载中图片显示与隐藏
      marginBottom: false,
    }
  },
  mounted() {
    // 给body 注册点击事件,以控制点击choice之外的位置,choice隐藏
    document.body.addEventListener('click',this.bodyClick,true);
  },
  created() {
    // 发送请求,获取歌单分类
    axios
      .get(address + '/playlist/catlist')
      .then(res => {
        if(res.data.code === 200) {
          for(let k in res.data.categories) {
            this.dtArr.push(res.data.categories[k])
          }
          res.data.sub.forEach(item => {
              this.ddArr.push(item)
            
          }); 
        }
      })
      // 获取全部歌单
    this.updatePlaylist('全部')
  },
  computed: {
    // 计算符合要求的数据并返回给 v-for
    newddArr() {
      return index => {
        const newArr = this.ddArr.filter(item => {
          return item.category === index
        })
        return newArr
      }
    },
  },
  methods: {
    // 设置dt的高度
    createCategory(boo) {
      if(!boo) {
        for (let i = 0; i < this.$refs.dl.length; i++) {
        this.$refs.dl[i].style.height = this.$refs.dd[i].offsetHeight + 'px'
        }
        this.showCatefory = true
      }else {
        this.showCatefory = false
      }
    },
    // 控制choice 的显示与隐藏
    bodyClick(e) {
      // 判断点击的对象中是否有 choice
      if(e.path.some(item=>item.className === "choice")) {
        // 有,什么都不用做
        return
        
      }else  if(e.path.some(item=>item.className === "categoryBtn")) {
        // 有,什么都不用做
        return
      }
      else {
        // 没有,隐藏 choice
        this.showCatefory = false
      }
    },
    // 该方法用于切换推荐页显示的歌单分类
    updatePlaylist(str) {
      // 先让loading 图片显示
      this.loadingImg = true
      // 先判断当前歌单分类是否为点击的歌单分类
      if(str === this.categoryStr) {
        // 不用发请求
        // 隐藏 choice
        this.showCatefory = false
        return
      }
      axios
        .get(address + '/top/playlist?limit=100&cat=' + str)
        .then(res => {
          // console.log(res);
          if(res.data.code === 200) {
            // 请求成功
            const newPlaylistArr = []
            res.data.playlists.forEach(item => {
            newPlaylistArr.push(item)
            })
            this.playlistArr = newPlaylistArr
          }
        })
      // 改变显示的歌单分类
      this.categoryStr = str
      // 隐藏 choice
      this.showCatefory = false
    },
    // 跳转到歌单详情组件
    playlistMsg(id) {
      // this.$router.push({path: '/home/music/list',query: {id: id}})
     this.$router.push({name: 'home/music/list',params: {id: id}})
      
    }
  },
  watch: {
    // 监听playlistArr 中数据是否发生改变
    playlistArr: {
      deep: true,
      handler() {
        this.loadingImg = false
      }
    },
  }
}
</script>

<style lang="less" scoped>
  .musicContent {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    .category {
      width: 100%;
      height: 50px;
      border-bottom: 2px solid #b82535; 
      position: relative;
      span {
        line-height: 50px;
        font-size: 20px;
      }
      .categoryBtn {
        width: 120px;
        height: 34px;
        color: #0c73ce;
        margin-left: 10px;
      }
      .hot {
        display: inline-block;
        width: 60px;
        height: 30px;
        background-color: #a80909;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        color: #fff;
        border-radius: 5px;
        box-shadow: 0.3px 0.5px 0.1px 0.1px #a80909;
        position: absolute;
        right: 1px;
        top: 10px;
      }
      .choice {
        z-index: 99;
        width: 600px;
        position: absolute;
        left: 10px;
        top: 62px;
        box-shadow: 0 0 1px rgba(0, 0, 0,.2);
        background-color: #fff;
        .all {
          width: 100%;
          overflow: hidden;
          border-bottom: 1px solid #e6e6e6;
          a {
            position: relative;
            z-index: 100;
            display: block;
            width: 75px;
            height: 26px;
            text-decoration: none;
            background-position: 0 -64px;
            text-align: center;
            line-height: 26px;
            border: 1px solid #bebebe;
            padding: 4px;
            margin: 10px 20px;
            border-radius: 4px;
            background-color: #f8f8f8;
            color: #555;
          }
          a:hover {
            text-decoration: underline
          }
        }
        .dl {
          margin: 0;
          padding: 0;
          display: block;
          width: 100%;
          
          dt,dd {
            margin: 0;
            padding: 0;
          }
          dt {
            float: left;
            height: 100%;
            width: 70px;
            text-align: center;
            border-right: 1px solid #e6e6e6;
            font-weight: 700;
            
          box-sizing: border-box;
            padding-top: 4px;
          }
          dd {
            float:left;
            width: 520px;
            box-sizing: border-box;
            padding-left: 10px;
            padding-right: 15px;
            .dd-a {
              line-height: 30px;
              text-decoration: none;
              font-size: 14px;
              color: #555;
            }
            .dd-a:hover {
              text-decoration: underline;
              color:#a80909;
            }
            .dd-a::after {
              content: '|';
              display: inline-block;
              margin: 0 8px;
              font-size: 12px;
            }
            .line {
              color: #d8d8d8;
              font-size: 12px;
            }
          }
          dd::after {
            content: '';
            display: block;
            clear: both;
          }
        }
        .dl::after {
          content: '';
          display: block;
          clear: both;
        }
        .box1 {
          width: 20px;
          height: 20px;
          background-color: #fff;
          transform: rotateZ(45deg);
          position: absolute;
          left: 90px;
          top: -11px;
          border-top: 1px solid rgba(0, 0, 0,.2);
          border-left: 1px solid rgba(0, 0, 0,.2);
        }
        .categorybgc {
          color: #a80909 !important;
        }
      }
    }
    .musicMain {
      width: 100%;
      margin-top: 10px;
      padding-left: 10px;
      box-sizing: border-box;
      .loadingImg {
        width: 600px;
        height: 600px;
        display: block;
        margin: 0 auto;
      }
      ul,li {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      ul {
        width: 100%;
        height: 100%;
        li {
          float: left;
          width: 140px;
          height: 200px;
          margin: 0 21px;
          box-shadow: 0px 0px 5px rgba(0, 0, 0,.2);
          margin-top: 20px;
          cursor: pointer;
          img {
            width: 140px;
          }
          p {
            margin: 0;
            padding: 0;
            font-size: 14px; 
            color: #555;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          span {
            font-size: 12px;
            color: #888;
          }
        }
      }
    }
    .musicMain::after {
      content:'';
      display: block;
      clear: both;
    }
  }
</style>