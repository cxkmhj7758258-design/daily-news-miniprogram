Page({
  data: {
    title: '',
    category: '',
    source: '',
    time: '',
    content: ''
  },

  onLoad(options) {
    if (options.data) {
      try {
        const article = JSON.parse(decodeURIComponent(options.data))
        this.setData({
          title: article.title || '',
          category: article.category || '',
          source: article.source || '',
          time: article.time || '',
          content: article.summary || article.content || '详细内容请查看原文'
        })
      } catch (e) {
        console.error('Parse error:', e)
      }
    }
  },

  goBack() {
    wx.navigateBack()
  },

  onShareAppMessage() {
    return {
      title: this.data.title,
      path: '/pages/article/article'
    }
  }
})
