# 贷款AI知识库系统 - 技术方案

**版本**：v1.0
**日期**：2026-07-14
**状态**：草稿

---

## 1. 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端 | Next.js 14 (App Router) | SSR + API Routes |
| 样式 | Tailwind CSS | 快速UI开发 |
| 数据库 | PostgreSQL (Supabase) | 关系数据，支持向量 |
| 文件存储 | 阿里云OSS | 文档存储 |
| AI能力 | MiniMax API | 对话+解析+分析 |
| 爬虫 | Puppeteer + Cheerio | 银行产品+潜客爬取 |
| 定时任务 | Supabase Cron | 爬虫调度 |
| 部署 | Vercel | 前端+API |

---

## 2. 项目结构

```
loan-ai-knowledge-base/
├── app/
│   ├── page.js                    # 首页/工作台
│   ├── layout.js                  # 布局
│   ├── globals.css               # 全局样式
│   │
│   ├── customers/                # 客户管理
│   │   ├── page.js               # 客户列表
│   │   ├── [id]/page.js          # 客户详情
│   │   └── new/page.js           # 新建客户
│   │
│   ├── products/                 # 产品知识库
│   │   ├── page.js               # 产品列表/搜索
│   │   └── [id]/page.js          # 产品详情
│   │
│   ├── potential-customers/       # 潜客管理
│   │   ├── page.js               # 潜客列表
│   │   └── [id]/page.js          # 潜客详情
│   │
│   ├── chat/                     # 对话窗口
│   │   └── page.js               # AI对话
│   │
│   ├── knowledge/                # 知识库管理（后台）
│   │   └── page.js               # 知识库配置
│   │
│   └── api/
│       ├── customers/
│       │   ├── route.js          # GET列表 / POST新建
│       │   └── [id]/
│       │       └── route.js      # GET详情 / PUT更新 / DELETE删除
│       │
│       ├── customers/[id]/documents/
│       │   └── route.js          # POST 上传文档
│       │
│       ├── analyze/
│       │   └── route.js          # POST 综合分析
│       │
│       ├── products/
│       │   ├── route.js          # GET 产品列表
│       │   └── scrape/
│       │       └── route.js      # POST 触发爬虫
│       │
│       ├── potential-customers/
│       │   ├── route.js          # GET 潜客列表
│       │   └── scrape/
│       │       └── route.js      # POST 触发潜客爬虫
│       │
│       ├── chat/
│       │   └── route.js          # POST 对话
│       │
│       └── upload/
│           └── route.js          # POST 文件上传签名URL
│
├── lib/
│   ├── db.js                     # Supabase客户端
│   ├── minimax.js                # MiniMax API封装
│   ├── rag.js                    # RAG检索（产品匹配）
│   ├── parser.js                 # 文档解析
│   └── scraper/
│       ├── bank.js               # 银行产品爬虫
│       └── potential.js          # 潜客爬虫
│
├── components/
│   ├── ui/                       # 通用UI组件
│   ├── customer/                 # 客户相关组件
│   ├── product/                  # 产品相关组件
│   ├── chat/                     # 对话组件
│   └── layout/                  # 布局组件
│
├── public/
│   └── uploads/                  # 临时上传文件
│
└── docs/
    ├── PRD-v1.0.md               # 产品需求文档
    └── TECH-SPEC-v1.0.md         # 本文档
```

---

## 3. 数据库设计

### 3.1 表结构

#### customers（客户档案）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR(255) | 企业名称 |
| credit_code | VARCHAR(18) | 统一社会信用代码 |
| industry | VARCHAR(100) | 行业 |
| established_year | INT | 成立年份 |
| employee_count | INT | 员工规模 |
| annual_revenue | DECIMAL(15,2) | 年营业额 |
| tax_amount | DECIMAL(15,2) | 纳税额 |
| has_collateral | BOOLEAN | 是否有抵押物 |
| collateral_type | TEXT[] | 抵押物类型 |
| risk_rating | VARCHAR(10) | 风控评级 A/B/C/D |
| status | VARCHAR(20) | 状态 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### customer_documents（客户证件）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| customer_id | UUID | 关联客户 |
| type | VARCHAR(50) | 文档类型 |
| file_url | TEXT | OSS存储地址 |
| extracted_data | JSONB | AI解析结果 |
| created_at | TIMESTAMP | 上传时间 |

#### products（贷款产品）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| bank | VARCHAR(100) | 银行名称 |
| product_name | VARCHAR(255) | 产品名称 |
| loan_type | VARCHAR(50) | 贷款类型 |
| min_amount | DECIMAL(15,2) | 最低额度 |
| max_amount | DECIMAL(15,2) | 最高额度 |
| min_rate | DECIMAL(5,2) | 最低利率(%) |
| max_rate | DECIMAL(5,2) | 最高利率(%) |
| min_term | INT | 最短期限(月) |
| max_term | INT | 最长期限(月) |
| target | TEXT | 目标客群 |
| collateral | VARCHAR(50) | 担保方式 |
| requirements | TEXT[] | 准入条件 |
| description | TEXT | 产品描述 |
| source_url | TEXT | 来源URL |
| confidence | DECIMAL(3,2) | 置信度 |
| status | VARCHAR(20) | 状态 |
| last_updated | TIMESTAMP | 最后更新 |
| created_at | TIMESTAMP | 创建时间 |

#### potential_customers（潜客线索）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR(255) | 企业名称 |
| industry | VARCHAR(100) | 行业 |
| region | VARCHAR(100) | 地区 |
| source | VARCHAR(50) | 来源 |
| source_url | TEXT | 来源URL |
| contact | TEXT | 联系方式 |
| recommended_products | TEXT[] | 推荐产品ID |
| status | VARCHAR(20) | 跟进状态 |
| follow_up_date | DATE | 计划跟进日期 |
| follow_up_notes | TEXT | 跟进记录 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### conversations（对话历史）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| session_id | VARCHAR(100) | 会话ID |
| role | VARCHAR(10) | user/assistant |
| content | TEXT | 对话内容 |
| context | JSONB | 上下文数据 |
| created_at | TIMESTAMP | 创建时间 |

### 3.2 RLS策略（行级安全）

所有表开启RLS，业务人员只能操作自己创建的数据（暂不区分账号，所有人共用）。

---

## 4. API设计

### 4.1 客户管理

#### 创建客户
```
POST /api/customers
Body: { name, credit_code, industry, ... }
Response: { id, ...customer }
```

#### 获取客户列表
```
GET /api/customers?page=1&limit=20&industry=&status=
Response: { data: [...customers], total, page, limit }
```

#### 获取客户详情
```
GET /api/customers/:id
Response: { ...customer, documents: [...] }
```

#### 更新客户
```
PUT /api/customers/:id
Body: { ...updates }
Response: { ...customer }
```

#### 删除客户
```
DELETE /api/customers/:id
Response: { success: true }
```

### 4.2 文档上传

#### 上传文档
```
POST /api/customers/:id/documents
Body: FormData { file, type }
Response: { id, file_url, extracted_data }
```
流程：
1. 接收文件 → 存OSS
2. 调用MiniMax解析 → 提取关键字段
3. 返回解析结果

### 4.3 综合分析

#### 执行分析
```
POST /api/analyze
Body: { customer_id }
Response: {
  match_results: [...],      # 产品匹配结果
  risk_assessment: {        # 风控评估
    rating: "B",
    dimensions: {...},
    conclusion: "...",
    advice: "..."
  }
}
```

### 4.4 产品管理

#### 获取产品列表
```
GET /api/products?bank=&type=&keyword=&page=1&limit=20
Response: { data: [...products], total, page, limit }
```

#### 触发产品爬虫
```
POST /api/products/scrape
Body: { bank_urls: [...] }
Response: { job_id, status }
```

### 4.5 潜客管理

#### 获取潜客列表
```
GET /api/potential-customers?source=&status=&page=1&limit=20
Response: { data: [...], total, page, limit }
```

#### 触发潜客爬虫
```
POST /api/potential-customers/scrape
Body: { sources: [...] }
Response: { job_id, status }
```

### 4.6 对话

#### 发送消息
```
POST /api/chat
Body: { session_id, message, context }
Response: { reply, context }
```

### 4.7 文件上传

#### 获取上传签名
```
POST /api/upload
Body: { filename, content_type }
Response: { upload_url, file_key }
```

---

## 5. MiniMax API集成

### 5.1 对话（Chat）

模型：`MiniMax-M2.7` / `abab6.5s-chat`

用途：对话窗口、RAG问答

### 5.2 文档解析（Document Parsing）

模型：`MiniMax-M2.7` with vision

用途：营业执照、财务报表、银行流水、房产证解析

### 5.3 产品匹配（Matching）

模型：`MiniMax-M2.7`

用途：根据企业画像匹配产品、生成推荐理由

### 5.4 风控分析（Risk Assessment）

模型：`MiniMax-M2.7`

用途：分析企业经营情况、输出风控评分和建议

---

## 6. RAG产品匹配方案

### 6.1 当前方案（简化版 - MVP用）

不使用向量检索，直接用关键词匹配：

```
1. 企业画像 → 构建查询字符串
2. 在产品库按关键词搜索（银行名、产品名、类型、准入条件）
3. 按匹配度打分排序
4. 取TOP 5返回
```

优点：简单、响应快、无需Embedding API
缺点：精度有限

### 6.2 后续升级方案

```
1. 产品信息 → 向量Embedding → 存入Supabase向量库
2. 企业画像 → 向量Embedding
3. 余弦相似度检索 → 取TOP产品
4. 结合规则过滤（硬性条件）
```

---

## 7. 爬虫方案

### 7.1 银行产品爬虫

**技术栈**：Puppeteer（JS渲染） + Cheerio（HTML解析）

**爬取流程**：
1. 读取配置（银行列表 + URL规则）
2. Puppeteer打开页面，等待JS渲染
3. Cheerio解析DOM，提取产品字段
4. 数据清洗 + 格式标准化
5. 写入/更新产品库

**配置格式**：
```json
{
  "banks": [
    {
      "name": "工商银行",
      "base_url": "https://www.icbc.com.cn",
      "product_list_url": "https://www.icbc.com.cn/icbc/.../loan",
      "parse_rules": {
        "product_name": ".product-title",
        "amount": ".amount",
        "rate": ".rate",
        ...
      }
    }
  ]
}
```

**定时策略**：
- 每天凌晨2:00自动执行
- 或手动触发

**异常处理**：
- 访问被封 → 降级为手动维护
- 页面结构变化 → 邮件告警 + 人工修复规则

### 7.2 潜客爬虫

**来源1：品牌经销商**
```
1. 配置品牌 + 经销商列表页URL
2. Puppeteer爬取经销商名单
3. 提取：企业名称、地区、联系方式
4. 关联推荐产品
```

**来源2：企查查/天眼查**
```
1. 搜索API（有反爬限制）
2. 备选：买数据接口
```

**来源3：公开招标信息**
```
1. 爬取招标网站、中标结果
2. 提取：企业名称、项目、金额
3. 关联贷款需求
```

---

## 8. 文件存储

### 8.1 OSS配置（阿里云）

| 配置项 | 值 |
|--------|-----|
| Bucket | loan-ai-docs |
| Region | cn-shanghai |
| 路径规则 | `customers/{customer_id}/{doc_type}/{filename}` |

### 8.2 上传流程

```
前端 → POST /api/upload → 获取签名URL → 直传OSS
```

### 8.3 文件访问

上传时生成签名URL，有效期24小时。

---

## 9. MVP开发计划

### 第一阶段：基础框架（1-2天）

| 任务 | 说明 |
|------|------|
| 项目初始化 | Next.js 14 + Tailwind + Supabase |
| 数据库设计 | 创建所有表 |
| 基础组件库 | Button/Input/Card/Table |
| 布局框架 | Sidebar + Header |

### 第二阶段：客户管理（2-3天）

| 任务 | 说明 |
|------|------|
| 客户列表页 | 搜索/筛选/分页 |
| 新建客户页 | 表单录入 |
| 客户详情页 | 信息展示 |
| 文档上传 | OSS直传 + 解析 |

### 第三阶段：产品匹配+风控（2-3天）

| 任务 | 说明 |
|------|------|
| 产品列表页 | 搜索/筛选 |
| 产品详情页 | 信息展示 |
| 分析API | 匹配 + 风控逻辑 |
| 分析结果展示 | 报告卡片 |

### 第四阶段：对话窗口（1-2天）

| 任务 | 说明 |
|------|------|
| 对话UI | 消息列表 + 输入框 |
| 对话API | MiniMax对接 |
| 上下文管理 | 多轮对话 |

### 第五阶段：爬虫（后续迭代）

| 任务 | 说明 |
|------|------|
| 银行产品爬虫 | Puppeteer + 规则配置 |
| 潜客爬虫 | 多源爬取 |
| 定时任务 | Supabase Cron |

---

## 10. 环境变量

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# MiniMax
MINIMAX_API_KEY=
MINIMAX_GROUP_ID=

# 阿里云OSS
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET=
OSS_REGION=
OSS_ENDPOINT=

# App
NEXT_PUBLIC_APP_URL=
```

---

## 11. 部署

### Vercel部署

```
1. GitHub连接仓库
2. 配置环境变量
3. 自动部署
```

### 注意事项

- OSS上传需要服务端签名，前端不能暴露AK
- 爬虫不能放在Vercel（无持久化），需要独立服务器或Supabase Edge Functions
- 建议：MVP阶段先不做爬虫，用手动录入数据

---

**下一步**：
1. 确认技术方案
2. 搭建项目框架
3. 开始MVP开发
