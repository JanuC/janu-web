import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const state = {
  userid: 0,// 存放网易云用户id
  playlist: [], //存放歌单中所有的歌曲
  playMusicMsg: {}, // 存放当前播放歌曲的信息
  playMusicTime: {currentTime: '00:00', totalTime: '00:00',progressWidth:{width: '0%'}},// 存放当前播放歌曲的时间信息
  showPlayBtn: true,//控制播放按钮的显示与隐藏
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
  getMusicTime(state,obj) {
    return state.playMusicTime = obj
  },
}


export default new Vuex.Store({
  state,
  mutations,
  // actions
})