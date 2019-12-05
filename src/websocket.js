// 连接地址
const address = "ws://v1.janulog.com:3003/islogin"
let ws = null

// 初始化 websocket
function initWebSocket() {
  ws = new WebSocket(address)
  return new Promise((resolve,reject) => {
    ws.onopen = () => {
      resolve ("连接成功")
    }
    ws.onmessage = (e) => {
      getMessage(e)
    }
    
    ws.onclose = (e) => {
      closeWebSocket(e)
    }
    ws.onerror = () => {
      reject("连接失败")
    }
  })
}

// 实际调用的方法
async function sendSock(data) {
  let res = await initWebSocket()
  if(ws.readyState === 1) {
    // 连接成功
    // 发送请求
    sendMessage(data)
    // 关闭连接
    ws.onclose()
  }
}

// 接收请求
function getMessage(e) {
  if(JSON.parse(e.data)) {
    alert("时间快到啦，先保存一下文章吧~")
  }
}
// 发送请求
function sendMessage(data) {
  ws.send(JSON.stringify(data))
}
// 关闭请求
function closeWebSocket() {
  console.log("已关闭websocket");
}

export {
  sendSock
}