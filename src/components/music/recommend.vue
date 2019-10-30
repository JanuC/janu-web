<template>
  <div class="musicContent">
    <div class="category">
      <span>全部</span>
      <button class="categoryBtn" @click="createCategory">选择分类</button>
      <div class="choice" v-show="showCatefory">
        <div class="all">
          <a href="javascript: void(0)">全部风格</a>
        </div>
        <div class="box1"></div>
        <dl class="dl" v-for="(item,index) in dtArr" :key="index" height="300px" ref="dl">
            <dt>{{item}}</dt>
            <dd ref="dd">
              <a href="javascript:void(0)" class="dd-a"  v-for="(items,indexs) in newddArr(index)" :key="indexs" >{{items.name}}</a>
            </dd>
        </dl>
      </div>
      <span class="hot">热门</span>
      
    </div>
    <div class="musicMain">
      <ul>
        <li v-for="(item,index) in playlistArr" :key="index">
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
const address = "http://localhost:3000";
export default {
  data() {
    return {
      dtArr: [],// 存放dt标签中的数据
      ddArr:[],// 存放dd标签中的数据
      showCatefory: false,// 显示选择分类
      playlistArr: [],//歌单列表
    }
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
    // 进入页面,发送请求,获取全部歌单
    axios
      .get(address + '/top/playlist?limit=100')
      .then(res => {
        console.log(res);
        if(res.data.code === 200) {
          res.data.playlists.forEach(item => {
            this.playlistArr.push(item)
          })
        }
      })  
  },
  computed: {
    newddArr() {
      return index => {
        const newArr = this.ddArr.filter(item => {
          return item.category === index
        })
        return newArr
      }
    }
  },
  methods: {
    createCategory() {
      for (let i = 0; i < this.$refs.dl.length; i++) {
        this.$refs.dl[i].style.height = this.$refs.dd[i].offsetHeight + 'px'
        }
      this.showCatefory =!this.showCatefory;
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
        right: 0;
        top: 10px;
      }
      .choice {
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
            // height: 100%;
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
              // white-space: nowrap;
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
          // z-index: -100;
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
      }
    }
    .musicMain {
      width: 100%;
      height: 100%;
      margin-top: 10px;
      // background: pink;
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
            // width: 100%;
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