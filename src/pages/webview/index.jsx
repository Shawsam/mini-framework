import Taro, { Component } from '@tarojs/taro'
import { Text, View, Swiper, SwiperItem } from '@tarojs/components'
import Loading from "../../components/Loading";

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      url: ''
    }
  }
  config = {
    navigationBarTitleText: "",
    navigationStyle: 'default'
  }

  componentWillMount() {
    let url = this.$router.params.url;
    url = 'https://item.jd.com/10021851288971.html';
    this.setState({ isLoading: false, url: url })
  }

  render() {
    const { isLoading, url } = this.state;
    return (
      <View className='page'>
          { isLoading?<Loading />:
            <View className='container webview'>  
                <ScrollView className="wrapper" scrollY>
                  <WebView src={url}  />
                </ScrollView>
            </View>
          }
      </View>
    )
  }
}
