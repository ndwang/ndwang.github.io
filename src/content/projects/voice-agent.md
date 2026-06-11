---
title: "Real-Time Voice Agent"
summary: "A microservices voice-AI framework hitting <2s end-to-end latency with open-source models running entirely on consumer hardware."
category: tools
order: 6
github: "https://github.com/ndwang/voice_agent"
---

## Talking to a machine should feel like talking

Most voice assistants feel like walkie-talkies: you speak, you wait, it speaks. This project is a ground-up framework for natural, interruptible voice conversation with an LLM — running **entirely locally on consumer hardware** with open-source models, at **under 2 seconds end-to-end latency**.

## How it gets fast

- **Director–Speaker orchestration** — a reasoning process and a speech-synthesis process run concurrently, so the agent starts talking while it's still thinking, minimizing perceived latency.
- **Asynchronous event-driven core** — ASR, LLM, and TTS run as concurrent streaming pipelines over an asyncio/WebSockets backbone, instead of a sequential pipeline.
- **Interrupt handling** — voice-activity detection lets you cut the agent off mid-sentence and it adapts, enabling non-linear, genuinely conversational exchanges.

## Tech

Python · FastAPI · asyncio · WebSockets · VAD · Whisper ASR · streaming TTS · local LLMs
