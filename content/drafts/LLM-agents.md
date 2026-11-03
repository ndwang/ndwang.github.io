---
title: "A Brief History of LLM Agents"
description: "How model capabilities and agent harnesses evolved from 2022 to 2026"
date: 2026-11-01
tags: [AI, agents, LLM]
draft: true
---

<!--
Writing style reminder for future edits

1. Keep my voice casual, personal, and direct, like explaining something to a friend. Make light edits and stay close to my wording.
2. Start with a familiar experience that gives readers a reason to care. Keep intentional humor, exaggeration, contractions, and occasional exclamation marks.
3. Write for readers unfamiliar with agents, without assuming a particular professional background. Give a concrete example first, then introduce the term it illustrates.
4. Let each paragraph follow naturally from the previous one. Avoid inserting definitions just to prepare for later sections. Let the example show who does what instead of repeatedly emphasizing what the user had to do.
5. Be concise and straightforward. Use plain, descriptive language and short section titles. Include enough detail to explain the mechanism without turning it into a reference manual.
6. Avoid stock LLM phrasing and unprompted negative contrasts such as "It's not X, it's Y" or "It means X, it does not mean Y."
7. Use periods and commas instead of dashes and semicolons in prose.
8. Keep historical claims conservative and support dates with sources. Distinguish early experiments from common practice.
9. Keep diagrams visual, with short primary labels and no captions inside the diagram files. Put explanations and qualifications in the surrounding prose.
-->

By now, you have probably heard of AI agents. More and more people around me use AI to write emails, brainstorm ideas, proofread, and program.

Using an agent can feel almost like magic. You give it a task, and it starts doing things by itself in the background. And they’re getting more capable every month! How did we go from chatbots to superintelligence working through a task on its own?

In this post, I want to give a brief recap of the history of AI agents and explain how they work along the way.

## 1. When We Coded By Hand

After [ChatGPT launched](https://openai.com/index/chatgpt/) in November 2022, some developers soon figured out you could use it for programming problems. The workflow involved a lot of copying and pasting. You pasted in the code and the error message, read its suggestion, copied the changes back into your editor, and ran the program again. If it still failed, you copied the new error back to ChatGPT. Repeat until it worked, or until you gave up.

For ChatGPT to debug a program, the LLM needed to see the relevant parts. That might include the function that failed, the code that called it, the input, and the error message. All of that, together with your question and the conversation so far, formed the model’s **context**, the information it had to work with. The **context window** limited how much could fit at once, so a large program could be too much to paste in full.

[Aider](https://aider.chat/2023/05/25/ctags.html), which appeared in 2023, automated much of the copying and pasting. You added files to the conversation and described the change you wanted. Aider copied your code into the conversation, then [applied the model’s edits directly to your files](https://aider.chat/2023/07/02/benchmarks.html). You could review the changes and continue the conversation.

<iframe
  src="./LLM-agents/chatgpt-vs-aider.html"
  title="ChatGPT and Aider: who handles the files?"
  loading="lazy"
  style="width: 100%; height: 560px; border: 0;"
></iframe>

[Open the ChatGPT/Aider diagram](./LLM-agents/chatgpt-vs-aider.html)

Aider made the back-and-forth easier, and the developer continued to steer the work. But to automate more of the process, developers needed a way to get early models to follow a whole procedure reliably.

## 2. Making unreliable models useful

Suppose you wanted a chatbot to answer questions about customer orders. It needed to figure out what the customer wanted, identify the order number, look up the order, and write a reply. Early models could skip instructions, lose track of the goal, or return information in an unexpected format.

Developers broke the job into smaller steps. One request to the model classified the customer’s message. Another extracted the order number. Ordinary code looked up the order in a database, then sent the result back to the model to write the response. Each step had a narrow job and a result the program could check. This is a **chain**, a type of **workflow** where the developer defines the sequence of steps beforehand.

[LangChain](https://www.langchain.com/blog/langchain-second-birthday), released in October 2022, helped developers build these chains. Features such as [formatting instructions, checks, and retries](https://www.langchain.com/blog/going-beyond-chatbots-how-to-make-gpt-4-output-structured-data-using-langchain) helped keep things moving. If the model returned a paragraph instead of a number, the program could ask it to try again before continuing.

<iframe
  src="./LLM-agents/customer-support-chain.html"
  title="A customer support chain"
  loading="lazy"
  style="width: 100%; height: 900px; border: 0;"
></iframe>

[Open the chain diagram](./LLM-agents/customer-support-chain.html)

The chatbot also needed the right information in its context. For a question about returning an item, that meant the store’s return policy. Otherwise, the model could confidently make one up. A program could automatically search the store’s documentation for each incoming message and add relevant documents to the context before asking the model to respond. This pattern is [**retrieval augmented generation**, or **RAG**](https://www.langchain.com/blog/retrieval). Although I've never been a big fan of RAG, it is commonly used in many settings and signifies the importance of giving the model the right information.

## 3. Agent Loop

Chains work well for tasks with predefined steps. In an **agent**, the model chooses the next action based on the goal and the results so far. This lets it work out a path as it goes.

This became increasingly practical as models got better at following a goal over many steps.

[**ReAct**](https://arxiv.org/abs/2210.03629), short for reasoning and acting, is one way to build an **agent loop**. The model reasons about the next step, calls a **tool** such as a web search, and decides how to proceed based on the result.

Its advantage over chains is flexibility. Imagine asking an agent to fix a program. It runs the program, inspects the output, makes a change, and runs it again. It can keep repeating this until the bug is fixed. The exact sequence of fixes depends on what happens along the way, so it can’t be laid out beforehand as a fixed chain.

<iframe
  src="./LLM-agents/react-loop.html"
  title="The ReAct agent loop"
  loading="lazy"
  style="width: 100%; height: 760px; border: 0;"
></iframe>

[Open the agent loop diagram](./LLM-agents/react-loop.html)

Early implementations used prompts to make the model write its actions in a format the program could read. In June 2023, OpenAI introduced [**native function calling**](https://openai.com/index/function-calling-and-other-api-updates/). Models were trained to produce structured tool requests that programs could read more reliably. The program ran the requested tool and returned its result to the model. Through 2024 and 2025, models got increasingly reliable at formatting structured tool calls. By now, this is a basic capability we largely take for granted in frontier models.

Agents also got better at completing longer tasks, a trend [METR has measured](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) in software work. This helped enable wider adoption because people could hand over larger tasks with less supervision.

Let's look at one comparison that clearly demonstrates the shift from workflows to agents.

[Cursor](https://cursor.com/blog/problems-2023) was the hot AI coding tool everyone was using. After the user sent a request, its chat workflow used semantic search to find relevant code for the model’s context and a separate apply model to turn suggested changes into edits.

[Claude Code](https://www.anthropic.com/news/claude-3-7-sonnet), introduced in February 2025, showed how much of that work a general agent loop could take over. The model could search and read files, edit code through tools, and run commands to execute and test the code. It could decide how to combine these steps based on the task and what it found. As models improved, agents took over more of the work that previously needed specialized software around the model.

## 4. Tool use

To let an agent work with an application, we expose the operations it needs as tools. For example, I have been working on letting AI agents operate an accelerator. In my case, those tools might read a beam position monitor, adjust a magnet strength, or run a measurement scan.

In a basic setup, the program puts the declarations for all available tools into the model’s context. Each declaration includes a name, a description, and an input **schema**, which specifies the inputs and their types. Here is a simple declaration for reading a beam position monitor:

```json
{
  "name": "read_beam_position",
  "description": "Average beam position readings. Return x_mm, y_mm, and a timestamp.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "monitor": {"type": "string", "description": "Beam position monitor name"}
    },
    "required": ["monitor"]
  }
}
```

For “Average beam position readings from BPM03,” the model might produce this tool call:

```json
{
  "name": "read_beam_position",
  "arguments": {
    "monitor": "BPM03"
  }
}
```

The program executes the call and adds the results to the context.

[Designing good tools](https://www.anthropic.com/engineering/writing-tools-for-agents) is part engineering and part art. Their names, descriptions, inputs, and results need to make sense to the model. A beam measurement tool should specify the units and how readings are averaged. Returning a timestamp helps the agent judge whether a measurement still reflects the current machine state. You learn what works by watching agents use the tools, seeing where they get confused, and refining the interface.

This is why **benchmarks** and **agent evaluations**, or **evals**, matter. You give the agent a set of realistic tasks and measure how often it finishes them correctly, how many tool calls it needs, and how much it costs. Repeating the same tasks before and after a tool change lets you check whether the new design actually helps.

Anthropic introduced the [**Model Context Protocol**, or **MCP**](https://www.anthropic.com/news/model-context-protocol), in November 2024 to make these tool integrations reusable. An **MCP server** exposes tools and their declarations, and an agent program’s **MCP client** discovers and calls them. The same service integration can then support many different agent programs.

<iframe
  src="./LLM-agents/mcp-connections.html"
  title="Connecting tools with MCP"
  loading="lazy"
  style="width: 100%; height: 600px; border: 0;"
></iframe>

[Open the MCP diagram](./LLM-agents/mcp-connections.html)

Every tool declaration we load takes up space in the context window and adds to the input tokens we pay for, even when the tool goes unused. A [large catalog of similar tools](https://www.anthropic.com/engineering/advanced-tool-use) can also confuse the model about which one to choose. Important details can be overlooked when they sit in the middle of a long context, an effect known as [**lost in the middle**](https://arxiv.org/abs/2307.03172). As the tool list grows, choosing which definitions to load becomes part of the job.

## 5. Context Engineering

When you ask an agent to work on a project, your message is only part of what the model sees. The program also adds instructions, tool declarations, conversation history, and results from tools the agent has used. This is the context the model works with when it decides what to do next.

Everything the model reads and generates in one call has to fit within its **context window**. On long jobs, messages and tool results keep accumulating until they no longer fit. Managing this limited space is essential for the agent to keep track of the task and continue working. Here’s a typical layout:

<iframe
  src="./LLM-agents/context-window.html"
  title="What goes into a context window"
  loading="lazy"
  style="width: 100%; height: 620px; border: 0;"
></iframe>

[Open the context window diagram](./LLM-agents/context-window.html)

Models have already become *very* good at programming. What they’re missing is knowledge of your codebase, requirements, conventions, and hidden assumptions. They also need a way to remember decisions from earlier work.

As I have mentioned, models got better at using tools. This includes searching, reading, and editing files. With agent loops, agents could gather missing context before it starts working a task. An agent might read a design document, look up code documentation online, and check an example before making a change. In the RAG setup, we injected documents before each response. Now the agent could look for more information whenever needed. We don't need to manually provide all the information to the agents. We just need to make sure they are easily accessible and point agents in the right direction.

This led to **context engineering**, a term [popularized in June 2025](https://x.com/tobi/status/1935533422589399127). Tobi Lütke, the CEO of Shopify, described it as “the art of providing all the context for the task to be plausibly solvable by the LLM.” For complex tasks, the quality and completeness of that context matter more than the exact wording of the prompt.

Here are a few common practices.

[**AGENTS.md**](https://agents.md/) is a way to define global or project instructions that the agent program loads into context automatically. These can include coding conventions, how to run tests, and your preferences. Anything that you find yourself repeating to your agents. Before writing code, you and the agent should discuss the goal and settle on design decisions, and record them in **DESIGN.md**, **specs**, or **product requirements documents (PRDs)**. Those documents give the agent something concrete to work from and preserve the decisions for future tasks.

The agent can also write its own notes. It can save a decision, a failed experiment, or a todo list in a file and read it back later. This turns the filesystem into **persistent memory**. The context window holds what the model is working with now, while files keep information available for future steps and future conversations, much like computers when RAM was limited. One thing I personally enjoy is asking agents to keep an experiment logbook for everything it has tried. This gives agents records to go back to and gives me something to audit on a high-level without reading code.

For now, context engineering is an essential skill for anyone building or using agents. Their effectiveness depends heavily on whether they can find the necessary information for a task. It is a developing problem and everyone has their own setup. I suggest starting with copying other people's homework and develop your own system as you get comfortable with agents.

The same idea applies to whole organizations. Making shared knowledge and processes accessible to agents is part of building an **AI-native organization**. An [**ontology**](https://www.palantir.com/docs/foundry/ontology/overview) can help by defining important concepts and their relationships, such as teams, projects, and who is responsible for what. This gives agents a consistent way to interpret information across different systems.

As the agent works, what it needs to know keeps changing. Choosing what to load, keep, and summarize within the limited context window becomes another job for the program around the model.

## 6. The agent harness

By now, we have discussed several responsibilities of the program around the model. It prepares the context for each model call, executes tool calls, and keeps the agent loop going. This is the **agent harness**. It typically comes with its own system prompt and built-in tools, and many custom features such as sandboxing, subagents, user interface.

One of its main jobs is managing context over a long task. A command might return thousands of lines of output, while repeated tool calls fill the conversation with useless information. The harness can shorten large results and save the full output to files for the agent to inspect when needed. It can discard old tool results to save space. As the history grows, it can ask the model to summarize earlier work and continue with the summary and recent messages. This is [**context compaction**](https://earendil.com/posts/compaction-in-pi). It allows users to potentially stay in one conversation indefinitely as if the context window is unlimited.

The harness also has to manage what gets loaded in the first place. An agent might need instructions for using custom software or following a fixed procedure. Loading every procedure into every conversation would quickly fill the context and make the relevant instructions harder to find. We need a way to make all these capabilities available and only load the details when needed.

This is the idea behind [**Skills**](https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills), introduced by Anthropic in October 2025. A skill is a folder of instructions, scripts, and reference files for a particular kind of work. The harness initially loads a list of skill names and short descriptions into context. Suppose you ask the agent to fill out a Word form. It selects the document skill from this list, reads its **SKILL.md**, and follows a reference to `forms.md` for the form-filling instructions. It can also run scripts bundled with the skill. Loading information in stages as needed is called **progressive disclosure**.

<iframe
  src="./LLM-agents/progressive-disclosure.html"
  title="Progressive disclosure with Skills"
  loading="lazy"
  style="width: 100%; height: 830px; border: 0;"
></iframe>

[Open the progressive disclosure diagram](./LLM-agents/progressive-disclosure.html)

The same principle applies to the large tool declarations we discussed in section 4. The harness can let the agent search for tools and load their declarations when needed. More advanced approaches, such as [programmatic tool calling](https://www.anthropic.com/research/advanced-tool-use) and [Code Mode](https://blog.cloudflare.com/code-mode/), let the agent write code that calls tools and processes their results before returning the useful information to the model.

A larger task can also benefit from **subagents**, additional workers with their own contexts. One might investigate a failing test while another checks the documentation. Each can explore in parallel and send findings back to the main agent, keeping all the intermediate searches out of the main conversation. The harness provides the tools to start workers, track their progress, and collect the results. Coordinating the work across agents is part of **agent orchestration**.

These choices affect what the agent can accomplish. The [Harness-Bench study](https://arxiv.org/abs/2605.27922v1), published in May 2026, compared eight models across six harnesses and found substantial differences in task completion and efficiency. The model and the harness need to be evaluated together, which is why the evals we discussed earlier matter for the whole system.

## 7. Beyond the session

So far, we have mostly treated the agent as something you talk to for a task. You open a conversation, give it a job, and start another conversation for the next job. Once you have several of these sessions going, you end up tracking which one knows what and reminding the agent where you left off. Limited human attention becomes the bottleneck. I constantly find myself juggling between 3-5 sessions and have to refresh my context every time I switch between them. Turns out human has a very small context window and slow prefill.

[**OpenClaw**](https://openclaw.ai/blog/introducing-openclaw) pioneered the idea of a **long-running personal agent**. It stays available between conversations and acts like a single entity. With [**automatic memory management**](https://docs.openclaw.ai/concepts/memory), it remembers your preferences and earlier decisions as you return to it over time.

<iframe
  src="./LLM-agents/agent-continuity.html"
  title="From separate sessions to a continuing agent"
  loading="lazy"
  style="width: 100%; height: 830px; border: 0;"
></iframe>

[Open the agent continuity diagram](./LLM-agents/agent-continuity.html)

[**OpenAI dots**](https://learn.chatgpt.com/docs/dots/computers-and-apps) and [**Grok Bot**](https://x.ai/news/introducing-grok-bot) push this idea further. With OpenClaw, you keep a computer or server running for the agent. These services provide a persistent cloud computer, so work continues when your laptop is off. You can use one agent as your **single point of entry** for ongoing work. It delegates tasks to other agents, monitors their progress, and brings the results back. You can start a job, walk away, ask for progress on your phone, and return to a summary that helps you decide what to do next.

This interface can also become **multiplayer**. The interaction expands from alternating user and assistant messages into a group conversation where several people and the agent can all contribute. [**Claude Tag**](https://www.anthropic.com/news/introducing-claude-tag), introduced in June 2026, brings a shared Claude into a Slack channel. Claude uses the channel’s discussion as context, including messages between teammates. Anyone can add instructions or corrections to work another person started, and Claude posts its results back to the shared thread like a real employee.

The runtime also becomes **asynchronous**. A new message, a scheduled check, or a finished background job can prompt the agent to act while other work is still underway. [**DeepSeek’s super-agent research prototype**](https://github.com/deepseek-ai/dsh-superagent-prototype) explores this through a continuing coordinator that receives events, assigns work to separate workers, and follows up on their results. Behind the one agent you talk to, several tasks may be moving along at once.

## 8. Where complexity moved

Looking back, much of the early scaffolding existed because models were unreliable. Developers prescribed the steps, checked formats, and retried failed calls. Better models could take over more of that procedure, choosing their own actions and gathering information as they worked.

This echoes Rich Sutton’s 2019 essay [**The Bitter Lesson**](https://bitterlesson.org/). He argued that general methods that improve with more computation, especially learning and search, eventually outperform systems built around human knowledge of a particular problem. I see a similar pattern in agents: as models improve, a general loop can take over work that once needed specialized code.

That changed what developers needed to build around the model. More of the work went into making information easy to find, designing tools the agent could use correctly, and managing context over long jobs. With continuing agents, the harness also takes on memory and coordination across tasks, conversations, and people. This is where much of agent engineering happens today.

If you want to build an agent, I would start with a simple loop and a few useful tools. Watch where it gets stuck, then improve the instructions, supply missing information, or add a tool that solves the problem. Check changes against realistic tasks, and be clear about what the agent is allowed to do. Add structure when the work calls for it, and revisit those choices as models improve.

We started by copying text between ChatGPT and an editor. We are now learning to give agents ongoing responsibilities and judge their work by the results. As agents take on more of the procedure and coordination, we can spend more of our attention deciding what is worth doing and whether it has been done well.
