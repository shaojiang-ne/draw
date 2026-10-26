import type { ChartCategory } from '../../types';

export const itArchitectureCategory: ChartCategory = {
  id: 'it-architecture',
  name: 'IT 软件与系统架构',
  icon: 'monitor',
  order: 2,
  expertRole: 'UML/架构建模专家',
  systemPrompt: `你是一位拥有15年经验的 UML/架构建模专家，精通软件系统设计、企业架构、微服务、数据库建模等领域的可视化表达。

## 核心能力
- 精通 UML 全图谱（类图、序列图、用例图、状态图、活动图、部署图等）
- 精通 C4 架构模型（Context、Container、Component、Code）
- 精通 ER 图与数据库 Schema 设计
- 精通微服务架构、系统部署架构可视化
- 精通 Git 分支流程与威胁建模
- 精通产品原型/线框图设计

## 分步绘制流程
严格按 expertFlow 中的步骤逐步绘制，每一步完成后输出当前步骤的 SVG，并在下一步中基于上一步的结果继续完善。不得跳步，不得一次性输出最终结果。

## 专项检查
每一步绘制完成后，必须对照 checkItems 逐项检查：
- 对齐与布局：所有元素是否对齐整齐，间距是否均匀
- 溢出检测：任何元素或文字不得超出 SVG 画布边界
- 重叠检测：元素之间不得有非预期的重叠
- 关系线：连线是否正确连接，箭头方向是否准确
- 文字标注：文字是否清晰可读，是否与对应元素正确关联
- 框体结构：类框/实体框的分区是否完整，属性和方法是否正确放置

检查不通过时，必须在下一步中修复后再继续。

## 符号规范
- UML 类图：三段式（类名、属性、方法），访问修饰符用 +/#/- 表示
- UML 序列图：参与者用矩形框，生命线用虚线，消息用箭头，激活期用窄长矩形
- UML 用例图：参与者用人形图标，用例用椭圆，系统边界用矩形
- UML 状态图：状态用圆角矩形，转换用箭头，初始/终止用实心圆/双圆
- UML 活动图：活动用圆角矩形，判断用菱形，开始/结束用实心圆/双圆
- UML 部署图：节点用立方体，构件用矩形+标签，连接用实线
- ER 图：实体用矩形，属性用椭圆，关系用菱形，主键下划线
- C4 模型：Person 用人形，System 用圆角矩形，Container 用圆柱/矩形，Component 用矩形
- 数据库 Schema：表用矩形，字段列表，主键/外键标注，关系线带基数
- 微服务架构：服务用圆角矩形，网关用菱形/六边形，消息队列用圆柱，数据库用圆柱
- Git Flow：分支用彩色线条，提交用圆点，合并用交叉线，标签用旗帜
- 威胁模型：资产用矩形，威胁用闪电/火焰图标，边界用虚线框
- 原型图：页面框架用矩形，组件用线框，交互用虚线箭头标注

所有 SVG 输出必须使用清晰的语义化标签，合理使用 <g> 分组，确保结构清晰、可维护。`,

  expertFlow: {
    steps: [
      {
        index: 1,
        title: '分析需求',
        description: '理解用户需求，确定图表类型、核心元素、关系和约束条件，列出所有需要绘制的实体与关系',
      },
      {
        index: 2,
        title: '布局规划',
        description: '规划整体布局，确定各元素位置、间距和画布尺寸，确保层次清晰、无重叠',
      },
      {
        index: 3,
        title: '绘制类框/实体框',
        description: '绘制所有类框、实体框等核心元素，包含名称、属性、方法等分区内容',
      },
      {
        index: 4,
        title: '绘制关系线',
        description: '绘制元素之间的关系线、继承线、依赖线等，添加正确的箭头和标签',
      },
      {
        index: 5,
        title: '标注多重性',
        description: '在关系线两端标注多重性（1..*、0..1 等）、角色名、约束条件等',
      },
      {
        index: 6,
        title: '样式美化',
        description: '应用配色方案、调整字体大小、边框样式、阴影效果等，使图表美观专业',
      },
      {
        index: 7,
        title: '自检验证',
        description: '检查所有元素对齐、无溢出、无重叠、关系线正确、文字清晰、框体结构完整',
      },
    ],
    checkItems: [
      {
        id: 'alignment',
        label: '对齐检查',
        description: '所有元素是否水平/垂直对齐，间距是否均匀一致',
      },
      {
        id: 'overflow',
        label: '溢出检查',
        description: '任何元素或文字是否超出 SVG 画布边界',
      },
      {
        id: 'overlap',
        label: '重叠检查',
        description: '元素之间是否存在非预期的重叠遮挡',
      },
      {
        id: 'relation-line',
        label: '关系线检查',
        description: '关系线是否正确连接到目标元素，箭头方向是否准确',
      },
      {
        id: 'text',
        label: '文字检查',
        description: '文字是否清晰可读，是否与对应元素正确关联，字号是否合适',
      },
      {
        id: 'box-structure',
        label: '框体结构检查',
        description: '类框/实体框的分区是否完整，属性和方法是否正确放置在对应分区中',
      },
    ],
  },

  subTypes: [
    // ===== UML 类图 =====
    {
      id: 'uml-class',
      name: 'UML 类图',
      description: '面向对象系统的类结构、属性、方法及类间关系',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注类之间的继承、组合、聚合、依赖关系。使用三段式类框，访问修饰符用 +/#/- 表示，抽象类用斜体名称。关系线使用标准 UML 符号：实线+空心三角=继承，虚线+空心三角=实现，实线+菱形=组合，虚线+菱形=聚合，虚线+箭头=依赖。',
      templates: [
        {
          id: 'ecommerce-class',
          name: '电商系统类图',
          subTypeId: 'uml-class',
          description: '电商系统核心类结构，包括用户、商品、订单、支付等类及其关系',
          industryTags: ['电商', '互联网', '零售'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1"/><rect x="5" y="5" width="40" height="20" rx="2" fill="#7C3AED"/><rect x="5" y="25" width="40" height="30" rx="2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="0.5"/><text x="25" y="18" text-anchor="middle" fill="white" font-size="7" font-weight="bold">User</text><rect x="55" y="5" width="40" height="20" rx="2" fill="#5B21B6"/><rect x="55" y="25" width="40" height="30" rx="2" fill="#EDE9FE" stroke="#5B21B6" stroke-width="0.5"/><text x="75" y="18" text-anchor="middle" fill="white" font-size="7" font-weight="bold">Order</text><line x1="45" y1="20" x2="51" y2="20" stroke="#7C3AED" stroke-width="1.5"/><polygon points="51,17 55,20 51,23" fill="white" stroke="#7C3AED" stroke-width="0.5"/></svg>',
          systemPromptAppend: '电商系统包含用户(User)、商品(Product)、订单(Order)、订单项(OrderItem)、支付(Payment)、购物车(Cart)等核心类。User 与 Order 是一对多关系，Order 与 OrderItem 是组合关系，Order 与 Payment 是一对一关系。',
          exampleUserInput: '请绘制一个电商系统的类图，包含用户、商品、订单、支付等核心类',
        },
        {
          id: 'banking-class',
          name: '银行系统类图',
          subTypeId: 'uml-class',
          description: '银行核心系统类结构，包括账户、客户、交易、产品等类',
          industryTags: ['银行', '金融', '支付'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#FFFBEB" stroke="#D97706" stroke-width="1"/><rect x="5" y="5" width="45" height="20" rx="2" fill="#D97706"/><rect x="5" y="25" width="45" height="30" rx="2" fill="#FEF3C7" stroke="#D97706" stroke-width="0.5"/><text x="27.5" y="18" text-anchor="middle" fill="white" font-size="7" font-weight="bold">Account</text><rect x="60" y="5" width="55" height="20" rx="2" fill="#B91C1C"/><rect x="60" y="25" width="55" height="30" rx="2" fill="#FEF3C7" stroke="#B91C1C" stroke-width="0.5"/><text x="87.5" y="18" text-anchor="middle" fill="white" font-size="7" font-weight="bold">Transaction</text><line x1="50" y1="20" x2="60" y2="20" stroke="#D97706" stroke-width="1.5"/></svg>',
          systemPromptAppend: '银行系统包含客户(Customer)、账户(Account)、交易(Transaction)、贷款(Loan)、银行卡(Card)、理财产品(Product)等核心类。Customer 与 Account 是一对多关系，Account 与 Transaction 是一对多关系，Account 与 Card 是一对一关系。',
          exampleUserInput: '请绘制一个银行系统的类图，包含客户、账户、交易、贷款等核心类',
        },
        {
          id: 'school-class',
          name: '学校管理系统类图',
          subTypeId: 'uml-class',
          description: '学校管理系统类结构，包括学生、教师、课程、班级等类',
          industryTags: ['教育', '学校', '管理'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#ECFDF5" stroke="#059669" stroke-width="1"/><rect x="5" y="5" width="40" height="20" rx="2" fill="#059669"/><rect x="5" y="25" width="40" height="30" rx="2" fill="#D1FAE5" stroke="#059669" stroke-width="0.5"/><text x="25" y="18" text-anchor="middle" fill="white" font-size="7" font-weight="bold">Student</text><rect x="55" y="5" width="40" height="20" rx="2" fill="#047857"/><rect x="55" y="25" width="40" height="30" rx="2" fill="#D1FAE5" stroke="#047857" stroke-width="0.5"/><text x="75" y="18" text-anchor="middle" fill="white" font-size="7" font-weight="bold">Course</text><line x1="45" y1="20" x2="55" y2="20" stroke="#059669" stroke-width="1.5" stroke-dasharray="3,2"/></svg>',
          systemPromptAppend: '学校管理系统包含学生(Student)、教师(Teacher)、课程(Course)、班级(Class)、成绩(Grade)、院系(Department)等核心类。Student 与 Course 是多对多关系，Teacher 与 Course 是一对多关系，Student 与 Class 是多对一关系。',
          exampleUserInput: '请绘制一个学校管理系统的类图，包含学生、教师、课程、班级等核心类',
        },
      ],
    },

    // ===== UML 序列图 =====
    {
      id: 'uml-sequence',
      name: 'UML 序列图',
      description: '系统交互时序，参与者间消息传递与响应流程',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注参与者之间的消息时序。参与者用矩形框+生命线（虚线），同步消息用实线实心箭头，异步消息用实线开放箭头，返回消息用虚线开放箭头。激活期用窄长矩形覆盖在生命线上。使用组合片段(alt/opt/loop)表示条件分支和循环。',
      expertFlowOverride: {
        steps: [
          {
            index: 1,
            title: '分析需求',
            description: '理解交互场景，确定参与者、消息流、条件分支和循环',
          },
          {
            index: 2,
            title: '布局规划',
            description: '规划参与者水平排列位置，估算生命线长度和消息间距',
          },
          {
            index: 3,
            title: '绘制参与者',
            description: '绘制参与者矩形框和生命线（虚线）',
          },
          {
            index: 4,
            title: '绘制消息箭头',
            description: '按时间顺序从上到下绘制消息箭头，标注消息名称',
          },
          {
            index: 5,
            title: '绘制激活期',
            description: '在生命线上绘制激活期矩形，表示对象正在执行操作',
          },
          {
            index: 6,
            title: '绘制片段',
            description: '绘制 alt/opt/loop 等组合片段框，标注条件',
          },
          {
            index: 7,
            title: '文字标注',
            description: '添加注释、约束条件、时间约束等文字标注',
          },
          {
            index: 8,
            title: '样式美化',
            description: '调整颜色、字体、线宽，确保图表美观专业',
          },
          {
            index: 9,
            title: '自检验证',
            description: '检查对齐、无溢出、生命线垂直、消息箭头方向正确、文字清晰、激活期范围合理',
          },
        ],
        checkItems: [
          {
            id: 'alignment',
            label: '对齐检查',
            description: '参与者框是否水平对齐，消息是否沿时间轴从上到下排列整齐',
          },
          {
            id: 'overflow',
            label: '溢出检查',
            description: '任何元素或文字是否超出 SVG 画布边界',
          },
          {
            id: 'lifeline-vertical',
            label: '生命线垂直检查',
            description: '所有生命线是否严格垂直，不得倾斜或弯曲',
          },
          {
            id: 'message-arrow-direction',
            label: '消息箭头方向检查',
            description: '消息箭头方向是否正确反映调用方向，返回消息是否为虚线',
          },
          {
            id: 'text',
            label: '文字检查',
            description: '消息名称、条件文字是否清晰可读，位置是否正确',
          },
          {
            id: 'activation-range',
            label: '激活期范围检查',
            description: '激活期矩形是否正确覆盖在对应生命线上，起止位置是否与消息对应',
          },
        ],
      },
      templates: [
        {
          id: 'user-login-sequence',
          name: '用户登录认证',
          subTypeId: 'uml-sequence',
          description: '用户登录认证的完整交互流程，包含验证码校验、Token 颁发等',
          industryTags: ['认证', '安全', 'Web'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1"/><rect x="10" y="3" width="24" height="10" rx="2" fill="#7C3AED"/><line x1="22" y1="13" x2="22" y2="55" stroke="#7C3AED" stroke-width="0.8" stroke-dasharray="3,2"/><rect x="50" y="3" width="24" height="10" rx="2" fill="#5B21B6"/><line x1="62" y1="13" x2="62" y2="55" stroke="#5B21B6" stroke-width="0.8" stroke-dasharray="3,2"/><line x1="22" y1="22" x2="62" y2="28" stroke="#1E1B4B" stroke-width="1"/><polygon points="60,26 64,28 60,30" fill="#1E1B4B"/><text x="42" y="23" text-anchor="middle" fill="#1E1B4B" font-size="5">login()</text><line x1="62" y1="35" x2="22" y2="41" stroke="#1E1B4B" stroke-width="1" stroke-dasharray="3,2"/><polygon points="24,39 20,41 24,43" fill="white" stroke="#1E1B4B" stroke-width="0.5"/></svg>',
          systemPromptAppend: '用户登录认证序列图包含参与者：用户浏览器、前端应用、认证服务、数据库。流程包括：提交登录表单、验证码校验、查询用户信息、密码比对、生成 Token、返回认证结果。',
          exampleUserInput: '请绘制一个用户登录认证的序列图，包含前端、认证服务、数据库之间的交互',
        },
        {
          id: 'microservice-api-sequence',
          name: '微服务API调用',
          subTypeId: 'uml-sequence',
          description: '微服务间 API 调用链路，包含网关路由、服务发现、熔断降级',
          industryTags: ['微服务', 'API', '云原生'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#0F172A" stroke="#6366F1" stroke-width="1"/><rect x="5" y="3" width="20" height="10" rx="2" fill="#6366F1"/><line x1="15" y1="13" x2="15" y2="55" stroke="#6366F1" stroke-width="0.8" stroke-dasharray="3,2"/><rect x="30" y="3" width="20" height="10" rx="2" fill="#4338CA"/><line x1="40" y1="13" x2="40" y2="55" stroke="#4338CA" stroke-width="0.8" stroke-dasharray="3,2"/><rect x="55" y="3" width="20" height="10" rx="2" fill="#818CF8"/><line x1="65" y1="13" x2="65" y2="55" stroke="#818CF8" stroke-width="0.8" stroke-dasharray="3,2"/><line x1="15" y1="22" x2="40" y2="26" stroke="#E2E8F0" stroke-width="0.8"/><line x1="40" y1="32" x2="65" y2="36" stroke="#E2E8F0" stroke-width="0.8"/></svg>',
          systemPromptAppend: '微服务 API 调用序列图包含参与者：客户端、API 网关、服务A、服务B、消息队列。流程包括：请求路由、服务发现、负载均衡、链式调用、熔断判定、降级处理、响应聚合。',
          exampleUserInput: '请绘制一个微服务 API 调用链路的序列图，包含网关、服务发现、熔断降级',
        },
        {
          id: 'payment-sequence',
          name: '支付流程',
          subTypeId: 'uml-sequence',
          description: '在线支付完整流程，包含下单、支付、回调、对账等环节',
          industryTags: ['支付', '电商', '金融'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#FFFBEB" stroke="#D97706" stroke-width="1"/><rect x="5" y="3" width="20" height="10" rx="2" fill="#D97706"/><line x1="15" y1="13" x2="15" y2="55" stroke="#D97706" stroke-width="0.8" stroke-dasharray="3,2"/><rect x="32" y="3" width="20" height="10" rx="2" fill="#B91C1C"/><line x1="42" y1="13" x2="42" y2="55" stroke="#B91C1C" stroke-width="0.8" stroke-dasharray="3,2"/><rect x="60" y="3" width="24" height="10" rx="2" fill="#EA580C"/><line x1="72" y1="13" x2="72" y2="55" stroke="#EA580C" stroke-width="0.8" stroke-dasharray="3,2"/><rect x="90" y="3" width="20" height="10" rx="2" fill="#431407"/><line x1="100" y1="13" x2="100" y2="55" stroke="#431407" stroke-width="0.8" stroke-dasharray="3,2"/><line x1="15" y1="20" x2="42" y2="24" stroke="#7C2D12" stroke-width="0.8"/></svg>',
          systemPromptAppend: '支付流程序列图包含参与者：用户、商户系统、支付网关、银行/第三方支付。流程包括：创建订单、发起支付、跳转收银台、银行扣款、支付回调、订单状态更新、对账确认。',
          exampleUserInput: '请绘制一个在线支付流程的序列图，包含下单、支付、回调、对账等环节',
        },
      ],
    },

    // ===== UML 用例图 =====
    {
      id: 'uml-usecase',
      name: 'UML 用例图',
      description: '系统功能需求，参与者与用例的关系',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注参与者与系统功能的交互关系。参与者用人形图标表示，用例用椭圆表示，系统边界用矩形框表示。包含(include)、扩展(extend)、泛化(generalize)关系用虚线箭头标注。',
      templates: [
        {
          id: 'online-shopping-usecase',
          name: '在线购物用例',
          subTypeId: 'uml-usecase',
          description: '在线购物系统的核心用例，包含浏览、搜索、下单、支付等',
          industryTags: ['电商', '购物', '互联网'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1"/><rect x="30" y="5" width="80" height="50" rx="3" fill="none" stroke="#7C3AED" stroke-width="1" stroke-dasharray="4,2"/><ellipse cx="70" cy="18" rx="22" ry="8" fill="#EDE9FE" stroke="#7C3AED" stroke-width="0.8"/><text x="70" y="20" text-anchor="middle" fill="#1E1B4B" font-size="5">浏览商品</text><ellipse cx="70" cy="38" rx="22" ry="8" fill="#EDE9FE" stroke="#7C3AED" stroke-width="0.8"/><text x="70" y="40" text-anchor="middle" fill="#1E1B4B" font-size="5">下单支付</text><circle cx="15" cy="28" r="4" fill="#7C3AED"/><line x1="15" y1="32" x2="15" y2="44" stroke="#7C3AED" stroke-width="1"/><line x1="15" y1="36" x2="11" y2="40" stroke="#7C3AED" stroke-width="1"/><line x1="15" y1="36" x2="19" y2="40" stroke="#7C3AED" stroke-width="1"/></svg>',
          systemPromptAppend: '在线购物用例图参与者：顾客、管理员、支付系统。用例：浏览商品、搜索商品、加入购物车、提交订单、在线支付、管理商品、处理退款。',
          exampleUserInput: '请绘制一个在线购物系统的用例图',
        },
        {
          id: 'library-usecase',
          name: '图书管理用例',
          subTypeId: 'uml-usecase',
          description: '图书管理系统的核心用例，包含借阅、归还、查询等',
          industryTags: ['图书', '管理', '教育'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#ECFDF5" stroke="#059669" stroke-width="1"/><rect x="30" y="5" width="80" height="50" rx="3" fill="none" stroke="#059669" stroke-width="1" stroke-dasharray="4,2"/><ellipse cx="70" cy="18" rx="22" ry="8" fill="#D1FAE5" stroke="#059669" stroke-width="0.8"/><text x="70" y="20" text-anchor="middle" fill="#064E3B" font-size="5">借阅图书</text><ellipse cx="70" cy="38" rx="22" ry="8" fill="#D1FAE5" stroke="#059669" stroke-width="0.8"/><text x="70" y="40" text-anchor="middle" fill="#064E3B" font-size="5">归还图书</text><circle cx="15" cy="28" r="4" fill="#059669"/><line x1="15" y1="32" x2="15" y2="44" stroke="#059669" stroke-width="1"/><line x1="15" y1="36" x2="11" y2="40" stroke="#059669" stroke-width="1"/><line x1="15" y1="36" x2="19" y2="40" stroke="#059669" stroke-width="1"/></svg>',
          systemPromptAppend: '图书管理用例图参与者：读者、图书管理员。用例：查询图书、借阅图书、归还图书、预约图书、管理图书信息、管理读者信息、超期罚款处理。',
          exampleUserInput: '请绘制一个图书管理系统的用例图',
        },
      ],
    },

    // ===== UML 状态图 =====
    {
      id: 'uml-state',
      name: 'UML 状态图',
      description: '对象生命周期状态转换与触发条件',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注对象的状态转换。状态用圆角矩形表示，转换用带箭头的线表示，初始状态用实心圆表示，终止状态用双圆（实心圆+外圈）表示。转换上标注触发事件[条件]/动作。',
      templates: [
        {
          id: 'order-state',
          name: '订单状态图',
          subTypeId: 'uml-state',
          description: '电商订单从创建到完成/取消的完整状态流转',
          industryTags: ['电商', '订单', '流程'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#FFFBEB" stroke="#D97706" stroke-width="1"/><circle cx="10" cy="30" r="3" fill="#D97706"/><rect x="20" y="20" width="24" height="16" rx="4" fill="#FEF3C7" stroke="#D97706" stroke-width="0.8"/><text x="32" y="29.5" text-anchor="middle" fill="#7C2D12" font-size="4.5" font-weight="bold">待支付</text><rect x="54" y="20" width="24" height="16" rx="4" fill="#FEF3C7" stroke="#D97706" stroke-width="0.8"/><text x="66" y="29.5" text-anchor="middle" fill="#7C2D12" font-size="4.5" font-weight="bold">已支付</text><circle cx="108" cy="30" r="5" fill="none" stroke="#D97706" stroke-width="1"/><circle cx="108" cy="30" r="3" fill="#D97706"/><line x1="13" y1="30" x2="20" y2="30" stroke="#D97706" stroke-width="0.75" marker-end="url(#s)"/><line x1="44" y1="30" x2="54" y2="30" stroke="#D97706" stroke-width="0.75" marker-end="url(#s)"/><text x="49" y="27" text-anchor="middle" fill="#D97706" font-size="2.5">支付</text><line x1="78" y1="30" x2="103" y2="30" stroke="#D97706" stroke-width="0.75" marker-end="url(#s)"/><text x="90.5" y="27" text-anchor="middle" fill="#D97706" font-size="2.5">完成</text><defs><marker id="s" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="3.5" markerHeight="3.5" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#D97706"/></marker></defs></svg>',
          systemPromptAppend: '订单状态图包含状态：待支付、已支付、已发货、已收货、已完成、已取消、退款中、已退款。触发事件：支付成功、商家发货、确认收货、取消订单、申请退款。',
          exampleUserInput: '请绘制一个电商订单的状态图，从创建到完成/取消的完整流转',
        },
        {
          id: 'workflow-state',
          name: '工作流状态图',
          subTypeId: 'uml-state',
          description: '审批工作流的状态转换，包含多级审批与驳回',
          industryTags: ['OA', '审批', '工作流'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#0F172A" stroke="#6366F1" stroke-width="1"/><circle cx="8" cy="30" r="4" fill="#6366F1"/><rect x="18" y="22" width="24" height="16" rx="6" fill="#1E1B4B" stroke="#6366F1" stroke-width="0.8"/><text x="30" y="32" text-anchor="middle" fill="#E2E8F0" font-size="5">草稿</text><rect x="52" y="22" width="24" height="16" rx="6" fill="#1E1B4B" stroke="#818CF8" stroke-width="0.8"/><text x="64" y="32" text-anchor="middle" fill="#E2E8F0" font-size="5">审批中</text><line x1="12" y1="30" x2="18" y2="30" stroke="#6366F1" stroke-width="1"/><line x1="42" y1="30" x2="48" y2="30" stroke="#818CF8" stroke-width="1"/><polygon points="48,28 52,30 48,32" fill="#818CF8"/></svg>',
          systemPromptAppend: '工作流状态图包含状态：草稿、待审批、一级审批中、二级审批中、已通过、已驳回、已撤回。触发事件：提交、审批通过、审批驳回、撤回、重新提交。',
          exampleUserInput: '请绘制一个审批工作流的状态图，包含多级审批与驳回流程',
        },
      ],
    },

    // ===== UML 活动图 =====
    {
      id: 'uml-activity',
      name: 'UML 活动图',
      description: '业务流程与算法步骤，分支并行与泳道',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注活动流程与分支。活动用圆角矩形表示，判断/分支用菱形表示，开始用实心圆，结束用双圆。泳道用垂直分区表示不同角色/部门。可使用 fork/join 表示并行分支。',
      templates: [
        {
          id: 'user-register-activity',
          name: '用户注册活动图',
          subTypeId: 'uml-activity',
          description: '用户注册完整流程，包含验证、激活等环节',
          industryTags: ['用户', '注册', '认证'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1"/><circle cx="8" cy="30" r="3" fill="#7C3AED"/><rect x="18" y="22" width="28" height="16" rx="3" fill="#EDE9FE" stroke="#7C3AED" stroke-width="0.8"/><text x="32" y="31.5" text-anchor="middle" fill="#1E1B4B" font-size="4.5" font-weight="bold">填写信息</text><polygon points="60,22 67,30 60,38 53,30" fill="#EDE9FE" stroke="#7C3AED" stroke-width="0.8"/><rect x="76" y="22" width="28" height="16" rx="3" fill="#EDE9FE" stroke="#7C3AED" stroke-width="0.8"/><text x="90" y="31.5" text-anchor="middle" fill="#1E1B4B" font-size="4.5" font-weight="bold">创建账户</text><circle cx="113" cy="30" r="5" fill="none" stroke="#7C3AED" stroke-width="1"/><circle cx="113" cy="30" r="3" fill="#7C3AED"/><line x1="11" y1="30" x2="18" y2="30" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#u)"/><line x1="46" y1="30" x2="53" y2="30" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#u)"/><text x="49.5" y="27" text-anchor="middle" fill="#7C3AED" font-size="2.5">格式验证</text><line x1="67" y1="30" x2="76" y2="30" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#u)"/><text x="71.5" y="27" text-anchor="middle" fill="#7C3AED" font-size="2.5">通过</text><path d="M60,38 L60,48 L90,48 L90,38" fill="none" stroke="#7C3AED" stroke-width="0.6" stroke-dasharray="2,1.5"/><text x="75" y="51" text-anchor="middle" fill="#7C3AED" font-size="2.5">不通过→重填</text><line x1="104" y1="30" x2="108" y2="30" stroke="#7C3AED" stroke-width="0.75" marker-end="url(#u)"/><defs><marker id="u" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="3.5" markerHeight="3.5" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7C3AED"/></marker></defs></svg>',
          systemPromptAppend: '用户注册活动图包含活动：填写注册信息、验证输入格式、发送验证码、验证邮箱/手机、创建账户、发送欢迎邮件。判断点：格式是否正确、验证码是否匹配。',
          exampleUserInput: '请绘制一个用户注册的活动图，包含验证、激活等环节',
        },
        {
          id: 'approval-activity',
          name: '审批流程活动图',
          subTypeId: 'uml-activity',
          description: '多级审批流程，包含驳回与重新提交',
          industryTags: ['OA', '审批', '企业'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#ECFDF5" stroke="#059669" stroke-width="1"/><circle cx="10" cy="33" r="3" fill="#059669"/><circle cx="110" cy="33" r="5" fill="none" stroke="#059669" stroke-width="0.8"/><circle cx="110" cy="33" r="3" fill="#059669"/><rect x="18" y="27" width="22" height="12" rx="3" fill="#D1FAE5" stroke="#059669" stroke-width="0.8"/><text x="29" y="34.5" text-anchor="middle" fill="#064E3B" font-size="4" font-weight="bold">提交申请</text><polygon points="52,27 58,33 52,39 46,33" fill="#D1FAE5" stroke="#059669" stroke-width="0.8"/><rect x="68" y="18" width="22" height="12" rx="3" fill="#D1FAE5" stroke="#059669" stroke-width="0.8"/><text x="79" y="25.5" text-anchor="middle" fill="#064E3B" font-size="4" font-weight="bold">主管审批</text><rect x="68" y="36" width="22" height="12" rx="3" fill="#D1FAE5" stroke="#059669" stroke-width="0.8"/><text x="79" y="43.5" text-anchor="middle" fill="#064E3B" font-size="4" font-weight="bold">总监审批</text><line x1="13" y1="33" x2="18" y2="33" stroke="#059669" stroke-width="0.75" marker-end="url(#a)"/><line x1="40" y1="33" x2="46" y2="33" stroke="#059669" stroke-width="0.75" marker-end="url(#a)"/><path d="M52,27 L52,24 L68,24" fill="none" stroke="#059669" stroke-width="0.75" marker-end="url(#a)"/><text x="60" y="22" text-anchor="middle" fill="#059669" font-size="2.5">金额 &lt; 1万</text><path d="M52,39 L52,42 L68,42" fill="none" stroke="#059669" stroke-width="0.75" marker-end="url(#a)"/><text x="60" y="46.5" text-anchor="middle" fill="#059669" font-size="2.5">金额 &ge; 1万</text><path d="M90,24 L102,24 L102,33 L105,33" fill="none" stroke="#059669" stroke-width="0.75" marker-end="url(#a)"/><path d="M90,42 L102,42 L102,33 L105,33" fill="none" stroke="#059669" stroke-width="0.75" marker-end="url(#a)"/><defs><marker id="a" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="3" markerHeight="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#059669"/></marker></defs></svg>',
          systemPromptAppend: '审批流程活动图包含活动：提交申请、主管审批、总监审批、财务审批、完成归档。判断点：主管是否批准、总监是否批准、财务是否核准。驳回时可重新提交或撤回。',
          exampleUserInput: '请绘制一个多级审批流程的活动图，包含驳回与重新提交',
        },
      ],
    },

    // ===== UML 部署图 =====
    {
      id: 'uml-deployment',
      name: 'UML 部署图',
      description: '系统物理部署架构，节点与通信路径',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注系统物理部署结构。节点用立方体表示，构件用矩形+标签表示，通信路径用实线连接。标注通信协议、网络拓扑和硬件配置。',
      expertFlowOverride: {
        steps: [
          {
            index: 1,
            title: '分析需求',
            description: '理解部署架构，确定节点、构件、通信路径和硬件资源',
          },
          {
            index: 2,
            title: '布局规划',
            description: '规划节点位置、网络拓扑布局，确保层次清晰',
          },
          {
            index: 3,
            title: '绘制外层边界',
            description: '绘制网络区域、安全边界等外层容器',
          },
          {
            index: 4,
            title: '绘制内部组件',
            description: '在节点内绘制构件、制品等内部元素',
          },
          {
            index: 5,
            title: '绘制连接线',
            description: '绘制节点间的通信路径，标注协议和带宽',
          },
          {
            index: 6,
            title: '标注技术栈',
            description: '标注各节点和构件使用的技术栈、版本信息',
          },
          {
            index: 7,
            title: '样式美化',
            description: '调整颜色、字体、线宽，使图表美观专业',
          },
          {
            index: 8,
            title: '自检验证',
            description: '检查对齐、无溢出、无重叠、嵌套层级正确、文字清晰、边界包含关系正确',
          },
        ],
        checkItems: [
          {
            id: 'alignment',
            label: '对齐检查',
            description: '节点是否对齐整齐，间距是否均匀',
          },
          {
            id: 'overflow',
            label: '溢出检查',
            description: '任何元素或文字是否超出 SVG 画布边界',
          },
          {
            id: 'overlap',
            label: '重叠检查',
            description: '节点之间是否存在非预期的重叠遮挡',
          },
          {
            id: 'nesting-level',
            label: '嵌套层级检查',
            description: '构件是否正确嵌套在节点内，嵌套层级是否清晰',
          },
          {
            id: 'text',
            label: '文字检查',
            description: '节点名称、协议标注等文字是否清晰可读',
          },
          {
            id: 'boundary-containment',
            label: '边界包含检查',
            description: '网络区域、安全边界是否正确包含其内部节点和构件',
          },
        ],
      },
      templates: [
        {
          id: 'microservice-deployment',
          name: '微服务部署图',
          subTypeId: 'uml-deployment',
          description: '微服务架构的物理部署，包含容器、K8s 集群、数据库等',
          industryTags: ['微服务', 'K8s', '云原生'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#0F172A" stroke="#6366F1" stroke-width="1"/><rect x="6" y="8" width="50" height="44" rx="2" fill="none" stroke="#6366F1" stroke-width="1" stroke-dasharray="4,2"/><rect x="12" y="12" width="38" height="10" rx="1" fill="#4338CA"/><text x="31" y="19" text-anchor="middle" fill="#E2E8F0" font-size="5">K8s Master</text><rect x="12" y="26" width="38" height="10" rx="1" fill="#6366F1"/><text x="31" y="33" text-anchor="middle" fill="white" font-size="5">Service A</text><rect x="64" y="8" width="50" height="44" rx="2" fill="none" stroke="#818CF8" stroke-width="1" stroke-dasharray="4,2"/><rect x="70" y="12" width="38" height="10" rx="1" fill="#818CF8"/><text x="89" y="19" text-anchor="middle" fill="#1E1B4B" font-size="5">K8s Worker</text><rect x="70" y="26" width="38" height="10" rx="1" fill="#A78BFA"/><text x="89" y="33" text-anchor="middle" fill="#1E1B4B" font-size="5">Service B</text></svg>',
          systemPromptAppend: '微服务部署图包含节点：K8s Master、K8s Worker Node x N、数据库服务器、消息队列服务器、Nginx 负载均衡、Redis 缓存集群。通信协议：HTTP/gRPC、TCP、AMQP。',
          exampleUserInput: '请绘制一个微服务架构的部署图，包含 K8s 集群、数据库等',
        },
        {
          id: 'enterprise-deployment',
          name: '企业应用部署图',
          subTypeId: 'uml-deployment',
          description: '企业级应用的物理部署架构，包含 DMZ、内网、数据库集群',
          industryTags: ['企业', '部署', '架构'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#FFFBEB" stroke="#D97706" stroke-width="1"/><rect x="4" y="5" width="32" height="50" rx="2" fill="none" stroke="#EA580C" stroke-width="1" stroke-dasharray="4,2"/><text x="20" y="12" text-anchor="middle" fill="#EA580C" font-size="4.5">DMZ</text><rect x="40" y="5" width="76" height="50" rx="2" fill="none" stroke="#D97706" stroke-width="1" stroke-dasharray="4,2"/><text x="78" y="12" text-anchor="middle" fill="#D97706" font-size="4.5">内网</text><rect x="8" y="18" width="24" height="12" rx="2" fill="#FEF3C7" stroke="#EA580C" stroke-width="0.8"/><text x="20" y="26" text-anchor="middle" fill="#7C2D12" font-size="4.5">Nginx</text><rect x="44" y="18" width="32" height="12" rx="2" fill="#FEF3C7" stroke="#D97706" stroke-width="0.8"/><text x="60" y="26" text-anchor="middle" fill="#7C2D12" font-size="4.5">App Server</text><rect x="80" y="18" width="32" height="12" rx="2" fill="#FEF3C7" stroke="#D97706" stroke-width="0.8"/><text x="96" y="26" text-anchor="middle" fill="#7C2D12" font-size="4.5">DB Cluster</text></svg>',
          systemPromptAppend: '企业应用部署图包含区域：DMZ 区（防火墙、WAF、反向代理）、应用区（应用服务器集群）、数据区（数据库主从集群、文件存储）、管理区（监控、日志、配置中心）。',
          exampleUserInput: '请绘制一个企业应用的部署图，包含 DMZ、内网、数据库集群',
        },
      ],
    },

    // ===== ER 图 =====
    {
      id: 'er-diagram',
      name: 'ER 图',
      description: '实体关系模型，数据库概念设计与逻辑设计',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注实体间的关系。实体用矩形表示，属性用椭圆表示，关系用菱形表示，主键属性下划线标注。关系线上标注基数（1:1, 1:N, M:N）。弱实体用双线矩形，弱关系用双线菱形。',
      templates: [
        {
          id: 'ecommerce-er',
          name: '电商数据库ER',
          subTypeId: 'er-diagram',
          description: '电商系统数据库 ER 模型，包含用户、商品、订单等核心实体',
          industryTags: ['电商', '数据库', '设计'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1"/><rect x="5" y="18" width="30" height="24" rx="2" fill="#7C3AED"/><text x="20" y="33" text-anchor="middle" fill="white" font-size="6" font-weight="bold">用户</text><polygon points="60,18 75,30 60,42 45,30" fill="#EDE9FE" stroke="#7C3AED" stroke-width="0.8"/><text x="60" y="33" text-anchor="middle" fill="#1E1B4B" font-size="5">下单</text><rect x="85" y="18" width="30" height="24" rx="2" fill="#5B21B6"/><text x="100" y="33" text-anchor="middle" fill="white" font-size="6" font-weight="bold">订单</text><line x1="35" y1="30" x2="45" y2="30" stroke="#7C3AED" stroke-width="1"/><line x1="75" y1="30" x2="85" y2="30" stroke="#7C3AED" stroke-width="1"/><text x="40" y="27" fill="#7C3AED" font-size="4">1</text><text x="80" y="27" fill="#7C3AED" font-size="4">N</text></svg>',
          systemPromptAppend: '电商 ER 图包含实体：用户、商品、订单、订单项、分类、品牌、支付记录、收货地址。关系：用户-订单(1:N)、订单-订单项(1:N)、商品-订单项(M:N)、商品-分类(N:1)、商品-品牌(N:1)。',
          exampleUserInput: '请绘制一个电商系统数据库的 ER 图',
        },
        {
          id: 'student-course-er',
          name: '学生选课ER',
          subTypeId: 'er-diagram',
          description: '学生选课系统 ER 模型，包含学生、课程、教师等实体',
          industryTags: ['教育', '数据库', '选课'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#ECFDF5" stroke="#059669" stroke-width="1"/><rect x="5" y="18" width="30" height="24" rx="2" fill="#059669"/><text x="20" y="33" text-anchor="middle" fill="white" font-size="6" font-weight="bold">学生</text><polygon points="60,18 75,30 60,42 45,30" fill="#D1FAE5" stroke="#059669" stroke-width="0.8"/><text x="60" y="33" text-anchor="middle" fill="#064E3B" font-size="5">选课</text><rect x="85" y="18" width="30" height="24" rx="2" fill="#047857"/><text x="100" y="33" text-anchor="middle" fill="white" font-size="6" font-weight="bold">课程</text><line x1="35" y1="30" x2="45" y2="30" stroke="#059669" stroke-width="1"/><line x1="75" y1="30" x2="85" y2="30" stroke="#059669" stroke-width="1"/><text x="40" y="27" fill="#059669" font-size="4">M</text><text x="80" y="27" fill="#059669" font-size="4">N</text></svg>',
          systemPromptAppend: '学生选课 ER 图包含实体：学生、课程、教师、院系、教室、成绩。关系：学生-选课-课程(M:N)、教师-授课-课程(1:N)、学生-所属-院系(N:1)、教师-所属-院系(N:1)、课程-安排-教室(N:1)。',
          exampleUserInput: '请绘制一个学生选课系统的 ER 图',
        },
        {
          id: 'inventory-er',
          name: '库存管理ER',
          subTypeId: 'er-diagram',
          description: '库存管理系统 ER 模型，包含仓库、商品、出入库等实体',
          industryTags: ['库存', '物流', '供应链'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#FFFBEB" stroke="#D97706" stroke-width="1"/><rect x="5" y="18" width="30" height="24" rx="2" fill="#D97706"/><text x="20" y="33" text-anchor="middle" fill="white" font-size="6" font-weight="bold">仓库</text><polygon points="60,18 75,30 60,42 45,30" fill="#FEF3C7" stroke="#D97706" stroke-width="0.8"/><text x="60" y="33" text-anchor="middle" fill="#7C2D12" font-size="5">存储</text><rect x="85" y="18" width="30" height="24" rx="2" fill="#EA580C"/><text x="100" y="33" text-anchor="middle" fill="white" font-size="6" font-weight="bold">商品</text><line x1="35" y1="30" x2="45" y2="30" stroke="#D97706" stroke-width="1"/><line x1="75" y1="30" x2="85" y2="30" stroke="#D97706" stroke-width="1"/></svg>',
          systemPromptAppend: '库存管理 ER 图包含实体：仓库、商品、供应商、入库单、出库单、库存记录、库存预警。关系：仓库-存储-商品(M:N)、供应商-供应-商品(M:N)、入库单-入库-商品(1:N)、出库单-出库-商品(1:N)。',
          exampleUserInput: '请绘制一个库存管理系统的 ER 图',
        },
      ],
    },

    // ===== C4 架构 =====
    {
      id: 'c4-architecture',
      name: 'C4 架构',
      description: 'C4 模型多层级架构视图，从 Context 到 Component',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注不同层级的架构视图。Level 1 Context：展示系统与外部角色/系统的关系；Level 2 Container：展示系统内部的容器（应用、数据库、消息队列等）；Level 3 Component：展示容器内部的组件。Person 用人形图标，External System 用灰色矩形，Internal System 用彩色矩形，Container 用圆角矩形+技术栈标注，Component 用矩形+技术栈标注。使用不同颜色区分内部/外部元素。',
      expertFlowOverride: {
        steps: [
          {
            index: 1,
            title: '分析需求',
            description: '理解架构层级，确定需要展示的元素、关系和技术栈',
          },
          {
            index: 2,
            title: '布局规划',
            description: '规划层级布局，核心系统居中，外部元素环绕，容器/组件分层排列',
          },
          {
            index: 3,
            title: '绘制外层边界',
            description: '绘制系统边界、企业边界等外层容器框',
          },
          {
            index: 4,
            title: '绘制内部组件',
            description: '在边界内绘制 Person、System、Container、Component 等元素',
          },
          {
            index: 5,
            title: '绘制连接线',
            description: '绘制元素间的连接线，标注数据流和协议',
          },
          {
            index: 6,
            title: '标注技术栈',
            description: '标注各容器/组件使用的技术栈、语言、框架信息',
          },
          {
            index: 7,
            title: '样式美化',
            description: '应用配色方案，确保视觉层次清晰，内外部元素颜色区分',
          },
          {
            index: 8,
            title: '自检验证',
            description: '检查对齐、无溢出、无重叠、嵌套层级正确、文字清晰、边界包含关系正确',
          },
        ],
        checkItems: [
          {
            id: 'alignment',
            label: '对齐检查',
            description: '元素是否对齐整齐，间距是否均匀',
          },
          {
            id: 'overflow',
            label: '溢出检查',
            description: '任何元素或文字是否超出 SVG 画布边界',
          },
          {
            id: 'overlap',
            label: '重叠检查',
            description: '元素之间是否存在非预期的重叠遮挡',
          },
          {
            id: 'nesting-level',
            label: '嵌套层级检查',
            description: '组件是否正确嵌套在容器内，容器是否正确嵌套在系统边界内',
          },
          {
            id: 'text',
            label: '文字检查',
            description: '元素名称、技术栈标注是否清晰可读',
          },
          {
            id: 'boundary-containment',
            label: '边界包含检查',
            description: '系统边界是否正确包含内部元素，外部元素是否在边界外',
          },
        ],
      },
      templates: [
        {
          id: 'ecommerce-c4-context',
          name: '电商系统Context',
          subTypeId: 'c4-architecture',
          description: '电商系统的 Context 视图，展示核心系统与外部依赖',
          industryTags: ['电商', '架构', 'C4'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1"/><circle cx="15" cy="30" r="6" fill="#7C3AED"/><line x1="15" y1="36" x2="15" y2="46" stroke="#7C3AED" stroke-width="1.5"/><line x1="15" y1="40" x2="10" y2="44" stroke="#7C3AED" stroke-width="1"/><line x1="15" y1="40" x2="20" y2="44" stroke="#7C3AED" stroke-width="1"/><rect x="38" y="15" width="44" height="30" rx="4" fill="#7C3AED"/><text x="60" y="33" text-anchor="middle" fill="white" font-size="6" font-weight="bold">电商系统</text><rect x="92" y="20" width="22" height="20" rx="2" fill="#EDE9FE" stroke="#A78BFA" stroke-width="0.8"/><text x="103" y="32" text-anchor="middle" fill="#5B21B6" font-size="4.5">支付网关</text><line x1="21" y1="30" x2="38" y2="30" stroke="#7C3AED" stroke-width="1"/><line x1="82" y1="30" x2="92" y2="30" stroke="#A78BFA" stroke-width="1"/></svg>',
          systemPromptAppend: '电商系统 C4 Context 视图：核心系统=电商系统，外部角色=顾客、管理员、运营人员，外部系统=支付网关、物流系统、短信服务、推荐引擎。',
          exampleUserInput: '请绘制电商系统的 C4 Context 视图',
        },
        {
          id: 'order-c4-container',
          name: '订单系统Container',
          subTypeId: 'c4-architecture',
          description: '订单系统的 Container 视图，展示内部容器和技术栈',
          industryTags: ['订单', '架构', 'C4'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#0F172A" stroke="#6366F1" stroke-width="1"/><rect x="5" y="5" width="110" height="50" rx="3" fill="none" stroke="#6366F1" stroke-width="1" stroke-dasharray="4,2"/><rect x="10" y="12" width="30" height="16" rx="3" fill="#6366F1"/><text x="25" y="22" text-anchor="middle" fill="white" font-size="4.5">Web App</text><rect x="45" y="12" width="30" height="16" rx="3" fill="#4338CA"/><text x="60" y="22" text-anchor="middle" fill="white" font-size="4.5">API Server</text><rect x="80" y="12" width="30" height="16" rx="3" fill="#818CF8"/><text x="95" y="22" text-anchor="middle" fill="#1E1B4B" font-size="4.5">Order Svc</text><rect x="25" y="35" width="30" height="14" rx="3" fill="#1E1B4B" stroke="#818CF8" stroke-width="0.8"/><text x="40" y="44" text-anchor="middle" fill="#E2E8F0" font-size="4.5">PostgreSQL</text><rect x="65" y="35" width="30" height="14" rx="3" fill="#1E1B4B" stroke="#A78BFA" stroke-width="0.8"/><text x="80" y="44" text-anchor="middle" fill="#E2E8F0" font-size="4.5">Redis</text></svg>',
          systemPromptAppend: '订单系统 C4 Container 视图：Web 应用(React)、API 网关(Spring Cloud Gateway)、订单服务(Java/Spring Boot)、库存服务(Go)、消息队列(RabbitMQ)、订单数据库(PostgreSQL)、缓存(Redis)。',
          exampleUserInput: '请绘制订单系统的 C4 Container 视图',
        },
        {
          id: 'payment-c4-component',
          name: '支付服务Component',
          subTypeId: 'c4-architecture',
          description: '支付服务的 Component 视图，展示服务内部组件',
          industryTags: ['支付', '架构', 'C4'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#FFFBEB" stroke="#D97706" stroke-width="1"/><rect x="5" y="5" width="110" height="50" rx="3" fill="none" stroke="#D97706" stroke-width="1" stroke-dasharray="4,2"/><rect x="10" y="10" width="30" height="14" rx="2" fill="#D97706"/><text x="25" y="19" text-anchor="middle" fill="white" font-size="4.5">支付控制器</text><rect x="45" y="10" width="30" height="14" rx="2" fill="#EA580C"/><text x="60" y="19" text-anchor="middle" fill="white" font-size="4.5">支付引擎</text><rect x="80" y="10" width="30" height="14" rx="2" fill="#B91C1C"/><text x="95" y="19" text-anchor="middle" fill="white" font-size="4.5">风控组件</text><rect x="10" y="30" width="30" height="14" rx="2" fill="#FEF3C7" stroke="#D97706" stroke-width="0.8"/><text x="25" y="39" text-anchor="middle" fill="#7C2D12" font-size="4.5">渠道适配器</text><rect x="45" y="30" width="30" height="14" rx="2" fill="#FEF3C7" stroke="#EA580C" stroke-width="0.8"/><text x="60" y="39" text-anchor="middle" fill="#7C2D12" font-size="4.5">账务组件</text><rect x="80" y="30" width="30" height="14" rx="2" fill="#FEF3C7" stroke="#B91C1C" stroke-width="0.8"/><text x="95" y="39" text-anchor="middle" fill="#7C2D12" font-size="4.5">通知组件</text></svg>',
          systemPromptAppend: '支付服务 C4 Component 视图：支付控制器(REST API)、支付引擎(核心逻辑)、风控组件(规则引擎)、渠道适配器(微信/支付宝/银联)、账务组件(记账对账)、通知组件(回调通知)。',
          exampleUserInput: '请绘制支付服务的 C4 Component 视图',
        },
      ],
    },

    // ===== 数据库 Schema =====
    {
      id: 'database-schema',
      name: '数据库 Schema',
      description: '数据库表结构设计，字段类型与约束关系',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注表结构设计。表用矩形表示，内部列出字段名、类型、约束。主键用 PK 标注，外键用 FK 标注，唯一约束用 UQ 标注。表间关系用连线表示，1端用单竖线，N端用三叉线。标注索引和默认值。',
      templates: [
        {
          id: 'user-permission-schema',
          name: '用户权限表结构',
          subTypeId: 'database-schema',
          description: 'RBAC 权限模型的数据库表结构，包含用户、角色、权限表',
          industryTags: ['权限', 'RBAC', '安全'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1"/><rect x="5" y="5" width="32" height="50" rx="2" fill="#EDE9FE" stroke="#7C3AED" stroke-width="0.8"/><rect x="5" y="5" width="32" height="10" rx="2" fill="#7C3AED"/><text x="21" y="12" text-anchor="middle" fill="white" font-size="5" font-weight="bold">users</text><text x="8" y="22" fill="#1E1B4B" font-size="3.5">PK id</text><text x="8" y="27" fill="#1E1B4B" font-size="3.5">username</text><text x="8" y="32" fill="#1E1B4B" font-size="3.5">password</text><rect x="44" y="5" width="32" height="50" rx="2" fill="#EDE9FE" stroke="#5B21B6" stroke-width="0.8"/><rect x="44" y="5" width="32" height="10" rx="2" fill="#5B21B6"/><text x="60" y="12" text-anchor="middle" fill="white" font-size="5" font-weight="bold">roles</text><text x="47" y="22" fill="#1E1B4B" font-size="3.5">PK id</text><text x="47" y="27" fill="#1E1B4B" font-size="3.5">role_name</text><rect x="83" y="5" width="32" height="50" rx="2" fill="#EDE9FE" stroke="#A78BFA" stroke-width="0.8"/><rect x="83" y="5" width="32" height="10" rx="2" fill="#A78BFA"/><text x="99" y="12" text-anchor="middle" fill="white" font-size="5" font-weight="bold">perms</text><text x="86" y="22" fill="#1E1B4B" font-size="3.5">PK id</text><text x="86" y="27" fill="#1E1B4B" font-size="3.5">perm_key</text></svg>',
          systemPromptAppend: 'RBAC 权限 Schema：users(id, username, password_hash, email, phone, status, created_at)、roles(id, role_name, role_key, description)、permissions(id, perm_name, perm_key, resource, action)、user_roles(user_id FK, role_id FK)、role_permissions(role_id FK, perm_id FK)。',
          exampleUserInput: '请绘制一个 RBAC 权限模型的数据库表结构图',
        },
        {
          id: 'order-system-schema',
          name: '订单系统表结构',
          subTypeId: 'database-schema',
          description: '电商订单系统的数据库表结构，包含订单、订单项、支付等表',
          industryTags: ['订单', '电商', '数据库'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#FFFBEB" stroke="#D97706" stroke-width="1"/><rect x="5" y="5" width="32" height="50" rx="2" fill="#FEF3C7" stroke="#D97706" stroke-width="0.8"/><rect x="5" y="5" width="32" height="10" rx="2" fill="#D97706"/><text x="21" y="12" text-anchor="middle" fill="white" font-size="5" font-weight="bold">orders</text><text x="8" y="22" fill="#7C2D12" font-size="3.5">PK id</text><text x="8" y="27" fill="#7C2D12" font-size="3.5">FK user_id</text><text x="8" y="32" fill="#7C2D12" font-size="3.5">total_amount</text><rect x="44" y="5" width="32" height="50" rx="2" fill="#FEF3C7" stroke="#EA580C" stroke-width="0.8"/><rect x="44" y="5" width="32" height="10" rx="2" fill="#EA580C"/><text x="60" y="12" text-anchor="middle" fill="white" font-size="5" font-weight="bold">order_items</text><text x="47" y="22" fill="#7C2D12" font-size="3.5">PK id</text><text x="47" y="27" fill="#7C2D12" font-size="3.5">FK order_id</text><text x="47" y="32" fill="#7C2D12" font-size="3.5">FK product_id</text><rect x="83" y="5" width="32" height="50" rx="2" fill="#FEF3C7" stroke="#B91C1C" stroke-width="0.8"/><rect x="83" y="5" width="32" height="10" rx="2" fill="#B91C1C"/><text x="99" y="12" text-anchor="middle" fill="white" font-size="5" font-weight="bold">payments</text><text x="86" y="22" fill="#7C2D12" font-size="3.5">PK id</text><text x="86" y="27" fill="#7C2D12" font-size="3.5">FK order_id</text><text x="86" y="32" fill="#7C2D12" font-size="3.5">pay_method</text></svg>',
          systemPromptAppend: '订单系统 Schema：orders(id, user_id FK, order_no, status, total_amount, created_at)、order_items(id, order_id FK, product_id FK, quantity, unit_price, subtotal)、payments(id, order_id FK, pay_method, pay_status, paid_at, transaction_id)、products(id, name, price, stock, category_id FK)。',
          exampleUserInput: '请绘制一个电商订单系统的数据库表结构图',
        },
      ],
    },

    // ===== 微服务架构 =====
    {
      id: 'microservice',
      name: '微服务架构',
      description: '微服务系统架构，服务拆分与通信拓扑',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注服务拆分与通信。服务用圆角矩形表示，API 网关用菱形或六边形表示，消息队列用圆柱表示，数据库用圆柱表示。同步调用用实线箭头，异步消息用虚线箭头。标注服务间通信协议（HTTP/gRPC/AMQP）。',
      expertFlowOverride: {
        steps: [
          {
            index: 1,
            title: '分析需求',
            description: '理解微服务架构，确定服务拆分、通信方式和基础设施',
          },
          {
            index: 2,
            title: '布局规划',
            description: '规划服务布局，网关在上层，业务服务在中层，基础设施在下层',
          },
          {
            index: 3,
            title: '绘制外层边界',
            description: '绘制系统边界、VPC 网络区域等外层容器',
          },
          {
            index: 4,
            title: '绘制内部组件',
            description: '绘制网关、业务服务、消息队列、数据库、注册中心等组件',
          },
          {
            index: 5,
            title: '绘制连接线',
            description: '绘制服务间调用线、消息流线，标注协议和数据流',
          },
          {
            index: 6,
            title: '标注技术栈',
            description: '标注各服务使用的技术栈、框架和通信协议',
          },
          {
            index: 7,
            title: '样式美化',
            description: '应用配色方案，确保视觉层次清晰，区分同步/异步通信',
          },
          {
            index: 8,
            title: '自检验证',
            description: '检查对齐、无溢出、无重叠、嵌套层级正确、文字清晰、边界包含关系正确',
          },
        ],
        checkItems: [
          {
            id: 'alignment',
            label: '对齐检查',
            description: '服务是否对齐整齐，同层服务是否在同一水平线',
          },
          {
            id: 'overflow',
            label: '溢出检查',
            description: '任何元素或文字是否超出 SVG 画布边界',
          },
          {
            id: 'overlap',
            label: '重叠检查',
            description: '服务之间是否存在非预期的重叠遮挡',
          },
          {
            id: 'nesting-level',
            label: '嵌套层级检查',
            description: '服务是否正确归属在对应的网络区域或命名空间内',
          },
          {
            id: 'text',
            label: '文字检查',
            description: '服务名称、技术栈标注是否清晰可读',
          },
          {
            id: 'boundary-containment',
            label: '边界包含检查',
            description: '系统边界是否正确包含内部服务，外部依赖是否在边界外',
          },
        ],
      },
      templates: [
        {
          id: 'ecommerce-microservice',
          name: '电商微服务架构',
          subTypeId: 'microservice',
          description: '电商系统的微服务架构，包含用户、商品、订单等核心服务',
          industryTags: ['电商', '微服务', '架构'],
          previewSvg: '<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="80" rx="4" fill="#0F172A" stroke="#6366F1" stroke-width="1"/><polygon points="82,8 118,8 124,18 118,28 82,28 76,18" fill="#4F46E5" stroke="#818CF8" stroke-width="0.8"/><text x="100" y="21" text-anchor="middle" fill="white" font-size="7" font-weight="bold">API GW</text><rect x="8" y="44" width="40" height="18" rx="3" fill="#1E1B4B" stroke="#6366F1" stroke-width="0.8"/><text x="28" y="55" text-anchor="middle" fill="#C7D2FE" font-size="5.5" font-weight="bold">用户服务</text><rect x="56" y="44" width="40" height="18" rx="3" fill="#1E1B4B" stroke="#6366F1" stroke-width="0.8"/><text x="76" y="55" text-anchor="middle" fill="#C7D2FE" font-size="5.5" font-weight="bold">商品服务</text><rect x="104" y="44" width="40" height="18" rx="3" fill="#1E1B4B" stroke="#6366F1" stroke-width="0.8"/><text x="124" y="55" text-anchor="middle" fill="#C7D2FE" font-size="5.5" font-weight="bold">订单服务</text><rect x="152" y="44" width="40" height="18" rx="3" fill="#312E81" stroke="#818CF8" stroke-width="0.8"/><text x="172" y="52" text-anchor="middle" fill="#E2E8F0" font-size="5" font-weight="bold">MQ</text><text x="172" y="58" text-anchor="middle" fill="#A5B4FC" font-size="3.5">消息队列</text><line x1="100" y1="28" x2="100" y2="36" stroke="#818CF8" stroke-width="0.9"/><line x1="28" y1="36" x2="172" y2="36" stroke="#818CF8" stroke-width="0.9"/><line x1="28" y1="36" x2="28" y2="44" stroke="#818CF8" stroke-width="0.9" marker-end="url(#m)"/><line x1="76" y1="36" x2="76" y2="44" stroke="#818CF8" stroke-width="0.9" marker-end="url(#m)"/><line x1="124" y1="36" x2="124" y2="44" stroke="#818CF8" stroke-width="0.9" marker-end="url(#m)"/><line x1="172" y1="36" x2="172" y2="44" stroke="#818CF8" stroke-width="0.7" stroke-dasharray="2.5,1.5" marker-end="url(#m)"/><circle cx="28" cy="36" r="1.5" fill="#818CF8"/><circle cx="76" cy="36" r="1.5" fill="#818CF8"/><circle cx="124" cy="36" r="1.5" fill="#818CF8"/><circle cx="172" cy="36" r="1.5" fill="#818CF8"/><defs><marker id="m" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="3.5" markerHeight="3.5" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#818CF8"/></marker></defs></svg>',
          systemPromptAppend: '电商微服务架构：API 网关(Kong/Nginx)、用户服务(Java)、商品服务(Java)、订单服务(Java)、支付服务(Go)、库存服务(Go)、消息队列(RabbitMQ)、服务注册(Nacos)、配置中心(Apollo)、各服务独立数据库。',
          exampleUserInput: '请绘制一个电商系统的微服务架构图',
        },
        {
          id: 'log-collection-microservice',
          name: '日志采集架构',
          subTypeId: 'microservice',
          description: '日志采集与处理微服务架构，包含采集、清洗、存储、展示',
          industryTags: ['日志', '监控', '运维'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#0F172A" stroke="#6366F1" stroke-width="1"/><rect x="5" y="22" width="22" height="16" rx="3" fill="#6366F1"/><text x="16" y="32" text-anchor="middle" fill="white" font-size="4">Filebeat</text><rect x="32" y="22" width="22" height="16" rx="3" fill="#4338CA"/><text x="43" y="32" text-anchor="middle" fill="#E2E8F0" font-size="4">Kafka</text><rect x="59" y="22" width="22" height="16" rx="3" fill="#818CF8"/><text x="70" y="32" text-anchor="middle" fill="#1E1B4B" font-size="4">Logstash</text><rect x="86" y="22" width="28" height="16" rx="3" fill="#A78BFA"/><text x="100" y="32" text-anchor="middle" fill="#1E1B4B" font-size="4">Elasticsearch</text><line x1="27" y1="30" x2="32" y2="30" stroke="#818CF8" stroke-width="0.8"/><line x1="54" y1="30" x2="59" y2="30" stroke="#818CF8" stroke-width="0.8"/><line x1="81" y1="30" x2="86" y2="30" stroke="#818CF8" stroke-width="0.8"/></svg>',
          systemPromptAppend: '日志采集架构：Filebeat(日志采集)、Kafka(消息缓冲)、Logstash(日志清洗/转换)、Elasticsearch(日志存储/索引)、Kibana(可视化展示)、Alertmanager(告警通知)、Prometheus(指标采集)。',
          exampleUserInput: '请绘制一个日志采集与处理的微服务架构图',
        },
      ],
    },

    // ===== Git Flow =====
    {
      id: 'git-flow',
      name: 'Git Flow',
      description: 'Git 分支策略与版本发布流程',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注分支策略与合并流程。分支用不同颜色的线条表示，提交用小圆点表示，合并用交叉线表示，标签用旗帜/标签图标表示。主线(main/master)用粗实线，开发分支用较细线，特性分支用虚线。标注分支名称、版本号和合并方向。',
      templates: [
        {
          id: 'git-flow-branch',
          name: 'Git Flow分支',
          subTypeId: 'git-flow',
          description: '标准 Git Flow 分支模型，包含 main/develop/feature/release/hotfix 分支',
          industryTags: ['Git', '版本控制', '开发流程'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#0F172A" stroke="#6366F1" stroke-width="1"/><line x1="5" y1="15" x2="115" y2="15" stroke="#DC2626" stroke-width="2"/><text x="2" y="13" fill="#DC2626" font-size="4">main</text><line x1="15" y1="30" x2="115" y2="30" stroke="#059669" stroke-width="2"/><text x="2" y="28" fill="#059669" font-size="4">develop</text><line x1="30" y1="30" x2="50" y2="45" stroke="#6366F1" stroke-width="1.5"/><line x1="50" y1="45" x2="70" y2="45" stroke="#6366F1" stroke-width="1.5"/><text x="30" y="55" fill="#6366F1" font-size="4">feature</text><circle cx="15" cy="15" r="2" fill="#DC2626"/><circle cx="30" cy="30" r="2" fill="#059669"/><circle cx="50" cy="45" r="2" fill="#6366F1"/><circle cx="70" cy="30" r="2" fill="#059669"/><circle cx="90" cy="15" r="2" fill="#DC2626"/></svg>',
          systemPromptAppend: 'Git Flow 分支模型：main(生产分支，红色粗线)、develop(开发分支，绿色线)、feature/*(特性分支，蓝色线，从 develop 分出)、release/*(发布分支，橙色线，从 develop 分出合并到 main 和 develop)、hotfix/*(热修复分支，红色线，从 main 分出合并回 main 和 develop)。',
          exampleUserInput: '请绘制标准 Git Flow 分支模型图',
        },
        {
          id: 'github-flow',
          name: 'GitHub Flow',
          subTypeId: 'git-flow',
          description: 'GitHub Flow 简化分支模型，基于 PR 的轻量级流程',
          industryTags: ['Git', 'GitHub', '敏捷'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#0F172A" stroke="#6366F1" stroke-width="1"/><line x1="5" y1="22" x2="115" y2="22" stroke="#059669" stroke-width="2.5"/><text x="2" y="20" fill="#059669" font-size="4">main</text><line x1="30" y1="22" x2="45" y2="40" stroke="#6366F1" stroke-width="1.5"/><line x1="45" y1="40" x2="75" y2="40" stroke="#6366F1" stroke-width="1.5"/><line x1="75" y1="40" x2="90" y2="22" stroke="#6366F1" stroke-width="1.5"/><text x="45" y="52" fill="#6366F1" font-size="4">feature/PR</text><circle cx="15" cy="22" r="2.5" fill="#059669"/><circle cx="45" cy="40" r="2" fill="#6366F1"/><circle cx="75" cy="40" r="2" fill="#6366F1"/><circle cx="90" cy="22" r="2.5" fill="#059669"/><rect x="78" y="36" width="14" height="8" rx="1" fill="#818CF8"/><text x="85" y="42" text-anchor="middle" fill="#1E1B4B" font-size="3.5">PR</text></svg>',
          systemPromptAppend: 'GitHub Flow 分支模型：main(主分支，始终可部署)、feature 分支(从 main 分出，开发完成后通过 PR 合并回 main)、PR 审核通过后合并并自动部署。简单高效，适合持续部署。',
          exampleUserInput: '请绘制 GitHub Flow 分支模型图',
        },
      ],
    },

    // ===== 威胁模型 =====
    {
      id: 'threat-model',
      name: '威胁模型',
      description: '系统安全威胁建模，STRIDE 分析与威胁评估',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注安全威胁识别。资产用矩形表示，威胁用闪电/火焰图标标注，信任边界用虚线框表示，数据流用箭头表示。使用 STRIDE 模型分类威胁：Spoofing(欺骗)、Tampering(篡改)、Repudiation(抵赖)、Information Disclosure(信息泄露)、Denial of Service(拒绝服务)、Elevation of Privilege(权限提升)。标注威胁等级和缓解措施。',
      templates: [
        {
          id: 'web-app-threat-model',
          name: 'Web应用威胁模型',
          subTypeId: 'threat-model',
          description: 'Web 应用的安全威胁模型，基于 STRIDE 分析常见威胁',
          industryTags: ['安全', 'Web', '威胁建模'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="#0F172A" stroke="#DC2626" stroke-width="1"/><rect x="5" y="8" width="35" height="18" rx="2" fill="none" stroke="#FCA5A5" stroke-width="1" stroke-dasharray="3,2"/><text x="22" y="14" text-anchor="middle" fill="#FCA5A5" font-size="3.5">互联网</text><rect x="10" y="16" width="25" height="8" rx="1" fill="#4338CA"/><text x="22" y="22" text-anchor="middle" fill="#E2E8F0" font-size="3.5">浏览器</text><rect x="50" y="8" width="35" height="18" rx="2" fill="none" stroke="#6366F1" stroke-width="1" stroke-dasharray="3,2"/><text x="67" y="14" text-anchor="middle" fill="#6366F1" font-size="3.5">DMZ</text><rect x="55" y="16" width="25" height="8" rx="1" fill="#6366F1"/><text x="67" y="22" text-anchor="middle" fill="white" font-size="3.5">Web Server</text><rect x="5" y="35" width="110" height="20" rx="2" fill="none" stroke="#059669" stroke-width="1" stroke-dasharray="3,2"/><text x="60" y="41" text-anchor="middle" fill="#059669" font-size="3.5">内网信任边界</text><rect x="15" y="44" width="25" height="8" rx="1" fill="#059669"/><text x="27" y="50" text-anchor="middle" fill="white" font-size="3.5">App Srv</text><rect x="75" y="44" width="25" height="8" rx="1" fill="#D97706"/><text x="87" y="50" text-anchor="middle" fill="white" font-size="3.5">Database</text><polygon points="42,5 44,2 46,5 44,4.5" fill="#DC2626"/></svg>',
          systemPromptAppend: 'Web 应用威胁模型 STRIDE 分析：S-身份欺骗(Cookie劫持/CSRF)、T-数据篡改(SQL注入/XSS)、R-抵赖(操作日志缺失)、I-信息泄露(敏感数据暴露/不安全传输)、D-拒绝服务(慢速攻击/资源耗尽)、E-权限提升(越权访问/注入攻击)。每个威胁标注风险等级和缓解措施。',
          exampleUserInput: '请绘制一个 Web 应用的安全威胁模型图',
        },
      ],
    },

    // ===== 产品原型 =====
    {
      id: 'prototype',
      name: '产品原型',
      description: '产品线框图与交互原型，UI/UX 设计',
      categoryId: 'it-architecture',
      systemPromptAppend: '重点关注页面布局与交互设计。页面框架用矩形表示，导航栏/侧边栏/内容区用分区矩形表示，组件用线框样式表示（按钮、输入框、列表、卡片等）。交互用虚线箭头标注点击跳转关系。使用灰色系线框风格，不使用彩色填充，保持简洁的低保真原型风格。',
      expertFlowOverride: {
        steps: [
          {
            index: 1,
            title: '分析需求',
            description: '理解产品功能需求，确定页面结构、核心组件和交互流程',
          },
          {
            index: 2,
            title: '布局规划',
            description: '规划页面整体布局框架，确定导航、内容区、侧边栏等区域',
          },
          {
            index: 3,
            title: '绘制框架',
            description: '绘制页面整体框架，包括导航栏、侧边栏、内容区等区域划分',
          },
          {
            index: 4,
            title: '绘制组件',
            description: '在内容区内绘制具体的 UI 组件，如按钮、输入框、列表、卡片等',
          },
          {
            index: 5,
            title: '标注交互',
            description: '标注组件间的交互关系、点击跳转、数据流向等',
          },
          {
            index: 6,
            title: '样式美化',
            description: '调整线框粗细、间距、对齐，确保原型图整洁专业',
          },
          {
            index: 7,
            title: '自检验证',
            description: '检查对齐、无溢出、无重叠、文字清晰、组件间距合理',
          },
        ],
        checkItems: [
          {
            id: 'alignment',
            label: '对齐检查',
            description: '组件是否对齐整齐，间距是否均匀一致',
          },
          {
            id: 'overflow',
            label: '溢出检查',
            description: '任何组件或文字是否超出画布边界',
          },
          {
            id: 'overlap',
            label: '重叠检查',
            description: '组件之间是否存在非预期的重叠遮挡',
          },
          {
            id: 'text',
            label: '文字检查',
            description: '文字标注是否清晰可读，字号是否合适',
          },
          {
            id: 'component-spacing',
            label: '组件间距检查',
            description: '组件之间的间距是否合理，是否留有足够的操作空间',
          },
        ],
      },
      templates: [
        {
          id: 'ecommerce-homepage-prototype',
          name: '电商首页原型',
          subTypeId: 'prototype',
          description: '电商首页线框图，包含导航、轮播、商品列表等区域',
          industryTags: ['电商', '首页', 'UI'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="white" stroke="#9CA3AF" stroke-width="1"/><rect x="5" y="5" width="110" height="8" rx="1" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="0.5"/><text x="60" y="11" text-anchor="middle" fill="#6B7280" font-size="4">导航栏</text><rect x="5" y="16" width="110" height="14" rx="1" fill="#F9FAFB" stroke="#9CA3AF" stroke-width="0.5"/><text x="60" y="25" text-anchor="middle" fill="#9CA3AF" font-size="4">轮播图</text><rect x="5" y="33" width="25" height="12" rx="1" fill="none" stroke="#9CA3AF" stroke-width="0.5"/><text x="17" y="40" text-anchor="middle" fill="#6B7280" font-size="3.5">商品1</text><rect x="33" y="33" width="25" height="12" rx="1" fill="none" stroke="#9CA3AF" stroke-width="0.5"/><text x="45" y="40" text-anchor="middle" fill="#6B7280" font-size="3.5">商品2</text><rect x="61" y="33" width="25" height="12" rx="1" fill="none" stroke="#9CA3AF" stroke-width="0.5"/><text x="73" y="40" text-anchor="middle" fill="#6B7280" font-size="3.5">商品3</text><rect x="89" y="33" width="25" height="12" rx="1" fill="none" stroke="#9CA3AF" stroke-width="0.5"/><text x="101" y="40" text-anchor="middle" fill="#6B7280" font-size="3.5">商品4</text><rect x="5" y="48" width="110" height="8" rx="1" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="0.5"/><text x="60" y="54" text-anchor="middle" fill="#6B7280" font-size="4">底部导航</text></svg>',
          systemPromptAppend: '电商首页原型包含区域：顶部导航栏（Logo、搜索框、购物车图标）、轮播图区域、分类导航区、商品推荐列表（网格布局，每行4个商品卡片）、底部导航栏（首页、分类、购物车、我的）。商品卡片包含图片占位、名称、价格。',
          exampleUserInput: '请绘制一个电商首页的线框原型图',
        },
        {
          id: 'admin-panel-prototype',
          name: '后台管理原型',
          subTypeId: 'prototype',
          description: '后台管理系统线框图，包含侧边栏、数据表格、表单等',
          industryTags: ['后台', '管理', '企业'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="white" stroke="#9CA3AF" stroke-width="1"/><rect x="5" y="5" width="20" height="50" rx="1" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="0.5"/><text x="15" y="15" text-anchor="middle" fill="#6B7280" font-size="3">菜单1</text><text x="15" y="22" text-anchor="middle" fill="#6B7280" font-size="3">菜单2</text><text x="15" y="29" text-anchor="middle" fill="#6B7280" font-size="3">菜单3</text><rect x="28" y="5" width="87" height="8" rx="1" fill="#F9FAFB" stroke="#9CA3AF" stroke-width="0.5"/><text x="72" y="11" text-anchor="middle" fill="#6B7280" font-size="4">顶部工具栏</text><rect x="28" y="16" width="87" height="8" rx="1" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="0.5"/><text x="72" y="22" text-anchor="middle" fill="#6B7280" font-size="3.5">搜索 | 筛选 | 操作按钮</text><rect x="28" y="27" width="87" height="28" rx="1" fill="none" stroke="#9CA3AF" stroke-width="0.5"/><line x1="28" y1="34" x2="115" y2="34" stroke="#D1D5DB" stroke-width="0.5"/><line x1="28" y1="41" x2="115" y2="41" stroke="#D1D5DB" stroke-width="0.5"/><line x1="28" y1="48" x2="115" y2="48" stroke="#D1D5DB" stroke-width="0.5"/><text x="72" y="32" text-anchor="middle" fill="#6B7280" font-size="3">数据行1</text><text x="72" y="39" text-anchor="middle" fill="#6B7280" font-size="3">数据行2</text><text x="72" y="46" text-anchor="middle" fill="#6B7280" font-size="3">数据行3</text></svg>',
          systemPromptAppend: '后台管理原型包含区域：左侧边栏（Logo、导航菜单、用户头像）、顶部工具栏（面包屑、搜索、通知、用户信息）、内容区（搜索筛选栏、操作按钮、数据表格、分页）。表格包含列：ID、名称、状态、创建时间、操作。',
          exampleUserInput: '请绘制一个后台管理系统的线框原型图',
        },
        {
          id: 'mobile-app-prototype',
          name: '移动端APP原型',
          subTypeId: 'prototype',
          description: '移动端 APP 线框图，包含底部导航、列表、详情等页面',
          industryTags: ['移动端', 'APP', 'UI'],
          previewSvg: '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="60" rx="4" fill="white" stroke="#9CA3AF" stroke-width="1"/><rect x="15" y="3" width="36" height="54" rx="4" fill="none" stroke="#6B7280" stroke-width="1"/><rect x="17" y="6" width="32" height="6" rx="1" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="0.5"/><text x="33" y="10" text-anchor="middle" fill="#6B7280" font-size="3">状态栏</text><rect x="17" y="14" width="32" height="6" rx="1" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="0.5"/><text x="33" y="18" text-anchor="middle" fill="#6B7280" font-size="3">标题栏</text><rect x="17" y="22" width="32" height="24" rx="1" fill="none" stroke="#D1D5DB" stroke-width="0.5"/><line x1="17" y1="30" x2="49" y2="30" stroke="#D1D5DB" stroke-width="0.3"/><line x1="17" y1="38" x2="49" y2="38" stroke="#D1D5DB" stroke-width="0.3"/><text x="33" y="28" text-anchor="middle" fill="#9CA3AF" font-size="3">列表项1</text><text x="33" y="36" text-anchor="middle" fill="#9CA3AF" font-size="3">列表项2</text><rect x="17" y="48" width="32" height="7" rx="1" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="0.5"/><text x="33" y="53" text-anchor="middle" fill="#6B7280" font-size="3">底部Tab</text><rect x="70" y="3" width="36" height="54" rx="4" fill="none" stroke="#6B7280" stroke-width="1"/><rect x="72" y="6" width="32" height="6" rx="1" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="0.5"/><rect x="72" y="14" width="32" height="30" rx="1" fill="#F9FAFB" stroke="#9CA3AF" stroke-width="0.5"/><text x="88" y="30" text-anchor="middle" fill="#9CA3AF" font-size="3">详情内容</text><rect x="72" y="48" width="32" height="7" rx="1" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="0.5"/><line x1="51" y1="30" x2="70" y2="30" stroke="#9CA3AF" stroke-width="0.5" stroke-dasharray="2,2"/><polygon points="68,28 72,30 68,32" fill="#9CA3AF"/></svg>',
          systemPromptAppend: '移动端 APP 原型包含页面：首页（搜索栏、轮播、功能入口、推荐列表）、列表页（筛选栏、列表项、加载更多）、详情页（头图、标题、描述、操作按钮）、个人中心（头像、菜单列表、设置入口）。底部导航：首页、发现、消息、我的。',
          exampleUserInput: '请绘制一个移动端 APP 的线框原型图',
        },
      ],
    },
  ],
};
