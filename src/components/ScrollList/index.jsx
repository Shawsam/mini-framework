import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import LoadingView from '../loadingView'
import './index.scss'

class ScrollList extends Component {

  static defaultProps = {
    emptyImg:require('./images/empty.png'),
    emptyStr:'暂无数据',
    scrollTop: 0,
    isInit:false,
    bgtype:0,
    dataLength:0,
    pullToRefresh: Function,
    pullToLoad: Function
  };

  state = {
      triggered:false
  }
  
  //下拉刷新
  pullToRefresh(){
      if (this._freshing) return;
      this.setState({triggered:true}); 
      this._freshing = true;
      Taro.vibrateShort();
      setTimeout(()=>{
          this.props.pullToRefresh().then(res=>{
              this._freshing = false;
              this.setState({triggered:false});  
          });
      },800)
  }
  
  //触底加载
  pullToLoad(){
      if (this._freshing || this.props.noMore) return;
      if(this.props.pullToLoad){
        this._freshing = true;
        this.props.pullToLoad().then(res=>{
            this._freshing = false;
        });
      }
  }
  
  render () {
    const { triggered } = this.state;
    const { emptyImg , emptyStr, hideNoMore, scrollTop, isInit, dataLength, noMore,bgtype } = this.props;
    console.log(dataLength)
    return (
        <View className='scrollList'>
        {
            isInit?null:
            <ScrollView className="listCon" 
                        scrollY='true' 
                        refresherEnabled="true"  
                        refresherThreshold="100" 
                        lower-threshold="300"
                        hideNoMore = { hideNoMore }
                        scrollTop = { scrollTop }
                        refresherTriggered={ triggered } 
                        onRefresherRefresh={ this.pullToRefresh }
                        onScrollToLower={ this.pullToLoad }>
                {   dataLength?
                    <View className={ `list  ${bgtype==1?'padtop':''}` }>
                        <slot></slot>
                        { hideNoMore?null:
                          <View>{  noMore || dataLength%10?<View className='noMore'>没有更多数据了~</View>:<LoadingView />  }</View>
                        }
                    </View>:
                    <View className={ `${bgtype==1?'emptyBg':''}` }>
                        <View className='empty'> 
                            <Image mode="widthFix" className="image" src={emptyImg}/>
                            <View className="text">{emptyStr}</View>
                        </View>
                    </View>
                     
                }
                {
                    triggered && <View className="shadow"></View>
                }
            </ScrollView>
        }   
        </View>            
    )
  }
}
export default ScrollList;