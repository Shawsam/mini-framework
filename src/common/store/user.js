import { observable } from 'mobx'

const userStore = observable({
	authorizeShow:false,
    registerShow:false,
    userInfo:{
    	point:'--',
        levelName:'普通会员',
        avatarUrl:require('../../assets/images/avatar.png')
    },
	setUserInfo(userInfo){
		console.log('**更新用户数据**');
		userInfo = { ...this.userInfo, ...userInfo }
		this.userInfo = userInfo;    
	},
    setAuthorizeShow(state){
    	console.log(`**${state?'打开':'关闭'}授权弹窗**`)
    	this.authorizeShow = state;
    },
    setRegisterShow(state){
        console.log(`**${state?'打开':'关闭'}注册弹窗**`)
        this.registerShow = state;
    },
    get isAuthorized(){
    	return !!this.userInfo.nickName;
    },
    get isRegister(){
        return !!this.userInfo.userId;
    }
})

export default userStore