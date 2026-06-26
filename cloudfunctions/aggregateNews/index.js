const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { categories, date } = event
  
  if (!categories || categories.length === 0) {
    return { code: 0, data: [], message: '未选择关注领域' }
  }

  try {
    const db = cloud.database()
    const newsCollection = db.collection('news')
    
    const dbResult = await newsCollection.where({
      date: date,
      category: db.command.in(categories)
    }).get()

    if (dbResult.data && dbResult.data.length > 0) {
      return { code: 0, data: dbResult.data }
    }

    const newsDB = {
      politics: [
        { category: '时政', title: '全国碳市场交易规模持续扩大', summary: '截至6月25日，全国碳排放权交易市场累计成交额突破200亿元大关。', source: '新华社', time: '昨天 18:30', url: '' },
        { category: '时政', title: '新型城镇化建设取得新进展', summary: '住建部发布最新数据，全国常住人口城镇化率达到67.8%。', source: '人民日报', time: '昨天 15:00', url: '' }
      ],
      tech: [
        { category: '科技', title: '国产大模型在多个基准测试中登顶', summary: '国产AI大模型在最新一轮国际基准测试中取得领先成绩。', source: '36氪', time: '昨天 20:00', url: '' },
        { category: '科技', title: '量子计算原型机取得突破性进展', summary: '九章团队发布新一代量子计算原型机。', source: '科技日报', time: '昨天 14:00', url: '' }
      ],
      finance: [
        { category: '财经', title: 'A股三大指数集体收涨', summary: '沪指涨0.8%报3150点，两市成交额突破万亿。', source: '证券时报', time: '昨天 15:30', url: '' },
        { category: '财经', title: '新能源汽车销量再创新高', summary: '新能源乘用车渗透率首次突破55%。', source: '第一财经', time: '昨天 16:00', url: '' }
      ],
      usStocks: [
        { category: '美股', title: '美股三大指数涨跌互现 纳指创新高', summary: '纳斯达克指数收涨1.2%，再创历史新高，科技股领涨。', source: '华尔街见闻', time: '今天 05:30', url: '' },
        { category: '美股', title: '英伟达市值突破4万亿美元', summary: 'AI芯片巨头英伟达股价持续攀升，市值首破4万亿美元。', source: '财联社', time: '今天 06:00', url: '' },
        { category: '美股', title: '特斯拉二季度交付量超预期', summary: '特斯拉全球交付量达48.6万辆，超出市场预期。', source: '第一财经', time: '今天 04:00', url: '' }
      ],
      sports: [
        { category: '体育', title: '中国女排在世界联赛中取得五连胜', summary: '提前锁定总决赛席位。', source: '央视体育', time: '昨天 22:00', url: '' }
      ],
      swimming: [
        { category: '游泳', title: '全国游泳锦标赛：张雨霏夺女子100蝶金牌', summary: '张雨霏以56秒12夺得女子100米蝶泳金牌，达标世锦赛。', source: '央视体育', time: '昨天 21:00', url: '' },
        { category: '游泳', title: '世锦赛中国队接力项目有望冲金', summary: '男子4×100米混合泳和女子4×200米自由泳接力项目具备夺金实力。', source: '新华社', time: '昨天 16:00', url: '' },
        { category: '游泳', title: '如何提高自由泳效率', summary: '保持身体水平、高肘划水、节奏呼吸三大关键技巧。', source: '游泳杂志', time: '昨天 10:00', url: '' }
      ],
      entertainment: [
        { category: '娱乐', title: '暑期档电影票房突破30亿', summary: '科幻纪元持续领跑票房榜。', source: '猫眼电影', time: '昨天 23:00', url: '' }
      ],
      health: [
        { category: '健康', title: '夏季养生：三伏天饮食调理指南', summary: '中医专家建议夏季饮食宜清淡。', source: '健康时报', time: '昨天 10:00', url: '' }
      ],
      world: [
        { category: '国际', title: '联合国气候变化大会达成新协议', summary: '各国就碳排放减排目标达成阶段性协议。', source: '环球网', time: '昨天 21:00', url: '' }
      ],
      game: [
        { category: '游戏', title: '国产独立游戏获国际大奖提名', summary: '首次入围该奖项。', source: '游民星空', time: '昨天 19:00', url: '' }
      ],
      local: [
        { category: '本地', title: '城市地铁新线路今日开通', summary: '全长35公里，共设22座车站。', source: '本地新闻', time: '昨天 09:00', url: '' }
      ]
    }

    const news = []
    categories.forEach(cat => {
      const items = newsDB[cat] || []
      items.forEach(n => {
        news.push({
          ...n,
          _id: `${cat}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          date: date,
          createdAt: new Date()
        })
      })
    })
    
    return { code: 0, data: news }
  } catch (err) {
    console.error('aggregateNews error:', err)
    return { code: -1, message: err.message }
  }
}
