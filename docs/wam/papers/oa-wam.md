---
title: OA-WAM 细读:把世界模型组织成「可寻址的对象槽位」,在场景扰动下稳住抓取(清华 + 上交 + 南洋理工)
description: OA-WAM(arXiv 2605.06481)提出 object addressability(对象可寻址性):每帧分解为 N+1 个槽位(1 机器人槽 + N 对象槽),每槽 = 冻结身份地址向量 addr(32-d)+ 时变内容向量 cnt(256-d);在 7B Chameleon 风格主干的每一层把跨槽注意力的 key 只投影到 addr 子向量,从张量层面把「该操作哪个对象」与「该对象当前是什么」解耦。world head 以 MSE 回归下一帧槽位状态、flow-matching 动作头解码 16 步连续动作块,一次前向联合输出 —— 因「未来=回归、动作=流匹配」机制不同,本站归为「联合·混合」。LIBERO 97.8 / SimplerEnv 79.3 / LIBERO-Plus 几何轴 SOTA(均为作者自评 ⚠️)。
---

# OA-WAM 细读

> **WAM 论文细读** · 联合·混合:对象可寻址槽位的世界-动作模型(world head 回归 + 流匹配动作头) · 清华大学 + 上海交通大学 + 南洋理工大学(丁文伯 / 张晓平团队)
> [← WAM 总览](/wam/) · [主报告](/vla/)

> 命名提示:本页对象是 **OA-WAM(Object-Addressable World Action Model)**,arXiv:[2605.06481](https://arxiv.org/abs/2605.06481)(*OA-WAM: Object-Addressable World Action Model for Robust Robot Manipulation*,v1 2026-05-07,cs.RO,License CC0)。下文 ✅ 为本站实查、⚠️ 为作者自评(预印本未经第三方复现)、**待核** 为一手源未给出。

## TL;DR

OA-WAM 是 **清华大学 × 上海交通大学 × 南洋理工大学** 的世界-动作模型(10 位作者,一作 Yushan Liu;资深 / 通讯位为 **Wenbo Ding 丁文伯 / Xiao-Ping Zhang 张晓平**,均署名 Tsinghua University)。它的诊断是:现有 **WAM(World Action Model)** 多把"被预测的世界"表示为整帧图像、视频 token 流或全局 latent —— 在场景扰动(相机视角、物体布局、机器人初始位姿、背景、光照、噪声)下,目标物往往**仍可见**,但它的身份在 holistic token 里和周遭背景**纠缠**在一起,动作解码器找不到一个稳定的"该操作哪个对象"的接口,于是 OOD 时动作漂移。作者把这一缺口命名为 **lack of object addressability(缺乏对象可寻址性)**。

解法:每帧分解为 **N+1 个槽位(1 个机器人槽 + N 个对象槽,N_max=16)**;每个槽 = **冻结的身份地址 addr(32-d,t=0 时由语言标签 + 初始 DINOv3 特征算出后整段 episode 不再更新)** ‖ **时变内容 cnt(256-d,每帧由 SAM 3 + DINOv3 重算)** ‖ 帧序号正弦嵌入(16-d)‖ 角色嵌入(16-d),共 320-d。在一个 **7B Chameleon 风格多模态自回归主干**(32 层、hidden 4096)的**每一层**施加两个**无参数**张量操作:(1)跨槽注意力的 key 只投影 addr 子向量(`mask_≤32` 把前 32 维以外清零再过 W_K);(2)每个 block 后用 forward hook 把残差流里的 addr 切片重置回缓存身份。由此**在张量层面**把"该操作哪个对象(由冻结 addr 路由)"与"该对象当前是什么(cnt、pose、上下文照常流动)"解耦。

输出端:**world head 以 MSE 回归下一帧每槽 (content, pose)**(Eq.4,机器人槽不计入)+ **flow-matching 动作头**解码 16 步连续动作块(Eq.5,推理 4 步 Euler),**一次前向同时产出**未来槽位状态与动作块。⚠️ 主结果(作者自评、3 seeds、仿真):**LIBERO 97.8 / SimplerEnv WidowX(Visual Matching)79.3**;**LIBERO-Plus** 零样本(只在标准 LIBERO 上训练)在**几何轴**刷新 SOTA(Camera 80.5、Robot-init 89.6、**Geo Avg 84.3,较 π0.5 +4.8%**),七轴总均值 **83.9 对 π0.5 的 85.7**(差距集中在 Sensor Noise −17.1%,系槽位提取被光度噪声破坏,属感知前端而非策略);因果换槽干预(swap-binding cosine)**0.87 对全部 8 个 holistic 基线 ≤0.09**。开源状态(实查):论文文中多次提到"已放出的 ckpt-stage0.pt + Stage I/II 训练脚本",但**正文与 arXiv 摘要页均未给出任何代码 / 权重链接**,GitHub / HuggingFace 实查也未找到对应仓库 —— 故记 **待核**(见 [§四](#四、与本站谱系的关系))。

## 一、定位与动机

OA-WAM 把"世界模型对操作有没有用"的问题,从"未来预测得准不准"重新框定为"未来表征**能不能被动作解码器按对象寻址**"。它的核心论点(§1):机器人操作天然发生在**对象层级**——"把红杯子放到绿托盘上"不是要复现某条训练轨迹,而是要在当前场景里**认出语言点名的物体**、推理它与干扰物的空间/功能关系、再生成稳健的闭环动作。而 robustness benchmark(如 [19] LIBERO-Plus)显示:高标准分**不等于**可靠的场景理解——轻微扰动下成功率从近饱和崩落,且策略对改写甚至无意义指令 token 都不敏感,说明"选哪个目标"被绑到了**训练布局与视觉上下文**、而非**语言点名的对象**上。

**归组判断(本站谱系):本页将 OA-WAM 归为「联合·混合」,而非「联合·扩散」。** 判断依据与理由如下:

- **"联合"成立**:world head 与 flow-matching 动作头**时序对齐、共享同一主干、在一次前向中同时**产出"下一帧槽位状态"与"16 步动作块"(论文 §3.1 Eq.1、§3.4、Fig.2 明确为 single forward pass、temporally aligned world/action heads)。这是 joint(联合)形态,而非"先生成整段未来再抽动作"的级联。
- **机制是"混合"而非同一种扩散**:关键在两条预测通路用的是**不同生成机制**——**未来预测(world head)是确定性 MSE 回归**(Eq.4:对下一帧每槽的 content + pose 做均方误差监督,无噪声/无去噪过程);**动作生成(action head)才是 flow-matching**(Eq.5:条件流匹配速度场,推理 4 步 Euler)。即"未来预测 ≠ 动作生成 的机制"。
- **据此排除"联合·扩散"**:本站"联合·扩散"指未来与动作**同为扩散 / 流匹配**(典型如 [UWM](/wam/papers/uwm) 的 coupled diffusion——未来与动作都走扩散;OA-WAM 原文 §2 也正是把 UWM 列为 "coupled diffusion" 的统一动作-未来模型)。OA-WAM 的未来通路是回归而非扩散,故**不满足**"同为扩散/流匹配"的条件 → 归 **联合·混合**。

换句话说,OA-WAM 的"扩散/流匹配"只用在**动作头**;**世界预测被刻意做成一个轻量的辅助回归目标**(论文把 `L_world` 的权重设为 0.5、把 image-VQ 设为 0.04,且 §4.3 的 A3 消融显示去掉 world head 后 LP-avg 反而 84.5 > 83.9、只在 camera/LIBERO 轴上掉分)——世界预测在这里是**塑造表征的正则与几何轴增益来源**,而非一个需要采样的生成器。这与"联合·扩散"路线里"未来本身要被扩散采样出来"在机制上判然不同。

机构与团队:论文署名 **¹Tsinghua University、²Shanghai Jiao Tong University、³Nanyang Technological University**;一作 Yushan Liu(¹),资深/末位作者 Xiao-Ping Zhang(张晓平,¹)与 Wenbo Ding(丁文伯,¹),论文标有 "Corresponding author." 脚注。⚠️ 注:本站任务线索称该组属"清华深圳 TBSI",但**论文署名仅写 "Tsinghua University",未注明深圳 / SIGS / TBSI 校区**——本页按署名原文记为"清华大学",校区归属**待核**。

## 二、方法与架构(据论文 §3 与附录 B–G)

**问题设定(§3.1)** — 第 t 步观测第三人称 + 腕部 RGB、本体 q_t∈ℝ⁷、语言指令 ℓ、过去 T−1 步动作;策略 π_θ **一次前向**同时产出动作块 A_t∈ℝ^{H×7}(**H=16**)与每对象下一帧状态预测 Ŝ_{t+1}。OA-WAM 把 π_θ 建在**对象级输入表征**之上,并约束跨槽注意力 key 只依赖对象身份。

**对象槽位化与统一序列(§3.2,附录 B 六路 tokenization)** — 冻结的基础感知产出**六条并行 token 流**,共享一条 Chameleon-7B 序列:① **T1** Qwen3-VL 名词短语(仅作 SAM 3 的 prompt,**不进主干**)、② **T2** BPE 文本、③ **I-A** Chameleon VQ-GAN 图像码、④ **I-B** SAM 3 + DINOv3 + pose 对象槽、⑤ **S** 256-bin 离散本体、⑥ **A-d** 256-bin 离散过去动作。**只有槽位流引入新参数**(slot adapter f_ϕ: ℝ³²⁰→ℝ⁴⁰⁹⁶),其余复用预训练 Chameleon embedding。每槽向量
`s_k = [ addr_k(32) ‖ cnt_k^t(256) ‖ π^t(16) ‖ ρ_k(16) ] ∈ ℝ³²⁰`,其中 **addr_k = f_addr([ℓ_k ‖ f_k^(0)]) 在 t=0 由语言标签 + 初始 DINOv3 特征算出后整段冻结(对象身份)**,cnt_k^t 每帧重算(时变状态),π^t 是帧序号正弦嵌入,ρ_k 是 robot/object/padding 三类角色查表。序列**跨帧块因果(block-causal)**,以可学习 query token `[act_q]` 收尾,其末隐藏态喂给动作头。N_max=16,机器人恒为槽 0;多实例名词在 t=0 由 Qwen3-VL 关系图消歧,身份跨帧由 SAM 3 concept tracking 维持。

**对象可寻址注意力(§3.3)— 全文最核心的设计** — 7B 主干为 Chameleon 式多模态自回归 transformer(**32 层、hidden 4096、32 头、无 GQA**;形状同 Lumina-mGPT-7B-768)。在槽位位置,标准自注意力被替换为 slot-aware 变体:
`K_k^(ℓ) = W_K^(ℓ) · mask_≤32(x_k^(ℓ))`,`Q,V` 照常 —— 即 **key 投影输入被限制为 addr 子向量**(前 32 维以外清零;实现为 pre-projection mask,复用预训练 W_K、**不引入 OA 专用参数**)。**每个 block 后** forward hook 把 `x_k^(ℓ+1)[1:32] ← addr_k` 重置(其余 4064 维不动),阻止地址通过残差更新漂移。两者合起来**保证每一层的槽路由 key 只依赖冻结身份 addr**:在槽提取正确的前提下,动作头注意哪个槽由 addr 决定,而**不由** cnt、场景上下文或非槽 token 决定;时变内容仍经 value 与残差流流动。帧内槽**双向**(置换等变),帧间块因果。作者反复强调:这是 **key 路由的架构性质,不是端到端语义 grounding 的保证**——若 SAM 3 漏检或地址初始化歧义,该约束**无法纠正上游错误**(继承 SAM 3 + Qwen3-VL 槽位流水线的误差)。

**三个预测头(§3.4)** —
- **World head h_ψ(未来=回归)**:取每槽隐藏态过两条并行 MLP——content 支(4096→1024→256)与 pose 支(4096→256→9),**由 MSE 监督**(Eq.4;9-d pose = 3-d 位置 + 6-d 连续旋转;**机器人槽不计入**,因其未来由动作决定)。
- **Action head h_ξ(动作=流匹配)**:读 `[act_q]` 隐藏态,是一个 **flow-matching MLP**,在 16 步动作块上预测速度场 v_ξ;训练用条件流匹配目标(Eq.5,τ~U(0,1)、ε~N(0,I));**推理 4 步 forward Euler**,一次前向出整块,避开自回归动作头的块内误差累积。
- **辅助 image-VQ head**:复用主干 `lm_head` 预测下一帧 VQ token(加权 CE,L_vq),无新参数。

**训练目标(§3.5)**:`L(θ) = L_act + λ_w·L_world + λ_v·L_vq + λ_c·L_compose + λ_r·L_role`,权重固定为 **{0.5, 0.04, 0.1, 0.05}**;L_compose(干扰物**置换 + 插入**不变性)的 λ_c 在前 30% 线性升温,L_role(把动作头注意力对齐语言抽取的 target/reference 标签)的 λ_r 在训练过半后退火到 0。

**三阶段训练(附录 G)** —
| 阶段 | 训练对象 | 数据 | 损失 | 资源 |
|---|---|---|---|---|
| **Stage 0**(~600k 步) | 从公开 **Chameleon-7B base** 暖启,全量重训出"slot-aware 主干";OA mask 在前 5k 步由 4096-d 退火到 32-d 硬约束(全程 99.2% 在硬约束下) | **~2.5T token**:web 图文 60% + **OXE 20% + DROID 8% + RoboCasa 8% + Bridge V2 4%** | image-VQ 次 token CE + 槽级世界 MSE(**无动作损失**) | 384×A100-80GB,~18 天,**~166k A100-hours**(≈ Chameleon-7B 预训练 856k 的 19%);输出 **ckpt-stage0.pt** |
| **Stage I**(50k 步) | 主干 + lm_head **冻结**;仅训 slot adapter + world head + reset hook(~23.8M) | LIBERO + DROID + ~100k-episode OXE 子集 | 仅 L_world | 8×A100,3–4 天 |
| **Stage II**(100k 步,**LoRA**) | LoRA r=32 挂全 proj(~80M)+ 动作头(~22M,+ 可选 1.2M role)+ 续训 Stage I 模块;**合计可训 ~127M** | **仅标准 LIBERO 演示**(无任何 LIBERO-Plus 扰动因子) | 完整 Eq.6 | 8×A100,3–4 天;全量微调替代方案与 LoRA 在各轴 ±1% 内 |

> 数据与基准的隔离:论文强调 Stage 0 机器人语料**不含** LIBERO 测试演示与 Table 1 用到的 SimplerEnv WidowX(Bridge)片段;Stage II 只用标准 LIBERO 演示,LIBERO-Plus 全程作为 OOD 留出。Backbone 规模因此应区分:**~7.0B 主干(下游冻结,仅 LoRA)+ ~127M 可训**。

**闭环时延(附录 G,单卡 A100)**:每动作块 **~233 ms** = 感知 138(SAM 3 73 + DINOv3 22 + Qwen3-VL 43,**仅首块**)+ 序列构造 ~5 + 主干前向 ~80 + 动作头 4 步 Euler ~10;每 16 个仿真步处理一块 → 在 20 Hz 仿真里**有效控制率 ~4.3 Hz**。⚠️ 内部不一致:论文 §5 Limitations 称"感知 ~95 ms/帧、trunk+head ~5.6 ms",与附录 G 表(138 / 80+10 ms)对不上——本页以附录 G 明列表格为准并标注此出入。

## 三、实验与关键结果

**评测范围(§4.1)**:三个**纯仿真**基准,均 3 seeds 取均值——**LIBERO**(Spatial/Object/Goal/Long,只用标准演示训练)、**SimplerEnv WidowX(Bridge,Visual Matching)**、**LIBERO-Plus**(七扰动轴零样本,只在标准 LIBERO 上训)。⚠️ **下表所有 OA-WAM 数字均为作者自评、单一预印本、无第三方复现**;部分基线(π0.5 的 LIBERO-Plus、π0.5 在 SimplerEnv)系作者"跑放出的 checkpoint"所得,亦记 ⚠️。

| 结果(作者自评 ⚠️) | 数值 | 出处 |
|---|---|---|
| **LIBERO** 四套件均值 | Spatial 98.9 / Object 99.0 / Goal 97.4 / Long 95.9,**Avg 97.8**(较次优 VLA-JEPA 97.2 +0.6) | 论文 Table 1 |
| **SimplerEnv WidowX(Visual Matching)** | Spoon-Towel 83.0 / Carrot-Plate 71.1 / Stack-Cube 65.0 / Eggplant-Basket 98.2,**Avg 79.3**(较次优 CoWVLA 76.0 +3.3) | 论文 Table 1 |
| **LIBERO-Plus** 七轴(零样本) | Camera **80.5**(+4.7 vs Cosmos-Policy)/ Robot-init **89.6**(−0.1 vs X-VLA)/ Layout 82.8 / **Geo Avg 84.3(+4.8 vs π0.5)**;Light 96.5 / BG 95.9 / Lang 85.3 / **Noise 75.6(−17.1)**;**七轴 Avg 83.9 对 π0.5 85.7(−1.8)** | 论文 Table 2 |
| **A2 因果换槽干预**(swap-binding cosine ↑) | OA-WAM **0.87**;全部 8 个 holistic VLA/WAM 基线 **≤0.09**;消融 V1(去 key mask)0.19、mean-pool 头 0.18 | 论文 Table 4 |
| **A1 OA 约束隔离** | V2(全关 OA)LIBERO 95.4 / LP-cam 60.5 / LP-robot 64.8 / LP-avg 76.2 / swap 0.06 → **V0(全开)97.8 / 80.5 / 89.6 / 83.9 / 0.87**;去 key mask 单项 V0→V1 使 LP-cam −13.3、LP-robot −18.2,而 LIBERO 仅 −1.5 | 论文 Table 3 / Table 7 |
| **A3 world head** | 仅动作(无世界头)LIBERO 95.6 / LP-cam 73.4 / **LP-avg 84.5**;加世界头 97.8 / 80.5 / **83.9** —— 世界头只在 camera/LIBERO 轴增益,LP-avg **持平甚至略降** | 论文 Table 5 |
| **A4 干扰物一致性损失 L_compose** | LP-layout 78.5→**82.8**;置换 KL 0.21→0.04、插入漂移 0.19→0.05 | 论文 Table 6 |
| 真机 / 公共操作真机基准 | **论文未报告**(仅仿真) | — |

关键读法:作者的论点不是"全面更强",而是"在**保留目标身份、只几何重排场景**的轴(Camera / Robot-init / Layout)上,address-only 路由带来可验证的结构性鲁棒"——A1 的非对称签名(去掉 OA 几乎不动 in-distribution LIBERO,却让几何 OOD 轴大幅崩落)与 A2 的 0.87 vs ≤0.09 是其核心证据。值得诚实记下:**在七轴总均值上 OA-WAM 仍低于 π0.5**(83.9 vs 85.7),且 A3 显示世界预测头对总均值并非净增益。

## 四、与本站谱系的关系

- **与 [UWM](/wam/papers/uwm) 的机制分野(本页归组的关键对照)**:OA-WAM 原文 §2 把 UWM 明确归为 "**coupled diffusion**" 的统一动作-未来模型(未来与动作**同走扩散**)——这正是本站"**联合·扩散**"的范式;OA-WAM 自己则是"**联合·混合**"(world head 回归 + 动作头流匹配)。二者都"联合",但**未来通路的生成机制不同**,这是把 OA-WAM 与 UWM 分到两组的依据。
- **与 [DreamZero](/wam/papers/dreamzero) 同属"联合"系**:DreamZero 被 OA-WAM 列入"memory / chain-of-world reasoning"一类联合动作-未来工作(§2)。两者都主张"未来预测要与动作生成在同一框架里联合"才对操作有用;区别在 OA-WAM 把"未来"组织成**结构化的、可按对象寻址的槽位状态**,而非全局/链式表征。
- **与 [LaDi-WM](/wam/papers/ladi-wm) 的表征对读**:LaDi-WM 在**潜空间**预测世界状态;OA-WAM 同样不在像素空间堆未来,但更进一步把世界状态**显式拆成"冻结身份地址 + 时变内容"的对象槽位**,并把跨槽路由约束到地址子空间——是"latent 世界预测"向"object-addressable 世界预测"的一次结构化收紧。三者共同点是"世界预测服务于动作",分歧在世界状态的**组织形态**(全局 latent vs 对象槽位 vs 链式记忆)。
- **开源定位(2026-06-11 实查)— 待核**:论文文中多处把 **ckpt-stage0.pt、Stage I/II 训练脚本、"released checkpoint"** 当作已放出之物(作者用它跑了自家 SimplerEnv 与 π0.5 复现),但**正文与 arXiv 摘要页都没有给出任何 GitHub / HuggingFace / 项目页链接**;本站对 GitHub(`OA-WAM` / `Object-Addressable World Action Model`)与 HuggingFace 的检索均**未找到对应仓库或权重**,arXiv 摘要页 Comments 字段为空。故开源状态记 **待核**——**有"已放出"的措辞,但无可核验的公开链接,目前无法确认可复现**。

## 五、局限与存疑

- **仅仿真,无真机(论文 §5 自陈)**:所有鲁棒性结论来自模拟器,**未证明真机部署**;作者明言"reported robustness does not yet prove real-robot deployment"。
- **感知前端是瓶颈与短板来源**:冻结 tokenizer 对小件、反光、透明、遮挡、运动模糊物体失效,**直接造成 Sensor Noise 轴 −17.1%**——属**槽位提取(感知)失败而非策略失败**。OA 约束只是 **key 路由的架构性质**,**不保证端到端语义 grounding 正确**,会原样继承 SAM 3 + Qwen3-VL 流水线的错误。
- **总均值并未超越 π0.5**:七轴 Avg 83.9 < π0.5 85.7;增益高度集中在几何轴。A3 还显示 **world head 对 LP-avg 非净增益**(去掉后 84.5 > 83.9)——"联合世界预测有用"这一卖点在**总均值口径下并不成立**,只在几何 OOD 轴成立,需按轴解读。
- **时延口径自相矛盾(待核)**:§5 的"感知 ~95 ms / trunk+head ~5.6 ms"与附录 G 表(138 / 80+10 ms,总 ~233 ms、~4.3 Hz)对不上;本页采信附录 G 表并标此出入。
- **基线可比性**:部分基线数取自各自原报告、部分系作者跑放出 checkpoint;OA-WAM 全部为自评、3 seeds、无第三方复现 ⚠️。L_compose 的"干扰物一致性"假设 target/distractor **弱耦合**,强交互场景未验证。
- **机构校区待核**:论文署名仅 "Tsinghua University",任务线索所称"深圳 / TBSI"未见于署名,**待核**;"Corresponding author." 脚注在 HTML 渲染中未明确绑定到具体姓名,本页据末位与署名将资深位归 Wenbo Ding / Xiao-Ping Zhang。

## 参考文献

- 一手论文:arXiv:[2605.06481](https://arxiv.org/abs/2605.06481) *OA-WAM: Object-Addressable World Action Model for Robust Robot Manipulation*(v1 2026-05-07,cs.RO,License CC0;Tsinghua University × Shanghai Jiao Tong University × Nanyang Technological University)。HTML 全文:https://arxiv.org/html/2605.06481 (实查 HTTP 200)。
- 作者(10 位,署名原文序):Yushan Liu¹, Peibo Sun², Shoujie Li³, Yifan Xie¹, Lingfeng Zhang¹, Xintao Chao¹, Shiyuan Dong², Fang Chen², Xiao-Ping Zhang¹, Wenbo Ding¹。¹Tsinghua University ²Shanghai Jiao Tong University ³Nanyang Technological University。
- 关键依赖(论文自述):主干暖启自公开 **Chameleon-7B base**(形状同 Lumina-mGPT-7B-768);感知用 **SAM 3 + DINOv3 + Qwen3-VL + T5**;预训练语料含 Open X-Embodiment / DROID / RoboCasa / Bridge V2;评测基准 LIBERO / LIBERO-Plus / SimplerEnv WidowX。
- 开源:论文提及 ckpt-stage0.pt 与 Stage I/II 脚本,但**未给链接**;GitHub / HuggingFace 实查(2026-06-11)未找到 → **待核**。

> 体例声明:✅ 为本站实查(arXiv 解析、GitHub/HF 放出状态);⚠️ 为作者/厂商自评或宣传口径(预印本未经第三方复现);**待核** 表示一手源未给出、不以外部记忆或常识补全。归组("联合·混合")为本站按论文自述机制(world head 回归 + 流匹配动作头)所作的分类判断。
