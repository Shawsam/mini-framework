import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import './index.scss'

class Panel extends Component {

  static defaultProps = {
      data:{
          title:'提示',
          msg:'内容',
          cancelText:'取消',
          confirmText:'确定',
          showCancel:true,
          cancel:Function,
          confirm:Function
      }
  }
  
  render () {
    const { panelShow, data } = this.props;
    return (
        <View>
        { 
          panelShow && <View className='panel'>
              <View className="shadow"></View>
              <View className="panelContent" catchTouchMove="ture">
                  <View className="title">{data.title||'提示'}</View>
                  <View className="content">{data.msg}</View>
                  <View className="bottom">
                      {data.showCancel && <View onClick={data.cancel} className="btn btnCancel">{data.cancelText||'取消'}</View>}
                      <View onClick={data.confirm} className="btn">{data.confirmText||'确定'}</View>
                  </View> 
              </View>
          </View>    
        }     
        </View>   
    )
  }
}
export default Panel;