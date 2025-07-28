---
layout: page
title: "Bmad-bot joins the battle!"
img: assets/img/Bmad-bot-red.png
category: AI
related_publications: false
description: "An AI-powered chatbot that answers your question about Bmad and Tao."
importance: 1
---

## The Challenge

You're in the middle of designing an accelerator lattice, trying to figure out why your simulation isn't behaving as expected. The Bmad Reference Manual sits open on your screen - all 600+ pages of it. You know the answer is in there somewhere, but finding it means wading through dense technical documentation while your simulation runs in the background.

Sound familiar?

This is a common challenge for anyone working with **Bmad**, the powerful software ecosystem for accelerator simulation developed at Cornell University. Since the mid 1990s, Bmad has been the go-to tool for beam dynamics, lattice design, and particle tracking. The Bmad Reference Manual contains nearly every piece of information you need - from basic element definitions to advanced optimization techniques. But with over 600 pages of dense technical content, finding the right information when you need it can slow down your workflow significantly.

Enter Bmad Bot - an AI assistant that makes the manual accessible through natural conversation.

## Meet Bmad Bot 🤖

{% include figure.liquid loading="eager" path="assets/img/Bmad-bot-red.png" title="" class="rounded z-depth-1" width="300" max-width="600px" %}

Bmad bot is an intelligent assistant that can provide instant access to Bmad and Tao manual through advanced AI-powered workflow. 

Imagine having a knowledgeable colleague who's read every page of Bmad manual and can answer any question you have about particle accelerator physics. That's exactly what Bmad bot is trying to do. It's an AI assistant that lives in your Slack workspace and helps you navigate complex technical documentation through simple conversations. Instead of digging through hundreds of pages of Bmad manual, you can simply ask it questions in plain English:

- **What attributes does a quadrupole have?**
- **How do I set up a lattice file?**
- **What commands are available for plotting in Tao?**

When you ask a question, Bmad bot will automatically search for relevant information from the manuals and provide detailed answers with source citations, so you can always verify the information and dive deeper into the manual when needed.

## Getting Started

Ready to try Bmad Bot for yourself? It's currently available on **Slack** and **Matrix**, and using it is as simple as having a conversation:

1. **Mention the bot** in any Slack channel or Matrix room: `@Bmad-bot how do I track particles?`
2. **Send a direct message** to get private help
3. **Use commands** to check on bot stats

## Current Limitations

As Bmad Bot is just getting started, there are some important limitations to keep in mind:

### Scope
- **Bmad and Tao only**: The bot is specifically trained on Bmad and Tao documentation. It won't answer general accelerator physics questions or questions about other simulation tools.
- **Manual content only**: It can only answer questions about what's documented in the Bmad Reference Manual and Tao documentation, so it cannot help you write a lattice.

### Current Performance
Since this is a new project, the bot is still learning and improving:

- **May miss information**: Sometimes the bot might not find the right information, even if it exists in the manual
- **Try rephrasing**: If you don't get a helpful answer, try asking your question in a different way
- **Check citations**: Always verify the information using the provided source citations

### What to Expect
- The bot works best with specific, concrete questions
- It's most effective for finding element definitions, parameter descriptions, and command syntax
- **No multi-turn conversations yet**: Each question is treated independently, so the bot won't remember context from previous questions in the same conversation

## Help Us Improve

The Bmad Bot includes a built-in feedback mechanism to continuously improve its responses. Here's how it works:

After the bot provides an answer, it automatically reacts to its own message with two emoji options:

- ✅ for helpful answers
- ❌ for answers that need improvement

### Why I Collect Feedback

Your feedback is incredibly valuable because it helps us:

- Identify high-quality answers that users find helpful
- Understand common pain points in the documentation
- Spot problematic responses and coverage gaps
- Train the system to provide better answers in the future

Bmad bot will continue to improve to provide real productivity for Bmad users of all experience levels. Each piece of feedback contributes to making the Bmad Bot more accurate, helpful, and valuable for the entire community. 

So next time you use the bot, please consider reacting to the answer. Your feedback, no matter how small, helps make the bot better for everyone who uses it.

## Privacy and Data Usage

Here's what you should know about how your interactions with the Bmad bot are handled:

### What We Collect and How We Use It

#### Question/Answer Pairs for Improvement

- We collect anonymized question/answer pairs to improve the bot's performance
- All personal information (user names) is removed before storage
- This data helps us understand common questions and pain points

#### Answer Feedbacks

- Your feedback is collected anonymously (no user information is stored)
- This helps us understand answer quality to deliver targeted improvements

### Third-Party Considerations

Bmad bot currently uses Google's Gemini models:

- Your questions are subject to [Google's privacy policy and terms of service](https://ai.google.dev/gemini-api/terms)
- Google may use this data for AI model training and improvement
- I recommend reviewing Google's privacy practices if you have concerns

### Your Control Over Data

- Currently there's no option to opt-out. If you ask Bmad bot questions, you agree to data collection mentioned above
- Currently there's no option to request deletion of any stored data, because I do not store user information so there's literally no way to tell which ones are yours.

## Ready to Try?

Bmad bot is ready to help you navigate the complex world of Bmad and Tao documentation. Whether you're a beginner learning Bmad or an experienced user looking for quick answers, Bmad bot is here to make your workflow more efficient.

Ready to accelerate your Bmad workflow? Try it on Matrix today!