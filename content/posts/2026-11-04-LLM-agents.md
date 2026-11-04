---
title: "A Brief History of LLM Agents"
description: "How model capabilities and agent harnesses evolved from 2022 to 2026"
date: 2026-11-04
tags: [AI, agents, LLM]
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

By now, you have probably heard of AI agents.

Using an agent can feel almost like magic. You give it a task, and it starts doing its things in the background. And they’re getting more capable every month! How did we go from chatbots to superintelligence doing all my programming?

In this post, I want to give a brief recap of the history of AI agents and explain how they work along the way.

## 1. When we coded by hand

After [ChatGPT launched](https://openai.com/index/chatgpt/) in November 2022, some developers soon figured out you could use it for programming problems. The workflow involved a lot of copying and pasting. You pasted in your code and the error message, read its suggestion, copied the changes back into your editor, and ran the program again. If it still failed, you copied the new error back to ChatGPT. Repeat until it worked, or until you gave up.

For ChatGPT to debug a program, the LLM needs to see the relevant parts. That includes the function that fails, the code that calls it, the input, and the error message. All of that, together with your question and the conversation so far, forms the model’s **context**, the information it has to work with. The **context window** limits how much can fit at once, so a large program can be too much to paste in full.

[Aider](https://aider.chat/2023/05/25/ctags.html), which came out in 2023, automated the copying and pasting. You added files to the conversation and described the change you wanted. Aider copied your code into the conversation, then [applied the model’s edits directly to your files](https://aider.chat/2023/07/02/benchmarks.html).

<iframe
  src="/assets/blog/LLM-agents/chatgpt-vs-aider.html"
  data-autosize
  title="ChatGPT and Aider: who handles the files?"
  loading="lazy"
  style="width: 100%; height: 560px; border: 0;"
></iframe>

Aider made the back-and-forth much easier, but to automate more of the process, developers needed a way to get early models to follow a whole procedure reliably.

## 2. Making unreliable models useful

Suppose you want a chatbot to answer questions about customer orders. It needs to figure out what the customer wants, identify the order number, look up the order, and write a reply. Early models might skip instructions, lose track of the goal, or return information in an unexpected format.

Developers broke the job into smaller steps. One request to the model classifies the customer’s message. Another extracts the order number. Regular code looks up the order in a database, then sends the result to the model to write a response. Each step has a narrow job and a result the program can check. This is a **chain**, a type of **workflow** where the developer defines the sequence of steps beforehand.

[LangChain](https://www.langchain.com/blog/langchain-second-birthday), released in October 2022, helped developers build these chains. Features such as [formatting instructions, checks, and retries](https://www.langchain.com/blog/going-beyond-chatbots-how-to-make-gpt-4-output-structured-data-using-langchain) help keep things moving. If the model returns a paragraph instead of a number, the program can ask it to try again before continuing.

<iframe
  src="/assets/blog/LLM-agents/customer-support-chain.html"
  data-autosize
  title="A customer support chain"
  loading="lazy"
  style="width: 100%; height: 900px; border: 0;"
></iframe>

The chatbot also needs the right information in its context. For a question about returning an item, that means the store’s return policy. Otherwise, the model can confidently make one up. A program can automatically search the store’s documentation for each incoming message and add relevant documents to the context before asking the model to respond. This pattern is [**retrieval augmented generation**, or **RAG**](https://www.langchain.com/blog/retrieval). RAG is commonly used in many industry settings and signifies the importance of giving the model the right information, although [it is less preferred in newer agent architectures](https://arxiv.org/abs/2610.41172).

## 3. Agent loop

Workflows work well for tasks with predefined steps, but it couldn't handle flexible open problems such as programming. This led to another paradigm of using LLMs: agents.

In an **agent**, the model chooses the next action based on the goal and the results so far. This lets it work out a path as it goes. This approach got increasingly practical as models got better at following a goal over many steps, and became [production-ready](https://www.anthropic.com/research/building-effective-agents) towards the end of 2024.

[**ReAct**](https://arxiv.org/abs/2210.03629), short for reasoning and acting, is one way to build an **agent loop**. The model reasons about the next step, calls a **tool** such as a web search, and decides how to proceed based on the result.

Its advantage over workflows is flexibility. Imagine asking an agent to debug a program. It runs the program, inspects the output, makes a change, and runs it again. It can keep repeating this until the bug is fixed. The exact sequence of actions depends on what happens along the way, so it can’t be laid out beforehand as a fixed chain.

<iframe
  src="/assets/blog/LLM-agents/react-loop.html"
  data-autosize
  title="The ReAct agent loop"
  loading="lazy"
  style="width: 100%; height: 760px; border: 0;"
></iframe>

Each trip around this loop sends the conversation so far back to the model, with new tool results added at the end. Much of that context stays the same between calls. **Prefix caching** lets the model provider reuse computation for that unchanged beginning, making repeated calls faster and cheaper. In general, we want to keep the prefix as stable as possible for better cache hit rate.

Early implementations used prompts to make the model write its actions in a format the program could read. In June 2023, OpenAI introduced [**native function calling**](https://openai.com/index/function-calling-and-other-api-updates/). Models were trained to produce structured tool requests that programs could read more reliably. The program executes the requested tool and returns its result to the model. Through 2024 and 2025, models got increasingly reliable at formatting structured tool calls. By now, this is a basic capability we largely take for granted in frontier models.

Agents also got better at completing longer tasks, a trend [METR has measured](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) in software work. This helped enable wider adoption because people could hand over more complicated tasks with less supervision.

Let's look at one comparison that clearly demonstrates the shift from workflows to agents.

[Cursor](https://cursor.com/blog/problems-2023) was the hot AI coding tool everyone jumped on 2024. It added a chat side panel in VS Code where the user can send a request, its chat workflow would use semantic search to find relevant code for the model’s context and a separate apply model to turn suggested changes into edits.

[Claude Code](https://www.anthropic.com/news/claude-3-7-sonnet), introduced in February 2025, showed how much of that work a general agent loop could take over. The model could search and read files, edit code, and run commands all through tool calls. It could decide how to combine these steps based on the task and what it found. As models improved, agents took over more of the work that previously needed specialized software around the model.

## 4. Tool use

To let an agent work with an application, we expose the operations it needs as tools. For an agent playing poker, those tools might check its hand, place a bet, or fold.

In a basic setup, the program puts the declarations for all available tools into the model’s context. Each declaration includes a name, a description, and an input **schema**, which specifies the inputs and their types. Here is a simple declaration for placing a bet:

```json
{
  "name": "place_bet",
  "description": "Bet additional chips on your turn. Return the updated pot and your remaining chips.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "amount": {"type": "integer", "description": "Number of additional chips to bet"}
    },
    "required": ["amount"]
  }
}
```

For “Bet 20 chips,” the model might produce this tool call:

```json
{
  "name": "place_bet",
  "arguments": {
    "amount": 20
  }
}
```

The program executes the call and adds the results to the context.

[Designing good tools](https://www.anthropic.com/engineering/writing-tools-for-agents) is part engineering and part art. Their names, descriptions, inputs, and results need to make sense to the model. A betting tool should specify whether the amount means 20 additional chips or 20 chips in total. Returning the updated pot and remaining chips helps the agent keep track of the game. You learn what works by watching agents use the tools, seeing where they get confused, and iterate.

This is why **benchmarks** and **agent evaluations**, or **evals**, are so important. You give the agent a set of realistic tasks and measure how often it completes them correctly, how many tool calls it needs, and how much it costs. Repeating the same tasks before and after a tool change lets you check whether the new design actually helps.

Anthropic introduced the [**Model Context Protocol**, or **MCP**](https://www.anthropic.com/news/model-context-protocol), in November 2024 to make these tool integrations reusable. An **MCP server** exposes tools and their declarations, and an agent program’s **MCP client** discovers and calls them. The same service integration can then support many different agent programs.

<iframe
  src="/assets/blog/LLM-agents/mcp-connections.html"
  data-autosize
  title="Connecting tools with MCP"
  loading="lazy"
  style="width: 100%; height: 600px; border: 0;"
></iframe>

Every tool declaration we load takes up space in the context window and adds to the input tokens we pay for, even when the tool goes unused. A [large catalog of similar tools](https://www.anthropic.com/engineering/advanced-tool-use) can also confuse the model about which one to choose. Important details can be overlooked when they sit in the middle of a long context, an effect known as [**lost in the middle**](https://arxiv.org/abs/2307.03172). As the tool list grows, choosing which definitions to load becomes part of the job.

## 5. Context engineering

As an agent works, instructions, tool declarations, messages, and tool results all compete for space in its context window. On long jobs, these keep accumulating. Choosing which information to include becomes essential. Here’s a typical layout:

<iframe
  src="/assets/blog/LLM-agents/context-window.html"
  data-autosize
  title="What goes into a context window"
  loading="lazy"
  style="width: 100%; height: 620px; border: 0;"
></iframe>

Models have already become *very* good at programming. What they’re missing is knowledge of your codebase, requirements, conventions, and hidden assumptions. They also need a way to remember decisions from earlier work.

As I have mentioned, models got better at using tools. This includes searching, reading, and editing files. With agent loops, agents can gather missing context before they start working on a task. An agent might read a design document, look up code documentation online, and check an example before making a change. In the RAG setup, we inject documents before each response. Now the agent can look for more information whenever needed. We don't need to manually provide all the information to the agents. We just need to make sure the information is easily accessible and point agents in the right direction.

This led to **context engineering**, a term [popularized in June 2025](https://x.com/tobi/status/1935533422589399127). Tobi Lütke, the CEO of Shopify, described it as “the art of providing all the context for the task to be plausibly solvable by the LLM.” For complex tasks, the quality and completeness of that context matter more than the exact wording of the prompt.

Here are a few common practices.

[**AGENTS.md**](https://agents.md/) is a way to define global or project instructions that the agent program loads into context automatically. These can include coding conventions, how to run tests, and your preferences. Anything that you find yourself repeating to your agents.

Before writing code, you and the agent should discuss the goal and settle on design decisions, and record them in **DESIGN.md**, **specs**, or **product requirements documents (PRDs)**. Those documents give the agent something concrete to work from and preserve the decisions for future tasks.

The agent can also write its own notes. It can save a decision, a failed experiment, or a todo list in a file and read it back later. This turns the filesystem into **persistent memory**. The context window holds what the model is working with now, while files keep information available for future steps and future conversations, much like keeping files on disk when RAM is limited.

One system I use frequently is asking agents to keep an experiment logbook for everything they have tried. This gives agents records to go back to and gives me something to audit at a high-level without reading code.

Context engineering is an essential skill for anyone building or using agents. The effectiveness of agents depends heavily on whether they can find the necessary information for a task. It is a developing problem and everyone has their own setup. I suggest copying other people's homework, then developing your own system as you get more comfortable.

The same idea applies to whole organizations. Making shared knowledge and processes accessible to agents is part of building an **AI-native organization**. An [**ontology**](https://www.palantir.com/docs/foundry/ontology/overview) can help by defining important concepts and their relationships, such as teams, projects, and who is responsible for what. This gives agents a consistent way to interpret information across different systems.

As the agent works, what it needs to know keeps changing. Choosing what to load, keep, and summarize within the limited context window becomes another job for the program around the model.

## 6. The agent harness

By now, we have discussed several responsibilities of the program around the model. It prepares the context for each model call, executes tool calls, and keeps the agent loop going. This is the **agent harness**. It typically comes with its own system prompt and built-in tools, and features such as sandboxing, subagents, and a user interface.

One of its main jobs is managing context over a long task. A command might return thousands of lines of output, while repeated tool calls fill the conversation with useless information. The harness can shorten large results and save the full output to files for the agent to inspect when needed. It can discard old tool results as they go stale.

As the history grows, the harness can ask the model to summarize earlier work and continue with the summary and recent messages. This is [**context compaction**](https://earendil.com/posts/compaction-in-pi). It lets users stay in one conversation for longer as if the context window is unlimited.

The harness also has to manage what gets loaded in the first place. An agent might need instructions for using custom software or following a fixed procedure. Loading every procedure into every conversation would quickly fill the context and make the relevant instructions harder to find. We need a way to make all these capabilities available and only load the details when needed.

This idea is called **progressive disclosure**, the motivation behind [**Skills**](https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills), introduced by Anthropic in October 2025. A skill is a folder of instructions, scripts, and reference files for a particular kind of work. The harness initially loads a list of skill names and short descriptions into context. Suppose you ask the agent to fill out a Word form. It selects the document skill from this list, reads its **SKILL.md**, and follows a reference to `forms.md` for the form-filling instructions. It can also run scripts bundled with the skill.

<iframe
  src="/assets/blog/LLM-agents/progressive-disclosure.html"
  data-autosize
  title="Progressive disclosure with Skills"
  loading="lazy"
  style="width: 100%; height: 830px; border: 0;"
></iframe>

The same principle applies to the large tool declarations we discussed in section 4. The harness can let the agent search for tools and load their declarations when needed. More advanced approaches, such as [programmatic tool calling](https://www.anthropic.com/research/advanced-tool-use) and [Code Mode](https://blog.cloudflare.com/code-mode/), let the agent write code that calls tools and processes their results before returning the useful information to the model.

A larger task can also benefit from **subagents**, additional workers with their own contexts. One might investigate a failing test while another checks the documentation. Each can explore in parallel and send findings back to the main agent, keeping all the intermediate searches out of the main conversation. The harness provides the tools to start workers, track their progress, and collect the results. Coordinating the work across agents is part of **agent orchestration**.

These choices affect what the agent can accomplish. The [Harness-Bench study](https://arxiv.org/abs/2605.27922v1) compared eight models across six harnesses and found substantial differences in task completion and efficiency. It found that the model and the harness need to be evaluated together, which is why the evals we discussed earlier matter for the whole system.

## 7. Beyond the session

So far, we have mostly treated the agent as something you spin up every time you have a task. You open a conversation, give it a job, and start another conversation for the next job. Once you have several of these sessions going, you end up tracking which one knows what and reminding the agent where you left off. Limited human attention becomes the bottleneck (attention is all you need, after all). I constantly find myself juggling 3-5 sessions and have to refresh my context every time I switch between them. Turns out humans have a very small context window and slow prefill.

[**OpenClaw**](https://openclaw.ai/blog/introducing-openclaw) pioneered the idea of a **long-running personal agent**. It stays available between conversations and acts like a single entity. With [**automatic memory management**](https://docs.openclaw.ai/concepts/memory), it remembers your preferences and earlier decisions as you return to it over time.

<iframe
  src="/assets/blog/LLM-agents/agent-continuity.html"
  data-autosize
  title="From separate sessions to a continuing agent"
  loading="lazy"
  style="width: 100%; height: 830px; border: 0;"
></iframe>

[**OpenAI dots**](https://learn.chatgpt.com/docs/dots/computers-and-apps) and [**Grok Bot**](https://x.ai/news/introducing-grok-bot) push this idea further. With OpenClaw, you keep a computer or server running for the agent. These newer services provide a persistent cloud computer, so work continues when your laptop is off. You can use one agent as your **single point of entry** for ongoing work. It delegates tasks to other agents, monitors their progress, and brings the results back. You can start a job, walk away, ask for progress on your phone, and return to a summary that helps you decide what to do next.

This interface can also become **multiplayer**. The interaction expands from alternating user and assistant messages into a group conversation where several people and the agent can all contribute. [**Claude Tag**](https://www.anthropic.com/news/introducing-claude-tag), introduced in June 2026, brings a shared Claude into a Slack channel. Claude uses the channel’s discussion as context, including messages between teammates. Anyone can add instructions or corrections to work another person started, and Claude posts its results back to the shared thread like a real employee.

The runtime also becomes **asynchronous**. A new message, a scheduled check, or a finished background job can trigger the agent while other work is still underway. [**DeepSeek’s super-agent research prototype**](https://github.com/deepseek-ai/dsh-superagent-prototype) explores this through a continuing coordinator that receives events, assigns work to separate workers, and follows up on their results.

All these new trends are happening in the industry right now and they seem to converge. I'm certainly excited to see how agent architectures continue to evolve in the future!

## 8. Where complexity moved

Looking back, much of the early scaffolding existed because models were unreliable. Developers had to handhold models through a complex task. As models improved, they proved capable of working through long-horizon tasks and making consistent decisions towards a goal. More of the work went into making information easy to find and designing tools the agent could use correctly. This is where much of agent engineering happens today.

If you want to learn more about agent engineering, I would strongly recommend writing a harness yourself. I know I learned a tremendous amount this way. Start with a simple loop and a few tools. Play around and watch where it gets stuck. Look at Codex, pi, OpenCode, or the leaked Claude Code source code!

Thanks for reading this. I hope this blog post helped explain the basic concepts of agent engineering!
