---
title: "Latent-Space Beam Dynamics"
summary: "A VAE + causal transformer that learns to propagate full 6D beam distributions through arbitrary lattices — fast enough for online control."
category: research
order: 4
github: "https://github.com/ndwang/beam_vae"
---

## The idea

Tracking a realistic particle beam through an accelerator means pushing hundreds of thousands of macro-particles through every magnet, cavity, and drift — accurate, but far too slow for online optimization or control. This project asks: what if a neural network could learn the *dynamics itself*, operating on a compressed representation of the whole beam?

The framework has two parts:

- A **variational autoencoder** encodes the 15 pairwise 2D projections of the 6D phase-space distribution into a single 256-dimensional latent vector. Reconstruction quality is high enough to trust: beam sizes and centroids come back with **R² ≥ 0.9995** across all six coordinates.
- A **GPT-style causal transformer** (TrackingTransformer) propagates that latent state element-by-element through the lattice. Each lattice element is explicitly tokenized, so the model is **lattice-agnostic by construction** — it predicts through arbitrary element sequences without retraining, rather than being tied to one fixed machine.

## Why it matters

End-to-end inference — VAE encode, autoregressive rollout through a 32-element FODO-style sequence, VAE decode — takes **≈67 ms per trajectory on a single GPU**. That puts full-distribution beam prediction in the real-time-capable regime for online control, where conventional tracking takes minutes to hours.

First-author paper at IPAC 2026: *"Learning beam dynamics in the latent space of beam distributions."*

## Tech

PyTorch · VAE · causal transformer · Bmad · CUDA
