import { BusinessAuditResult } from '../types';

export function generateFallbackReport(
  url: string,
  projectName: string,
  analysisMode?: 'quick_scan' | 'single_mentor' | 'mentor_board',
  selectedMentors?: string[],
  language: 'en' | 'zh-CN' = 'en'
): BusinessAuditResult {
  const finalScore = 78;

  const mentorGlossaryEn: Record<string, { mentorName: string; lens: string; score: number; verdict: string; keyAdvice: string[]; blindSpot: string }> = {
    elon_musk: {
      mentorName: 'Elon Musk',
      lens: 'Musk-style Scale Lens',
      score: 75,
      verdict: 'Good utility, but lacks massive system leverage to command broad market share.',
      keyAdvice: [
        'Automate the HTML extraction scraper to crawl thousands of sites concurrently.',
        'Open API hooks to build an ecosystem rather than a standalone dashboard.'
      ],
      blindSpot: 'Requires heavy upfront cloud infrastructure configuration.'
    },
    steve_jobs: {
      mentorName: 'Steve Jobs',
      lens: 'Jobs-style Positioning Lens',
      score: 82,
      verdict: 'Clear layout value, but value proposition copy could be vastly simplified.',
      keyAdvice: [
        'Strip non-essential details from the dashboard to elevate focus on the score.',
        'Position the seal certificate as an emotional badge of honor.'
      ],
      blindSpot: 'Tends to overlook the raw engineering workflow requirements of developers.'
    },
    naval_ravikant: {
      mentorName: 'Naval Ravikant',
      lens: 'Naval-style Solo Leverage Lens',
      score: 90,
      verdict: 'Excellent product for a solo developer utilizing code and content leverage.',
      keyAdvice: [
        'Keep running costs minimal by hosting backend functions exclusively on Cloudflare Workers.',
        'Let product quality drive word-of-mouth adoption without paid sales staff.'
      ],
      blindSpot: 'Vulnerable to sudden changes in upstream LLM api billing models.'
    },
    larry_ellison: {
      mentorName: 'Larry Ellison',
      lens: 'Ellison-style Enterprise Lens',
      score: 76,
      verdict: 'Good utility, but needs direct B2B corporate sales locking mechanisms.',
      keyAdvice: [
        'Create enterprise seats controls and target design agencies.',
        'Bundle active audits into a client reporting white-label PDF.'
      ],
      blindSpot: 'High touch sales cycle takes away velocity.'
    },
    mark_zuckerberg: {
      mentorName: 'Mark Zuckerberg',
      lens: 'Zuckerberg-style Growth Lens',
      score: 80,
      verdict: 'Lacks built-in viral distribution features to capture high growth speeds.',
      keyAdvice: [
        'Establish direct invite credits bonuses to turn users into promoters.',
        'Inject watermark seal badges onto all generated public dashboards.'
      ],
      blindSpot: 'Growth loops may dilute the professional brand of validation seals.'
    },
    jeff_bezos: {
      mentorName: 'Jeff Bezos',
      lens: 'Bezos-style Flywheel Lens',
      score: 84,
      verdict: 'Needs to reinvest data margins to create a structural operations moat.',
      keyAdvice: [
        'Collect anonymized project metadata to construct market readiness reports.',
        'Continuously lower query latency and costs to build operational leverage.'
      ],
      blindSpot: 'Requires significant upfront volume to initiate the data flywheel.'
    }
  };

  const mentorGlossaryZh: Record<string, { mentorName: string; lens: string; score: number; verdict: string; keyAdvice: string[]; blindSpot: string }> = {
    elon_musk: {
      mentorName: 'Elon Musk',
      lens: '马斯克式规模化视角',
      score: 75,
      verdict: '实用性不错，但缺乏庞大的系统杠杆来掌控广泛的市场份额。',
      keyAdvice: [
        '使 HTML 提取爬虫自动化，以并发爬取数千个网站。',
        '开放 API 钩子以构建生态系统，而非单一的仪表板。'
      ],
      blindSpot: '需要繁重的前期云基础设施配置。'
    },
    steve_jobs: {
      mentorName: 'Steve Jobs',
      lens: '乔布斯式产品定位视角',
      score: 82,
      verdict: '布局价值清晰，但价值主张文案可以大大简化。',
      keyAdvice: [
        '从仪表板中剥离非必要细节，以提升对分数的关注。',
        '将印章证书定位为一种情感上的荣誉徽章。'
      ],
      blindSpot: '容易忽略开发者原始的工程工作流需求。'
    },
    naval_ravikant: {
      mentorName: 'Naval Ravikant',
      lens: '纳瓦尔式个人杠杆视角',
      score: 90,
      verdict: '对于利用代码和内容杠杆的独立开发者而言，是极佳的产品。',
      keyAdvice: [
        '通过将后端函数完全托管在 Cloudflare Workers 上，将运行成本降至最低。',
        '让产品质量驱动口碑传播，无需付费销售人员。'
      ],
      blindSpot: '易受上游 LLM API 计费模型突然变化的影响。'
    },
    larry_ellison: {
      mentorName: 'Larry Ellison',
      lens: '埃里森式企业级销售视角',
      score: 76,
      verdict: '实用性不错，但需要直接的 B2B 企业销售锁定机制。',
      keyAdvice: [
        '创建企业席位控制并瞄准设计机构。',
        '将主动审计打包到客户报告白标 PDF 中。'
      ],
      blindSpot: '高接触的销售周期会削减速度。'
    },
    mark_zuckerberg: {
      mentorName: 'Mark Zuckerberg',
      lens: '扎克伯格式增长视角',
      score: 80,
      verdict: '缺乏内置的病毒式传播功能，无法捕获高增长速度。',
      keyAdvice: [
        '建立直接的邀请积分奖励，将用户转化为推广者。',
        '在所有生成的公共仪表板上植入水印印章徽章。'
      ],
      blindSpot: '增长循环可能会稀释验证印章的专业品牌形象。'
    },
    jeff_bezos: {
      mentorName: 'Jeff Bezos',
      lens: '贝佐斯式飞轮视角',
      score: 84,
      verdict: '需要将数据利润进行再投资，以建立结构化的运营护城河。',
      keyAdvice: [
        '收集匿名项目元数据以构建市场就绪度报告。',
        '持续降低查询延迟和成本，以构建运营杠杆。'
      ],
      blindSpot: '需要大量的前期数据量才能启动数据飞轮。'
    }
  };

  const glossary = language === 'zh-CN' ? mentorGlossaryZh : mentorGlossaryEn;

  let mentorsToScan = selectedMentors && selectedMentors.length > 0 ? selectedMentors : ['elon_musk', 'steve_jobs', 'naval_ravikant'];
  if (analysisMode === 'quick_scan') {
    mentorsToScan = ['naval_ravikant'];
  } else if (analysisMode === 'single_mentor') {
    mentorsToScan = selectedMentors && selectedMentors.length > 0 ? [selectedMentors[0]] : ['steve_jobs'];
  }

  const normalizedMentorReports = mentorsToScan.map(m => {
    const defaultData = language === 'zh-CN' ? {
      mentorName: m.charAt(0).toUpperCase() + m.slice(1).replace('_', ' '),
      lens: `${m}式视角`,
      score: 80,
      verdict: '项目设计令人满意，但仍有成长空间。',
      keyAdvice: ['尽早验证用户参与度指标。'],
      blindSpot: '容易受到局部市场饱和的影响。'
    } : {
      mentorName: m.charAt(0).toUpperCase() + m.slice(1).replace('_', ' '),
      lens: `${m}-style Lens`,
      score: 80,
      verdict: 'Satisfactory product design with room for growth.',
      keyAdvice: ['Validate user engagement metrics early.'],
      blindSpot: 'Vulnerable to localized market saturation.'
    };
    const prof = glossary[m] || defaultData;
    return {
      mentorId: m,
      mentorName: prof.mentorName,
      lens: prof.lens,
      score: prof.score,
      verdict: prof.verdict,
      keyAdvice: prof.keyAdvice,
      blindSpot: prof.blindSpot
    };
  });

  if (language === 'zh-CN') {
    return {
      projectName: projectName,
      url: url,
      score: finalScore,
      grade: 'B',
      language: 'zh-CN',
      summary: {
        oneSentenceDiagnosis: `针对 ${projectName} 的实用型开发者工具，拥有强大的技术杠杆，但缺少企业级销售定位。`,
        biggestOpportunity: '将原始 API 打包为面向开发工作室的 B2B 企业计划。',
        biggestWeakness: '高度依赖单一开发者资源，且缺乏有机的病毒式传播循环。',
        recommendedPositioning: '面向高速度团队的零配置部署加速器。'
      },
      metrics: {
        commercialValue: 80,
        painkillerIndex: 75,
        monetizationClarity: 70,
        targetBuyerFit: 85,
        advantageAmplification: 65,
        growthLeverage: 60,
        executionFeasibility: 90
      },
      moneyPaths: [
        {
          name: '开发者专业版',
          model: 'subscription',
          whyItFits: '开发者愿意为节省时间和提高生产力限制而付费。',
          suggestedPriceOrValueExchange: '每月固定 29 美元',
          firstExperiment: '锁定自定义域名集成和高级 API 访问日志。'
        },
        {
          name: '自定义团队方案',
          model: 'enterprise',
          whyItFits: '允许开发团队集成具有自定义安全控制的私有服务器。',
          suggestedPriceOrValueExchange: '每月 149 美元起',
          firstExperiment: '在定价面板中添加“联系销售”呼吁卡片。'
        }
      ],
      targetBuyers: [
        {
          segment: '独立开发者',
          willingnessToPay: 65,
          whyTheyBuy: '需要快速验证指标和用于社交分享的即时 PDF 报告。',
          bestOffer: '包含标准访问权限的入门档（$19/月）。'
        },
        {
          segment: 'SaaS 外包公司创始人',
          willingnessToPay: 85,
          whyTheyBuy: '需要大批量扫描来优化客户转化漏斗并验证价格档位。',
          bestOffer: '包含无限次扫描的工作室捆绑包（$79/月）。'
        }
      ],
      advantageMap: {
        strongestAsset: '优秀的自动化执行速度和高保真启发式建议。',
        hiddenAsset: '已准备好用于自动化数据库 Webhook 集成的结构化 JSON 导出器。',
        moatPotential: '作为有机病毒式获取循环的动态评分证书网络。',
        howToAmplify: [
          '在用户仪表板的显眼位置放置验证证书徽章。',
          '鼓励用户推特分享他们的价值证书输出，以触发增长奖励。'
        ]
      },
      growthLevers: [
        {
          lever: '公开构建（Build-in-Public）社交循环',
          channel: 'X / Twitter',
          whyItWorks: '创始人喜欢展示验证评分和验证徽章。',
          firstAction: '提供一个预填证书徽章链接的一键分享按钮。'
        },
        {
          lever: '副业营销目录',
          channel: '目录列表',
          whyItWorks: '免费提交可以生成有价值的反向链接和直接的有机 SEO 索引排名。',
          firstAction: '将投票最高的产品审计页面提交给搜索引擎爬虫。'
        }
      ],
      mentorReports: normalizedMentorReports,
      actionPlan: {
        next24Hours: [
          '切换后端模型 Prompt，将重点严格放在商业诊断维度上。',
          '从 UI 视图状态配置中移除视觉热点元素。'
        ],
        next7Days: [
          '在前端单页应用（SPA）中部署本地 localStorage Pilot 积分引擎。',
          '挂接“赚取积分”增长面板的检查。'
        ],
        next30Days: [
          '推出包含精选商业领袖观点的公开导师团。',
          '引入直接验证证书图像分享意图。'
        ],
        next90Days: [
          '评估用于全球邀请排行榜的 D1 SQL 数据库 Schema 的集成。',
          '扩展 API 查询端点，以处理来自外部应用的批量请求。'
        ]
      },
      riskWarnings: [
        {
          risk: '对上游 AI 响应稳定性的高度依赖。',
          severity: 'high',
          fix: '在 API 中间件中实现鲁棒的 Fallback JSON 报告触发器。'
        },
        {
          risk: '独立构建者绕过 Turnstile 验证端点。',
          severity: 'medium',
          fix: '启用 Cloudflare Web 应用防火墙（WAF）托管规则集。'
        }
      ]
    };
  }

  return {
    projectName: projectName,
    url: url,
    score: finalScore,
    grade: 'B',
    language: 'en',
    summary: {
      oneSentenceDiagnosis: `A utility-first builder tool for ${projectName} with strong technical leverage but missing enterprise sales positioning.`,
      biggestOpportunity: 'Package raw APIs into a B2B enterprise plan targeting developer studios.',
      biggestWeakness: 'High dependency on single developer resources and lack of organic virality loops.',
      recommendedPositioning: 'The zero-config deployment accelerator for high-velocity teams.'
    },
    metrics: {
      commercialValue: 80,
      painkillerIndex: 75,
      monetizationClarity: 70,
      targetBuyerFit: 85,
      advantageAmplification: 65,
      growthLeverage: 60,
      executionFeasibility: 90
    },
    moneyPaths: [
      {
        name: 'Developer Pro Tier',
        model: 'subscription',
        whyItFits: 'Developers are willing to pay for time saved and increased productivity limits.',
        suggestedPriceOrValueExchange: '$29/month flat',
        firstExperiment: 'Lock custom domain integration and premium API access logs.'
      },
      {
        name: 'Custom Team Setup',
        model: 'enterprise',
        whyItFits: 'Allows dev teams to integrate private servers with custom security controls.',
        suggestedPriceOrValueExchange: 'From $149/month',
        firstExperiment: 'Add a "Contact Sales" callout trigger card in the pricing panel.'
      }
    ],
    targetBuyers: [
      {
        segment: 'Solo Indie Hackers',
        willingnessToPay: 65,
        whyTheyBuy: 'Need quick validation metrics and instant PDF reports for social sharing.',
        bestOffer: 'Starter Tier ($19/mo) with standard access permissions.'
      },
      {
        segment: 'SaaS Agency Founders',
        willingnessToPay: 85,
        whyTheyBuy: 'Require high-volume scans to optimize client conversion funnels and validate pricing tiers.',
        bestOffer: 'Agency Studio Bundle ($79/mo) with unlimited scans.'
      }
    ],
    advantageMap: {
      strongestAsset: 'Excellent automated execution speed and high-fidelity heuristic suggestions.',
      hiddenAsset: 'Structured JSON exporter ready for automated database webhooks integration.',
      moatPotential: 'Dynamic scoring certificate network acting as organic viral acquisition loops.',
      howToAmplify: [
        'Place the verification certificate badge prominently on the user dashboard.',
        'Encourage users to tweet their value certificate output to trigger growth bonuses.'
      ]
    },
    growthLevers: [
      {
        lever: 'Build-in-Public Social Loops',
        channel: 'X / Twitter',
        whyItWorks: 'Founders love showing off validation scores and verification badges.',
        firstAction: 'Provide an instant one-click Share button prefilled with the certificate seal link.'
      },
      {
        lever: 'Side-project Marketing Directory',
        channel: 'Directory Listings',
        whyItWorks: 'Free submissions generate valuable backlinks and direct organic SEO index rankings.',
        firstAction: 'Submit the top-voted product audit pages to web search engine crawlers.'
      }
    ],
    mentorReports: normalizedMentorReports,
    actionPlan: {
      next24Hours: [
        'Switch backend model prompts to focus strictly on commercial diagnostic vectors.',
        'Remove Visual Hotspot elements from UI view state configurations.'
      ],
      next7Days: [
        'Deploy the local localStorage Pilot Credits engine in the frontend SPA.',
        'Hook up Earn Credits growth panel checks.'
      ],
      next30Days: [
        'Launch public mentor boards with selected business leader opinions.',
        'Introduce direct verification certificate image sharing intents.'
      ],
      next90Days: [
        'Evaluate integration of D1 SQL database schemas for global invite leaderboards.',
        'Scale API query endpoints to process batch requests from external apps.'
      ]
    },
    riskWarnings: [
      {
        risk: 'High dependency on upstream AI response stability.',
        severity: 'high',
        fix: 'Implement robust fallback JSON report triggers in the API middleware.'
      },
      {
        risk: 'Indie builders bypassing Turnstile validation endpoints.',
        severity: 'medium',
        fix: 'Activate Cloudflare Web Application Firewall (WAF) managed rulesets.'
      }
    ]
  };
}
