import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {
  userid: 0,// 存放网易云用户id
  playlist: [], //存放歌单中所有的歌曲
  playMusicMsg: {}, // 存放当前播放歌曲的信息
  playMusicTime: {currentTime: '00:00', totalTime: '00:00',progressWidth:{width: '0%'}},// 存放当前播放歌曲的时间信息
  showPlayBtn: true,//控制播放按钮的显示与隐藏
  showPlayMusic: false,// 是否显示播放界面
  showSecMusic: false,// 显示音乐二级导航菜单
  oldArticleVal: '',
  newArticleVal: '',
}

const mutations = { 
  // 获取用户id
  getUserId(state,n) {
    return state.userid = n
  },
  // 获取歌单列表
  getPlaylist(state,list) {
    return state.playlist = list
  },
  // 获取歌曲信息
  getMusicMsg(state,obj) {
    return state.playMusicMsg = obj
  },
  // 控制播放暂停按钮的显示与隐藏
  updateMusicBtn(state,boo) {
    return state.showPlayBtn = boo
  },
  // 获取音乐播放信息
  getMusicTime(state,obj) {
    return state.playMusicTime = obj
  },
  // 控制音乐界面是否出现
  updatePlayMusic(state,boo) {
    return state.showPlayMusic = boo
  },
  getSecMusic(state,boo) {
    return state.showSecMusic = boo
  },
  getOldArticleVal(state,str) {
    return state.oldArticleVal = str
  },
  getNewArticleVal(state,str) {
    return state.newArticleVal = str
  }
}


export default new Vuex.Store({
  state,
  mutations,
  // actions
})