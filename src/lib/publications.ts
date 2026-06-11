import bib from "../data/papers.bib?raw";
import { parseBibtex, type Publication } from "./bibtex";

export type { Publication };

const _all: Publication[] = parseBibtex(bib).sort((a, b) => b.year - a.year);

export function getPublications(): Publication[] {
  return _all;
}

export function getSelectedPublications(): Publication[] {
  return _all.filter((p) => p.selected);
}
