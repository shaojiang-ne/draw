import type { ChartCategory } from '../../types';

export const flowchartCategory: ChartCategory = {
  id: 'flowchart',
  name: '流程图',
  icon: 'git-branch',
  order: 1,
  expertRole: '流程建模专家',
  systemPrompt: `你是一位拥有15年经验的流程建模专家（流程建模专家），精通各类流程图的标准符号体系与绘制规范。请严格遵循以下指导：

## 角色设定
- 你精通 BPMN 2.0、EPC、IDEF0/3、UML 活动图、价值流图等主流流程建模语言
- 你擅长将复杂业务逻辑转化为清晰、规范、易读的流程图
- 你对流程图的符号规范、布局美学、信息层次有极高要求
- 你生成的流程图必须符合国际标准，同时兼顾中文用户的阅读习惯

## 分步绘制流程
1. **需求解析**：仔细分析用户描述，提取流程中的关键活动、决策点、参与角色和数据对象
2. **流程梳理**：确定流程的起点与终点，梳理主干路径与分支路径，识别并行活动与循环回路
3. **符号选择**：根据流程元素类型选择正确的标准符号（圆角矩形=开始/结束，矩形=处理，菱形=判断，平行四边形=数据等）
4. **布局规划**：采用自上而下或自左而右的主流方向，合理分配节点间距，确保连线不交叉或少交叉
5. **连线绘制**：使用带箭头的直线或折线连接节点，分支处标注条件，汇聚处明确逻辑
6. **文字标注**：为每个节点添加简洁准确的文字，决策分支标注条件（是/否），关键数据标注数据名
7. **细节完善**：添加必要的注释、图例、泳道分隔线等辅助元素，确保信息完整
8. **质量检查**：执行流程图专项检查清单，修正所有问题后输出最终 SVG

## 流程图专项检查
1. **符号规范性**：所有节点使用正确的标准符号，不得混用或自创符号
2. **流程完整性**：从开始到结束存在至少一条可达路径，无死胡同（除终止节点外）
3. **连线正确性**：所有连线起止于节点锚点，箭头方向与流程方向一致，无悬空连线
4. **布局合理性**：节点间距均匀，连线交叉最少，整体布局平衡美观
5. **文字可读性**：所有文字在节点内居中显示，无截断溢出，字号统一

## 流程图符号规范
- **开始/结束**：圆角矩形（rx≥12），内部标注"开始"或"结束"
- **处理/活动**：直角矩形，内部标注活动名称
- **判断/决策**：菱形，内部标注判断条件，分支标注"是/否"或具体条件
- **数据/文档**：平行四边形，内部标注数据名称
- **预定义处理**：双边框矩形，表示子流程
- **连线**：带箭头的直线或折线，箭头使用 <marker> 定义
- **注释**：虚线连接的文本框，用于补充说明`,

  expertFlow: {
    steps: [
      { index: 1, title: '需求解析', description: '分析用户描述，提取流程中的关键活动、决策点、参与角色和数据对象' },
      { index: 2, title: '流程梳理', description: '确定起点与终点，梳理主干与分支路径，识别并行活动与循环回路' },
      { index: 3, title: '符号选择', description: '根据流程元素类型选择正确的标准符号（圆角矩形、矩形、菱形、平行四边形等）' },
      { index: 4, title: '布局规划', description: '采用自上而下或自左而右方向，合理分配节点间距，减少连线交叉' },
      { index: 5, title: '连线绘制', description: '使用带箭头的直线或折线连接节点，分支处标注条件，汇聚处明确逻辑' },
      { index: 6, title: '文字标注', description: '为每个节点添加简洁准确的文字，决策分支标注条件，关键数据标注名称' },
      { index: 7, title: '细节完善', description: '添加必要的注释、图例、泳道分隔线等辅助元素，确保信息完整' },
      { index: 8, title: '质量检查', description: '执行流程图专项检查清单，修正所有问题后输出最终 SVG' },
    ],
    checkItems: [
      { id: 'alignment', label: '对齐检查', description: '所有同行元素 y 坐标一致，同列元素 x 坐标一致' },
      { id: 'overflow', label: '溢出检查', description: '所有元素坐标 + 尺寸不超过视口边界 (1200×900)' },
      { id: 'overlap', label: '覆盖检查', description: '无两个可见元素占据重叠区域（除连线与节点的交叉）' },
      { id: 'connection', label: '连线检查', description: '所有连线的起止点精确连接目标节点中心或边缘锚点' },
      { id: 'arrow', label: '箭头检查', description: '所有有向连线末端必须有 <marker> 箭头，方向正确' },
      { id: 'text', label: '文字检查', description: '所有 <text> 在其父容器内居中，无截断' },
      { id: 'closure', label: '闭合检查', description: '流程的起点和终点明确，无悬空连线' },
    ],
  },

  subTypes: [
    // ===== 1. basic-flowchart =====
    {
      id: 'basic-flowchart',
      name: '基础流程图',
      description: '使用标准符号表示流程的基本走向与决策分支',
      categoryId: 'flowchart',
      systemPromptAppend: `基础流程图规范：
- 使用圆角矩形表示开始/结束节点
- 使用直角矩形表示处理步骤
- 使用菱形表示判断/决策节点
- 使用平行四边形表示输入/输出数据
- 连线使用带箭头的直线或折线
- 决策分支必须标注"是/否"或具体条件
- 主流程方向为自上而下，分支向左右展开
- 每个流程必须有且仅有一个开始节点和至少一个结束节点`,
      templates: [
        {
          id: 'basic-flowchart-software-dev',
          name: '软件开发流程',
          subTypeId: 'basic-flowchart',
          description: '描述从需求分析到上线部署的完整软件开发流程',
          industryTags: ['软件', 'IT', '互联网'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="70" y="2" width="60" height="12" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="100" y="10.5" text-anchor="middle" font-size="7" fill="#1E293B">需求分析</text><rect x="70" y="23" width="60" height="12" rx="2" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="100" y="31.5" text-anchor="middle" font-size="7" fill="#1E293B">设计开发</text><rect x="70" y="44" width="60" height="12" rx="2" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="100" y="52.5" text-anchor="middle" font-size="7" fill="#1E293B">测试验证</text><rect x="70" y="65" width="60" height="12" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="100" y="73.5" text-anchor="middle" font-size="7" fill="#1E293B">上线部署</text><line x1="100" y1="14" x2="100" y2="23" stroke="#2563EB" stroke-width="1" marker-end="url(#a)"/><line x1="100" y1="35" x2="100" y2="44" stroke="#2563EB" stroke-width="1" marker-end="url(#a)"/><line x1="100" y1="56" x2="100" y2="65" stroke="#2563EB" stroke-width="1" marker-end="url(#a)"/><defs><marker id="a" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/></marker></defs></svg>',
          systemPromptAppend: `软件开发流程结构：
- 开始节点 → 需求分析 → 概要设计 → 详细设计 → 编码实现 → 单元测试 → 集成测试 → 用户验收测试(UAT) → 部署上线 → 结束节点
- 在"集成测试"处设置判断：测试通过→UAT，测试失败→返回编码实现
- 在"UAT"处设置判断：验收通过→部署上线，验收不通过→返回需求分析或设计阶段
- 可选分支：需求变更时返回需求分析阶段`,
          exampleUserInput: '帮我画一个软件开发流程图，从需求分析到上线部署，包含测试回退逻辑',
        },
        {
          id: 'basic-flowchart-approval',
          name: '审批流程',
          subTypeId: 'basic-flowchart',
          description: '通用的多级审批流程，包含提交、审核、批准/驳回等环节',
          industryTags: ['行政', '管理', '通用'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="70" y="2" width="60" height="12" rx="6" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="100" y="10.5" text-anchor="middle" font-size="7" fill="#1E293B">提交申请</text><polygon points="100,22 115,31 100,40 85,31" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="100" y="33.5" text-anchor="middle" font-size="6" fill="#1E293B">审核</text><rect x="70" y="49" width="60" height="12" rx="6" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="100" y="57.5" text-anchor="middle" font-size="7" fill="#1E293B">审批完成</text><line x1="100" y1="14" x2="100" y2="22" stroke="#DC2626" stroke-width="1" marker-end="url(#b)"/><line x1="100" y1="40" x2="100" y2="49" stroke="#DC2626" stroke-width="1" marker-end="url(#b)"/><text x="108" y="46" font-size="5" fill="#059669">是</text><defs><marker id="b" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/></marker></defs></svg>',
          systemPromptAppend: `审批流程结构：
- 开始节点 → 填写申请表 → 提交申请 → 初审（判断：材料是否齐全）→ 不齐全→补充材料→返回提交
- 材料齐全→部门主管审核（判断：是否同意）→ 不同意→驳回修改→返回填写
- 同意→总经理审批（判断：是否批准）→ 不批准→流程结束（未通过）
- 批准→执行办理 → 结束节点
- 每个判断节点需标注"是/否"分支条件`,
          exampleUserInput: '画一个三级审批流程图：初审→主管审核→总经理审批，包含驳回和补充材料的回退路径',
        },
        {
          id: 'basic-flowchart-customer-service',
          name: '客户服务流程',
          subTypeId: 'basic-flowchart',
          description: '客户咨询到问题解决的完整服务流程',
          industryTags: ['服务', '客服', '电商'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="70" y="2" width="60" height="12" rx="6" fill="#ECFDF5" stroke="#059669" stroke-width="1"/><text x="100" y="10" text-anchor="middle" font-size="7" fill="#1E293B">接收咨询</text><polygon points="100,22 115,31 100,40 85,31" fill="#ECFDF5" stroke="#059669" stroke-width="1"/><text x="100" y="33.5" text-anchor="middle" font-size="6" fill="#1E293B">分类</text><rect x="20" y="49" width="50" height="12" rx="2" fill="#ECFDF5" stroke="#059669" stroke-width="1"/><text x="45" y="57" text-anchor="middle" font-size="6" fill="#1E293B">技术支持</text><rect x="130" y="49" width="50" height="12" rx="2" fill="#ECFDF5" stroke="#059669" stroke-width="1"/><text x="155" y="57" text-anchor="middle" font-size="6" fill="#1E293B">售后服务</text><line x1="100" y1="14" x2="100" y2="22" stroke="#059669" stroke-width="1" marker-end="url(#c)"/><line x1="85" y1="31" x2="45" y2="49" stroke="#059669" stroke-width="1" marker-end="url(#c)"/><line x1="115" y1="31" x2="155" y2="49" stroke="#059669" stroke-width="1" marker-end="url(#c)"/><defs><marker id="c" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#059669"/></marker></defs></svg>',
          systemPromptAppend: `客户服务流程结构：
- 开始节点 → 接收客户咨询 → 问题分类（判断：问题类型）
- 技术问题→技术支持处理（判断：能否解决）→ 能→反馈客户→结束
- 不能→升级至工程师→处理→反馈客户→结束
- 售后问题→售后服务处理（判断：是否退换货）→ 是→退换货流程→结束
- 否→维修/补偿→反馈客户→结束
- 所有路径最终汇聚到"客户满意度回访"→结束`,
          exampleUserInput: '画一个客户服务流程图，包含问题分类、技术支持和售后两条主线，以及升级处理逻辑',
        },
        {
          id: 'basic-flowchart-production',
          name: '生产工艺流程',
          subTypeId: 'basic-flowchart',
          description: '从原材料到成品的完整生产工艺流程',
          industryTags: ['制造', '生产', '工业'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="70" y="2" width="60" height="12" rx="6" fill="#FFF7ED" stroke="#EA580C" stroke-width="1"/><text x="100" y="10" text-anchor="middle" font-size="7" fill="#1E293B">原料入库</text><rect x="70" y="22" width="60" height="12" rx="2" fill="#FFF7ED" stroke="#EA580C" stroke-width="1"/><text x="100" y="30" text-anchor="middle" font-size="7" fill="#1E293B">加工制造</text><polygon points="100,41 115,49 100,57 85,49" fill="#FFF7ED" stroke="#EA580C" stroke-width="1"/><text x="100" y="51.5" text-anchor="middle" font-size="6" fill="#1E293B">质检</text><rect x="70" y="65" width="60" height="12" rx="6" fill="#FFF7ED" stroke="#EA580C" stroke-width="1"/><text x="100" y="73" text-anchor="middle" font-size="7" fill="#1E293B">成品出库</text><line x1="100" y1="14" x2="100" y2="22" stroke="#EA580C" stroke-width="1" marker-end="url(#d)"/><line x1="100" y1="34" x2="100" y2="41" stroke="#EA580C" stroke-width="1" marker-end="url(#d)"/><line x1="100" y1="57" x2="100" y2="65" stroke="#EA580C" stroke-width="1" marker-end="url(#d)"/><defs><marker id="d" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#EA580C"/></marker></defs></svg>',
          systemPromptAppend: `生产工艺流程结构：
- 开始节点 → 原材料入库 → 来料检验（判断：合格？）→ 不合格→退货/换货→结束
- 合格→领料出库 → 加工制造（可含多道工序：切割→焊接→组装等）→ 过程检验（判断：合格？）
- 不合格→返工→返回加工制造
- 合格→成品检验（判断：合格？）→ 不合格→报废/返修
- 合格→包装 → 入库 → 成品出库 → 结束节点
- 使用平行四边形表示原料/成品数据节点`,
          exampleUserInput: '画一个生产工艺流程图，从来料检验到成品出库，包含多道质检环节和返工逻辑',
        },
      ],
    },

    // ===== 2. swimlane =====
    {
      id: 'swimlane',
      name: '泳道图',
      description: '按角色或部门划分泳道，展示跨职能协作流程',
      categoryId: 'flowchart',
      systemPromptAppend: `泳道图专项规范：
- 使用水平或垂直泳道分隔不同角色/部门
- 每个泳道顶部标注角色/部门名称
- 泳道之间使用虚线分隔
- 活动节点放置在执行该活动的角色泳道内
- 跨泳道的连线表示协作/交接关系
- 泳道宽度根据内容自适应，最小宽度 150px
- 泳道标签区域宽度 80-120px
- 同一泳道内的节点按流程顺序从上到下或从左到右排列
- 跨泳道交接处使用明确的箭头和标注`,
      templates: [
        {
          id: 'swimlane-order-processing',
          name: '订单处理泳道图',
          subTypeId: 'swimlane',
          description: '客户、销售、仓储、财务四方协作的订单处理流程',
          industryTags: ['电商', '零售', '贸易'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="196" height="18" fill="#DBEAFE" stroke="#2563EB" stroke-width="0.5"/><text x="10" y="13" text-anchor="start" font-size="7" fill="#1D4ED8" font-weight="bold">客户</text><rect x="2" y="20" width="196" height="18" fill="#EDE9FE" stroke="#7C3AED" stroke-width="0.5"/><text x="10" y="31" text-anchor="start" font-size="7" fill="#6D28D9" font-weight="bold">销售</text><rect x="2" y="38" width="196" height="18" fill="#D1FAE5" stroke="#059669" stroke-width="0.5"/><text x="10" y="49" text-anchor="start" font-size="7" fill="#047857" font-weight="bold">仓储</text><rect x="2" y="56" width="196" height="18" fill="#FEF2F2" stroke="#DC2626" stroke-width="0.5"/><text x="10" y="67" text-anchor="start" font-size="7" fill="#B91C1C" font-weight="bold">财务</text><rect x="60" y="5" width="40" height="12" rx="2" fill="#fff" stroke="#2563EB" stroke-width="0.5"/><text x="80" y="13" text-anchor="middle" font-size="5" fill="#1E293B">下单</text><rect x="110" y="23" width="40" height="12" rx="2" fill="#fff" stroke="#7C3AED" stroke-width="0.5"/><text x="130" y="31" text-anchor="middle" font-size="5" fill="#1E293B">确认</text><rect x="150" y="41" width="40" height="12" rx="2" fill="#fff" stroke="#059669" stroke-width="0.5"/><text x="170" y="49" text-anchor="middle" font-size="5" fill="#1E293B">发货</text></svg>',
          systemPromptAppend: `订单处理泳道图结构：
- 四条泳道：客户、销售部、仓储部、财务部
- 客户泳道：浏览商品 → 下单 → 确认收货 → 评价
- 销售泳道：接收订单 → 审核订单 → 确认订单 → 跟踪物流
- 仓储泳道：备货 → 拣货打包 → 发货 → 更新库存
- 财务泳道：收款确认 → 开具发票 → 退款处理（如需）
- 跨泳道交接：下单→接收订单，确认订单→备货，发货→跟踪物流，确认收货→收款确认`,
          exampleUserInput: '画一个订单处理泳道图，包含客户、销售、仓储、财务四个角色的协作流程',
        },
        {
          id: 'swimlane-recruitment',
          name: '招聘流程泳道图',
          subTypeId: 'swimlane',
          description: '用人部门、HR、候选人三方参与的招聘流程',
          industryTags: ['人力资源', '招聘', '管理'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="196" height="24" fill="#EDE9FE" stroke="#7C3AED" stroke-width="0.5"/><text x="10" y="16" text-anchor="start" font-size="7" fill="#6D28D9" font-weight="bold">用人部门</text><rect x="2" y="26" width="196" height="24" fill="#DBEAFE" stroke="#2563EB" stroke-width="0.5"/><text x="10" y="40" text-anchor="start" font-size="7" fill="#1D4ED8" font-weight="bold">HR</text><rect x="2" y="50" width="196" height="24" fill="#D1FAE5" stroke="#059669" stroke-width="0.5"/><text x="10" y="64" text-anchor="start" font-size="7" fill="#047857" font-weight="bold">候选人</text><rect x="60" y="7" width="40" height="14" rx="2" fill="#fff" stroke="#7C3AED" stroke-width="0.5"/><text x="80" y="16" text-anchor="middle" font-size="5" fill="#1E293B">提需求</text><rect x="110" y="31" width="40" height="14" rx="2" fill="#fff" stroke="#2563EB" stroke-width="0.5"/><text x="130" y="40" text-anchor="middle" font-size="5" fill="#1E293B">筛选简历</text><rect x="150" y="55" width="40" height="14" rx="2" fill="#fff" stroke="#059669" stroke-width="0.5"/><text x="170" y="64" text-anchor="middle" font-size="5" fill="#1E293B">面试</text></svg>',
          systemPromptAppend: `招聘流程泳道图结构：
- 三条泳道：用人部门、HR、候选人
- 用人部门泳道：提交招聘需求 → 面试评估 → 录用决策 → 入职安排
- HR泳道：发布职位 → 筛选简历 → 安排面试 → 背景调查 → 发放Offer
- 候选人泳道：投递简历 → 参加面试 → 等待结果 → 接受/拒绝Offer
- 跨泳道交接：提交需求→发布职位，筛选通过→安排面试，面试评估→录用决策，发放Offer→接受/拒绝`,
          exampleUserInput: '画一个招聘流程泳道图，展示用人部门、HR和候选人三方的协作流程',
        },
        {
          id: 'swimlane-procurement',
          name: '采购流程泳道图',
          subTypeId: 'swimlane',
          description: '需求部门、采购部、供应商、财务四方协作的采购流程',
          industryTags: ['采购', '供应链', '财务'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="196" height="18" fill="#FFF7ED" stroke="#EA580C" stroke-width="0.5"/><text x="10" y="13" text-anchor="start" font-size="7" fill="#C2410C" font-weight="bold">需求部门</text><rect x="2" y="20" width="196" height="18" fill="#DBEAFE" stroke="#2563EB" stroke-width="0.5"/><text x="10" y="31" text-anchor="start" font-size="7" fill="#1D4ED8" font-weight="bold">采购部</text><rect x="2" y="38" width="196" height="18" fill="#D1FAE5" stroke="#059669" stroke-width="0.5"/><text x="10" y="49" text-anchor="start" font-size="7" fill="#047857" font-weight="bold">供应商</text><rect x="2" y="56" width="196" height="18" fill="#FEF2F2" stroke="#DC2626" stroke-width="0.5"/><text x="10" y="67" text-anchor="start" font-size="7" fill="#B91C1C" font-weight="bold">财务</text><rect x="60" y="5" width="40" height="12" rx="2" fill="#fff" stroke="#EA580C" stroke-width="0.5"/><text x="80" y="13" text-anchor="middle" font-size="5" fill="#1E293B">提需求</text><rect x="110" y="23" width="40" height="12" rx="2" fill="#fff" stroke="#2563EB" stroke-width="0.5"/><text x="130" y="31" text-anchor="middle" font-size="5" fill="#1E293B">招标</text><rect x="150" y="41" width="40" height="12" rx="2" fill="#fff" stroke="#059669" stroke-width="0.5"/><text x="170" y="49" text-anchor="middle" font-size="5" fill="#1E293B">供货</text></svg>',
          systemPromptAppend: `采购流程泳道图结构：
- 四条泳道：需求部门、采购部、供应商、财务部
- 需求部门泳道：提交采购申请 → 验收货物 → 确认付款
- 采购部泳道：审核申请 → 询价比价 → 招标/谈判 → 下达订单 → 跟踪交货
- 供应商泳道：响应报价 → 签订合同 → 生产/备货 → 发货交付
- 财务部泳道：预算审核 → 合同审批 → 付款结算
- 跨泳道交接：提交申请→审核申请，询价→响应报价，下达订单→签订合同，发货→验收，确认付款→付款结算`,
          exampleUserInput: '画一个采购流程泳道图，包含需求部门、采购部、供应商和财务四个角色',
        },
      ],
    },

    // ===== 3. bpmn =====
    {
      id: 'bpmn',
      name: 'BPMN流程图',
      description: '遵循BPMN 2.0标准的业务流程建模图',
      categoryId: 'flowchart',
      systemPromptAppend: `BPMN 2.0 专项规范：
- 开始事件：细线圆圈，内部可标注触发类型（邮件、定时器等）
- 结束事件：粗线圆圈，内部可标注结束类型
- 用户任务：圆角矩形+左上角用户图标
- 服务任务：圆角矩形+左上角齿轮图标
- 脚本任务：圆角矩形+左上角脚本图标
- 网关（排他）：菱形内含X，表示互斥分支
- 网关（并行）：菱形内含+，表示并行分支/汇聚
- 网关（包含）：菱形内含O，表示条件并行
- 消息流：虚线箭头，连接不同池的元素
- 序列流：实线箭头，连接同一池内的元素
- 关联：虚线无箭头，连接注释与元素
- 数据对象：折角矩形，表示流程中的数据
- 泳池/泳道：用矩形框表示参与方，内部用虚线分隔泳道`,
      templates: [
        {
          id: 'bpmn-loan-approval',
          name: '贷款审批BPMN',
          subTypeId: 'bpmn',
          description: '银行贷款审批的BPMN standard 流程',
          industryTags: ['银行', '金融', '信贷'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="40" r="8" fill="#fff" stroke="#2563EB" stroke-width="1.5"/><rect x="30" y="30" width="45" height="20" rx="8" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="52.5" y="43" text-anchor="middle" font-size="6" fill="#1E293B">提交申请</text><polygon points="95,30 105,40 95,50 85,40" fill="#fff" stroke="#2563EB" stroke-width="1"/><text x="95" y="43" text-anchor="middle" font-size="7" fill="#2563EB">X</text><rect x="115" y="30" width="45" height="20" rx="8" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="137.5" y="43" text-anchor="middle" font-size="6" fill="#1E293B">放款</text><circle cx="183" cy="40" r="8" fill="#fff" stroke="#2563EB" stroke-width="2.5"/><line x1="20" y1="40" x2="30" y2="40" stroke="#2563EB" stroke-width="1" marker-end="url(#e)"/><line x1="75" y1="40" x2="85" y2="40" stroke="#2563EB" stroke-width="1" marker-end="url(#e)"/><line x1="105" y1="40" x2="115" y2="40" stroke="#2563EB" stroke-width="1" marker-end="url(#e)"/><line x1="160" y1="40" x2="175" y2="40" stroke="#2563EB" stroke-width="1" marker-end="url(#e)"/><defs><marker id="e" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/></marker></defs></svg>',
          systemPromptAppend: `贷款审批BPMN结构：
- 开始事件（贷款申请提交）→ 用户任务：填写申请表 → 服务任务：征信查询 → 排他网关（信用评估）
- 信用良好→用户任务：面签审核→排他网关（审批决策）→批准→服务任务：放款→结束事件
- 信用不良→服务任务：拒绝通知→结束事件
- 面签不通过→服务任务：补充材料→返回征信查询
- 使用BPMN标准符号：细线圆圈=开始，粗线圆圈=结束，圆角矩形=任务，菱形X=排他网关
- 数据对象：申请表、征信报告、贷款合同`,
          exampleUserInput: '画一个银行贷款审批的BPMN流程图，包含征信查询、面签审核和放款环节',
        },
        {
          id: 'bpmn-order-fulfillment',
          name: '订单履约BPMN',
          subTypeId: 'bpmn',
          description: '电商订单从下单到交付的BPMN标准流程',
          industryTags: ['电商', '物流', '零售'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="40" r="7" fill="#fff" stroke="#059669" stroke-width="1.5"/><rect x="30" y="30" width="45" height="20" rx="8" fill="#D1FAE5" stroke="#059669" stroke-width="1"/><text x="52.5" y="43" text-anchor="middle" font-size="6" fill="#1E293B">接单</text><polygon points="100,30 115,40 100,50 85,40" fill="#fff" stroke="#059669" stroke-width="1"/><text x="100" y="43" text-anchor="middle" font-size="7" fill="#059669">+</text><rect x="125" y="20" width="45" height="16" rx="8" fill="#D1FAE5" stroke="#059669" stroke-width="1"/><text x="147.5" y="31" text-anchor="middle" font-size="5" fill="#1E293B">备货</text><rect x="125" y="44" width="45" height="16" rx="8" fill="#D1FAE5" stroke="#059669" stroke-width="1"/><text x="147.5" y="55" text-anchor="middle" font-size="5" fill="#1E293B">开票</text><circle cx="185" cy="40" r="7" fill="#fff" stroke="#059669" stroke-width="2.5"/><line x1="22" y1="40" x2="30" y2="40" stroke="#059669" stroke-width="1" marker-end="url(#f)"/><line x1="75" y1="40" x2="85" y2="40" stroke="#059669" stroke-width="1" marker-end="url(#f)"/><line x1="108" y1="35" x2="125" y2="28" stroke="#059669" stroke-width="1" marker-end="url(#f)"/><line x1="108" y1="45" x2="125" y2="52" stroke="#059669" stroke-width="1" marker-end="url(#f)"/><line x1="170" y1="28" x2="180" y2="35" stroke="#059669" stroke-width="1" marker-end="url(#f)"/><line x1="170" y1="52" x2="180" y2="45" stroke="#059669" stroke-width="1" marker-end="url(#f)"/><defs><marker id="f" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#059669"/></marker></defs></svg>',
          systemPromptAppend: `订单履约BPMN结构：
- 开始事件（订单创建）→ 用户任务：订单确认 → 并行网关（+）→ 分支为：
  - 服务任务：库存检查→备货拣选→包装
  - 服务任务：支付处理→开具发票
- 并行汇聚网关（+）→ 服务任务：物流配送 → 用户任务：签收确认 → 结束事件
- 异常路径：库存不足→服务任务：补货通知→等待→返回库存检查
- 支付失败→服务任务：支付提醒→排他网关→取消订单→结束事件
- 使用BPMN并行网关表示备货与开票的并行执行`,
          exampleUserInput: '画一个电商订单履约的BPMN流程图，包含并行网关表示备货和开票同时进行',
        },
        {
          id: 'bpmn-employee-onboarding',
          name: '员工入职BPMN',
          subTypeId: 'bpmn',
          description: '新员工入职的BPMN标准流程',
          industryTags: ['人力资源', '管理', '企业'],
          previewSvg: '<svg viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="80" rx="4" fill="#FAF5FF" stroke="#7C3AED" stroke-width="1"/><circle cx="12" cy="40" r="7" fill="#fff" stroke="#7C3AED" stroke-width="1.5"/><circle cx="210" cy="40" r="7" fill="#fff" stroke="#7C3AED" stroke-width="2.5"/><rect x="28" y="30" width="48" height="20" rx="4" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="52" y="42.5" text-anchor="middle" font-size="6.5" fill="#1E293B" font-weight="bold">入职登记</text><rect x="116" y="20" width="56" height="16" rx="3" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="144" y="30.5" text-anchor="middle" font-size="5.5" fill="#1E293B">IT开通账号</text><rect x="116" y="44" width="56" height="16" rx="3" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="144" y="54.5" text-anchor="middle" font-size="5.5" fill="#1E293B">培训安排</text><polygon points="96,33 103,40 96,47 89,40" fill="#fff" stroke="#7C3AED" stroke-width="1"/><text x="96" y="42.5" text-anchor="middle" font-size="8" fill="#7C3AED">+</text><polygon points="188,33 195,40 188,47 181,40" fill="#fff" stroke="#7C3AED" stroke-width="1"/><text x="188" y="42.5" text-anchor="middle" font-size="8" fill="#7C3AED">+</text><line x1="19" y1="40" x2="28" y2="40" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#g)"/><line x1="76" y1="40" x2="89" y2="40" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#g)"/><path d="M96,33 L96,28 L116,28" fill="none" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#g)"/><path d="M96,47 L96,52 L116,52" fill="none" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#g)"/><path d="M172,28 L188,28 L188,33" fill="none" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#g)"/><path d="M172,52 L188,52 L188,47" fill="none" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#g)"/><line x1="195" y1="40" x2="203" y2="40" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#g)"/><defs><marker id="g" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7C3AED"/></marker></defs></svg>',
          systemPromptAppend: `员工入职BPMN结构：
- 开始事件（Offer接受）→ 用户任务：入职登记 → 并行网关（+）→ 分支为：
  - 服务任务：IT系统开通（邮箱、工号、门禁卡）
  - 用户任务：部门培训（制度学习、业务介绍）
  - 服务任务：行政准备（工位、设备领用）
- 并行汇聚网关（+）→ 用户任务：导师分配 → 服务任务：试用期跟踪 → 排他网关（转正评估）
- 通过→服务任务：转正手续→结束事件
- 不通过→排他网关（延长/辞退）→延长试用期→返回试用期跟踪 / 辞退→结束事件
- 数据对象：入职登记表、培训记录、转正评估表`,
          exampleUserInput: '画一个新员工入职的BPMN流程图，包含IT开通、培训和行政准备三个并行任务',
        },
      ],
    },

    // ===== 4. epc =====
    {
      id: 'epc',
      name: 'EPC事件驱动链',
      description: '事件驱动过程链，交替展示事件与功能',
      categoryId: 'flowchart',
      systemPromptAppend: `EPC专项规范：
- 事件：六边形或圆角六边形，表示状态或发生的事情
- 功能：圆角矩形（带圆角），表示活动或操作
- 事件与功能必须严格交替出现
- 规则（逻辑连接符）：圆圈内含∧（与）、∨（或）、XOR（异或）
- 控制流：事件→功能→事件→功能...严格交替
- 组织单元：椭圆或矩形标注，用虚线关联到功能
- 信息资源：平行四边形，用虚线关联到功能
- 流程必须以事件开始，以事件结束
- 每个功能前后必须有事件`,
      templates: [
        {
          id: 'epc-procurement',
          name: '采购流程EPC',
          subTypeId: 'epc',
          description: '企业采购流程的事件驱动过程链',
          industryTags: ['采购', '供应链', '企业'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><polygon points="30,10 50,10 55,20 50,30 30,30 25,20" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="40" y="23" text-anchor="middle" font-size="5" fill="#1E293B">需求产生</text><rect x="25" y="35" width="30" height="14" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="40" y="45" text-anchor="middle" font-size="5" fill="#1E293B">提申请</text><polygon points="80,10 100,10 105,20 100,30 80,30 75,20" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="90" y="23" text-anchor="middle" font-size="5" fill="#1E293B">申请提交</text><rect x="75" y="35" width="30" height="14" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="90" y="45" text-anchor="middle" font-size="5" fill="#1E293B">审批</text><polygon points="130,10 150,10 155,20 150,30 130,30 125,20" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="140" y="23" text-anchor="middle" font-size="5" fill="#1E293B">审批通过</text><rect x="125" y="35" width="30" height="14" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="140" y="45" text-anchor="middle" font-size="5" fill="#1E293B">下单</text><line x1="40" y1="30" x2="40" y2="35" stroke="#1E293B" stroke-width="0.75" marker-end="url(#h)"/><path d="M55,42 L65,42 L65,20 L75,20" fill="none" stroke="#1E293B" stroke-width="0.75" marker-end="url(#h)"/><line x1="90" y1="30" x2="90" y2="35" stroke="#1E293B" stroke-width="0.75" marker-end="url(#h)"/><path d="M105,42 L115,42 L115,20 L125,20" fill="none" stroke="#1E293B" stroke-width="0.75" marker-end="url(#h)"/><line x1="140" y1="30" x2="140" y2="35" stroke="#1E293B" stroke-width="0.75" marker-end="url(#h)"/><defs><marker id="h" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1E293B"/></marker></defs></svg>',
          systemPromptAppend: `采购流程EPC结构：
- 事件：采购需求产生 → 功能：提交采购申请 → 事件：申请已提交
- 功能：采购审核 → 事件：审核结果（XOR规则）→ 批准/驳回
- 批准→功能：询价比价→事件：供应商确定→功能：签订合同→事件：合同签订
- 功能：下达订单→事件：订单下达→功能：跟踪交货→事件：货物到达
- 功能：验收入库→事件：验收完成→功能：付款结算→事件：采购完成
- 驳回→功能：修改申请→事件：申请已修改→返回审核
- 组织单元关联：采购员→提交申请，采购经理→审核，仓库管理员→验收`,
          exampleUserInput: '画一个采购流程的EPC图，展示事件与功能的交替，包含审批的异或分支',
        },
        {
          id: 'epc-invoice',
          name: '发票处理EPC',
          subTypeId: 'epc',
          description: '发票从接收到归档的事件驱动过程链',
          industryTags: ['财务', '会计', '企业'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><polygon points="30,15 50,15 55,25 50,35 30,35 25,25" fill="#FFF7ED" stroke="#EA580C" stroke-width="1"/><text x="40" y="28" text-anchor="middle" font-size="5" fill="#1E293B">发票收到</text><rect x="25" y="40" width="30" height="14" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="40" y="50" text-anchor="middle" font-size="5" fill="#1E293B">登记</text><polygon points="80,15 100,15 105,25 100,35 80,35 75,25" fill="#FFF7ED" stroke="#EA580C" stroke-width="1"/><text x="90" y="28" text-anchor="middle" font-size="5" fill="#1E293B">已登记</text><rect x="75" y="40" width="30" height="14" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="90" y="50" text-anchor="middle" font-size="5" fill="#1E293B">审核</text><polygon points="130,15 150,15 155,25 150,35 130,35 125,25" fill="#FFF7ED" stroke="#EA580C" stroke-width="1"/><text x="140" y="28" text-anchor="middle" font-size="5" fill="#1E293B">审核通过</text><line x1="40" y1="35" x2="40" y2="40" stroke="#1E293B" stroke-width="0.75" marker-end="url(#i)"/><path d="M55,47 L65,47 L65,25 L75,25" fill="none" stroke="#1E293B" stroke-width="0.75" marker-end="url(#i)"/><line x1="90" y1="35" x2="90" y2="40" stroke="#1E293B" stroke-width="0.75" marker-end="url(#i)"/><path d="M105,47 L115,47 L115,25 L125,25" fill="none" stroke="#1E293B" stroke-width="0.75" marker-end="url(#i)"/><defs><marker id="i" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1E293B"/></marker></defs></svg>',
          systemPromptAppend: `发票处理EPC结构：
- 事件：发票收到 → 功能：发票登记 → 事件：发票已登记
- 功能：三单匹配（发票/订单/收货单）→ 事件：匹配结果（XOR规则）→ 匹配/不匹配
- 匹配→功能：审核审批→事件：审批通过→功能：付款→事件：付款完成
- 功能：记账→事件：发票已归档
- 不匹配→功能：联系供应商→事件：问题已解决→返回三单匹配
- 组织单元关联：应付会计→登记/匹配，财务经理→审批，出纳→付款
- 信息资源：发票、采购订单、收货单`,
          exampleUserInput: '画一个发票处理的EPC图，从收到发票到归档，包含三单匹配和异常处理',
        },
      ],
    },

    // ===== 5. idef =====
    {
      id: 'idef',
      name: 'IDEF流程图',
      description: 'IDEF0/IDEF3功能建模与过程描述图',
      categoryId: 'flowchart',
      systemPromptAppend: `IDEF专项规范：
- IDEF0盒子：矩形表示活动/功能，左入输入，右出输出，上入控制，下入机制
- 输入箭头：从左侧进入盒子，表示被活动消耗或转化的数据/物料
- 输出箭头：从右侧离开盒子，表示活动产生的结果
- 控制箭头：从上方进入盒子，表示约束或规则
- 机制箭头：从下方进入盒子，表示执行活动的人员/系统
- 层次分解：A0为顶层，A1/A2/A3为第一层分解，A11/A12为第二层
- IDEF3过程流：UOB（行为单元）盒子+交汇点（J1/J2）表示逻辑
- 交汇点：&（与）、O（或）、X（异或），同步/异步标注`,
      templates: [
        {
          id: 'idef-manufacturing',
          name: '制造系统IDEF0',
          subTypeId: 'idef',
          description: '制造系统的IDEF0功能分解模型',
          industryTags: ['制造', '工业', '系统工程'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="15" width="100" height="50" rx="2" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.5"/><text x="100" y="43" text-anchor="middle" font-size="8" fill="#1E293B">制造系统</text><text x="100" y="55" text-anchor="middle" font-size="6" fill="#64748B">A0</text><line x1="20" y1="30" x2="50" y2="30" stroke="#2563EB" stroke-width="1" marker-end="url(#j)"/><text x="35" y="27" font-size="5" fill="#64748B">原材料</text><line x1="150" y1="30" x2="180" y2="30" stroke="#2563EB" stroke-width="1" marker-end="url(#j)"/><text x="165" y="27" font-size="5" fill="#64748B">成品</text><line x1="100" y1="2" x2="100" y2="15" stroke="#DC2626" stroke-width="1" marker-end="url(#j)"/><text x="110" y="10" font-size="5" fill="#64748B">标准</text><line x1="100" y1="78" x2="100" y2="65" stroke="#059669" stroke-width="1" marker-end="url(#j)"/><text x="110" y="75" font-size="5" fill="#64748B">设备</text><defs><marker id="j" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1E293B"/></marker></defs></svg>',
          systemPromptAppend: `制造系统IDEF0结构：
- A0 制造系统（顶层）
  - 输入：原材料、能源 → 输出：成品、废料
  - 控制：质量标准、生产计划 → 机制：生产设备、操作人员
- A1 备料：输入原材料→输出合格物料，控制=质量标准，机制=仓储人员
- A2 加工：输入合格物料→输出半成品，控制=工艺规程，机制=加工设备
- A3 装配：输入半成品→输出成品组件，控制=装配工艺，机制=装配线
- A4 检验：输入成品组件→输出合格成品/不合格品，控制=检验标准，机制=质检人员
- A1-A4按顺序连接，A4的输出"不合格品"反馈到A2`,
          exampleUserInput: '画一个制造系统的IDEF0图，展示A0顶层和A1-A4的功能分解，包含输入输出控制和机制',
        },
        {
          id: 'idef-order-management',
          name: '订单管理IDEF0',
          subTypeId: 'idef',
          description: '订单管理系统的IDEF0功能分解模型',
          industryTags: ['电商', '管理', 'IT系统'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="15" width="100" height="50" rx="2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.5"/><text x="100" y="43" text-anchor="middle" font-size="8" fill="#1E293B">订单管理</text><text x="100" y="55" text-anchor="middle" font-size="6" fill="#64748B">A0</text><line x1="20" y1="30" x2="50" y2="30" stroke="#7C3AED" stroke-width="1" marker-end="url(#k)"/><text x="35" y="27" font-size="5" fill="#64748B">订单</text><line x1="150" y1="30" x2="180" y2="30" stroke="#7C3AED" stroke-width="1" marker-end="url(#k)"/><text x="165" y="27" font-size="5" fill="#64748B">发货单</text><line x1="100" y1="2" x2="100" y2="15" stroke="#DC2626" stroke-width="1" marker-end="url(#k)"/><text x="110" y="10" font-size="5" fill="#64748B">规则</text><line x1="100" y1="78" x2="100" y2="65" stroke="#059669" stroke-width="1" marker-end="url(#k)"/><text x="110" y="75" font-size="5" fill="#64748B">系统</text><defs><marker id="k" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1E293B"/></marker></defs></svg>',
          systemPromptAppend: `订单管理IDEF0结构：
- A0 订单管理系统（顶层）
  - 输入：客户订单 → 输出：发货单、账单
  - 控制：业务规则、库存策略 → 机制：订单系统、客服人员
- A1 订单接收：输入客户订单→输出已登记订单，控制=业务规则，机制=订单系统
- A2 订单验证：输入已登记订单→输出已验证订单/无效订单，控制=验证规则，机制=验证系统
- A3 库存分配：输入已验证订单→输出已分配订单，控制=库存策略，机制=库存系统
- A4 订单执行：输入已分配订单→输出发货单+账单，控制=执行规则，机制=物流系统
- A2的"无效订单"输出到异常处理`,
          exampleUserInput: '画一个订单管理系统的IDEF0图，展示从订单接收到执行的四个功能模块',
        },
      ],
    },

    // ===== 6. sdl =====
    {
      id: 'sdl',
      name: 'SDL状态图',
      description: '规范与描述语言，用于通信系统的状态转移建模',
      categoryId: 'flowchart',
      systemPromptAppend: `SDL专项规范：
- 状态：圆角矩形，内部标注状态名称
- 转移：箭头连线，标注触发事件和执行动作
- 输入：从左侧进入的信号，用尖角符号表示
- 输出：从右侧发出的信号，用尖角符号表示
- 任务：矩形框内标注执行的操作
- 判断：菱形，标注条件表达式
- 进程框架：整个流程用矩形框包围，顶部标注进程名
- 信号：用箭头+信号名表示消息传递
- 定时器：用沙漏符号或T标记表示超时`,
      templates: [
        {
          id: 'sdl-call-flow',
          name: '通话流程SDL',
          subTypeId: 'sdl',
          description: '电话通话的SDL状态转移模型',
          industryTags: ['通信', '电信', '嵌入式'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="8" width="180" height="68" rx="3" fill="none" stroke="#64748B" stroke-width="0.5" stroke-dasharray="3,2"/><text x="100" y="6" text-anchor="middle" font-size="6" fill="#64748B">通话进程</text><rect x="30" y="15" width="50" height="18" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="55" y="26" text-anchor="middle" font-size="6" fill="#1E293B">空闲</text><rect x="120" y="15" width="50" height="18" rx="6" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="145" y="26" text-anchor="middle" font-size="6" fill="#1E293B">振铃</text><rect x="75" y="50" width="50" height="18" rx="6" fill="#D1FAE5" stroke="#059669" stroke-width="1"/><text x="100" y="61" text-anchor="middle" font-size="6" fill="#1E293B">通话中</text><line x1="80" y1="24" x2="120" y2="24" stroke="#2563EB" stroke-width="0.75" marker-end="url(#l)"/><text x="100" y="20" text-anchor="middle" font-size="5" fill="#64748B">来电</text><path d="M145,33 L145,41.5 L100,41.5 L100,50" fill="none" stroke="#059669" stroke-width="0.75" marker-end="url(#l)"/><text x="130" y="40" text-anchor="middle" font-size="5" fill="#64748B">接听</text><path d="M75,59 L55,59 L55,33" fill="none" stroke="#DC2626" stroke-width="0.75" marker-end="url(#l)"/><text x="50" y="48" text-anchor="middle" font-size="5" fill="#64748B">挂断</text><defs><marker id="l" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1E293B"/></marker></defs></svg>',
          systemPromptAppend: `通话流程SDL结构：
- 进程框架：通话进程
- 状态：空闲 → 振铃 → 通话中 → 空闲
- 空闲状态：输入"来电信号"→输出"振铃信号"→进入振铃状态
- 振铃状态：输入"接听信号"→任务：建立通话连接→进入通话中状态
- 振铃状态：输入"超时(T1)"→输出"挂断信号"→返回空闲状态
- 通话中状态：输入"挂断信号"→任务：释放连接→输出"结束信号"→返回空闲
- 通话中状态：输入"保持信号"→进入保持状态→输入"恢复信号"→返回通话中
- 每个转移标注：事件[条件]/动作`,
          exampleUserInput: '画一个电话通话的SDL状态图，包含空闲、振铃、通话中三个状态和转移条件',
        },
      ],
    },

    // ===== 7. value-stream =====
    {
      id: 'value-stream',
      name: '价值流图',
      description: '精益生产中的价值流映射图，展示信息流与物料流',
      categoryId: 'flowchart',
      systemPromptAppend: `价值流图专项规范：
- 过程框：矩形框内标注工序名称和关键数据（CT、C/O、Uptime、Batch）
- 数据框：过程框下方的小矩形，标注周期时间(C/T)、换模时间(C/O)、可用率、批量
- 物料流：粗实线箭头，从左到右表示物料流动方向
- 信息流：细虚线箭头，从上到下或从右到左表示信息传递
- 看板：小正方形内含K标记，表示拉动信号
- 超市：两端开口的矩形，表示库存缓冲
- 推动箭头：黑白条纹箭头，表示推动式生产
- 拉动箭头：空心箭头，表示拉动式生产
- 时间线：底部锯齿线，标注增值时间与非增值时间
- 改进目标：用辐射状图标标注改善点(kaizen burst)`,
      templates: [
        {
          id: 'value-stream-production',
          name: '生产价值流图',
          subTypeId: 'value-stream',
          description: '典型制造企业的当前状态价值流图',
          industryTags: ['制造', '精益', '生产管理'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="35" height="25" rx="2" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="27" y="25" text-anchor="middle" font-size="5" fill="#1E293B">冲压</text><rect x="55" y="10" width="35" height="25" rx="2" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="72" y="25" text-anchor="middle" font-size="5" fill="#1E293B">焊接</text><rect x="100" y="10" width="35" height="25" rx="2" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="117" y="25" text-anchor="middle" font-size="5" fill="#1E293B">涂装</text><rect x="145" y="10" width="35" height="25" rx="2" fill="#DBEAFE" stroke="#2563EB" stroke-width="1"/><text x="162" y="25" text-anchor="middle" font-size="5" fill="#1E293B">总装</text><line x1="45" y1="22" x2="55" y2="22" stroke="#1E293B" stroke-width="2" marker-end="url(#m)"/><line x1="90" y1="22" x2="100" y2="22" stroke="#1E293B" stroke-width="2" marker-end="url(#m)"/><line x1="135" y1="22" x2="145" y2="22" stroke="#1E293B" stroke-width="2" marker-end="url(#m)"/><rect x="10" y="38" width="35" height="12" rx="1" fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.5"/><text x="27" y="47" text-anchor="middle" font-size="4" fill="#64748B">C/T:5s</text><rect x="55" y="38" width="35" height="12" rx="1" fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.5"/><text x="72" y="47" text-anchor="middle" font-size="4" fill="#64748B">C/T:30s</text><rect x="100" y="38" width="35" height="12" rx="1" fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.5"/><text x="117" y="47" text-anchor="middle" font-size="4" fill="#64748B">C/T:45s</text><rect x="145" y="38" width="35" height="12" rx="1" fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.5"/><text x="162" y="47" text-anchor="middle" font-size="4" fill="#64748B">C/T:60s</text><polyline points="10,60 27,55 45,60 72,55 100,60 117,55 135,60 162,55 180,60" fill="none" stroke="#DC2626" stroke-width="0.5"/><text x="100" y="70" text-anchor="middle" font-size="4" fill="#64748B">增值/非增值时间线</text><defs><marker id="m" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1E293B"/></marker></defs></svg>',
          systemPromptAppend: `生产价值流图结构：
- 客户→供应商（信息流：订单/预测，虚线从右到左）
- 生产工序链：冲压→焊接→涂装→总装（物料流，粗实线从左到右）
- 每个工序标注数据框：C/T(周期时间)、C/O(换模时间)、Uptime(可用率)、Batch(批量)
- 冲压：C/T=5s, C/O=60min, Uptime=85%, Batch=500
- 焊接：C/T=30s, C/O=20min, Uptime=90%, Batch=100
- 涂装：C/T=45s, C/O=30min, Uptime=80%, Batch=50
- 总装：C/T=60s, C/O=5min, Uptime=95%, Batch=1
- 工序间设置超市（库存缓冲），使用看板拉动
- 底部时间线：标注增值时间与非增值等待时间
- 改善点：冲压换模时间长、涂装可用率低`,
          exampleUserInput: '画一个制造企业的价值流图，包含冲压、焊接、涂装、总装四个工序，标注周期时间和库存',
        },
        {
          id: 'value-stream-software-delivery',
          name: '软件交付价值流图',
          subTypeId: 'value-stream',
          description: '软件从需求到上线的价值流映射',
          industryTags: ['软件', 'DevOps', '敏捷'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="35" height="25" rx="2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="27" y="25" text-anchor="middle" font-size="5" fill="#1E293B">需求</text><rect x="55" y="10" width="35" height="25" rx="2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="72" y="25" text-anchor="middle" font-size="5" fill="#1E293B">开发</text><rect x="100" y="10" width="35" height="25" rx="2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="117" y="25" text-anchor="middle" font-size="5" fill="#1E293B">测试</text><rect x="145" y="10" width="35" height="25" rx="2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="162" y="25" text-anchor="middle" font-size="5" fill="#1E293B">部署</text><line x1="45" y1="22" x2="55" y2="22" stroke="#1E293B" stroke-width="2" marker-end="url(#n)"/><line x1="90" y1="22" x2="100" y2="22" stroke="#1E293B" stroke-width="2" marker-end="url(#n)"/><line x1="135" y1="22" x2="145" y2="22" stroke="#1E293B" stroke-width="2" marker-end="url(#n)"/><rect x="10" y="38" width="35" height="12" rx="1" fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.5"/><text x="27" y="47" text-anchor="middle" font-size="4" fill="#64748B">3天</text><rect x="55" y="38" width="35" height="12" rx="1" fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.5"/><text x="72" y="47" text-anchor="middle" font-size="4" fill="#64748B">5天</text><rect x="100" y="38" width="35" height="12" rx="1" fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.5"/><text x="117" y="47" text-anchor="middle" font-size="4" fill="#64748B">2天</text><rect x="145" y="38" width="35" height="12" rx="1" fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.5"/><text x="162" y="47" text-anchor="middle" font-size="4" fill="#64748B">1天</text><polyline points="10,60 27,55 45,60 72,55 100,60 117,55 135,60 162,55 180,60" fill="none" stroke="#7C3AED" stroke-width="0.5"/><defs><marker id="n" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1E293B"/></marker></defs></svg>',
          systemPromptAppend: `软件交付价值流图结构：
- 客户→产品团队（信息流：需求/反馈，虚线）
- 交付工序链：需求分析→设计→开发→测试→部署→运维
- 每个工序标注数据框：前置时间(L/T)、处理时间(P/T)、等待时间(W/T)
- 需求分析：L/T=3天, P/T=1天, W/T=2天
- 设计：L/T=5天, P/T=2天, W/T=3天
- 开发：L/T=10天, P/T=5天, W/T=5天
- 测试：L/T=4天, P/T=2天, W/T=2天
- 部署：L/T=1天, P/T=0.5天, W/T=0.5天
- 工序间设置待办队列（Backlog），使用看板拉动
- 底部时间线：总前置时间 vs 总处理时间
- 改善点：开发等待时间长、需求到设计交接效率低`,
          exampleUserInput: '画一个软件交付的价值流图，从需求到部署，标注前置时间和处理时间',
        },
      ],
    },

    // ===== 8. fault-tree =====
    {
      id: 'fault-tree',
      name: '故障树',
      description: '自上而下的故障逻辑分析树形图',
      categoryId: 'flowchart',
      expertFlowOverride: {
        steps: [
          { index: 1, title: '顶事件定义', description: '明确故障树的顶事件（最不希望发生的故障）' },
          { index: 2, title: '直接原因分析', description: '分析导致顶事件的直接原因，确定逻辑门类型（与门/或门）' },
          { index: 3, title: '逐层分解', description: '对每个中间事件继续分解，直到基本事件（不可再分的原因）' },
          { index: 4, title: '符号选择', description: '选择正确的故障树符号：与门（半圆顶）、或门（尖顶）、基本事件（圆形）、中间事件（矩形）' },
          { index: 5, title: '布局规划', description: '采用自上而下的树形布局，顶事件在最上方，逐层向下展开' },
          { index: 6, title: '连线绘制', description: '使用直线连接事件与逻辑门，确保层次清晰' },
          { index: 7, title: '文字标注', description: '为每个事件和逻辑门添加准确的文字描述' },
          { index: 8, title: '质量检查', description: '执行故障树专项检查，确保逻辑完整、树结构正确' },
        ],
        checkItems: [
          { id: 'alignment', label: '对齐检查', description: '同一层级的节点水平对齐，上下层级垂直对齐' },
          { id: 'overflow', label: '溢出检查', description: '所有元素坐标 + 尺寸不超过视口边界 (1200×900)' },
          { id: 'overlap', label: '覆盖检查', description: '无两个可见元素占据重叠区域' },
          { id: 'connection', label: '连线检查', description: '所有连线正确连接事件与逻辑门，无悬空连线' },
          { id: 'text', label: '文字检查', description: '所有 <text> 在其父容器内居中，无截断' },
          { id: 'tree-structure', label: '树结构检查', description: '故障树为严格的树形结构，无回路，顶事件唯一，基本事件无子节点' },
        ],
      },
      systemPromptAppend: `故障树专项规范：
- 顶事件：矩形框，位于树的最顶端，表示最不希望发生的故障
- 中间事件：矩形框，表示需要进一步分解的故障
- 基本事件：圆形，表示不可再分的最底层原因
- 与门(AND)：底部平直、顶部半圆的门符号，所有输入同时发生时输出才发生
- 或门(OR)：底部平直、顶部尖角的门符号，任一输入发生时输出就发生
- 未展开事件：菱形，表示有意不再进一步分析的事件
- 转移符号：三角形，表示子树的转移连接
- 布局：严格的自上而下树形结构，顶事件→逻辑门→中间事件→逻辑门→基本事件
- 连线：从子事件向上连接到逻辑门，再从逻辑门向上连接到父事件`,
      templates: [
        {
          id: 'fault-tree-power-system',
          name: '电力系统故障树',
          subTypeId: 'fault-tree',
          description: '电力系统停电事故的故障树分析',
          industryTags: ['电力', '能源', '安全工程'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="2" width="80" height="16" rx="2" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="100" y="13" text-anchor="middle" font-size="6" fill="#1E293B">系统停电</text><path d="M85,28 L100,20 L115,28 Z" fill="#fff" stroke="#DC2626" stroke-width="1"/><text x="100" y="27" text-anchor="middle" font-size="5" fill="#DC2626">OR</text><rect x="15" y="38" width="60" height="14" rx="2" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="45" y="48" text-anchor="middle" font-size="5" fill="#1E293B">主电源故障</text><rect x="125" y="38" width="60" height="14" rx="2" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="155" y="48" text-anchor="middle" font-size="5" fill="#1E293B">备用电源故障</text><circle cx="45" cy="68" r="10" fill="#fff" stroke="#DC2626" stroke-width="1"/><text x="45" y="71" text-anchor="middle" font-size="4" fill="#1E293B">线路断</text><circle cx="155" cy="68" r="10" fill="#fff" stroke="#DC2626" stroke-width="1"/><text x="155" y="71" text-anchor="middle" font-size="4" fill="#1E293B">柴油故障</text><line x1="100" y1="18" x2="100" y2="20" stroke="#1E293B" stroke-width="0.5"/><line x1="85" y1="28" x2="45" y2="38" stroke="#1E293B" stroke-width="0.5"/><line x1="115" y1="28" x2="155" y2="38" stroke="#1E293B" stroke-width="0.5"/><line x1="45" y1="52" x2="45" y2="58" stroke="#1E293B" stroke-width="0.5"/><line x1="155" y1="52" x2="155" y2="58" stroke="#1E293B" stroke-width="0.5"/></svg>',
          systemPromptAppend: `电力系统故障树结构：
- 顶事件：系统停电
- 或门(OR)：主电源故障 OR 备用电源故障 → 系统停电
- 主电源故障（中间事件）→ 或门 → 变压器故障 OR 输电线路故障
  - 变压器故障（基本事件）
  - 输电线路故障 → 或门 → 雷击 OR 线路老化
    - 雷击（基本事件）
    - 线路老化（基本事件）
- 备用电源故障（中间事件）→ 与门(AND) → 柴油发电机故障 AND UPS耗尽
  - 柴油发电机故障 → 或门 → 燃料不足 OR 启动失败
  - UPS耗尽 → 基本事件：电池老化
- 注意：备用电源需要两个条件同时满足（与门）才会导致备用失败`,
          exampleUserInput: '画一个电力系统停电的故障树，包含主电源和备用电源两条分支，使用与门和或门',
        },
        {
          id: 'fault-tree-server-down',
          name: '服务器宕机故障树',
          subTypeId: 'fault-tree',
          description: '服务器宕机事故的故障树分析',
          industryTags: ['IT', '运维', '安全工程'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="2" width="80" height="16" rx="2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="100" y="13" text-anchor="middle" font-size="6" fill="#1E293B">服务器宕机</text><path d="M85,28 L100,20 L115,28 Z" fill="#fff" stroke="#7C3AED" stroke-width="1"/><text x="100" y="27" text-anchor="middle" font-size="5" fill="#7C3AED">OR</text><rect x="15" y="38" width="60" height="14" rx="2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="45" y="48" text-anchor="middle" font-size="5" fill="#1E293B">硬件故障</text><rect x="125" y="38" width="60" height="14" rx="2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="155" y="48" text-anchor="middle" font-size="5" fill="#1E293B">软件故障</text><circle cx="30" cy="68" r="8" fill="#fff" stroke="#7C3AED" stroke-width="1"/><text x="30" y="71" text-anchor="middle" font-size="4" fill="#1E293B">CPU</text><circle cx="60" cy="68" r="8" fill="#fff" stroke="#7C3AED" stroke-width="1"/><text x="60" y="71" text-anchor="middle" font-size="4" fill="#1E293B">磁盘</text><circle cx="140" cy="68" r="8" fill="#fff" stroke="#7C3AED" stroke-width="1"/><text x="140" y="71" text-anchor="middle" font-size="4" fill="#1E293B">OS</text><circle cx="170" cy="68" r="8" fill="#fff" stroke="#7C3AED" stroke-width="1"/><text x="170" y="71" text-anchor="middle" font-size="4" fill="#1E293B">应用</text><line x1="100" y1="18" x2="100" y2="20" stroke="#1E293B" stroke-width="0.5"/><line x1="85" y1="28" x2="45" y2="38" stroke="#1E293B" stroke-width="0.5"/><line x1="115" y1="28" x2="155" y2="38" stroke="#1E293B" stroke-width="0.5"/><line x1="45" y1="52" x2="30" y2="60" stroke="#1E293B" stroke-width="0.5"/><line x1="45" y1="52" x2="60" y2="60" stroke="#1E293B" stroke-width="0.5"/><line x1="155" y1="52" x2="140" y2="60" stroke="#1E293B" stroke-width="0.5"/><line x1="155" y1="52" x2="170" y2="60" stroke="#1E293B" stroke-width="0.5"/></svg>',
          systemPromptAppend: `服务器宕机故障树结构：
- 顶事件：服务器宕机
- 或门(OR)：硬件故障 OR 软件故障 OR 网络故障 → 服务器宕机
- 硬件故障（中间事件）→ 或门 → CPU过热 OR 磁盘损坏 OR 内存故障 OR 电源故障
  - CPU过热 → 与门(AND) → 散热风扇故障 AND 温控系统失效
  - 磁盘损坏（基本事件）
  - 内存故障（基本事件）
  - 电源故障（基本事件）
- 软件故障（中间事件）→ 或门 → OS崩溃 OR 应用异常 OR 数据库死锁
  - OS崩溃 → 或门 → 内核panic OR 驱动冲突
  - 应用异常（基本事件：内存泄漏）
  - 数据库死锁（基本事件）
- 网络故障（中间事件）→ 或门 → 交换机故障 OR 网线断裂`,
          exampleUserInput: '画一个服务器宕机的故障树，包含硬件、软件、网络三大类原因，使用或门和与门',
        },
      ],
    },

    // ===== 9. event-tree =====
    {
      id: 'event-tree',
      name: '事件树',
      description: '自左向右展开的事件后果分析图',
      categoryId: 'flowchart',
      expertFlowOverride: {
        steps: [
          { index: 1, title: '初始事件定义', description: '明确事件树的初始事件（触发事故的起始事件）' },
          { index: 2, title: '安全屏障识别', description: '识别初始事件后依次触发的安全屏障/防护措施' },
          { index: 3, title: '分支逻辑确定', description: '对每个安全屏障确定成功/失败两种分支' },
          { index: 4, title: '后果场景确定', description: '确定每条分支路径的最终后果场景' },
          { index: 5, title: '布局规划', description: '采用自左向右的树形布局，初始事件在左，后果在右' },
          { index: 6, title: '文字标注', description: '标注每个安全屏障名称、成功/失败分支、后果描述' },
          { index: 7, title: '质量检查', description: '执行事件树专项检查，确保逻辑完整、树结构正确' },
        ],
        checkItems: [
          { id: 'alignment', label: '对齐检查', description: '同一层级的节点垂直对齐，分支间距均匀' },
          { id: 'overflow', label: '溢出检查', description: '所有元素坐标 + 尺寸不超过视口边界 (1200×900)' },
          { id: 'text', label: '文字检查', description: '所有 <text> 在其父容器内居中，无截断' },
          { id: 'tree-structure', label: '树结构检查', description: '事件树为严格的二叉树结构，每层两个分支（成功/失败），无回路' },
        ],
      },
      systemPromptAppend: `事件树专项规范：
- 初始事件：左侧起始节点，用矩形或圆角矩形表示
- 安全屏障/防护层：垂直线段，表示依次触发的安全措施
- 成功分支：向上延伸的线，标注"成功"或"是"
- 失败分支：向下延伸的线，标注"失败"或"否"
- 后果场景：右侧终端节点，用矩形表示，标注后果严重程度
- 布局：严格的自左向右展开，初始事件→屏障1→屏障2→...→后果
- 每个屏障产生两个分支（成功/失败），形成二叉树结构
- 后果按严重程度从上到下排列（最轻在上，最重在下）
- 可在分支上标注概率值`,
      templates: [
        {
          id: 'event-tree-chemical-spill',
          name: '化学品泄漏事件树',
          subTypeId: 'event-tree',
          description: '化学品泄漏事故的事件树分析',
          industryTags: ['化工', '安全', '环境'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="30" width="30" height="20" rx="2" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="17" y="43" text-anchor="middle" font-size="5" fill="#1E293B">泄漏</text><line x1="32" y1="35" x2="60" y2="20" stroke="#059669" stroke-width="1"/><line x1="32" y1="45" x2="60" y2="60" stroke="#DC2626" stroke-width="1"/><text x="46" y="16" font-size="4" fill="#059669">成功</text><text x="46" y="66" font-size="4" fill="#DC2626">失败</text><line x1="60" y1="20" x2="90" y2="10" stroke="#059669" stroke-width="1"/><line x1="60" y1="20" x2="90" y2="30" stroke="#DC2626" stroke-width="1"/><line x1="60" y1="60" x2="90" y2="50" stroke="#059669" stroke-width="1"/><line x1="60" y1="60" x2="90" y2="70" stroke="#DC2626" stroke-width="1"/><text x="75" y="7" font-size="4" fill="#059669">成功</text><text x="75" y="35" font-size="4" fill="#DC2626">失败</text><rect x="90" y="4" width="40" height="12" rx="2" fill="#D1FAE5" stroke="#059669" stroke-width="0.5"/><text x="110" y="13" text-anchor="middle" font-size="4" fill="#1E293B">轻微</text><rect x="90" y="24" width="40" height="12" rx="2" fill="#FEF2F2" stroke="#DC2626" stroke-width="0.5"/><text x="110" y="33" text-anchor="middle" font-size="4" fill="#1E293B">中等</text><rect x="90" y="44" width="40" height="12" rx="2" fill="#FEF2F2" stroke="#DC2626" stroke-width="0.5"/><text x="110" y="53" text-anchor="middle" font-size="4" fill="#1E293B">严重</text><rect x="90" y="64" width="40" height="12" rx="2" fill="#7F1D1D" stroke="#DC2626" stroke-width="0.5"/><text x="110" y="73" text-anchor="middle" font-size="4" fill="#fff">灾难</text><line x1="32" y1="40" x2="60" y2="40" stroke="#94A3B8" stroke-width="0.5" stroke-dasharray="2,1"/><text x="46" y="38" font-size="3" fill="#64748B">围堵</text></svg>',
          systemPromptAppend: `化学品泄漏事件树结构：
- 初始事件：化学品泄漏
- 安全屏障1：泄漏检测系统
  - 成功→及时报警→屏障2：应急围堵
    - 成功→后果：轻微泄漏（可控）
    - 失败→屏障3：疏散措施
      - 成功→后果：中等影响（人员已疏散）
      - 失败→后果：严重影响（人员暴露）
  - 失败→未及时报警→屏障2：应急围堵
    - 成功→后果：中等影响（延迟围堵）
    - 失败→屏障3：疏散措施
      - 成功→后果：严重影响
      - 失败→后果：灾难性后果（大规模污染+人员伤亡）
- 后果按严重程度从上到下排列
- 可标注各分支概率`,
          exampleUserInput: '画一个化学品泄漏的事件树，包含泄漏检测、应急围堵和疏散三个安全屏障',
        },
      ],
    },

    // ===== 10. fishbone =====
    {
      id: 'fishbone',
      name: '鱼骨图',
      description: '因果分析图，从多维度分析问题的根本原因',
      categoryId: 'flowchart',
      expertFlowOverride: {
        steps: [
          { index: 1, title: '问题定义', description: '明确需要分析的核心问题/结果，写在鱼头位置' },
          { index: 2, title: '维度确定', description: '确定分析维度（如人、机、料、法、环、测等6M维度）' },
          { index: 3, title: '主骨绘制', description: '绘制水平主骨线，右端连接鱼头（问题），左端为起点' },
          { index: 4, title: '分支绘制', description: '从主骨斜向上方和下方交替绘制各维度的分支线' },
          { index: 5, title: '原因列举', description: '在每个维度下列举具体原因，用短线连接到对应分支' },
          { index: 6, title: '层次深化', description: '对重要原因进一步追问"为什么"，形成子原因层次' },
          { index: 7, title: '质量检查', description: '执行鱼骨图专项检查，确保结构完整、分支角度正确' },
        ],
        checkItems: [
          { id: 'alignment', label: '对齐检查', description: '主骨线水平居中，上下分支对称分布' },
          { id: 'overflow', label: '溢出检查', description: '所有元素坐标 + 尺寸不超过视口边界 (1200×900)' },
          { id: 'text', label: '文字检查', description: '所有 <text> 在其父容器内居中，无截断' },
          { id: 'branch-angle', label: '分支角度检查', description: '所有分支线与主骨线夹角约60度，上下对称，子原因线与分支线夹角一致' },
        ],
      },
      systemPromptAppend: `鱼骨图专项规范：
- 鱼头：右侧矩形框，内部标注核心问题/结果
- 主骨：水平粗线，从左到右指向鱼头
- 大分支：从主骨斜向延伸的线，与主骨夹角约60度
- 上下交替：大分支在主骨上方和下方交替分布
- 维度标签：每个大分支末端标注维度名称（如人、机、料、法、环、测）
- 中分支：从大分支延伸的斜线，标注具体原因
- 小分支：从中分支延伸的斜线，标注更深层原因
- 分支角度：所有分支与父线夹角约60度，方向一致
- 布局：左右对称，上下均衡，整体呈鱼骨形状`,
      templates: [
        {
          id: 'fishbone-product-quality',
          name: '产品质量鱼骨图',
          subTypeId: 'fishbone',
          description: '从6M维度分析产品质量问题的根本原因',
          industryTags: ['制造', '质量', '精益'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="40" x2="170" y2="40" stroke="#1E293B" stroke-width="2"/><rect x="170" y="30" width="28" height="20" rx="3" fill="#FEF2F2" stroke="#DC2626" stroke-width="1"/><text x="184" y="43" text-anchor="middle" font-size="5" fill="#1E293B">质量</text><line x1="40" y1="40" x2="25" y2="15" stroke="#2563EB" stroke-width="1"/><text x="20" y="12" font-size="5" fill="#2563EB">人</text><line x1="80" y1="40" x2="65" y2="15" stroke="#059669" stroke-width="1"/><text x="60" y="12" font-size="5" fill="#059669">机</text><line x1="120" y1="40" x2="105" y2="15" stroke="#7C3AED" stroke-width="1"/><text x="100" y="12" font-size="5" fill="#7C3AED">料</text><line x1="40" y1="40" x2="25" y2="65" stroke="#EA580C" stroke-width="1"/><text x="20" y="72" font-size="5" fill="#EA580C">法</text><line x1="80" y1="40" x2="65" y2="65" stroke="#DC2626" stroke-width="1"/><text x="60" y="72" font-size="5" fill="#DC2626">环</text><line x1="120" y1="40" x2="105" y2="65" stroke="#64748B" stroke-width="1"/><text x="100" y="72" font-size="5" fill="#64748B">测</text></svg>',
          systemPromptAppend: `产品质量鱼骨图结构（6M维度）：
- 鱼头（问题）：产品质量不合格
- 人(Man)：操作技能不足、培训不到位、责任心不强、疲劳作业
- 机(Machine)：设备精度不足、维护保养缺失、设备老化、工装夹具磨损
- 料(Material)：原材料不合格、供应商变更、来料检验疏漏、物料存储不当
- 法(Method)：工艺参数不当、SOP不完善、作业标准不统一、变更管理缺失
- 环(Environment)：温湿度超标、洁净度不足、照明不良、振动干扰
- 测(Measurement)：量具精度不足、检测方法不当、抽样方案不合理、校准超期
- 每个维度下列举3-4个具体原因，重要原因可进一步分解子原因`,
          exampleUserInput: '画一个产品质量问题的鱼骨图，从人机料法环测六个维度分析原因',
        },
        {
          id: 'fishbone-project-delay',
          name: '项目延期鱼骨图',
          subTypeId: 'fishbone',
          description: '从多维度分析项目延期的根本原因',
          industryTags: ['项目管理', 'IT', '通用'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="40" x2="170" y2="40" stroke="#1E293B" stroke-width="2"/><rect x="170" y="30" width="28" height="20" rx="3" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1"/><text x="184" y="43" text-anchor="middle" font-size="5" fill="#1E293B">延期</text><line x1="40" y1="40" x2="25" y2="15" stroke="#2563EB" stroke-width="1"/><text x="20" y="12" font-size="5" fill="#2563EB">人员</text><line x1="80" y1="40" x2="65" y2="15" stroke="#059669" stroke-width="1"/><text x="60" y="12" font-size="5" fill="#059669">流程</text><line x1="120" y1="40" x2="105" y2="15" stroke="#7C3AED" stroke-width="1"/><text x="100" y="12" font-size="5" fill="#7C3AED">技术</text><line x1="40" y1="40" x2="25" y2="65" stroke="#EA580C" stroke-width="1"/><text x="20" y="72" font-size="5" fill="#EA580C">需求</text><line x1="80" y1="40" x2="65" y2="65" stroke="#DC2626" stroke-width="1"/><text x="60" y="72" font-size="5" fill="#DC2626">资源</text><line x1="120" y1="40" x2="105" y2="65" stroke="#64748B" stroke-width="1"/><text x="100" y="72" font-size="5" fill="#64748B">外部</text></svg>',
          systemPromptAppend: `项目延期鱼骨图结构：
- 鱼头（问题）：项目延期
- 人员：关键人员离职、团队协作不畅、技能不匹配、沟通效率低
- 流程：审批环节过多、变更流程冗长、决策链过长、缺乏敏捷实践
- 技术：技术方案复杂、技术债务积累、集成困难、性能瓶颈
- 需求：需求变更频繁、需求不明确、范围蔓延、优先级调整
- 资源：预算不足、设备短缺、测试环境不足、工具链不完善
- 外部：供应商交付延迟、政策法规变化、市场环境变化、依赖方配合不力
- 每个维度下列举3-4个具体原因`,
          exampleUserInput: '画一个项目延期的鱼骨图，从人员、流程、技术、需求、资源、外部六个维度分析',
        },
        {
          id: 'fishbone-customer-complaint',
          name: '客户投诉鱼骨图',
          subTypeId: 'fishbone',
          description: '从多维度分析客户投诉的根本原因',
          industryTags: ['服务', '客服', '质量'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="40" x2="170" y2="40" stroke="#1E293B" stroke-width="2"/><rect x="170" y="30" width="28" height="20" rx="3" fill="#FFF7ED" stroke="#EA580C" stroke-width="1"/><text x="184" y="43" text-anchor="middle" font-size="5" fill="#1E293B">投诉</text><line x1="40" y1="40" x2="25" y2="15" stroke="#2563EB" stroke-width="1"/><text x="20" y="12" font-size="5" fill="#2563EB">产品</text><line x1="80" y1="40" x2="65" y2="15" stroke="#059669" stroke-width="1"/><text x="60" y="12" font-size="5" fill="#059669">服务</text><line x1="120" y1="40" x2="105" y2="15" stroke="#7C3AED" stroke-width="1"/><text x="100" y="12" font-size="5" fill="#7C3AED">交付</text><line x1="40" y1="40" x2="25" y2="65" stroke="#EA580C" stroke-width="1"/><text x="20" y="72" font-size="5" fill="#EA580C">沟通</text><line x1="80" y1="40" x2="65" y2="65" stroke="#DC2626" stroke-width="1"/><text x="60" y="72" font-size="5" fill="#DC2626">期望</text><line x1="120" y1="40" x2="105" y2="65" stroke="#64748B" stroke-width="1"/><text x="100" y="72" font-size="5" fill="#64748B">流程</text></svg>',
          systemPromptAppend: `客户投诉鱼骨图结构：
- 鱼头（问题）：客户投诉增多
- 产品：质量缺陷、功能不完善、包装破损、规格不符
- 服务：响应速度慢、态度不专业、解决方案无效、跟进不及时
- 交付：物流延迟、配送错误、包装不当、缺货发不了
- 沟通：信息不透明、承诺未兑现、渠道不畅通、反馈无回应
- 期望：宣传过度、承诺过高、用户认知偏差、市场定位偏差
- 流程：退换货复杂、投诉处理慢、跨部门协调难、缺乏闭环机制
- 每个维度下列举3-4个具体原因，重要原因可追问"为什么"深化`,
          exampleUserInput: '画一个客户投诉的鱼骨图，从产品、服务、交付、沟通、期望、流程六个维度分析',
        },
      ],
    },
  ],
};
