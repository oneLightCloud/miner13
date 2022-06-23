/* 新增建议页面 */

Page({
  // 保存编辑中的信息
  data: {
    title: '',
    desc: '',
    files: [],
    fileName: '',
    freqOptions: ['是', '否'],
    freq: 0,
    a:[],
    b:[],
    length:' ',
    tt:' '
  },

  // 表单输入处理函数
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },

  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  // 上传新附件
  async addFile() {
    // 限制附件个数
    if (this.data.files.length + 1 > getApp().globalData.fileLimit) {
      wx.showToast({
        title: '数量达到上限',
        icon: 'error',
        duration: 2000
      })
      return
    }
    // 从会话选择文件
    wx.chooseMessageFile({
      count: 1
    }).then(res => {
      const file = res.tempFiles[0]
      // 上传文件至云存储
      getApp().uploadFile(file.name,file.path).then(res => {
        // 追加文件记录，保存其文件名、大小和文件 id
        this.data.files.push({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          id: res.fileID
        })
        // 更新文件显示
        this.setData({
          files: this.data.files,
          fileName: this.data.fileName + file.name + ' '
        })
      })
    })
  },

  // 响应事件状态选择器
  onChooseFreq(e) {
    this.setData({
      freq: e.detail.value
    })
  },

  // 保存待办
  async saveTodo() {
    // 对输入框内容进行校验
    if (this.data.title.length > 10) {
      wx.showToast({
        title: '事项标题过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.desc.length > 10) {
      wx.showToast({
        title: '事项描述过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    const db = await getApp().database()
    // 在数据库中新建待办事项，并填入已编辑对信息
    db.collection(getApp().globalData.collection).add({
      data: {
        title: this.data.title,       // 待办标题
        desc: this.data.desc,         // 待办描述
        files: this.data.files,       // 待办附件列表
        freq: Number(this.data.freq), // 待办完成情况（提醒频率）
        star: false
      }
    }).then(() => {
      wx.navigateBack({
        delta: 0,
      })
    })
  },

  // 重置所有表单项
  resetTodo() {
    this.setData({
      title: '',
      desc: '',
      files: [],
      fileName: '',
      freqOptions: ['是', '否'],
      freq: 0
    })
  },

//想弄一个定时提醒，所需API格式
Onload:function(){  
  this.setData({
    a:[1,2,3],
    b:[4,5,6],
    length:3,
    tt:{freqOptions}
  })  
  this.DaoJiShi();//执行DaoJiShi函数
  setTimeout(this.DaoJiShi, 1000);//设置每隔一秒执行一次倒计时函数。(1ms*1000==1s)
},
//以下为倒计时函数声明
//函数末尾又调用了设定倒计时函数，实现了一个递归。不停的调用。
DaoJiShi:function(){
  let newTime = new Date().getTime();
  let endTime = new Date(this.data.actEndTimeList).getTime();
  //console.log(endTime);
  //console.log(newTime);
  //console.log(endTime - newTime);
  if(endTime-newTime > 0){//如果未达到时间
    let Time = (endTime - newTime)/1000;//换算时间
    let day = parseInt(Time / 3600 / 24) ;
    let hou = parseInt((Time % (3600 * 24) /3600));
    let min = parseInt((Time %3600) / 60);
    let sec = parseInt((Time % 3600) % 60);
    this.setData({ DaysRemain: day, HourRemain: hou, MinuteRemain: min, SecondRemain: sec });
  }else{
    this.setData({ DaysRemain: '0', HourRemain: '0', MinuteRemain: '0', SecondRemain: '0' });
  }
  setTimeout(this.DaoJiShi, 1000);
}
})