import Taro from '@tarojs/taro';

const globalData = {};

export const setGlobalData=(key, val)=>{
    globalData[key] = val
}

export const getGlobalData=(key)=>{
    return globalData[key]
}

export const setStorage=(key, val)=>{
	Taro.setStorage({
		key: key,
		data: val
	}).then(() => {})
}

export const getStorage=(key)=>{
  try {
    const value = Taro.getStorageSync(key)
    if (value) {
      return value
    }
  } catch (err) {
  	console.log(err)
  }
}

//页面分享
export const shareMessage = ()=>{
    return {
        title: '一杯tims咖啡，开启鲜活一天！',
        imageUrl:"https://cnshacc1oss01.oss-cn-shanghai.aliyuncs.com/tims1594624370142a.jpg",
        path: 'pages/index/index'
    }
}

//版本更新
export const versionUpdate = ()=>{
    const updateManager = Taro.getUpdateManager(); 
    updateManager.onUpdateReady(() => {
		Taro.showModal({
		    title: '更新提示',
		    content: '新版本已经准备好，是否重启应用？',
		    showCancel: false,
		    success(res) {
		      if (res.confirm) {
		        updateManager.applyUpdate()
		      }
		    }
		})
    })
}