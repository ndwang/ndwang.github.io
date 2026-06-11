export interface Publication {
  key: string;
  type: string;
  title: string;
  authors: { name: string; isMe: boolean }[];
  venue: string;
  year: number;
  doi?: string;
  url?: string;
  pages?: string;
  selected: boolean;
}

// ---------------------------------------------------------------------------
// Low-level helpers
// ---------------------------------------------------------------------------

/**
 * Strip outer LaTeX brace groups and quotes from a raw field value string,
 * then collapse internal whitespace.
 * e.g. '{Cathode Space Charge}' -> 'Cathode Space Charge'
 *      '"2022"' -> '2022'
 *      '{EIC {cooler}}' -> 'EIC cooler'
 */
function stripBraces(raw: string): string {
  let s = raw.trim();

  // Strip outer quotes
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1);
  }

  // Recursively remove all brace groups (handles nesting)
  // Replace {content} with content repeatedly until no braces remain
  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s.replace(/\{([^{}]*)\}/g, "$1");
  }

  // Collapse whitespace
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Normalize an author name token to "First Last" display order.
 * Handles:
 *   "Last, First Middle"  -> "First Middle Last"
 *   "First Last"          -> "First Last" (unchanged)
 *   "others"              -> "et al."
 */
function normalizeAuthorName(raw: string): string {
  const s = raw.trim();
  if (s.toLowerCase() === "others") return "et al.";

  if (s.includes(",")) {
    // "Last, First" format
    const commaIdx = s.indexOf(",");
    const last = s.slice(0, commaIdx).trim();
    const first = s.slice(commaIdx + 1).trim();
    return first ? `${first} ${last}` : last;
  }

  // Already "First Last"
  return s;
}

/**
 * Detect whether an author name refers to Ningdong Wang.
 * Matches: "Wang, Ningdong", "Ningdong Wang", "Wang, N.", "N. Wang"
 */
function isNingdongWang(name: string): boolean {
  const s = name.trim();
  // After normalization, name is in "First Last" or "Last" format.
  // Check normalized form: first token contains N/Ningdong, last token is Wang.
  const parts = s.split(/\s+/);
  if (parts.length < 2) return false;

  const last = parts[parts.length - 1];
  const first = parts[0];

  if (last.toLowerCase() !== "wang") return false;

  return (
    first.toLowerCase() === "ningdong" ||
    first === "N." ||
    first === "N"
  );
}

// ---------------------------------------------------------------------------
// BibTeX tokeniser / parser
// ---------------------------------------------------------------------------

/**
 * Extract the content of a balanced brace group starting at src[pos]
 * where src[pos] === '{'. Returns the inner content (without outer braces).
 */
function extractBraceGroup(src: string, pos: number): { content: string; end: number } {
  let depth = 0;
  let start = pos;
  for (let i = pos; i < src.length; i++) {
    if (src[i] === "{") {
      depth++;
      if (depth === 1) start = i;
    } else if (src[i] === "}") {
      depth--;
      if (depth === 0) {
        return { content: src.slice(start + 1, i), end: i };
      }
    }
  }
  // Unterminated brace group — return what we have
  return { content: src.slice(start + 1), end: src.length - 1 };
}

/**
 * Parse a single BibTeX entry body (the part after the entry key, without
 * outer braces). Returns a Map of field -> raw value (preserving last-wins).
 */
function parseFields(body: string): Map<string, string> {
  const fields = new Map<string, string>();
  let i = 0;

  while (i < body.length) {
    // Skip whitespace and commas
    while (i < body.length && /[\s,]/.test(body[i])) i++;
    if (i >= body.length) break;

    // Read field name (letters, digits, underscores, hyphens)
    let nameStart = i;
    while (i < body.length && /[a-zA-Z0-9_\-]/.test(body[i])) i++;
    const fieldName = body.slice(nameStart, i).toLowerCase().trim();
    if (!fieldName) {
      // Skip unexpected character
      i++;
      continue;
    }

    // Skip whitespace then expect '='
    while (i < body.length && body[i] === " " || body[i] === "\t" || body[i] === "\r" || body[i] === "\n") i++;
    if (i >= body.length || body[i] !== "=") {
      // Malformed — skip
      continue;
    }
    i++; // consume '='

    // Skip whitespace
    while (i < body.length && /\s/.test(body[i])) i++;

    // Read value: brace-delimited, quote-delimited, or bare (number)
    let rawValue = "";
    if (i < body.length && body[i] === "{") {
      const { content, end } = extractBraceGroup(body, i);
      rawValue = `{${content}}`;
      i = end + 1;
    } else if (i < body.length && body[i] === '"') {
      // Quote-delimited value — scan to matching close quote (not inside braces)
      let j = i + 1;
      let depth = 0;
      while (j < body.length) {
        if (body[j] === "{") depth++;
        else if (body[j] === "}") depth--;
        else if (body[j] === '"' && depth === 0) break;
        j++;
      }
      rawValue = body.slice(i + 1, j); // content between quotes
      i = j + 1; // consume closing quote
      // Wrap in braces for uniform stripping later
      rawValue = `{${rawValue}}`;
    } else {
      // Bare value (number or identifier)
      let j = i;
      while (j < body.length && body[j] !== "," && body[j] !== "}" && body[j] !== "\n") j++;
      rawValue = `{${body.slice(i, j).trim()}}`;
      i = j;
    }

    // Last-wins: always overwrite
    if (fieldName) {
      fields.set(fieldName, rawValue);
    }
  }

  return fields;
}

/**
 * Parse the full BibTeX source string and return an array of Publication objects.
 * Never throws — malformed entries are skipped.
 */
export function parseBibtex(src: string): Publication[] {
  const publications: Publication[] = [];

  // Find all @type{key, ...} blocks
  // We scan character by character to handle nested braces properly.
  let i = 0;
  while (i < src.length) {
    // Find next '@'
    const atIdx = src.indexOf("@", i);
    if (atIdx === -1) break;
    i = atIdx + 1;

    // Read entry type
    let typeStart = i;
    while (i < src.length && /[a-zA-Z]/.test(src[i])) i++;
    const entryType = src.slice(typeStart, i).toLowerCase();
    if (!entryType) continue;

    // Skip whitespace then expect '{'
    while (i < src.length && /\s/.test(src[i])) i++;
    if (i >= src.length || src[i] !== "{") continue;

    // Extract the entire brace group for this entry
    const { content: entryContent, end: entryEnd } = extractBraceGroup(src, i);
    i = entryEnd + 1;

    // First token in entryContent is the citation key
    let j = 0;
    while (j < entryContent.length && /\s/.test(entryContent[j])) j++;
    let keyStart = j;
    while (j < entryContent.length && entryContent[j] !== "," && entryContent[j] !== " ") j++;
    const key = entryContent.slice(keyStart, j).trim();
    if (!key) continue;

    // Rest is the field body
    const body = entryContent.slice(j);

    let fields: Map<string, string>;
    try {
      fields = parseFields(body);
    } catch {
      continue;
    }

    const get = (name: string): string => {
      const raw = fields.get(name);
      if (raw === undefined) return "";
      return stripBraces(raw);
    };

    // Title
    const title = get("title");

    // Authors
    const authorRaw = get("author");
    const authorTokens = authorRaw
      ? authorRaw.split(/\s+and\s+/i).map((s) => s.trim()).filter(Boolean)
      : [];

    const authors = authorTokens.map((token) => {
      const normalized = normalizeAuthorName(token);
      return {
        name: normalized,
        isMe: normalized !== "et al." && isNingdongWang(normalized),
      };
    });

    // Venue: booktitle > journal > institution > publisher
    const venue =
      get("booktitle") ||
      get("journal") ||
      get("institution") ||
      get("publisher") ||
      "";

    // Year
    const yearStr = get("year");
    const year = yearStr ? parseInt(yearStr, 10) : 0;

    // DOI / URL
    const doi = get("doi") || undefined;
    const explicitUrl = get("url") || undefined;
    const url = explicitUrl ?? (doi ? `https://doi.org/${doi}` : undefined);

    // Pages
    const pages = get("pages") || undefined;

    // Selected
    const selectedRaw = get("selected");
    const selected = selectedRaw.toLowerCase() === "true";

    publications.push({
      key,
      type: entryType,
      title,
      authors,
      venue,
      year,
      doi,
      url,
      pages,
      selected,
    });
  }

  return publications;
}
