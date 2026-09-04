---
title: Concrete Drilling V0.1 研究证据与过程记录
create_time: 2026-09-04
tags:
  - VisualJobSolver
  - 研究记录
source:
  - 官方网页
  - 官方手册
status: 已结构化
---
# 内部研究证据与过程记录

用户任务：仅研究V0.1 Concrete Drilling选型，不写代码。最终报告：[[Concrete-Drilling-Research-V0.1]]。规范底稿：[[report-source]]。

## 计划与完成状态

本轮无可调用的update_plan工具，已检索工具目录确认；以本记录保留计划。步骤依次完成：
1. 明确范围与资料层级：面向海外用户，先官方手册/型号技术字段，再官方教育页；法规仅核对适用地域。
2. 发现：分工具机制、Hilti/Bosch型号参数、Makita/Milwaukee/DEWALT参数与续航三线查阅。
3. 补证：重点核验Plus/Max重叠、Hammer Drill能力反例、普通电钻模式例外、深孔/清孔及取芯差异。
4. 综合：事实、推论、产品策略和无证据规则分层；主代理复核重要来源。
5. 文档交付与核验：生成Markdown研究报告，检查来源引用、规则编号、文件一致性。

按deep-research技能指令启用两条有多步依赖的独立研究子任务；未开发任何Agent系统。子任务没有写文件或代码。主任务负责证据复核、综合、文档落盘。

## 关键主张—来源账本

置信度指证据对有限主张的支持，不等于获得现场施工许可或产品认证。

| 主张 | 可见证据摘要（非长引文） | 来源 | 性质/置信度 | 限制或矛盾 |
|---|---|---|---|---|
| 工具机制分类 | 机械盘/凸轮轴向冲击；电锤压缩空气冲击；impact driver扭转作用 | S01,S02 | 定性事实/高 | hammer drill词有品类及模式歧义 |
| 普通Drill不默认用于本轮混凝土方案 | CYL-3夹头兼容普通钻；FAQ对混凝土要求impact模式 | S03 | 事实＋保守策略/高 | 不构成所有纯旋转组合禁用证据 |
| Hammer Drill存在20mm混凝土能力型号 | HP2010N Concrete 20mm，230V，2.9kg | S14 | 型号事实/高 | 无最优范围，不能泛化 |
| 小锚固/材料定性边界 | Makita FAQ：小锚固非钢筋混凝土与电锤钢筋/非钢筋应用区分 | S02 | 定性事实/高 | small无数值 |
| TE2能力与最优分离 | 4–22mm与4–14mm | S04 | 型号事实/高 | 不跨型号/地区 |
| TE30能力与最优分离 | 5–28mm与10–28mm | S05 | 型号事实/高 | UK所选110V版本 |
| GBH2-28能力与最优分离 | 4–28mm与8–16mm | S06 | 型号事实/高 | core cutters另列68mm |
| GBH4-32能力与最优分离 | 6–32mm与14–25mm，4.7kg | S07 | 型号事实/高 | 套装电压240V与技术230V保留原字段 |
| GBH5-40分方式能力 | 普通12–40，贯通45–55，取芯40–90；最优18–32mm，6.8kg | S08 | 型号事实/高 | 不把90mm作为实心钻头能力 |
| Plus/Max存在最优交集 | GBH4-32与5-40交集18–25mm；TE30与TE60交集18–28mm | S05,S07,S08,S09 | 区间交集计算/高 | 不是全品类分界 |
| TE60字段不一致不能取最大值 | UK12–100总体、18–40最优、18–80推荐应用；手册普通12–55另分附件 | S09,S10 | 原始差异/高 | 地区版本不同，不能未核对直接覆盖；手册表格未视觉核验 |
| DEWALT最大推荐不能等于最优 | p10 masonry drilling 1in(25.4mm) | S11 | 型号事实/高 | masonry不能无条件当成所有concrete；表格未视觉核验 |
| 深孔影响操作而非固定接口切换 | 深孔减速按手册排屑，过量推力可降速和过热 | S11 | 型号操作事实/高 | 没有通用深度分界 |
| 总长度不等于工作长度 | CYL-3 8mm规格：80mm工作/120mm总长 | S03 | 型号事实/高 | 不统一扣除柄长；有效长度充分性仍需组合条件 |
| 续航需保留条件 | 2915-20，XC6.0，最多50个5/8×3in孔 | S12 | 厂商限定声明/高 | 非保证值、非独立对比、不可外推 |
| 无线不等于轻型 | 2717-20：M18无线SDS-Max | S13 | 产品存在事实/高 | 不借此声称所有无线与有线相同 |
| 接口转接为专用组合 | TE-Y-BFH为TE-Y接受TE-C附件的转接件 | S15 | 产品事实/高 | 不擅自批准任何机型与附件组合 |
| 钻头模式和材料需匹配 | TE-CX列TE-C、混凝土/钢筋混凝土、hammer drilling | S16 | 系列事实/高 | 具体直径与工作长需单品 |
| 锚固方法与清孔依系统 | SafeSet页面区分空心钻头、钻孔及粗化方案 | S17 | 系统定性事实/高 | 当前IFU、型号条件未完整展开，不能自动免清孔 |
| 切钢筋能力不等于许可 | 北美2015指南p17要求事前咨询EOR/主管机构，特别提示预应力风险 | S18 | 稳定安全原理/高；现行审批效力不适用 | 旧资料不支撑当前结构设计参数 |
| 隐蔽设施/卡钻/握持 | TE60手册英文p3–4：检查隐蔽设施、双手握持、卡钻停机 | S10 | 型号手册事实/高 | 未由这些输入确认现场安全 |
| 粉尘规则地域性 | OSHA Table1(vii)官方索引条文；手册直接支持适当粉尘控制 | S19,S10,S11 | 法规全文可访问性不足/中；手册事实/高 | OSHA直开失败；不用于合规承诺 |
| 通用孔深/孔数/功率公式 | 所查资料为型号能力及有条件续航，无统一公式 | 本轮检索集 | 有限检索结果 | 不宣称不存在任何其他资料；禁止以AI补数 |

## 证据差距矩阵与处理结果

| 差距 | 追加检索/核对 | 结果 | 当前处理 |
|---|---|---|---|
| 是否有SDS统一孔径界限 | 同一地区Hilti/Bosch跨接口型号技术区 | 最优范围存在交集 | 不设统一阈值 |
| Hammer Drill统一10/13mm上限是否成立 | Makita NZ有线冲击钻对比，继而打开HP2010N单品 | 20mm混凝土能力反例 | 明确型号限定 |
| 普通钻头兼容是否意味纯旋转混凝土 | CYL-3全文FAQ | 夹头兼容与加工模式不同 | 不推荐未核实纯旋转组合，不绝对禁用 |
| 取芯最大值能否用于普通钻头 | Bosch分项数据与HiltiTE60手册 | 各类分开；Hilti网页字段口径差异 | 禁止合并最大值 |
| 孔深与孔数能否切换类别 | DEWALT操作手册、Milwaukee续航条件 | 无可推广阈值 | 保留为工作量/长度约束 |
| SDS转接是否绝对不可能 | Hilti TE-Y-BFH | 官方专用转接件存在 | V0.1默认原生匹配，转接不自动展开 |
| OSHA法规全文获取 | 条文和事实页/PDF各入口尝试 | 官方索引可见、直开失败 | 透明披露，发布安全内容前补验 |
| 大型Bosch目录 | 2026附件PDF | 超工具大小限制，约81MB | 不再重复重试，使用型号页与小范围字段 |
| Makita美国型号PDF/目录 | 子任务取得HR1840、HR3011FCK、HR4013C索引；正文502 | 原件未复核 | 不进入主报告数值表；改用已完整打开的NZ官方型号 |

## 检索记录

主检索不是全网穷尽，按以下问题族有界执行；先使用品牌官方域名查询，结果中的论坛、经销商及转载不作为结论证据。

- site.hilti.com anchor drilling hammer drilling diamond drilling hole cleaning instructions
- site.bosch-professional.com concrete drilling rebar working length SDS drill bit
- site.osha.gov silica handheld rotary hammer drills dust collection HEPA
- site.hilti.com "Operating Instruction" "reinforcing bars" "structural engineer"
- site.hilti.com "TE 6-22" "pipes" "cables"
- site.hilti.com "HIT-HY 200" "diamond" "Instructions"
- site.hilti.com "drilling through" "reinforcing bars"
- site.hilti.com "HIT-HY 200-A V3" "instructions for use"
- site.osha.gov "Handheld and stand-mounted drills" "99%"
- site.bosch-professional.com "SDS plus-7X" "Working length" "100"
- site.bosch-professional.com concrete "rotary mode" drill bit
- site.bosch-diy.com "concrete" "without impact" drill
- site.bosch-professional.com "SDS" "10 mm" "18 mm"
- site.hilti.com "SDS Plus" "SDS Max" "adapter"
- site.makitatools.com "SDS-PLUS" "SDS-MAX" "interchangeable"
- site.bosch-professional.com/gb/en/products/gsb-13-re "concrete"
- site.makita.co.nz HP1640 "Concrete"
- 子任务品牌检索族：Hilti TE2/TE30/TE60及Bosch GBH2-28/4-32/5-40的optimum与capacity；Makita FAQ与HR1840/HR3011FCK/HR4013C；Milwaukee2915/2717；DEWALT DCH253/DCH273手册。
- 随后直接打开原始型号页与手册，查找Optimum、Opt.、recommended、12mm…55mm、concealed、cams、reinforced、50、18V、Maximum Recommended、pressure、side handle、rotary mode等原文字段。

停止理由：用户要求的五类术语、五品牌覆盖、主要输入条件、关键数值反例已有原始证据；剩余工作是限定产品组合的后续生产资料核验，继续搜更多型号不会改变“不能发明通用阈值”的结论。未开展价格比较、Affiliate抓取、锚固承载力设计或V0.2研究。

## 来源原始追溯

以下工具引用标识仅供内部审计，不出现在交付报告。

### S01 Bosch DIY｜Not sure which drill you need?

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：UK；品类教育。
- 读取：全文；分类章节。
- [官方来源](https://www.bosch-diy.com/gb/en/all-about-diy/types-of-drills)。
- 内部可见工具引用：turn33view0。

### S02 Makita Canada｜Frequently asked questions

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：加拿大；品类FAQ。
- 读取：全文；混凝土钻孔问答。
- [官方来源](https://www.makita.ca/index2new.php?event=faq-frequently-asked-questions)。
- 内部可见工具引用：turn31view1。

### S03 Bosch Professional｜CYL-3 Drill Bit

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：UK；钻头及共用技术FAQ。
- 读取：全文；材料/模式FAQ、规格。
- [官方来源](https://www.bosch-professional.com/gb/en/cyl-3-concrete-drill-bits-2868161-ocs-ac/)。
- 内部可见工具引用：turn32view0。

### S04 Hilti｜TE 2 Rotary hammer

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：UK；TE 2。
- 读取：全文；Technical Data。
- [官方来源](https://www.hilti.co.uk/c/CLS_POWER_TOOLS_7125/CLS_ROTARY_HAMMERS_7125/r3682)。
- 内部可见工具引用：turn34view0。

### S05 Hilti｜TE 30-AVR Rotary hammer

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：UK；所选110V套装#2160045。
- 读取：全文；Technical Data。
- [官方来源](https://www.hilti.co.uk/c/CLS_POWER_TOOLS_7125/CLS_ROTARY_HAMMERS_7125/r6848759)。
- 内部可见工具引用：turn34view1。

### S06 Bosch｜PRO GBH 2-28 F

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：UK；订单0611267661；110V。
- 读取：全文；Drilling range。
- [官方来源](https://www.bosch-professional.com/gb/en/products/gbh-2-28-f-0611267661)。
- 内部可见工具引用：turn34view3。

### S07 Bosch｜PRO GBH 4-32 DFR

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：UK；订单0611332171；套装240V、技术字段230V。
- 读取：全文；Drilling range。
- [官方来源](https://www.bosch-professional.com/gb/en/products/gbh-4-32-dfr-0611332171)。
- 内部可见工具引用：turn34view4。

### S08 Bosch｜PRO GBH 5-40 DCE

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：UK；订单0611264060；110V。
- 读取：全文；Drilling range。
- [官方来源](https://www.bosch-professional.com/gb/en/products/gbh-5-40-dce-0611264060)。
- 内部可见工具引用：turn34view5。

### S09 Hilti｜TE 60-ATC-AVR Rotary hammer

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：UK；第4代。
- 读取：全文；技术字段与Applications存在口径差异。
- [官方来源](https://www.hilti.co.uk/c/CLS_POWER_TOOLS_7125/CLS_ROTARY_HAMMERS_7125/r5731031)。
- 内部可见工具引用：turn34view2。

### S10 Hilti｜Operating Instruction TE 60 (04), 2134964

- 发布/版本日期：2024-07-10；访问：2026-09-04。
- 范围：澳洲托管；第4代；技术数据以230V为基准。
- 读取：PDF全文；英文p4、p7；未完成表格视觉核验。
- [官方来源](https://www.hilti.com.au/medias/sys_master/documents/h0f/h32/10131928743966/Operating-Instruction-TE-60-04-Operating-Instruction-PUB-5278010-000.pdf)。
- 内部可见工具引用：turn34view6 / turn34view7。

### S11 DEWALT｜DCH253/DCH273 Instruction Manual, NA516950

- 发布/版本日期：未确认文内日期；访问：2026-09-04。
- 范围：北美；DCH253/DCH273；产品代次以对应铭牌核对。
- 读取：PDF全文；英文p7–10；未完成表格视觉核验。
- [官方来源](https://www.dewalt.com/GLOBALBOM/QU/DCH273B/20/Instruction_Manual/EN/NA516950_DCH253_DCH273_T1_NA.pdf)。
- 内部可见工具引用：turn30view3 / turn31view3 / turn31view4。

### S12 Milwaukee｜M18 FUEL 1-1/8 in SDS Plus Rotary Hammer 2915-20

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：USA；2915-20；指定XC6.0电池。
- 读取：全文；运行时间声明。
- [官方来源](https://www.milwaukeetool.com/products/details/m18-fuel-1-1-8-sds-plus-rotary-hammer-w-one-key/2915-20)。
- 内部可见工具引用：turn30view1。

### S13 Milwaukee｜M18 FUEL 1-9/16 in SDS Max Rotary Hammer 2717-20

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：USA；2717-20；18V。
- 读取：全文；产品说明。
- [官方来源](https://www.milwaukeetool.com/products/details/m18-fuel-1-9-16-sds-max-rotary-hammer/2717-20)。
- 内部可见工具引用：turn30view2。

### S14 Makita NZ｜HP2010N 20mm 2 Speed Hammer Drill

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：新西兰；HP2010N；230V。
- 读取：全文；混凝土能力20mm、2.9kg。
- [官方来源](https://www.makita.co.nz/products/model/HP2010N)。
- 内部可见工具引用：turn38view0。

### S15 Hilti｜Spindle TE-Y-BFH #263359

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：USA；指定转接件。
- 读取：全文；TE-Y转TE-C产品信息。
- [官方来源](https://www.hilti.com/c/CLS_POWER_TOOLS_7125/CLS_TOOLS_7125/CLS_ACC_ROTARY_HAMMERS_7125/263359)。
- 内部可见工具引用：turn36view0。

### S16 Hilti｜TE-CX (SDS Plus) Metric hammer drill bit

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：USA；公制钻头系列。
- 读取：全文；材料、工作模式与接口；单品尺寸需另核对。
- [官方来源](https://www.hilti.com/c/CLS_POWER_TOOL_INSERT_7126/CLS_CONCRETE_MASONRY_DRILL_BITS_7126/r4429)。
- 内部可见工具引用：turn39view0。

### S17 Hilti Singapore｜SafeSet and Anchor Installation

- 发布/版本日期：未标注；访问：2026-09-04。
- 范围：新加坡；指定锚固系统方案。
- 读取：全文；自动清孔与roughening章节。
- [官方来源](https://www.hilti.com.sg/content/hilti/A2/SG/en/products/bu-anchors/safeset-and-anchor-installations.html)。
- 内部可见工具引用：turn7view1 / turn12view2。

### S18 Hilti North America｜Post-Installed Reinforcing Bar Guide

- 发布/版本日期：2015-08；访问：2026-09-04。
- 范围：北美；历史技术指南；仅用于稳定方法原理。
- 读取：PDF全文；p17；不作为现行结构设计/锚固审批依据。
- [官方来源](https://files-ask.hilti.com/original/ci/cikbnwqsf1.pdf)。
- 内部可见工具引用：turn24view2。

### S19 OSHA｜29 CFR 1926.1153, Table 1 (vii)

- 发布/版本日期：在线条文；本次未确认修订日；访问：2026-09-04。
- 范围：美国建筑业职业暴露法规。
- 读取：官方搜索索引；直开失败；只作背景，法规实施前复核全文。
- [官方来源](https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1153)。
- 内部可见工具引用：turn3search10 / turn3search14。

## 操作日志

- 任务等级：知识研究；因涉及产品规则另读取项目治理草案。
- 已读取AGENTS.md.md、Personal_Profile.md.md、Global_Work_Rules.md.md、Decision_Log.md.md、Failure_Log.md.md、KnowledgeOS_ProductOS_Governance_V2.md.md。治理V2文件标明草案未生效，未擅自启用。
- 已检查Projects，无现有Visual Job Solver目录和适用子目录AGENTS.md。
- 新增：Concrete-Drilling-Research-V0.1.md（交付）、report-source.md（内部规范底稿）、research-evidence-log.md（本记录）。
- 修改既有文件：无。代码变更：无。发布：无。
- 操作日志保存在项目内，与根目录禁止随意新增笔记的约束一致。
- 本地默认沙箱仍初始化失败；已获自动审核允许，通过明确限定路径的沙箱外操作读取说明、保存研究文档。未发生自动审核拒绝。
- 未创建产品代码、JSON规则、数据库或网站。
- 需要知识库更新：本次报告已沉淀；不自动改写全局决策/失败记录。
