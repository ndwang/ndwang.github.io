---
title: "SpaceCharge.jl"
summary: "A high-performance Julia package for space charge field calculation with GPU acceleration."
category: research
order: 1
image: "/images/space_charge.png"
github: "https://github.com/bmad-sim/SpaceCharge.jl"
---

## Overview

**SpaceCharge.jl** is a Julia package designed for calculating space charge fields in particle accelerators. Adapted from the Fortran package [OpenSpaceCharge](https://github.com/RobertRyne/OpenSpaceCharge) used by Bmad, this package provides researchers and accelerator physicists with powerful tools to model the complex interactions between charged particle beams and their self-generated electromagnetic fields.

## Key Features

- **Particle-In-Cell**: Fast FFT solver using Integrated Green's Functions method
- **GPU Acceleration**: Leverages modern hardware for parallel computation
- **Benchmarked Speedup**: We evaluated performance on common problem sizes and achieved 10-100x speedup on GPUs

## Easy to use

```julia
# Quick setup
using Pkg
Pkg.add(url="https://github.com/ndwang/SpaceCharge.jl.git")

using SpaceCharge
# Create a Mesh3D object with automatic bounds
mesh = Mesh3D(grid_size, particles_x, particles_y, particles_z)
# Deposit particle charges onto the grid
deposit!(mesh, particles_x, particles_y, particles_z, particles_q)
# Solve for electric field
solve!(mesh)
# Interpolate fields back to particle positions
Ex, Ey, Ez = interpolate_field(mesh, particles_x, particles_y, particles_z)
```

## Links

- **Source Code**: [GitHub Repository](https://github.com/bmad-sim/SpaceCharge.jl)
- **Examples**: [Ready-to-run demonstrations](https://github.com/bmad-sim/SpaceCharge.jl/tree/main/examples)

---
