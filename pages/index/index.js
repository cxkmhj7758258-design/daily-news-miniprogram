Page({
  data: { dateStr: '', loading: true, hasCats: false, groups: [] },

  onLoad() { this.updDate(); this.load(); },
  onShow() { this.load(); },
  onPullDownRefresh() { this.load(() => wx.stopPullDownRefresh()) },

  updDate() {
    const n = new Date(), w = ['日','一','二','三','四','五','六']
    this.setData({ dateStr: `${n.getMonth()+1}月${n.getDate()}日 星期${w[n.getDay()]}` })
  },

  load(cb) {
    this.setData({ loading: true })
    const sel = wx.getStorageSync('selectedCategories') || []
    const app = getApp()
    const cats = app.globalData.categories.filter(c => sel.includes(c.id))
    this.setData({ hasCats: cats.length >= 3 })

    if (sel.length < 3) {
      this.setData({ loading: false, groups: [] })
      cb && cb(); return
    }

    if (wx.cloud) {
      wx.cloud.callFunction({
        name: 'aggregateNews',
        data: { categories: sel, date: new Date().toISOString().split('T')[0] }
      }).then(res => { this.process(res.result || []) })
        .catch(() => { this.loadMock() })
        .finally(() => { this.setData({ loading: false }); cb && cb() })
    } else {
      this.loadMock(() => { this.setData({ loading: false }); cb && cb() })
    }
  },

  loadMock(cb) {
    const db = {
      politics:[{id:'p1',category:'时政',title:'全国碳市场成交额突破200亿',summary:'碳排放权交易市场累计成交额突破200亿元大关，参与企业同比增长35%。',source:'新华社',time:'昨天 18:30'}],
      tech:[{id:'t1',category:'科技',title:'国产大模型多基准测试登顶',summary:'国产AI大模型在国际基准测试中取得领先成绩，推理、代码生成表现突出。',source:'36氪',time:'昨天 20:00'}],
      finance:[{id:'f1',category:'财经',title:'A股三大指数集体收涨',summary:'沪指涨0.8%报3150点，两市成交额突破万亿。',source:'证券时报',time:'昨天 15:30'}],
      usStocks:[{id:'u1',category:'美股',title:'纳指再创新高 科技股领涨',summary:'纳斯达克指数收涨1.2%，美联储暗示年内或降息一次。',source:'华尔街见闻',time:'今天 05:30'}],
      sports:[{id:'s1',category:'体育',title:'中国女排世联赛五连胜',summary:'3-0完胜对手提前锁定总决赛席位。',source:'央视体育',time:'昨天 22:00'}],
      swimming:[{id:'sw1',category:'游泳',title:'张雨霏全国赛女子100蝶夺金',summary:'以56秒12达标世锦赛。',source:'央视体育',time:'昨天 21:00'}],
      entertainment:[{id:'e1',category:'娱乐',title:'暑期档电影票房破30亿',summary:'科幻纪元持续领跑票房榜。',source:'猫眼电影',time:'昨天 23:00'}],
      health:[{id:'h1',category:'健康',title:'三伏天饮食调理指南',summary:'中医专家建议夏季饮食宜清淡。',source:'健康时报',time:'昨天 10:00'}],
      world:[{id:'w1',category:'国际',title:'联合国气候大会达成新协议',summary:'各国就碳排放减排目标达成阶段性协议。',source:'环球网',time:'昨天 21:00'}],
      game:[{id:'g1',category:'游戏',title:'国产独立游戏获国际大奖提名',summary:'国产像素风独立游戏首次入围最佳叙事奖。',source:'游民星空',time:'昨天 19:00'}],
      local:[{id:'l1',category:'本地',title:'地铁5号线今日开通运营',summary:'全长35公里共22站。',source:'本地新闻',time:'昨天 09:00'}]
    }
    const sel = wx.getStorageSync('selectedCategories') || []
    const app = getApp()
    const flt = app.globalData.categories.filter(c => sel.includes(c.id))
    const allNews = []
    flt.forEach(cat => { (db[cat.id] || []).forEach(n => { allNews.push({...n, icon: cat.icon}) }) })
    this.process(allNews)
    cb && cb()
  },

  process(list) {
    const sel = wx.getStorageSync('selectedCategories') || []
    const app = getApp()
    const groups = []
    app.globalData.categories.filter(c => sel.includes(c.id)).forEach(cat => {
      const items = list.filter(n => n.category === cat.name)
      if (items.length) groups.push({ cat: cat.id, icon: cat.icon, name: cat.name, list: items })
    })
    this.setData({ groups })
  },

  onTap(e) {
    const { cat, title } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/article/article?cat=${cat}&title=${encodeURIComponent(title)}`
    })
  },

  goSettings() { wx.switchTab({ url: '/pages/settings/settings' }) }
})
