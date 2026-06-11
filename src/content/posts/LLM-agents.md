---
title: "A Brief History of LLM Agents"
description: "How agentic AI evolved from 2023 to 2025"
date: 2026-04-13
tags: [AI, agents, LLM]
draft: true
---

**Intro** *(2–3 paragraphs)*
- Frame the post: a tour of how agent harnesses evolved alongside model capabilities

---

**1. From text completion to AI agents**

A language model does one thing: given a sequence of tokens, predict the next one. This was all it took to power a chatbot. When ChatGPT launched in November 2022, it was specifically trained to engage in conversations. The user asks, the model answers, the conversation grows. It became the fastest-growing app of all time, reaching 100 million monthly active users in just over two months. The responses were shockingly good. For a moment, it seemed like the hard problem of AI was mostly solved.

But as people adopted LLMs for real tasks, the limitation became apparent. A chatbot has no memory beyond the current conversation, no access to external information, and no ability to take action in the world. Its world ends at the edge of the context window.

In the same way that a human brain is useless without eyes and hands, an LLM on its own can only influence the world through the person reading its output. An agent changes this by giving the model eyes and hands. The model still only writes tokens, but some of those tokens can now read a file, run a command, query a database, or browse the web. And what comes back from those actions shapes what the model writes next. The boundary between the model and the world becomes permeable. This is what people refer to as agentic AI: a model that can perceive its environment and act on it.

**2. Early scaffolding: making unreliable models useful**

Getting useful work out of an early LLM required a lot of handholding. The models were brilliant but undisciplined. When you ask one to follow a multi-step procedure, it might skip steps, invent ones that weren't requested, or simply forget what it was doing partway through. To address this, developers built scaffolding that carefully broke down the task, parsed the model's output, and tried to recover when the output wasn't what was expected. The model was the engine; the scaffolding was the business logic.

LangChain, released in late 2022, became the dominant framework in this era. Rather than ask a model to handle a complex request in one shot, LangChain decomposed the task into a chain of small steps, each doing the minimum amount of work the model can handle reliably. A customer support agent, for example, might pass through four sequential LLM calls: one to classify intent, one to extract relevant fields, one to draft a response, one to adjust the tone. Each step's output was typed and validated before going to the next. It worked but was severely limited. Every category, every output format, every workflow was hardcoded by developers.

A different idea was developing in parallel. Shunyu Yao et al. proposed an alternative approach in 2022: ReAct. Instead of a developer pre-defining every step, the model itself would reason about what to do next, take an action, observe the results, and reason again. The loop has three parts: a Thought, the model's internal reasoning; an Action, a call to an external tool; an Observation, the result fed back in. The appeal was clear. A model running a ReAct loop could handle tasks the developer hadn't anticipated, recover from partial failures by reasoning about them, and use external tools to ground its answers rather than relying on training data alone. 

ReAct was not widely adopted at first because LLMs weren't capable enough to follow the pattern consistently. They struggled with following instructions and planning long-horizon tasks, which is why LangChain dominated at the time. But as model became more and more capable with the release of GPT-4 and GPT-4o, ReAct clearly pointed toward where agents were going.

**3. Native tool calling**

On June 13, 2023, OpenAI released function calling. The announcement was brief but its consequences were large. For the first time, developers could describe a set of functions to GPT-4 using JSON schema, and the model would decide when to call them, returning structured JSON arguments rather than free text. The model had been fine-tuned to recognize when a tool should be invoked and to produce output that matched the function signature reliably.

This was not a new idea. ReAct had been doing this through prompt engineering and string parsing. The difference was reliability. A prompt-based ReAct agent might follow the Thought/Action/Observation 80% of the time. A fine-tuned function-calling model followed it essentially always. The need for scaffolding shrank dramatically. Code that previously spent dozens of lines parsing model output and recovering from format errors could now be replaced with a straightforward API call and a JSON parse.

Function calling made the ReAct loop viable, but not obviously sufficient. A working loop for three tool calls doesn't mean a working loop for thirty. Two responses emerged. One doubled down on structure: LangGraph, released by the LangChain team in January 2024, replaced the linear "chain" abstraction with graphs, allowing conditional state transitions and human-in-the-loop. Developers drew the workflow and the model filled in the decisions inside each node. This is the right answer for a real but narrow set of problems: regulated pipelines where an auditor needs proof that step A ran before step B. Plenty of business processes look like this, and did long before LLMs. But it was the wrong answer for the open question: how far could a single loop go if yoou just let it run? The bet was on the growing intrinsic capabilities of base models. If the scaling law were true, the models would get better every few months and take off. Just give the model better tools and more room and see what it could do. The proving ground turned out to be code.

**4. Coding agents as the first real-world stress test (early 2025)**
- Aider, Cursor, Claude Code (3 different approaches)
- What they exposed: context management, multi-file planning, test-debug loops, failure recovery
- The proving ground for harness design
In the dark age before coding agents, a programmer would hit a tricky bug, open ChatGPT in their browser, describe the problem, maybe paste in the relevant code and error messages, read the suggestion, and copy the edit back into their IDE, run the tests, and repeat the process if they failed.

Coding is a unique proving grounds for AI agents because of the complexity and, perhaps more importantly, the variability of programming. A customer support agent can be built around a list of intents, but code has no such regularity. Every codebase has its own structure and undocumented conventions. Tasks range from "fix this one-line bug" to "refactor the whole functionality." Criteria for success aren't always specified in advance, and even when they are, the path to them requires syntactically correct output, reading across multiple files, reasoning about dependencies, and often discovering mid-task that the original plan needs revision. This stresses on every aspect of an agent's design: context management, structured output, multi-file state, long-horizon planning, and the ability the recover from partial failures. I'll go into details on three tools that emerged to tackle this challenge. They represent how things evolved in the past couple years and three distinct points on a spectrum of autonomy.

Aider sat at the minimal end. Released in 2023, it automated exactly what developers were doing by hand. Instead of manually copying file contents into ChatGPT, Aider injects them into the prompt directly. You add files to the message with an `/add` command and their full text appears in context. The model's output is a structured `SEARCH/REPALCE` block: a verbatim snippet to find and the new text to substitute in, resembling git diffs. Aider's job is to parse that block and apply it to disk. No human copy-paste. The harness is thin. Its job is to extract strings and match diffs. This also exposed the harness's main fragility: models need to match exact strings or the change would fail. You do have to manage the context manually, which means more control but less autonomy.

Cursor took a different bet. Rather than injecting full files, it used vector embeddings to retrieve relevant context automatically. The developer didn't need to specify which files mattered — the harness figured it out from the query. Edits 

**5. MCP and tool standardization (late 2024–2025)**
- The N×M integration problem
- MCP as universal connector
- Adoption by OpenAI, Google
- Tool integration becomes write-once

**6. Agent Skills as a harness primitive (late 2025–2026)**
- Modular folders of instructions, scripts, resources
- Progressive disclosure: load on demand
- Bottleneck shifts from model intelligence to knowledge organization

**7. The always-on personal agent (late 2025–2026)**
- OpenClaw: open-source, local-first, messaging-app interface
- Architectural shift: single always-on instance vs. stateless sessions
- Mainstream reach (247K stars in 60 days)
- Security concerns surfaced at scale

**8. Where complexity lives now**
- The model is increasingly commoditized
- Real design questions: protocols, knowledge organization, long-running state, evaluation
- The harness didn't disappear — it evolved

**Conclusion** *(2–3 paragraphs)*
- Recap the arc: complexity migrated from harness into model
- Practical takeaway: start thin, add scaffolding only when needed
- Forward look: the interesting problems are now systems design problems

**What I want the reader to walk away with**
The arc of the post shows complexity migrating out of the harness and into the model. Early frameworks were necessary scaffolding around unreliable models. As models improved, the best agent systems got simpler — a thin harness, good knowledge organization (Skills), and standardized tool access (MCP) beat elaborate orchestration. But the harness didn't disappear; it evolved. The interesting problems shifted from "how do I make the model work" to "how do I organize knowledge, manage long-running state, and connect to the real world." Those are systems design problems, not model problems — and they're wide open.

---
