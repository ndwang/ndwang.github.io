---
layout: distill
title: "Claude Plays Slay the Spire 2, and What It Says About AI in Science"
description: "What happens when you throw a LLM into a game it's never seen before"
tags: [AI, LLM, gaming, fun]
categories: [research]
date: 2026-03-16 3:00:00

toc:
  - name: The Experiment
  - name: Gameplay
    subsections:
      - name: The Necrobinder
      - name: The Ironclad
      - name: Common Failures
  - name: Observations
  - name: The Uncomfortable Question

_styles: >
  d-title {
    border-bottom: none !important;
  }
  d-title h1 {
    border-bottom: none !important;
  }
---

How well can AI play a brand new game through reasoning? I spent $100 on Claude API credits and a Friday night having it play a brand new card game on stream. The answer was more interesting than I expected.

## The Experiment

Slay the Spire 2 is a single-player card game that just came out in March 2026. You fight through increasingly difficult enemies in turn-based combat. Each battle is a puzzle: you draw a hand of cards, spend limited energy to play them, and try to deal damage while not dying. Between fights you choose your path on a branching map, pick up new cards to build your deck, and find items that modify your strategy. When you die, you start over from the bottom.

The original Slay the Spire was one of the most popular indie games of the last decade (I spent 200+ hours on it), and the sequel keeps the same core loop but introduces brand new characters, mechanics, cards, and events.

Since the game only just came out, I thought it'd be ideal for testing AI. While the models may have an understanding of the previous game, the new content doesn't exist in any LLM's training data.

So I built a mod that monitors for decision points where player input is needed. When it detects one, it serializes the complete game state to JSON: player HP, deck, relics, potions, the full combat board with enemy intents and status effects, map layout, event options, shop inventory. Everything a human player would see, rendered as structured data.

The agent polls for state, feeds it to Claude along with a system prompt describing the game's rules, and gets back actions through tool use. It also maintains two knowledge bases, one persistent across runs and one per-run, so the AI can record what it learns and carry insights forward.

The engineering worked well. The AI navigated menus, played cards, made map choices, managed its deck, all without manual intervention. The repos are public: [sts2-remote](https://github.com/ndwang/sts2-remote) for the mod and [ClaudePlaysSTS2](https://github.com/ndwang/ClaudePlaysSTS2) for the agent. VODs (in Chinese): [part 1](https://www.bilibili.com/video/BV1GxwxzEEuK), [part 2](https://www.bilibili.com/video/BV1PkwxzqEa9).

## Gameplay

### The Necrobinder

The first character I threw the AI at was the Necrobinder, one of the new characters with mechanics that don't exist in the original game. I started with Claude Sonnet 4.6, then switched to Opus 4.6 for later runs. Between the two models, the AI played four games as the Necrobinder. It never beat the Act 1 boss.

The Necrobinder's central mechanic revolves around a skeletal companion called Osty. Here's how it works: you apply a status called "summon" to build up Osty's HP. When you take damage, your block absorbs it first, then Osty's HP absorbs the rest. If the hit is bigger than Osty's remaining HP, Osty dies and the leftover damage hits you. Osty gets revived every turn with 1 HP thanks to a starting relic. There's also a starting card that deals bonus damage equal to Osty's current HP, so building up summon is simultaneously building your defense _and_ your offense.

This is described in plain English in the status effect descriptions, which are included in the game state the agent receives every single turn.

{% include video.liquid path="assets/video/osty.mp4" class="img-fluid rounded z-depth-1" controls=true autoplay=true loop=true muted=true %}

It never figured it out. Across multiple games and multiple models, the AI didn't understand how damage flows through Osty and didn't see that investing in summon was the path to both surviving and dealing damage. It treated Osty as some passive thing happening in the background rather than the core of its entire strategy. It also kept getting confused by how damage was split between Osty and the Necrobinder.

The other key mechanic is doom: a debuff you apply to enemies. At the end of the enemy's turn, if their remaining HP is less than their doom, they die instantly. There are cards that compound doom, making it a powerful finisher if you build around it. The catch is that doom is triggered at the end of the enemy's turn, meaning they will attack before they die.

The AI's relationship with doom was all over the place. Sometimes it reasoned about the timing correctly. Sometimes it expected doom to kill enemies before they attacked. Sometimes it expressed outright confusion. But it never once wrote down its confusion in the knowledge base, and it never designed an experiment to test its understanding. It had the tools to say "I'm not sure when doom triggers, let me pay attention this turn." It never did.

### The Ironclad

After the Necrobinder runs, I switched Opus to the Ironclad, a character from the original game. The Ironclad has mechanics like strength buffs, vulnerable debuffs, and exhaust synergies, but they're more straightforward than other characters and largely carried over from the original game. Years of Slay the Spire strategy discussion online means these concepts are probably present in LLM training data.

The difference was significant. The AI played noticeably better and fought its way through all of Act 1 and deep into Act 2. The deckbuilding still wasn't great, but it made more reasonable choices and navigated events intelligently. It looked like someone who roughly knew what they were doing, even if they weren't good at it.

Then it met the Act 2 boss: a sandworm, a new boss not in the original game.

On its first turn, the sandworm adds six copies of a card called Frantic Escape to your deck. It also starts a timer called "sandpit" at 4, which ticks down by 1 each turn. Playing a Frantic Escape costs 1 energy and increases the timer by 1. The description of the sandpit timer reads something like: "What will happen when this reaches 0...?"

Any human would connect the dots. Yes, it kills you instantly.

The AI's reasoning was glorious. It looked at the timer. It read the description. And it concluded:

<blockquote class="block-warning">
<p><strong>Key question: what happens when sandpit reaches 0?</strong> I don't know. To be safe, I will <strong>not</strong> play Frantic Escape and instead observe what happens when sandpit decays to 0. Actually, I'll just end my turn to save energy (even though it doesn't carry over).</p>
</blockquote>

It died in four turns.

{% include video.liquid path="assets/video/sandworm.mp4" class="img-fluid rounded z-depth-1" controls=true autoplay=true loop=true muted=true %}

The whole chat burst into laughter. The AI had all the information it needed. The mechanic was practically screaming its purpose: a countdown timer, a card that delays it, a cryptic warning about what happens at zero. A human player sees this and thinks "I should probably not let that timer hit zero." The AI saw the same information and chose to run an experiment it wouldn't survive.

### Common Failures

Beyond the character-specific struggles, the AI had a crippling general problem: it refused to add new cards to its deck. Run after run, it would see card rewards after battles, open them up, and decline, claiming it wanted to keep a lean deck or that the options didn't fit its build. This is a reasonable heuristic in the late game, but fatal in Act 1 when your starting cards are weak and you desperately need power. The AI was applying a strategy principle it learned from training data without understanding _when_ it applies.

One failure mode was particularly funny. After a battle, the game shows a reward screen with a card reward among other rewards. The AI would open the card reward, decide it didn't want any of them, and skip. This brings it back to the reward screen where the card reward is still listed. The AI would see it and think, oh, another card reward! It would open it again, see the same three cards, skip again, and loop back. It did this consistently, every single time it saw a card reward, throughout the entire run. Every time it opened the cards for the second time, it had a little moment of surprise that the options were the same, and made up some random reason why it's there. A human would learn this after one occurrence. The AI repeated it dozens of times.

{% include video.liquid path="assets/video/reward.mp4" class="img-fluid rounded z-depth-1" controls=true autoplay=true loop=true muted=true %}

## Observations

It wasn't all bad.

The math mostly worked. The AI could add up damage, count energy, and spot lethal. A year ago this wasn't the case at all. It still miscalculated sometimes, but humans do too.

It also had a real sense of deckbuilding. For the Necrobinder, the agents wrote down which cards were good for a doom build. Their picks weren't actually that good (I've played enough to know), but the fact that they were thinking about build identity at all was amazing.

Same with combat. It made mistakes no human would make from time to time, but the turn-to-turn play wasn't bad at all. In one fight, Opus applied vulnerable to an elite (50% more damage taken), popped a potion for a one-turn strength buff, then played a card that attacks twice against vulnerable enemies — meaning the strength bonus applied twice, on top of the vulnerability multiplier. That's three separate effects stacking multiplicatively, and it saw the line. It was so pleased with itself it wrote the combo down in the knowledge base.

The knowledge base tells its own story. Opus wrote genuinely useful entries: accurate enemy attack patterns, damage numbers, behavioral observations. It catalogued how enemies behaved across multiple encounters and produced notes that were actually worth reading back. When Opus had training data to draw on, it looked competent.

Sonnet, by contrast, wrote things like "I didn't use this card on turn 5, which was a bad decision" and "I used this on turn 3. Perfect decision." These are useless because they're tied to a specific game state that will never recur. Worse, Sonnet would reference specific relics it had, which actually confused Opus in later runs into thinking _it_ had those relics too. The gap between the models was real.

But both models shared a telling blind spot in how they used the knowledge base. They wrote reflections and summaries, never questions and answers. The knowledge base was full of "here's what happened" and empty of "here's what I don't understand and here's how I'll find out." No model ever used it to track its own confusion or systematically test hypotheses. I guess this is a consequence of post-training for coding tasks where summarization is emphasized.

Give the AI a situation that resembles something in its training data and it performs well. Take that away, and it doesn't degrade gracefully. It falls apart in ways that feel different from how a human beginner would struggle. A human who doesn't understand Osty will try things and notice what happens. The AI just keeps not understanding.

## The Uncomfortable Question

This was a fun weekend project, but I haven't been able to stop thinking about what it implies — especially since I'm actively working on bringing AI agents into accelerator physics research.

There's been a wave of excitement in academia about using AI agents to automate scientific research. Some projects claim that LLM agents can autonomously generate hypotheses, design experiments, and write papers. The vision is compelling: AI that doesn't just assist with science but _does_ science, making independent discoveries.

But the game is a near-perfect controlled experiment for whether that's possible. The mechanics are described in plain English. The feedback loop is immediate — play a card, see what happens. The environment is fully observable. There is no noise, no measurement error, no confounding variables. If an AI can't figure out how Osty works under these conditions, what happens when you point it at a genuinely novel physical phenomenon with noisy data and no English description of the underlying mechanism?

I suspect the reason AI agents look impressive in current scientific applications is that the science isn't actually new to them. If a model has ingested thousands of papers on physics, it can say smart things about physics. That's not discovery, that's retrieval and recombination. The real test is whether an AI could discover something that isn't already, in some form, in its training data. Put an LLM in 1900 and ask it to discover special relativity from the Michelson-Morley experiment. I don't think it could yet.

I have no doubt that a lot of the problems can be mitigated with human in the loop and better prompting. I could write down how exactly the mechanics work and clear up any ambiguity. I could interrupt the agent's decision loops and guide it in the right direction. But that is human-AI collaboration, not fully autonomous discovery.

Maybe the gap between pattern matching and genuine understanding is wider than we think. Maybe the thing that makes a human player try playing Frantic Escape, the intuition that a giant sandworm with a countdown to zero is probably bad, is not something you can easily get from current training methods.

Or maybe SOTA models will prove me completely wrong in a year, which would be amazing news for autonomous research.

After my 5-minute AI adventure, my friend had a ground-breaking finding:

<span style="font-size: 1.3em;">**"Dude, I just found out you can play Slay the Spire 2 using the human brain, build infinite combos, and beat the game, without using any tokens!"**</span>
