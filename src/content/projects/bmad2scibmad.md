---
title: "Bmad to SciBmad Translator"
summary: "A web-based tool for converting Bmad lattices to SciBmad."
category: tools
order: 3
image: "/images/bmad2scibmad.png"
link: "https://bmad2scibmad.com"
---

SciBmad is a next-generation open-source accelerator physics simulation software under active development at Cornell University. As the package matures and people are starting to try it out, I developed this web service to assist colleagues in converting Bmad lattices into the new format.

This tool runs the translation program in the Bmad distribution. You can find the source code [here](https://github.com/bmad-sim/bmad-ecosystem/blob/main/util_programs/bmad_to_scibmad/bmad_to_scibmad.f90). Because the whole Bmad distribution is large (4GB) and difficult to compile locally, I have hosted it here as a cloud service for the community.

Upload your Bmad lattice file (must be `.bmad`), and your translated lattice will be ready for download shortly.

> **Warning:** SciBmad and the translation program are both under active development. Not all features in Bmad are currently supported in SciBmad, and some lattice elements or configurations may not translate perfectly. Please use the tool with caution, carefully review the output, and consult the SciBmad developers if you need support.

<div class="row justify-content-center mt-4 mb-4">
    <div class="col-sm-12">
        <!-- THE EMBEDDED TOOL -->
        <iframe 
            src="https://bmad2scibmad.com" 
            style="width:100%;height:700px;"
            title="Lattice Translation Tool"
            scrolling="no">
        </iframe>
    </div>
</div>
