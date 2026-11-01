---
title: "A Brief History of LLM Agents"
description: "How model capabilities and agent harnesses evolved from 2022 to 2026"
date: 2026-11-01
tags: [AI, agents, LLM]
draft: true
---

## Working thesis

As models became better at following instructions and using tools, developers could delegate more decisions to them—including decisions about what information to retrieve. The surrounding software increasingly focused on organizing knowledge, connecting capabilities, and maintaining continuity across tasks.

Write for readers unfamiliar with agents. Explain each problem before naming the mechanism. Use general examples and brief product histories. Target roughly 2,000–2,400 words. Approaches overlap historically; use dates as anchors rather than presenting complete replacements.

Diagrams show mechanisms with short labels. Dates, qualifications, and explanations belong in the article or captions, not inside the graphics.

## 1. The human runs the loop

**Main message:** People initially used models as assistants while supplying the coordination themselves.

- Open with the ChatGPT workflow: describe a problem, paste relevant material, read the suggestion, apply it, check the result, and return with another message. Anchor ChatGPT's launch in November 2022.
- Introduce early Aider in 2023 as an intermediate step. It read files and applied edits, removing much of the copying and pasting. In this interactive workflow, the developer still largely directed the task. Do not reduce all of Aider's capabilities to this interaction style.
- Define the parts briefly: the **model** generates output from its current input; **tools** perform operations such as reading a file or running a command; the **harness** supplies input, executes requested operations, and returns results. The **context window** is the bounded amount of information available to the model at a particular moment.
- Distinguish automating the mechanics of an action from delegating the decision about what happens next.

**Figure:** [ChatGPT and Aider](./LLM-agents/aider.html), after the Aider paragraph. Compare the same person, model, and files; show how Aider removes manual handoffs. No code listing or reliability comparison.

**Transition:** Developers could automate more of the surrounding procedure, but early models needed considerable help.

## 2. Making unreliable models useful

**Main message:** Developers made early models useful by prescribing workflows, constraining individual steps, and supplying relevant information.

- Explain skipped instructions, inconsistent formats, invented steps, and poor recovery. Developers responded with decomposition, parsing, validation, retries, and explicit control flow.
- Use **LangChain chains** as the representative developer-defined workflow: classify a request, extract information, generate a response, and validate it. The application determines the sequence. LangChain also supported agents; the contrast concerns the workflow pattern, not an exclusive property of the framework.
- Introduce **RAG** through an early customer-service application: customer question → retrieve relevant documentation → inject passages into the prompt → generate an answer. In this example, retrieval runs automatically before each response; the model does not decide whether to invoke a search tool.
- The application controls both the procedure and the supplied context. RAG addresses missing information as well as supporting useful responses; it is not merely a workaround for weak instruction following.

**Figure:** [Who chooses the next step?](./LLM-agents/langchain-vs-react.html), at the transition into section 3. Show a prescribed sequence and a model-directed loop solving the same task with the same information sources. Avoid comparing a framework with a pattern or presenting autonomy as fewer model calls.

**Transition:** Could the model take responsibility for choosing those steps?

## 3. Letting models decide

**Main message:** Improving model capabilities made it increasingly practical to delegate the procedure to the model.

- Introduce **tool use**: the model requests an action, software executes it, and the result returns in a subsequent model input.
- Explain **ReAct** (October 2022) as incremental decision-making: reason about the situation, take an action, observe the result, and decide again. Its original prompted form used an explicit generated reasoning trace. The model does not need to plan the entire task correctly in advance.
- Describe prompted action formats and text parsing, followed by **native function calling** (OpenAI, June 2023), supported by model training and a structured API. Improved format reliability does not guarantee correct decisions or successful execution.
- Preserve the long-horizon question: “A working loop for three tool calls doesn't mean a working loop for thirty.” Discuss changing plans, partial failures, and recovery. Explicit workflows and checkpoints remain useful alongside model-selected actions; LangGraph can be a brief example.
- Use **coding agents** as the concrete demonstration: inspect files, edit code, run tests, and respond to failures. Mention Cursor and Claude Code selectively; Claude Code's research preview in February 2025 is a useful date. Avoid separate product histories.
- Context gathering also becomes a delegated decision: identify missing information, search files, inspect results, and follow references.

**Figure:** [One agent loop](./LLM-agents/tool-calling-loop.html), after explaining tool use and native calling. Prompted and native views share the model–harness–tool loop; only the action representation changes. Include an answer/stop exit.

**Optional companion:** [ReAct](./LLM-agents/react-loop.html) provides the original conceptual view. Use it as an alternative to the prompted view, not a second full walkthrough.

**Transition:** Greater autonomy makes useful tools and well-organized information increasingly important.

## 4. Connecting tools

**Main message:** Agents need access to many systems, and those connections should be reusable.

- Explain the many-applications-by-many-services integration problem before introducing a standard. Custom adapters can multiply as the ecosystem grows.
- Introduce **MCP** (November 2024): a common protocol implemented by clients and servers that expose tools and data.
- Distinguish the layers: tool calling expresses the model's requested action; MCP standardizes connections to systems providing capabilities and information.
- Mention adoption across major providers, including OpenAI and Google, in one sentence with dated primary sources.
- Describe reuse without promising that authentication, configuration, or service-specific behavior disappears.

**Figure:** [Connecting tools](./LLM-agents/mcp-diagram.html), after introducing the integration problem. Compare custom adapters with reusable MCP client/server implementations. MCP is a shared protocol, not a central service; adapter reuse is distinct from the number of live connections.

## 5. Knowledge on demand

**Main message:** Useful knowledge extends beyond the current context window; the system must make it discoverable, relevant, and maintainable.

- Recall the automatic RAG pipeline briefly. As models became more reliable at using file and search tools, agents could increasingly gather context during a task. In file-based workflows, retrieval decisions can move from the application into the model. Automatic retrieval and model-directed searches can coexist.
- Introduce persistent documents: **AGENTS.md** for working instructions, **DESIGN.md** for design decisions, and **specs and product requirements documents (PRDs)** for intended behavior. These reduce repeated explanations; the documents serve different roles rather than constituting interchangeable standards.
- As available material grows, selecting what enters context becomes an engineering problem. Name **context engineering** after explaining that need.
- Explain **progressive disclosure**: supply enough information to identify relevant resources, load detailed instructions when needed, and consult supporting material selectively.
- Introduce **Skills** (October 2025): reusable instructions, scripts, and resources. Show metadata → instructions → selected resources. Catalogs still occupy context; loading a new skill does not automatically erase earlier context.
- Extend the filesystem from supplied documentation to **persistent memory**. The agent can record decisions, discoveries, preferences, and unfinished work, then retrieve and update them later.

**Figure:** [Who selects the context?](./LLM-agents/context-retrieval.html), near the opening RAG callback. Contrast automatic retrieval before a response with model-directed searches during work.

**Figure:** [Knowledge on demand](./LLM-agents/skills-context.html), after introducing Skills. Show a catalog, selection of a skill, and loading one supporting resource; unused material remains outside active context.

**Transition:** Files can outlive a conversation. What happens when the agent's working relationship with the user does too?

## 6. Beyond the session

**Main message:** A continuing agent identity carries knowledge and responsibilities across tasks, conversations, and periods of inactivity.

- Start with fragmented context, repeated explanations, and the user coordinating unfinished work across sessions.
- Use **OpenClaw** to bring together filesystem memory, continuity across sessions, and one central point of contact reachable through several channels. Its role here is the combination and interaction model, not the invention of persistence or recovery.
- Explain **automatic memory management**: record useful information, retrieve it when relevant, and update it as circumstances change. Continuing identity does not require one uninterrupted model invocation.
- Briefly cover newer developments: **OpenAI dots** and **Grok Bot** as continuing personal agents; **Claude Tag** (June 2026) as shared interaction among people; **DeepSeek's super-agent research prototype** as a continuing coordinator for workers and events. Keep memory implementations distinct and date the examples when drafting.
- One user-facing identity can coordinate several internal sessions or workers. Multiplayer adds multiple people interacting with that identity and appropriately scoped shared context.
- Give asynchronous operation one short paragraph: work can arrive through messages, scheduled wake-ups, or completed background jobs while other tasks remain underway. Leave queues and concurrency mechanics for another article.

**Figure:** [Beyond the session](./LLM-agents/beyond-the-session.html), after the OpenClaw explanation. Compare separate task sessions with a continuing point of contact and memory outside individual task contexts. No product logos or feature lists.

## 7. Where complexity moved

**Main message:** Better models changed what developers needed to build around them.

- Recap: people coordinated responses; applications prescribed workflows and context; models took over decisions about actions and information gathering; surrounding systems supplied reusable capabilities, organized knowledge, and continuity.
- Bring together **greater delegation within tasks** and **greater continuity across tasks**.
- Mention checking results and defining what the agent may do in a sentence or two. Evaluation and security remain supporting considerations.
- Close with the practical principle: begin with a simple agent loop, observe where it fails, and add the structure those failures justify. A simple decision loop can sit inside substantial infrastructure.

**Figure:** None. Refer back to earlier figures.

## Source anchors for drafting

- [ReAct paper](https://arxiv.org/abs/2210.03629)
- [LangChain's early tool support](https://www.langchain.com/blog/structured-tools)
- [Original RAG paper](https://arxiv.org/abs/2005.11401)
- [Function calling, June 2023](https://openai.com/index/function-calling-and-other-api-updates/)
- [Structured Outputs, August 2024](https://openai.com/index/introducing-structured-outputs-in-the-api/)
- [Aider's repository map](https://aider.chat/2023/10/22/repomap.html)
- [Claude Code research preview](https://www.anthropic.com/news/claude-3-7-sonnet)
- [MCP introduction](https://www.anthropic.com/news/model-context-protocol) and [architecture](https://modelcontextprotocol.io/docs/learn/architecture)
- [AGENTS.md](https://agents.md/)
- [Agent Skills introduction](https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills)
- [OpenClaw memory](https://docs.openclaw.ai/concepts/memory) and [main session](https://docs.openclaw.ai/concepts/main-session)
- [Dots: tasks and memory](https://learn.chatgpt.com/docs/dots/tasks-and-memory)
- [Grok Bot](https://prod.cursor.com/docs/grok-bot)
- [Claude Tag](https://www.anthropic.com/news/introducing-claude-tag)
- [DeepSeek super-agent prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)
