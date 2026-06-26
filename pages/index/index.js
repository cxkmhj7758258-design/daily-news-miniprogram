Page({
  data: {
    dateStr: '',
    loading: true,
    hasCategories: false,
    newsList: [],
    groupedNews: [],
    categories: []
  },

  onLoad() {
    this.updateDate()
    this.loadCategories()
    this.loadNews()
  },

  onShow() {
    this.loadCategories()
    this.loadNews()
  },

  onPullDownRefresh() {
    this.loadNews(() => {
      wx.stopPullDownRefresh()
    })
  },

  updateDate() {
    const now = new Date()
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const month = now.getMonth() + 1
    const day = now.getDate()
    const weekday = weekdays[now.getDay()]
    this.setData({ dateStr: `${month}月${day}日 星期${weekday}` })
  },

  loadCategories() {
    const app = getApp()
    const allCategories = app.globalData.categories
    const selected = wx.getStorageSync('selectedCategories') || []
    const cats = allCategories.filter(c => selected.includes(c.id))
    this.setData({ 
      categories: cats,
      hasCategories: cats.length >= 3
    })
  },

  loadNews(callback) {
    this.setData({ loading: true })
    const selected = wx.getStorageSync('selectedCategories') || []

    if (selected.length < 3) {
      this.setData({ loading: false, newsList: [], groupedNews: [] })
      callback && callback()
      return
    }

    // 尝试从云开发获取新闻
    if (wx.cloud) {
      wx.cloud.callFunction({
        name: 'aggregateNews',
        data: { categories: selected, date: new Date().toISOString().split('T')[0] }
      }).then(res => {
        const news = res.result || []
        this.processNews(news)
      }).catch(() => {
        // 云函数暂未部署，使用模拟数据
        this.loadMockNews()
      }).finally(() => {
        this.setData({ loading: false })
        callback && callback()
      })
    } else {
      this.loadMockNews(() => {
        this.setData({ loading: false })
        callback && callback()
      })
    }
  },

  loadMockNews(callback) {
    const mockData = {
      politics: [
        { id: 'p1', category: '时政', title: '全国碳市场交易规模持续扩大', summary: '截至6月25日，全国碳排放权交易市场累计成交额突破200亿元大关，参与交易企业数量同比增长35%。', source: '新华社', time: '昨天 18:30' },
        { id: 'p2', category: '时政', title: '新型城镇化建设取得新进展', summary: '住建部发布最新数据，全国常住人口城镇化率达到67.8%，城乡居民收入差距持续缩小。', source: '人民日报', time: '昨天 15:00' }
      ],
      tech: [
        { id: 't1', category: '科技', title: '国产大模型在多个基准测试中登顶', summary: '多家国产AI大模型在最新一轮国际基准测试中取得领先成绩，在推理、代码生成等任务上表现突出。', source: '36氪', time: '昨天 20:00' },
        { id: 't2', category: '科技', title: '量子计算原型机取得突破性进展', summary: '九章团队发布新一代量子计算原型机，在特定计算任务上实现超越经典超算的算力优势。', source: '科技日报', time: '昨天 14:00' }
      ],
      finance: [
        { id: 'f1', category: '财经', title: 'A股三大指数集体收涨', summary: '6月25日，A股三大指数全线上涨，沪指涨0.8%报3150点，两市成交额突破万亿，北向资金净流入超80亿元。', source: '证券时报', time: '昨天 15:30' },
        { id: 'f2', category: '财经', title: '新能源汽车销量再创新高', summary: '乘联会数据显示，6月前三周新能源乘用车零售同比增长42%，渗透率首次突破55%。', source: '第一财经', time: '昨天 16:00' }
      ],
      sports: [
        { id: 's1', category: '体育', title: '中国女排在世界联赛中取得五连胜', summary: '中国女排在世联赛比赛中以3-0完胜对手，取得五连胜战绩，提前锁定总决赛席位。', source: '央视体育', time: '昨天 22:00' }
      ],
      entertainment: [
        { id: 'e1', category: '娱乐', title: '暑期档电影票房突破30亿', summary: '据猫眼专业版数据，2026年暑期档电影总票房已突破30亿元，《科幻纪元》持续领跑票房榜。', source: '猫眼电影', time: '昨天 23:00' }
      ],
      health: [
        { id: 'h1', category: '健康', title: '夏季养生：三伏天饮食调理指南', summary: '入伏在即，中医专家建议夏季饮食宜清淡，适当食用苦味食物，避免贪凉过度伤及脾胃。', source: '健康时报', time: '昨天 10:00' }
      ],
      world: [
        { id: 'w1', category: '国际', title: '联合国气候变化大会达成新协议', summary: '经过两周紧张谈判，各国代表在最新一轮气候大会上就碳排放减排目标达成阶段性协议。', source: '环球网', time: '昨天 21:00' }
      ],
      game: [
        { id: 'g1', category: '游戏', title: '国产独立游戏获国际大奖提名', summary: '一款国产像素风独立游戏获得年度游戏大奖最佳叙事奖提名，是中国独立游戏首次入围该奖项。', source: '游民星空', time: '昨天 19:00' }
      ],
      local: [
        { id: 'l1', category: '本地', title: '城市地铁新线路今日开通试运营', summary: '地铁5号线今日正式开通试运营，全长35公里，共设22座车站，连接城市南北主要商圈。', source: '本地新闻', time: '昨天 09:00' }
      ]
    }

    const selected = wx.getStorageSync('selectedCategories') || []
    const app = getApp()
    const allCategories = app.globalData.categories
    const filteredCats = allCategories.filter(c => selected.includes(c.id))

    const allNews = []
    filteredCats.forEach(cat => {
      const items = mockData[cat.id] || []
      allNews.push(...items.map(item => ({ ...item, icon: cat.icon })))
    })

    this.processNews(allNews)
    callback && callback()
  },

  processNews(newsList) {
    const app = getApp()
    const allCategories = app.globalData.categories
    const selected = wx.getStorageSync('selectedCategories') || []
    
    // 按领域分组
    const grouped = []
    allCategories.filter(c => selected.includes(c.id)).forEach(cat => {
      const list = newsList.filter(n => n.category === cat.name)
      if (list.length > 0) {
        grouped.push({
          category: cat.id,
          icon: cat.icon,
          name: cat.name,
          list: list
        })
      }
    })

    this.setData({ newsList, groupedNews: grouped })
  },

  onArticleTap(e) {
    const { article } = e.detail
    wx.navigateTo({
      url: `/pages/article/article?data=${encodeURIComponent(JSON.stringify(article))}`
    })
  },

  goSettings() {
    wx.switchTab({ url: '/pages/settings/settings' })
  }
})
