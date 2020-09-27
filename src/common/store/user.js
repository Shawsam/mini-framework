import { observable } from 'mobx'

const userStore = observable({
	authorizeShow:false,
    registerShow:true,
    userInfo:{
    	point:'--'
    },
	setUserInfo(userInfo){
		console.log('**setUserInfo--更新用户数据**');
		userInfo = { ...this.userInfo, ...userInfo }
		this.userInfo = userInfo;    
	},
    setAuthorizeShow(state){
    	console.log('**setAuthorizeShow--授权弹窗**')
    	this.authorizeShow = state;
    },
    setRegisterShow(state){
        console.log('**setRegisterShow--注册弹窗**')
        this.authorizeShow = state;
    },
    get isAuthorized(){
    	return !!this.userInfo.nickName;
    },
    get isRegister(){
        return !!this.userInfo.userId;
    }
})

export default userStore