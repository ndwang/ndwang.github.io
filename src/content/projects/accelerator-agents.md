---
title: "AI Agents for Accelerator Operations"
summary: "Autonomous LLM agents that operate accelerator simulation and control systems — benchmarked in AcceleratorGym, deployed via the multi-lab Osprey framework."
category: research
order: 5
github: "https://github.com/ndwang/AcceleratorGym"
link: "https://als-apg.github.io/osprey"
---

## From chatbots to operators

Large language models can already answer questions about accelerator physics. The harder question is whether an agent can *do* the work: query live systems, run simulations, and execute multi-step operational workflows safely. This is my main line of agentic-AI research, spanning Cornell, Brookhaven, and a multi-lab collaboration.

## AcceleratorGym — measuring whether agents are ready

You can't deploy what you can't evaluate. **AcceleratorGym** is an agent evaluation framework that benchmarks correctness and reliability on realistic operational scenarios — agents integrate with simulation software and control systems through MCP servers, and their multi-step workflows are scored against known-good outcomes. The goal: build the evidence base to put an agent on a real accelerator at BNL.

## Osprey — agentic AI for control rooms

I contribute to **Osprey**, an LBNL-led framework developed with SLAC, Fermilab, Argonne, Jefferson Lab, and Cornell that sandboxes a coding agent inside a control-room operator interface for safe, natural-language operation of accelerator facilities. It couples an MCP tool surface and pluggable hardware connectors with an in-line safety chain — static code screening, human-approved writes, and channel whitelisting — so no machine-touching command executes without explicit operator consent.

Osprey is deployed across **seven DOE accelerator facilities** under the Genesis Mission Multi-Office Accelerator Team (MOAT) seed effort, with a status paper at IPAC 2026.

## Tech

LLM agents · MCP · Python · EPICS-style control systems · evaluation harnesses
