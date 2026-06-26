Component({
  properties: {
    article: { type: Object, value: {} }
  },
  data: {
    category: '',
    title: '',
    summary: '',
    source: '',
    time: ''
  },
  observers: {
    'article': function(article) {
      if (article) {
        this.setData({
          category: article.category || '',
          title: article.title || '',
          summary: article.summary || '',
          source: article.source || '',
          time: article.time || ''
        })
      }
    }
  },
  methods: {
    onTap() {
      this.triggerEvent('taparticle', { article: this.properties.article })
    }
  }
})
