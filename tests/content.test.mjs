import test from "node:test";
import assert from "node:assert/strict";
import { getPosts, getProjects, getPapers, formatDate, resume } from "../src/lib/content.js";

test("existing posts keep exact Jekyll URLs and frontmatter dates", async () => {
  const posts = await getPosts();
  assert.equal(posts.length, 2);
  assert.deepEqual(
    posts.map((post) => post.url),
    ["/blog/2026/claude-plays-slay-the-spire/", "/blog/2025/AI_space_charge/"]
  );
  assert.equal(formatDate(posts[1].date), "July 30, 2025");
  assert.ok(posts.every((post) => post.headings.length > 0 && post.minutes > 0));
});

test("posts retain video embeds, expandable code, and benchmark tables", async () => {
  const [gaming, physics] = await getPosts();
  for (const name of ["osty", "sandworm", "reward"]) {
    assert.ok(gaming.html.includes(`src="/assets/video/${name}.mp4"`));
  }
  assert.equal((gaming.html.match(/<video /g) || []).length, 3);
  assert.ok(gaming.html.includes('class="block-warning"'));
  assert.equal((physics.html.match(/<details>/g) || []).length, 2);
  assert.ok(physics.html.includes("<table>"));
  assert.ok(physics.html.includes("<pre "));
  assert.ok(physics.html.includes("Fortran vs Julia Translation Example"));
  assert.ok(!physics.html.includes("{%"));
});

test("projects retain URLs, image, embedded translator, and privacy anchor", async () => {
  const projects = await getProjects();
  assert.equal(projects.length, 3);
  assert.deepEqual(projects.map((project) => project.url).sort(), ["/projects/Bmad-bot/", "/projects/Bmad2Scibmad/", "/projects/spacecharge.jl/"]);
  const bot = projects.find((project) => project.slug === "Bmad-bot");
  const translator = projects.find((project) => project.slug === "Bmad2Scibmad");
  assert.ok(bot.html.includes('src="/assets/img/Bmad-bot-red.png"'));
  assert.ok(bot.html.includes('id="privacy"'));
  assert.ok(bot.headings.some((heading) => heading.slug === "privacy"));
  assert.ok(translator.html.includes('src="https://bmad2scibmad.com"'));
  assert.ok(translator.html.includes('class="block-warning"'));
  assert.ok(!translator.html.includes("{:"));
});

test("all bibliography records preserve fields and complete citation text", () => {
  const papers = getPapers();
  assert.equal(papers.length, 16);
  assert.equal(new Set(papers.map((paper) => paper.id)).size, 16);
  const dois = papers.filter((paper) => paper.doi).map((paper) => paper.doi.toLowerCase());
  assert.equal(new Set(dois).size, dois.length);
  assert.equal(papers.filter((paper) => paper.author.startsWith("Wang, Ningdong and ")).length, 6);
  assert.ok(papers.every((paper) => paper.url && paper.author.includes("Wang, Ningdong")));
  assert.ok(!papers.some((paper) => /\band others\b/.test(paper.author)));
  assert.equal(papers.filter((paper) => paper.selected).length, 3);
  const paper = papers.find((item) => item.id === "wang:napac2025-tup069");
  assert.equal(paper.title, "Multi-objective optimization of Strong Hadron Cooler Energy Recovery Linac injector");
  assert.equal(paper.doi, "10.18429/JACoW-NAPAC2025-TUP069");
  assert.equal(paper.booktitle, "Proceedings of the North American Particle Accelerator Conference (NAPAC2025)");
  assert.ok(paper.bibtex.startsWith("@inproceedings{wang:napac2025-tup069,"));
  assert.ok(paper.bibtex.endsWith("}"));
  assert.equal(resume.basics.name, "Ningdong Wang");
  assert.deepEqual(
    resume.publications.map((item) => item.name),
    papers.map((item) => item.title)
  );
  const latent = papers.find((item) => item.id === "wang:ipac2026-thp5347");
  assert.equal(latent.year, 2026);
  assert.equal(latent.doi, "10.18429/JACoW-IPAC2026-THP5347");
  assert.equal(latent.author, "Wang, Ningdong and Cao, Ireanne and Hoffstaetter, Georg");
});
