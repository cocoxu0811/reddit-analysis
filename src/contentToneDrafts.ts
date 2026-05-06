/**
 * 内容生成：多种 Reddit 发帖语气（疑惑 / 提问 / 推荐 / 吐槽）
 */

export type ContentToneId = 'curious' | 'question' | 'recommend' | 'rant';

export const DEFAULT_CONTENT_TONE: ContentToneId = 'question';

export const CONTENT_TONE_IDS: ContentToneId[] = ['curious', 'question', 'recommend', 'rant'];

export interface DraftReport {
  summary: string;
  painPoints: string[];
  praisedFeatures: string[];
  mentionedBrands: string[];
  highFrequencyWords: string[];
}

export interface TopicContent {
  postTitle: string;
  postBody: string;
  suggestedSubreddit?: string;
}

export interface ContentIdea {
  title: string;
  angle: string;
  basedOn: string[];
  content: TopicContent;
}

type Lang = 'en' | 'zh';

function block1(
  tone: ContentToneId,
  lang: Lang,
  p0: string,
  f0: string,
  brands: string[],
  summaryHint: string
): ContentIdea {
  const b2 = brands.slice(0, 2).join(lang === 'zh' ? '、' : ' / ') || (lang === 'zh' ? '几款工具' : 'a few tools');
  if (lang === 'zh') {
    const byTone: Record<ContentToneId, ContentIdea> = {
      curious: {
        title: `疑惑：都说「${f0}」好，可我每天卡在「${p0}」——是我漏看了什么前提？`,
        angle: `疑惑向：强调「帖子里夸的」和「自己每天体感」对不上，征求是不是选型条件没看清。`,
        basedOn: [p0, f0],
        content: {
          postTitle: `我可能理解错了：为什么人人谈「${f0}」，我却先被「${p0}」拖垮？`,
          postBody: `发贴前想了很久，怕显得蠢，但还是想问。

我刷到的叙事经常是：「${f0}」很重要、很值得。可我回到工作日，最先爆炸的往往是「${p0}」。就像…脑子在跟帖，身体在加班。

我随手概括一下最近看到的感觉（可能片面）：${summaryHint}

试过 ${b2}，要么预算顶不住，要么迁移/权限这种脏活把人劝退。我现在最疑惑的不是「要不要追求 ${f0}」，而是：是不是我漏看了某个前提条件，才导致 ${p0} 一直解决不了？

有没有人能把我点醒：你们当时到底多满足了哪些条件，才觉得 ${f0} 真的值？还是其实大家也痛，只是没写出来？

（标题太长就截；版规自审。）`,
          suggestedSubreddit: 'r/smallbusiness',
        },
      },
      question: {
        title: `从「${p0}」到「${f0}」：用户真实需求驱动的选品讨论`,
        angle: `提问向：先承认「羡慕的功能 vs 日常折磨」的撕裂，再引出取舍与试点流程。`,
        basedOn: [p0, f0],
        content: {
          postTitle: `说个真心话：看到别人吹「${f0}」，可我每天还是被「${p0}」拖着走——只有我这样吗？`,
          postBody: `Discussion，真诚发问。

潜水挺久了。我也想要「${f0}」，这个我懂；但一回到工作日，真正把我拖垮的往往是「${p0}」。就像脑子知道该羡慕什么，身体却被另一条线拽着。

我随手概括一下最近刷到的感觉（不一定对，欢迎拍砖）：${summaryHint}

试过 ${b2}，要么预算肉疼，要么迁移/权限这种琐事把人劝退。我不是来求「完美答案」的，就想听听你们真实怎么取舍的：为了少踩「${p0}」的坑，你们愿意牺牲什么？又有哪些东西你打死不妥协？

我这算不算想太多，还是其实大家都卡在同一种撕裂里，只是没人摊开讲？有那种很土但很管用的试点流程也可以丢评论里。好回复我整理到主楼「编辑：更新」。

（标题太长就自己截；发帖前瞄一眼版规。）`,
          suggestedSubreddit: 'r/smallbusiness',
        },
      },
      recommend: {
        title: `小团队试错后总结：冲「${f0}」前，先把「${p0}」这笔账算清`,
        angle: `推荐向：像过来人劝一句——先讲怎么绕坑，再谈值得买的点，避免广告感。`,
        basedOn: [p0, f0],
        content: {
          postTitle: `踩坑选手来分享：如果你也想要「${f0}」，我建议你先别忽视「${p0}」`,
          postBody: `不是教程，也不是带货，就是我自己的顺序感。

我以前也先被「${f0}」吸引，结果上线后才发现「${p0}」会把人磨到没脾气。后来我才慢慢把顺序调过来：先把最会拖后腿的那块压住，再去追亮点。

我看到的讨论大意是这样（概括）：${summaryHint}

我试过 ${b2}，经验很朴素：别指望一次买齐所有幸福，先问自己——如果「${p0}」这周不解决，「${f0}」再好也像在云端。

如果你要我给一个「我会再来一次」的建议：先小范围试点，别让迁移/权限/协作在第一个月就把你拖死。你们要是觉得哪步最关键，评论里补一句，我也能整理成 checklist。

（适合小团队；大厂别笑我土。）`,
          suggestedSubreddit: 'r/smallbusiness',
        },
      },
      rant: {
        title: `别再只吹「${f0}」了，谁来管管「${p0}」？`,
        angle: `吐槽向：情绪强一点但仍可讨论，用反差把真实取舍拽回地面。`,
        basedOn: [p0, f0],
        content: {
          postTitle: `我真的累了：帖子里人人夸「${f0}」，现实里却被「${p0}」按在地上摩擦`,
          postBody: `先说好：我不是来否定「${f0}」，我只是烦那种只谈亮点不谈代价的贴。

我每天面对的是「${p0}」这种脏活，它不会因为你买了更酷的功能就自动消失。你刷社区会觉得世界很美好，回到工位就像换了个宇宙。

我概括一下我看到的讨论（可能刺耳）：${summaryHint}

我也试过 ${b2}，结论很俗：钱、迁移、权限，总有一个会在你兴冲冲上线后给你一巴掌。

我就想问一句：我们是不是把「${f0}」讲得太像解药了？其实更多人需要的是先把「${p0}」止血。你们要是也烦这种割裂，评论区一起骂两句也行，骂完顺便说说你怎么扛过来的。

（骂完请给点可执行建议，别只剩情绪。）`,
          suggestedSubreddit: 'r/smallbusiness',
        },
      },
    };
    return byTone[tone];
  }

  const byTone: Record<ContentToneId, ContentIdea> = {
    curious: {
      title: `Confused: everyone says “${f0}” — so why does “${p0}” still eat my week?`,
      angle: `Curiosity / doubt: mismatch between thread hype and lived reality; ask what precondition you might be missing.`,
      basedOn: [p0, f0],
      content: {
        postTitle: `Am I reading the sub wrong? “${f0}” is everywhere, but “${p0}” is what actually breaks me.`,
        postBody: `Might be a dumb question — I’ve sat on this for a while.

The narrative I keep seeing is: “${f0}” matters, it’s worth it. But when I snap back to my actual workflow, “${p0}” is what detonates first. Like my brain is reading threads and my calendar is in a different universe.

Paraphrasing what I’ve been reading (could be wrong): ${summaryHint}

I’ve poked at ${b2} and it’s always the same fork: price jumps or migration/permissions busywork. What I’m *not* asking is “should I want ${f0}.” What I’m asking is: **what precondition did I miss** that keeps “${p0}” from ever getting solved?

If you’ve made it work: what had to be true in your org before ${f0} felt real? Or is everyone quietly miserable and just not posting that part?

(Trim title if needed; check sub rules.)`,
        suggestedSubreddit: 'r/smallbusiness',
      },
    },
    question: {
      title: `From “${p0}” to “${f0}”: a grounded buying / rollout discussion`,
      angle: `Ask: lived tension (praised feature vs daily pain), tradeoffs, pilot workflows — not a framework deck.`,
      basedOn: [p0, f0],
      content: {
        postTitle: `Why does “${f0}” sound amazing in threads but my week still gets eaten by “${p0}”?`,
        postBody: `Discussion — real question, not a flex.

Long-time lurker. I’ve tried the “just buy the better thing” story in my head — it’s fine, it makes sense. But the moment I’m back in my actual workflow, “${p0}” is the part that hits deeper. It’s like my brain stops comparing tools on a spreadsheet and instead just… notices what actually hurts day-to-day.

Paraphrasing what I’ve been reading lately (could be wrong): ${summaryHint}

Small team, tight budget. I’ve poked at ${b2} and I keep bouncing between price jumps and “almost there” UX. I care about “${f0}”, but not if it means pretending “${p0}” doesn’t exist.

So: is this just me being dramatic, or is there a real tradeoff people don’t say out loud? How did you actually choose what to sacrifice — and what would you refuse to compromise on if you did it again? Genuinely curious; lived experience beats a pitch deck.

(Edit: if replies are good I’ll summarize into the OP. Trim title if needed + check sub rules.)`,
        suggestedSubreddit: 'r/smallbusiness',
      },
    },
    recommend: {
      title: `After getting burned: secure “${p0}” before you chase “${f0}”`,
      angle: `Recommend: “what I’d do again” energy — practical sequencing, anti-shill.`,
      basedOn: [p0, f0],
      content: {
        postTitle: `If you want “${f0}”, don’t sleep on how fast “${p0}” can ruin the rollout`,
        postBody: `Not a vendor post — just the order of operations that saved my sanity.

I used to lead with “${f0}” in my head, then get wrecked by “${p0}” after go-live. Now my boring take is: stabilize the thing that drains you weekly *before* you chase the shiny promise.

What people seem to be saying lately (paraphrased): ${summaryHint}

I’ve tried ${b2}. My takeaway is unglamorous: you rarely buy your way out of “${p0}” with features alone — you buy time to fix process, permissions, migration, whatever your org actually is.

If I had to recommend a playbook: tiny pilot, explicit permission rules, one migration checkpoint — don’t let month one become a death march. If you disagree, tell me what you’d prioritize instead — I’ll edit good replies into the OP.

(Small teams; enterprise folks can laugh at my budget.)`,
        suggestedSubreddit: 'r/smallbusiness',
      },
    },
    rant: {
      title: `Stop praising “${f0}” like it’s magic while “${p0}” quietly ruins people`,
      angle: `Rant: heated but still discussable — contrast hype posts with operational reality.`,
      basedOn: [p0, f0],
      content: {
        postTitle: `I’m tired: threads hype “${f0}” but my job is stuck on “${p0}”`,
        postBody: `Not here to say “${f0}” is fake — I’m tired of threads that sound like highlight reels.

My day-to-day is “${p0}.” It doesn’t vanish because you bought a nicer story. Reddit makes the world feel solved; my desk makes it feel like a ticket queue from hell.

Paraphrasing what I’m seeing (blunt): ${summaryHint}

I’ve kicked the tires on ${b2}. Every time, one of these shows up: money, migration, permissions — the unsexy stuff that punches you after the demo.

Can we admit “${f0}” isn’t a moral victory? Sometimes you need to stop the bleeding on “${p0}” before anything feels “worth it.” Vent with me if you want — but please also drop what actually worked, not vibes.

(Rant + actionable comments > pure anger.)`,
        suggestedSubreddit: 'r/smallbusiness',
      },
    },
  };
  return byTone[tone];
}

function block2(
  tone: ContentToneId,
  lang: Lang,
  p1: string,
  brands: string[],
  words: string[],
  w0: string
): ContentIdea {
  const b0 = brands[0] || (lang === 'zh' ? '某些产品' : 'certain tools');
  const terms = words[0] || (lang === 'zh' ? '这些词' : 'these terms');
  if (lang === 'zh') {
    const byTone: Record<ContentToneId, ContentIdea> = {
      curious: {
        title: `疑惑：「${p1}」到底是产品烂，还是我当初缺信息？`,
        angle: `疑惑向：区分「真差」与「信息差」，邀请补齐决策时缺的那块拼图。`,
        basedOn: [p1],
        content: {
          postTitle: `越想越不对劲：踩「${p1}」的时候，我是不是其实没问到关键问题？`,
          postBody: `轻吐槽 + 真心疑惑。

我越来越觉得：大家骂「${p1}」时，骂的可能不是同一件事。有人是产品真拉，有人是当时手里信息不够，结果预期跑偏。

它和 ${b0}、「${terms}」经常一起出现，但我更想知道：你那一刻到底知道什么、不知道什么？

如果你愿意讲：第一次撞上「${p1}」时你是什么岗位/团队规模？如果重来，你会先死磕哪三个问题？

我是不是把简单问题复杂化了？还是这里确实有一类「默认对方会说但其实没人说」的信息黑洞？`,
          suggestedSubreddit: 'r/Entrepreneur',
        },
      },
      question: {
        title: `为什么用户总在抱怨「${p1}」？场景与信息缺口`,
        angle: `提问向：把抱怨还原成决策链条，收集真实故事。`,
        basedOn: [p1],
        content: {
          postTitle: `被「${p1}」坑过的来集合一下——你们当时是缺了哪条信息？`,
          postBody: `不是来倒垃圾的，就想把事聊清楚。

我好奇的是：大家骂「${p1}」的时候，背后是不是同一种「当时以为懂了、其实没问到点子上」？讨论里它老跟 ${b0}、还有「${terms}」绑在一起出现，但我更想知道**你那一刻手里到底有哪些信息、缺了哪一块**。

如果你愿意讲：第一次撞上「${p1}」时你是什么岗位/团队规模？如果重来一次，你会死磕哪三个问题再问采购/老板？

我是不是把这事想复杂了？还是确实有一类信息大家都默认「对方会主动说」，结果从来没人说。有故事丢评论，后面我整理个 checklist 编辑到主楼。

（版主如果觉得像问卷我可以改标题。）`,
          suggestedSubreddit: 'r/Entrepreneur',
        },
      },
      recommend: {
        title: `如果你怕再踩「${p1}」：我会先问清楚的清单`,
        angle: `推荐向：给“下次采购前核对项”，像老用户带路。`,
        basedOn: [p1],
        content: {
          postTitle: `血泪总结：再遇到「${p1}」这种坑，我会先问这 3 件事`,
          postBody: `不是甩锅教程，就是我自己的复盘。

「${p1}」这个词我跟 ${b0}、以及「${terms}」一起见过太多次。后来我学会一件事：先把问题定义清楚，再谈买不买。

我第一次踩坑通常是：我以为我懂了，其实我只懂了销售话术。现在我会强制自己问：数据谁负责？权限边界是什么？迁移失败怎么回滚？

如果你愿意补充：你当时岗位/团队规模？你会把哪三条写成“签合同前必须答”的硬条件？

我会把高质量评论整理进主楼，给后来人当 checklist。`,
          suggestedSubreddit: 'r/Entrepreneur',
        },
      },
      rant: {
        title: `我真的受够「${p1}」这种坑了`,
        angle: `吐槽向：先发泄，再把“信息缺口”拉回讨论。`,
        basedOn: [p1],
        content: {
          postTitle: `能不能别让我再因为「${p1}」破防了？`,
          postBody: `我承认我情绪化，但我真的烦。

每次看到「${p1}」和 ${b0}、以及「${terms}」绑在一起，我都能脑补出一堆人被坑到失眠。问题不是“没人提醒”，而是提醒来得太晚。

我就想问：当初到底是谁该把话说清楚？还是我们买方自己该更狠一点问？

骂完我想做点有用的：你们如果重来，会先逼对方回答哪三个问题？我把评论整理出来，给下一个倒霉蛋省点时间。`,
          suggestedSubreddit: 'r/Entrepreneur',
        },
      },
    };
    return byTone[tone];
  }
  const byTone: Record<ContentToneId, ContentIdea> = {
    curious: {
      title: `Confused: is “${p1}” the product… or missing context?`,
      angle: `Doubt: separate “bad tool” vs “bad info,” ask what you didn’t know at purchase time.`,
      basedOn: [p1],
      content: {
        postTitle: `Something feels off: when “${p1}” hits, what question didn’t I ask?`,
        postBody: `Light vent + genuine confusion.

I’m starting to think people say “${p1}” but mean different failures — sometimes the tool, sometimes the expectations set by… nobody.

It clusters with ${b0} and “${terms}” in what I read, but what I want is the *missing piece*: what did you know / not know at decision time?

If you’ve lived it: role + team size when it first happened? If you could rerun it, what three questions would you force answers to?

Am I overcomplicating a simple thing, or is there a real “info black hole” everyone assumes someone else will fill?`,
        suggestedSubreddit: 'r/Entrepreneur',
      },
    },
    question: {
      title: `Why people keep hitting “${p1}”: scenes + info gaps`,
      angle: `Ask: map rants to the decision chain; collect stories.`,
      basedOn: [p1],
      content: {
        postTitle: `Did “${p1}” bite you because you were missing a piece of context — what would you verify first next time?`,
        postBody: `Honest question, not a roast thread.

I’m not trying to pile on the product — I’m trying to understand what people *didn’t know* when “${p1}” showed up. In what I’ve read it clusters with ${b0} and “${terms}”, but the part I care about is the gap between what you assumed and what reality was.

It feels less like “bad luck” and more like… my brain filled in blanks with vibes, then got surprised later. Maybe that’s just me.

If you’ve lived it: what role/team size were you in when it first hit? If you could rerun the purchase, what three questions would you refuse to leave unanswered?

Genuinely curious — if this gets good replies I’ll edit a checklist into the OP. (Mods: happy to rephrase if it reads too survey-ish.)`,
        suggestedSubreddit: 'r/Entrepreneur',
      },
    },
    recommend: {
      title: `A “before you buy” checklist if you fear “${p1}” again`,
      angle: `Recommend: veteran-style pre-purchase questions — practical, not preachy.`,
      basedOn: [p1],
      content: {
        postTitle: `Lessons learned: 3 things I’d force an answer on before I ever hit “${p1}” again`,
        postBody: `Not blame assignment — just my postmortem template.

I keep seeing “${p1}” near ${b0} and “${terms}”. The pattern I trust now: define the failure mode *before* you define the vendor.

My first misses were usually: I understood the demo, not the operating reality. Now I ask: who owns the data, what are permission edges, what’s rollback if migration goes sideways?

If you add your must-ask trio in the comments, I’ll edit a community checklist into the OP.`,
        suggestedSubreddit: 'r/Entrepreneur',
      },
    },
    rant: {
      title: `I’m done pretending “${p1}” is just “a small issue”`,
      angle: `Rant first, then channel into “what we should have asked.”`,
      basedOn: [p1],
      content: {
        postTitle: `Can we talk about how tired I am of “${p1}” threads that ignore the real failure mode?`,
        postBody: `I’m heated, sorry.

Whenever “${p1}” shows up next to ${b0} and “${terms}”, I know someone’s week just got worse. It’s not that warnings don’t exist — they arrive after you’re committed.

Who should’ve said what? Probably everyone. But I still want something useful: if you could rerun the purchase, what three questions would you scream until you got a straight answer?

I’ll compile replies so the next person loses less sleep.`,
        suggestedSubreddit: 'r/Entrepreneur',
      },
    },
  };
  return byTone[tone];
}

function block3(
  tone: ContentToneId,
  lang: Lang,
  f0: string,
  f1: string,
  brands: string[],
  summaryHint: string,
  summary: string
): ContentIdea {
  const sh = summaryHint.slice(0, 160) + (summary.length > 160 ? '…' : '');
  const b3 = brands.slice(0, 3).join(' / ');
  if (lang === 'zh') {
    const byTone: Record<ContentToneId, ContentIdea> = {
      curious: {
        title: `疑惑：「${f0}」和「${f1}」都高频出现，到底哪个才是真优先级？`,
        angle: `疑惑向：质疑“热词=该押注”，请别人用自己的痛来校准。`,
        basedOn: [f0, f1],
        content: {
          postTitle: `我越来越糊涂：社区里「${f0}」和「${f1}」都在吵，到底先解决哪个才对？`,
          postBody: `可能我笨，但真的越看越懵。

热词高频不代表它就是你这周该赌的那张牌。最近讨论里我截到的 vibe：${sh}

我自己卡在：如果一句话只能推销一个承诺，你会把「${f0}」放前面还是「${f1}」？不是哪个更酷，是哪个更贴近你正在痛的那件事。

看过 ${b3} 的朋友随便聊：我是不是在制造假两难？还是你们其实也默默排过优先级只是没写出来？

有回复我整理小表编辑进主楼。`,
          suggestedSubreddit: 'r/SaaS',
        },
      },
      question: {
        title: `用户最认可的特征：${f0} + ${f1} 哪个更该优先？`,
        angle: `讨论向：用真实疼痛校准卖点优先级。`,
        basedOn: [f0, f1],
        content: {
          postTitle: `[Discussion] 「${f0}」和「${f1}」都很好听，但小团队到底先押哪一个？`,
          postBody: `社区里这两个词都出现得很勤，可我越来越觉得：高频≠你现在最该赌的那张牌。

我随手截一段最近讨论的感觉（可能片面）：${sh}

我自己卡在一种很蠢的纠结里：如果落地页只能喊一句话，你会把「${f0}」放前面，还是「${f1}」？不是因为哪个更酷，而是哪个更贴近你团队这周真实会痛的那件事。

看过 ${b3} 的朋友也可以随口说说：谁家讲故事时把这两点绑得最自然——不是站队，就想听听「你怎么排」这种很私人的答案。

我是不是在制造假两难？还是你们其实也默默排过优先级只是没写出来。有回复我后面整理个小表编辑进主楼。`,
          suggestedSubreddit: 'r/SaaS',
        },
      },
      recommend: {
        title: `如果只能选一个主卖点：我会怎么在「${f0}」和「${f1}」之间排`,
        angle: `推荐向：给出个人排序逻辑，邀请补充而非吵架。`,
        basedOn: [f0, f1],
        content: {
          postTitle: `小团队落地页只能 hero 一个：我倾向先讲「${f0}」还是「${f1}」？`,
          postBody: `纯经验，不是标准答案。

背景 vibe：${sh}

我的粗糙规则是：哪个更接近你本周会丢单/会加班的痛，哪个就上首屏。另一个可以放第二屏做支撑，而不是两个都想当主角。

看过 ${b3} 的欢迎吐槽我排序错——我就想看看不同行业怎么排。

好回复我整理对照表编辑进主楼。`,
          suggestedSubreddit: 'r/SaaS',
        },
      },
      rant: {
        title: `别再把「${f0}」和「${f1}」一起吹成“全都要”了`,
        angle: `吐槽向：反感“营销全包”，拉回真实优先级。`,
        basedOn: [f0, f1],
        content: {
          postTitle: `我真的烦：人人都要「${f0}」又要「${f1}」，小团队哪有那么多带宽？`,
          postBody: `我知道两个都好，但现实不是开外挂。

最近讨论里我看到的：${sh}

问题是：落地页、路线图、销售话术都在暗示你能同时拿下「${f0}」和「${f1}」，结果团队被 KPI 撕成两半。

我就想听句实话：你当时砍了哪个、保了哪个？看过 ${b3} 的也别客气，直接骂醒我。

骂完请给你们的优先级，我想整理成对照表。`,
          suggestedSubreddit: 'r/SaaS',
        },
      },
    };
    return byTone[tone];
  }
  const byTone: Record<ContentToneId, ContentIdea> = {
    curious: {
      title: `Confused: “${f0}” vs “${f1}” both trend — which is actually the priority?`,
      angle: `Doubt: hot words ≠ what you should ship first; ask others to calibrate with pain.`,
      basedOn: [f0, f1],
      content: {
        postTitle: `I’m genuinely lost: everyone discusses “${f0}” and “${f1}” — which comes first for a tiny team?`,
        postBody: `Maybe I’m slow, but the more I read, the less obvious this is.

Frequency isn’t the same as urgency. Quick vibe from threads: ${sh}

The part I can’t settle: if your homepage can only promise *one* thing first, do you lead with “${f0}” or “${f1}” — based on pain, not vibes.

If you’ve used ${b3}, tell me how you’d rank them. Am I creating a fake dilemma?

I’ll edit a small comparison table into the OP if replies are good.`,
        suggestedSubreddit: 'r/SaaS',
      },
    },
    question: {
      title: `Praised traits: ${f0} + ${f1} — what would you prioritize?`,
      angle: `Discussion: calibrate messaging priority with real pain.`,
      basedOn: [f0, f1],
      content: {
        postTitle: `[Discussion] “${f0}” vs “${f1}” — which one actually matters first on a tiny team?`,
        postBody: `Real question. Both “${f0}” and “${f1}” get praised constantly, but “popular in threads” isn’t the same as “this is what I should optimize for *this quarter*.”

Quick vibe from what people are saying lately: ${sh}

Here’s the part my brain won’t settle: if your homepage can only hero *one* promise, which do you lead with — and why? Not which sounds cooler — which one matches the pain you’re actually living in.

If you’ve used ${b3}, I’m also curious who tells the cleanest story tying both together (not a brand war; just narrative craft).

Am I inventing a fake tradeoff, or is this a real “you can’t market everything at once” thing? Genuinely curious — I’ll edit a small comparison table into the OP if people share how they prioritized.`,
        suggestedSubreddit: 'r/SaaS',
      },
    },
    recommend: {
      title: `If I could only hero one: how I rank “${f0}” vs “${f1}”`,
      angle: `Recommend: share a personal ordering rule + invite corrections.`,
      basedOn: [f0, f1],
      content: {
        postTitle: `Tiny team, one hero line: I’d lead with “${f0}” vs “${f1}” like this`,
        postBody: `Experience, not gospel.

Context from threads: ${sh}

My boring rule: whichever is closer to the pain that makes you lose deals *this week* goes first. The other becomes proof/support — not a second hero.

If you’ve shipped ${b3}, roast my ordering — I want industry-specific priorities, not ideology.

I’ll edit a comparison table if this gets traction.`,
        suggestedSubreddit: 'r/SaaS',
      },
    },
    rant: {
      title: `Stop marketing “${f0}” AND “${f1}” like tiny teams have infinite bandwidth`,
      angle: `Rant: push back on “have it all” messaging; demand real tradeoffs.`,
      basedOn: [f0, f1],
      content: {
        postTitle: `I’m exhausted: we’re told to want “${f0}” *and* “${f1}” with 4 people and a dream`,
        postBody: `I know both can matter. I also know my calendar is real.

What I’m seeing lately: ${sh}

Landing pages promise both. Roadmaps promise both. Then your team gets split in half and nobody admits the tradeoff.

Tell me what you *cut*, what you *kept*, and why — especially if you’ve used ${b3}. I’ll turn rants into a priority matrix in the OP if people share specifics.`,
        suggestedSubreddit: 'r/SaaS',
      },
    },
  };
  return byTone[tone];
}

function block4(
  tone: ContentToneId,
  lang: Lang,
  brands: string[],
  p0: string,
  w0: string,
  f0: string
): ContentIdea {
  const b3 = brands.slice(0, 3).join(lang === 'zh' ? '、' : ' / ');
  const w = w0 || (lang === 'zh' ? '…' : '…');
  const f = f0 || (lang === 'zh' ? '…' : '…');
  const p = p0 || (lang === 'zh' ? '核心痛点' : 'your main pain');
  if (lang === 'zh') {
    const byTone: Record<ContentToneId, ContentIdea> = {
      curious: {
        title: `疑惑：${b3} 在「${p}」上到底差在哪？`,
        angle: `疑惑向：不想站队，只想搞清“同名不同痛”。`,
        basedOn: brands.slice(0, 3),
        content: {
          postTitle: `越看越懵：${b3} 解决「${p}」时，差别到底在细节还是预期？`,
          postBody: `不是求榜单名次，是我真没看懂。

当讨论里同时出现 ${b3}，我更好奇：你到底想解决什么问题？我看到的词经常是「${w}」，夸得多的是「${f}」，但落到每天用，差在哪？

用过哪家、多久、最爽和最想骂各一点？我可能问得太细，但就是想搞清“同名不同痛”。`,
          suggestedSubreddit: 'r/B2BSaaS',
        },
      },
      question: {
        title: `品牌观察：${b3}`,
        angle: `提问向：要真实体验，不要站队。`,
        basedOn: brands.slice(0, 3),
        content: {
          postTitle: `真心请教：${b3} 在「${p}」这件事上，你们真实体验里强项/短板是啥？`,
          postBody: `不想看营销号表格，就想听人话。

当讨论里同时出现 ${b3} 时，我更好奇：你当时到底想解决啥？我看到的词经常是「${w}」，夸得最多的是「${f}」，但落到每天用，差别在哪？

用过哪家的、大概多久、最爽的一点和最想骂的一点分别是什么？如果你是竞品，你会抄哪条说法、会刻意避开哪个坑？

我可能问得太细了，但就是想听真实体验不是站队。涉及具体报价记得打码，别害版主难做。`,
          suggestedSubreddit: 'r/B2BSaaS',
        },
      },
      recommend: {
        title: `用过 ${b3} 之后的「${p}」主观排名（非权威）`,
        angle: `推荐向：分享个人体验坐标，强调主观与场景。`,
        basedOn: brands.slice(0, 3),
        content: {
          postTitle: `踩坑选手主观分享：${b3} 谁在「${p}」上更顺手？`,
          postBody: `先声明：全是主观+场景，不是结论。

我关心「${p}」时，讨论里常出现「${w}」，夸得多的是「${f}」。我自己的用法是：先定义你最痛的场景，再选叙事最贴近的那个。

用过 ${b3} 的欢迎补充：你最爽/最想骂各一点。涉及价格打码。

我想把高质量回复整理成“场景→选择”对照，给后来人参考。`,
          suggestedSubreddit: 'r/B2BSaaS',
        },
      },
      rant: {
        title: `别再让我看那种“万能对比表”了：${b3}`,
        angle: `吐槽向：反感空洞对比，逼出场景化真相。`,
        basedOn: brands.slice(0, 3),
        content: {
          postTitle: `受够了：聊到「${p}」就甩 ${b3} 对比，但没人说自己的真实场景`,
          postBody: `我知道对比表好看，但我需要的是人话。

当「${w}」和「${f}」一起出现时，我更火大：你到底在解决什么问题？同一套词，不同团队完全是两种地狱。

用过 ${b3} 的直接骂：最爽/最想骂各一句。骂完给场景（行业/规模），不然全是空话。

打码报价，别害版主。`,
          suggestedSubreddit: 'r/B2BSaaS',
        },
      },
    };
    return byTone[tone];
  }
  const pEn = p0 || 'your main pain';
  const byTone: Record<ContentToneId, ContentIdea> = {
    curious: {
      title: `Confused: what actually differs across ${b3} for “${pEn}”?`,
      angle: `Doubt: same names, different pains — ask for concrete deltas.`,
      basedOn: brands.slice(0, 3),
      content: {
        postTitle: `I’m lost on details: ${b3} — where’s the real gap on “${pEn}”?`,
        postBody: `Not asking for a leaderboard — I’m trying to understand the job to be done.

When ${b3} show up together, what problem were *you* solving? I keep seeing “${w}” cluster with praise for “${f}”, but day-to-day, what’s the delta?

Tenure + best part + worst part. Might be too granular, but I want messy truth.`,
        suggestedSubreddit: 'r/B2BSaaS',
      },
    },
    question: {
      title: `Brands in play: ${b3}`,
      angle: `Ask: lived experience, not tribalism.`,
      basedOn: brands.slice(0, 3),
      content: {
        postTitle: `Honest thread: ${b3} — what actually moved the needle on “${pEn}”?`,
        postBody: `Trying not to make this a billboard thread.

When people bring up ${b3.split(' / ').join(', ')}, what job were you hiring the tool for? In what I’ve read, it clusters with “${w}” and people praise “${f}” — but day-to-day, what’s the delta?

If you’ve used one of them: rough tenure, the part that felt surprisingly good, and the part that made you swear at your laptop. If you were building a competitor, what story would you steal — and what trap would you avoid?

Might be too granular, but I’d rather hear messy truth than tribal loyalty. Redact pricing if needed for sub rules.`,
        suggestedSubreddit: 'r/B2BSaaS',
      },
    },
    recommend: {
      title: `Non-authoritative ranking: ${b3} on “${pEn}” (experience-based)`,
      angle: `Recommend: subjective coordinates + scenarios.`,
      basedOn: brands.slice(0, 3),
      content: {
        postTitle: `Subjective take: which of ${b3} felt best for “${pEn}” in *my* workflow`,
        postBody: `Disclaimer: scenarios matter more than logos.

When “${pEn}” is the pain, I keep seeing “${w}” and praise for “${f}”. My rule: match the story to the scenario that hurts you weekly.

If you’ve used ${b3.split(' / ').join(' / ')}: best/worst each in one sentence + your industry/size.

I’ll compile “scenario → pick” if replies are good. Redact pricing.`,
        suggestedSubreddit: 'r/B2BSaaS',
      },
    },
    rant: {
      title: `Stop feeding me generic comparison grids: ${b3}`,
      angle: `Rant: demand scenario-grounded truth, not feature soup.`,
      basedOn: brands.slice(0, 3),
      content: {
        postTitle: `I’m tired of “${pEn}” threads that compare ${b3} without real context`,
        postBody: `Comparison tables look smart and solve nothing.

When “${w}” shows up with “${f}”, tell me what *you* were trying to fix — same words, totally different hells depending on team.

Roast ${b3.split(' / ').join(' / ')} with best/worst + your scenario. After venting, add something actionable.

Redact pricing for sub rules.`,
        suggestedSubreddit: 'r/B2BSaaS',
      },
    },
  };
  return byTone[tone];
}

function block5(tone: ContentToneId, lang: Lang, w0: string, w1: string, w2: string, b0: string, p0: string): ContentIdea {
  const w = w0;
  const wExtra = [w1, w2].filter(Boolean).join(lang === 'zh' ? ' / ' : ' / ');
  if (lang === 'zh') {
    const byTone: Record<ContentToneId, ContentIdea> = {
      curious: {
        title: `疑惑：怎么写「${w}」才不会像软文？`,
        angle: `疑惑向：承认“像营销”的恐惧，征求真实长帖写法。`,
        basedOn: [w0, w1, w2].filter(Boolean),
        content: {
          postTitle: `越写越心虚：讲「${w}」时怎么避免那种 landing page 味？`,
          postBody: `我真的在问，不是装。

我整理讨论时发现「${w}」老跟 ${b0 || '某些品牌'}、「${p0 || '那些糟心事'}」绑在一起。我一写 bullet 就像广告，一写故事又怕跑题。

你们平时觉得哪种更像真人长帖？如果要覆盖 ${wExtra || '相关词'}，你会怎么开头才不会让人秒关？

我会按评论改，避免广告感。`,
          suggestedSubreddit: 'r/marketing',
        },
      },
      question: {
        title: `从高频词「${w}」出发：像真人一样写长帖`,
        angle: `提问向：讨论结构与读者焦虑点。`,
        basedOn: [w0, w1, w2].filter(Boolean),
        content: {
          postTitle: `想把「${w}」讲清楚又怕写成软文——有没有「像真人长帖」的写法？`,
          postBody: `最近在整理社区讨论，发现「${w}」老跟 ${b0 || '某些品牌'}、还有「${p0 || '那些糟心事'}」绑在一起。

我卡住的不是“要堆什么功能”，而是：**大家到底在什么阶段会开始搜这个词、会在夜里焦虑它**？一旦写成bullet，就像landing page了。

我脑子里有个很粗的草稿：先把 ${w} 在你行业里到底指什么说清楚；再聊轻量/标准/重几条路；哪些坑和「${p0 || '翻车'}」强相关；最后给一个能明天就动一步的建议。

这会不会太教学腔？你们平时看到哪种写法更像真人——我会按评论改措辞，尽量别像广告。`,
          suggestedSubreddit: 'r/marketing',
        },
      },
      recommend: {
        title: `我这样写「${w}」长帖：更少广告味，更像人话`,
        angle: `推荐向：分享个人写作顺序与避坑。`,
        basedOn: [w0, w1, w2].filter(Boolean),
        content: {
          postTitle: `分享一个笨办法：写「${w}」时我先讲清这三件事`,
          postBody: `适合和我一样怕写成软广的人。

背景：「${w}」常和 ${b0 || '某些品牌'}、以及「${p0 || '典型痛点'}」一起出现。我的顺序是：先定义读者此刻的焦虑（不是功能），再给路径对比，最后给一个最小行动。

如果要顺带覆盖 ${wExtra || '相关词'}，我会用案例钉住，而不是堆词。

欢迎拍砖；好回复我整理成模板编辑进主楼。`,
          suggestedSubreddit: 'r/marketing',
        },
      },
      rant: {
        title: `我真的烦死“内容像软文”这件事了（尤其是「${w}」）`,
        angle: `吐槽向：对模板化营销的反感，仍求有用建议。`,
        basedOn: [w0, w1, w2].filter(Boolean),
        content: {
          postTitle: `写「${w}」写到自我厌恶：一正经就像广告，一随意又像没深度`,
          postBody: `我情绪上来了，抱歉。

社区里「${w}」跟 ${b0 || '某些品牌'}、「${p0 || '糟心事'}」绑在一起时，读者很敏感：你稍微整齐一点，他就觉得你在卖。

我就想问：你们到底想看哪种“人话”？我可以骂完再改，但别让我猜。

骂完请给你们觉得舒服的写法示例。`,
          suggestedSubreddit: 'r/marketing',
        },
      },
    };
    return byTone[tone];
  }
  const wAlt = w1 || '…';
  const byTone: Record<ContentToneId, ContentIdea> = {
    curious: {
      title: `Confused: how do you write about “${w}” without sounding like an ad?`,
      angle: `Doubt: fear of “marketing voice,” ask what feels human.`,
      basedOn: [w0, w1, w2].filter(Boolean),
      content: {
        postTitle: `Writing about “${w}” makes me feel shady — how do you keep it human?`,
        postBody: `Serious question — I’m not virtue signaling.

Aggregating threads, “${w}” clusters with ${b0 || 'certain brands'} and “${p0 || 'the usual pain'}”. The second I outline it cleanly, it reads like a landing page.

What opening would *you* keep reading? If you also need to touch ${wExtra || 'related terms'}, how do you weave them without keyword stuffing?

I’ll revise based on comments.`,
        suggestedSubreddit: 'r/marketing',
      },
    },
    question: {
      title: `Start from “${w}”: write a long post that still feels human`,
      angle: `Ask: structure + when readers actually care.`,
      basedOn: [w0, w1, w2].filter(Boolean),
      content: {
        postTitle: `How do you write about “${w}” (and “${wAlt}”) without it reading like a landing page?`,
        postBody: `Aggregating threads — “${w}” keeps clustering with ${b0 || 'certain brands'} and “${p0 || 'the usual pain'}”.

The part I’m stuck on isn’t feature soup. It’s *when* someone actually starts googling this, or lying awake thinking about it — because the second I outline it like a neat list, my brain goes “this is marketing.”

Rough shape in my head: what “${w}” even means in your context, a few realistic paths (light vs standard vs heavy), where it tends to blow up with “${p0 || 'failure modes'}”, and one concrete next step you could actually do this week.

Is that too “tutorial voice”? What makes a long sub post feel human to you? I’ll revise based on comments.`,
        suggestedSubreddit: 'r/marketing',
      },
    },
    recommend: {
      title: `How I write long posts about “${w}” with less ad stink`,
      angle: `Recommend: share a simple writing sequence + pitfalls.`,
      basedOn: [w0, w1, w2].filter(Boolean),
      content: {
        postTitle: `My boring method: 3 things I clarify before I write about “${w}”`,
        postBody: `For people who are scared of sounding like a brochure.

“${w}” often shows up with ${b0 || 'certain brands'} and “${p0 || 'the usual pain'}”. My order: name the anxiety *first* (not the feature), compare paths, then one minimum next step.

If I need ${wExtra || 'related terms'}, I anchor with a story instead of stacking keywords.

Roast me — I’ll edit a template into the OP if this gets useful replies.`,
        suggestedSubreddit: 'r/marketing',
      },
    },
    rant: {
      title: `I hate how easy it is to sound like an ad when writing about “${w}”`,
      angle: `Rant: frustration with “content marketing voice,” still want craft tips.`,
      basedOn: [w0, w1, w2].filter(Boolean),
      content: {
        postTitle: `Writing about “${w}” gives me cringe — structured = salesy, casual = shallow`,
        postBody: `Heated take: readers are right to be suspicious.

“${w}” next to ${b0 || 'certain brands'} and “${p0 || 'pain'}” triggers the ad detector fast.

Tell me what human sounds like *to you* — examples welcome. I’ll take the roast if it comes with a fix.`,
        suggestedSubreddit: 'r/marketing',
      },
    },
  };
  return byTone[tone];
}

function block6(
  tone: ContentToneId,
  lang: Lang,
  p0: string,
  b0: string,
  f0: string
): ContentIdea {
  const f = f0 || (lang === 'zh' ? '某些点' : 'certain strengths');
  if (lang === 'zh') {
    const byTone: Record<ContentToneId, ContentIdea> = {
      curious: {
        title: `疑惑：「${p0}」×「${b0}」是不是热闹但答不到点子上？`,
        angle: `疑惑向：追问“高质量答案长什么样”。`,
        basedOn: [p0, b0],
        content: {
          postTitle: `越看越迷惑：聊到「${p0}」和「${b0}」时，热帖到底缺了哪种答案？`,
          postBody: `我不是抬杠，是我真没刷到那种“看完就能动手”的帖。

一边有人夸「${f}」，一边同一群人还在说「${p0}」没解决。热闹归热闹， actionable 的答案好像总缺一块。

你觉得缺的是数字、流程，还是权限/协作那种脏细节？如果只能深挖一篇，你想先看哪种？

我可能问太贪——但就想知道好答案长什么样。`,
          suggestedSubreddit: 'r/CustomerSuccess',
        },
      },
      question: {
        title: `痛点 × 品牌：高讨论低满足？`,
        angle: `提问向：收集信息缺口。`,
        basedOn: [p0, b0],
        content: {
          postTitle: `「${p0}」配上「${b0}」这种帖是不是吵得很热但答不到点子上？你们到底还想知道啥？`,
          postBody: `我观察到一种很怪的撕裂：一边有人夸「${f}」，一边同一群人还在说「${p0}」没解决。像讨论很热，但你要一篇能照着做的答案，又找不着。

我把这理解成：痛点「${p0}」× 品牌/产品线「${b0}」交叉时，信息往往停在表面。

所以真心问一句：你觉得现在缺的到底是数字对比、落地流程，还是权限/协作里那些脏细节？如果只能让我写一篇深挖，你最想先看算账、迁移还是治理？

我可能问得太贪心——但就是想搞清楚「高质量答案」长什么样。好评论我整理进主楼编辑更新。不引战，只聊信息缺口。`,
          suggestedSubreddit: 'r/CustomerSuccess',
        },
      },
      recommend: {
        title: `如果只能写一篇深挖：我会先写「${p0}」×「${b0}」的哪一块`,
        angle: `推荐向：给出内容优先级建议，邀请投票式回复。`,
        basedOn: [p0, b0],
        content: {
          postTitle: `内容向建议：聊「${p0}」+「${b0}」时，优先补哪类答案最有用？`,
          postBody: `我做内容的角度：大家夸「${f}」但「${p0}」还在，说明读者缺的是可执行层。

我会优先补：落地流程 + 权限/协作现实，其次才是算账；因为前者决定你能不能动起来。

你不同意就直接反驳：你最想先看到迁移、ROI 还是治理？我把评论整理成投票式总结编辑进主楼。`,
          suggestedSubreddit: 'r/CustomerSuccess',
        },
      },
      rant: {
        title: `别只会在「${p0}」+「${b0}」帖里互吹了`,
        angle: `吐槽向：对浅层讨论的反感，再拉回可执行信息。`,
        basedOn: [p0, b0],
        content: {
          postTitle: `我真的烦：热帖吵半天，「${p0}」还是「${b0}」那套，没人讲怎么落地`,
          postBody: `夸「${f}」很容易，解决「${p0}」很难，所以大家都爱聊容易的。

但读者要的不是气氛组，是要能照着做的步骤。权限、协作、迁移这些脏活才是主菜。

骂完我想做点有用的：你最想先看哪种深挖？我把高赞意见整理进主楼。`,
          suggestedSubreddit: 'r/CustomerSuccess',
        },
      },
    };
    return byTone[tone];
  }
  const fEn = f0 || 'certain strengths';
  const byTone: Record<ContentToneId, ContentIdea> = {
    curious: {
      title: `Confused: is “${p0}” × “${b0}” loud but shallow?`,
      angle: `Doubt: ask what a “good enough” deep answer looks like.`,
      basedOn: [p0, b0],
      content: {
        postTitle: `What answer is still missing when “${p0}” meets “${b0}”?`,
        postBody: `Not trying to be contrarian — I genuinely can’t find the “do this next” thread.

People praise “${fEn}” but still say “${p0}” isn’t solved. Lots of heat, not lots of depth.

Is the missing piece numbers, playbooks, or messy permissions reality? If you could demand one deep post, ROI vs migration vs governance?

What does “good enough” even look like here?`,
        suggestedSubreddit: 'r/CustomerSuccess',
      },
    },
    question: {
      title: `Pain × brand threads: high talk, low depth?`,
      angle: `Ask: surface info gaps without flaming.`,
      basedOn: [p0, b0],
      content: {
        postTitle: `When “${p0}” meets “${b0}”, are threads loud but shallow — what answer is still missing?`,
        postBody: `Honest question. I keep seeing praise for “${fEn}” in the same breath as “${p0}” still not being solved. It feels like lots of heat, not lots of depth.

Maybe I’m framing it wrong, but it’s the cross-section I care about: the pain (“${p0}”) and the product line (“${b0}”) — what do you actually still not know after reading typical threads?

Is the missing piece numbers, a playbook, or the messy permissions/collab reality nobody puts in a case study? If you could demand one deep post, would you want ROI math, migration war stories, or governance?

Genuinely curious what “good enough” looks like — I’ll edit a summary into the OP if this gets traction. Not trying to start a flame war; info gaps only.`,
        suggestedSubreddit: 'r/CustomerSuccess',
      },
    },
    recommend: {
      title: `If I could publish one deep dive: what I’d cover first for “${p0}” × “${b0}”`,
      angle: `Recommend: propose a content priority order + invite votes.`,
      basedOn: [p0, b0],
      content: {
        postTitle: `Content take: for “${p0}” + “${b0}”, the highest-leverage answer is usually…`,
        postBody: `From a practitioner lens: if people praise “${fEn}” but “${p0}” persists, readers usually lack execution truth — workflows, permissions, migration reality — more than another ROI chart.

If you disagree, vote with your comment: migration vs ROI vs governance first.

I’ll summarize the thread into an actionable outline in the OP.`,
        suggestedSubreddit: 'r/CustomerSuccess',
      },
    },
    rant: {
      title: `Stop “${p0}” + “${b0}” threads that only cheerlead`,
      angle: `Rant: shallow hype, then pivot to what actionable means.`,
      basedOn: [p0, b0],
      content: {
        postTitle: `I’m tired of hot takes on “${p0}” and “${b0}” with zero implementation detail`,
        postBody: `Praising “${fEn}” is easy; fixing “${p0}” is hard — so the thread stays comfy.

Readers don’t need more vibes. They need steps, edge cases, permissions mess.

Vent if you want — then tell me what deep post you’d actually read. I’ll compile the top asks into the OP.`,
        suggestedSubreddit: 'r/CustomerSuccess',
      },
    },
  };
  return byTone[tone];
}

export function buildIdeasWithDrafts(report: DraftReport, lang: Lang, tone: ContentToneId): ContentIdea[] {
  const pains = report.painPoints.slice(0, 5);
  const features = report.praisedFeatures.slice(0, 5);
  const brands = report.mentionedBrands.slice(0, 5);
  const words = report.highFrequencyWords.slice(0, 5);
  const summaryHint =
    report.summary.length > 200 ? `${report.summary.slice(0, 200)}…` : report.summary;

  const ideas: ContentIdea[] = [];

  if (pains.length && features.length) {
    ideas.push(block1(tone, lang, pains[0], features[0], brands, summaryHint));
  }

  if (pains.length >= 2) {
    ideas.push(block2(tone, lang, pains[1], brands, words, words[0] || ''));
  }

  if (features.length >= 2) {
    ideas.push(block3(tone, lang, features[0], features[1], brands, summaryHint, report.summary));
  }

  if (brands.length) {
    ideas.push(block4(tone, lang, brands, pains[0] || '', words[0] || '', features[0] || ''));
  }

  if (words.length) {
    ideas.push(block5(tone, lang, words[0], words[1] || '', words[2] || '', brands[0] || '', pains[0] || ''));
  }

  if (pains.length && brands.length) {
    ideas.push(block6(tone, lang, pains[0], brands[0], features[0] || ''));
  }

  return ideas.slice(0, 6);
}
