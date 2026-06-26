Page({
  data: { cat: '', title: '', source: '', time: '', summary: '', url: '' },

  onLoad(opts) {
    const cat = opts.cat || ''
    const title = decodeURIComponent(opts.title || '')
    const app = getApp()
    const c = app.globalData.categories.find(x => x.id === cat)

    // 从全局 mock 数据查找
    const db = {
      politics:[{title:'全国碳市场成交额突破200亿',summary:'碳排放权交易市场累计成交额突破200亿元大关，参与企业同比增长35%。',source:'新华社',time:'昨天 18:30'}],
      tech:[{title:'国产大模型多基准测试登顶',summary:'国产AI大模型在国际基准测试中取得领先成绩。',source:'36氪',time:'昨天 20:00'}],
      finance:[{title:'A股三大指数集体收涨',summary:'沪指涨0.8%报3150点，两市成交额突破万亿。',source:'证券时报',time:'昨天 15:30'}],
      usStocks:[{title:'纳指再创新高 科技股领涨',summary:'纳斯达克指数收涨1.2%再创新高。',source:'华尔街见闻',time:'今天 05:30'}],
      sports:[{title:'中国女排世联赛五连胜',summary:'3-0完胜对手提前锁定总决赛席位。',source:'央视体育',time:'昨天 22:00'}],
      swimming:[{title:'张雨霏全国赛夺金',summary:'以56秒12达标世锦赛。',source:'央视体育',time:'昨天 21:00'}],
      entertainment:[{title:'暑期档电影票房破30亿',summary:'科幻纪元持续领跑票房榜。',source:'猫眼电影',time:'昨天 23:00'}],
      health:[{title:'三伏天饮食调理指南',summary:'中医专家建议夏季饮食宜清淡。',source:'健康时报',time:'昨天 10:00'}],
      world:[{title:'联合国气候大会达成新协议',summary:'各国达成阶段性协议。',source:'环球网',time:'昨天 21:00'}],
      game:[{title:'国产独立游戏获提名',summary:'首次入围最佳叙事奖。',source:'游民星空',time:'昨天 19:00'}],
      local:[{title:'地铁5号线开通',summary:'全长35公里共22站。',source:'本地新闻',time:'昨天 09:00'}]
    }

    const items = db[cat] || db['tech']
    const item = items.find(n => n.title === title) || items[0]
    if (item) {
      this.setData({
        cat: c ? c.name : '',
        title: item.title,
        source: item.source,
        time: item.time,
        summary: item.summary
      })
    }
  },

  back() { wx.navigateBack() },
  onShareAppMessage() { return { title: this.data.title, path: '/pages/article/article' } }
})
