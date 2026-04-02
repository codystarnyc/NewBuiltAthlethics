/**
 * Trello CLI: list board, sync docs, mark cards done.
 * Env: TRELLO_API_KEY, TRELLO_TOKEN, optional TRELLO_BOARD_ID, TRELLO_DONE_LIST_NAME.
 */
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";

const key = process.env.TRELLO_API_KEY;
const token = process.env.TRELLO_TOKEN;
const boardId = process.env.TRELLO_BOARD_ID ?? "bMPu750G";

type TList = { id: string; name: string; pos: number };
type TCard = {
  id: string;
  name: string;
  idList: string;
  desc?: string;
  url?: string;
};

type TBoard = {
  name: string;
  shortUrl?: string;
  lists?: TList[];
  cards?: TCard[];
};

const DOCS = path.join(__dirname, "..", "docs");
const CONTEXT_FILE = path.join(DOCS, "trello-board-context.txt");
const SESSION_FILE = path.join(DOCS, "session-summary.txt");

const MARK_BEGIN = "<<<TRELLO_BOARD_AUTOGEN_BEGIN>>>";
const MARK_END = "<<<TRELLO_BOARD_AUTOGEN_END>>>";

function requireAuth(): { key: string; token: string } {
  if (!key || !token) {
    console.error(
      "Missing TRELLO_API_KEY or TRELLO_TOKEN. See .env.example."
    );
    process.exit(1);
  }
  return { key, token };
}

async function fetchBoard(): Promise<TBoard> {
  const { key, token } = requireAuth();
  const params = new URLSearchParams({
    key,
    token,
    lists: "open",
    cards: "open",
    card_fields: "name,desc,idList,url,labels,dateLastActivity",
    list_fields: "name,pos",
    fields: "name,url,shortUrl,desc",
  });
  const res = await fetch(
    `https://api.trello.com/1/boards/${boardId}?${params}`
  );
  if (!res.ok) {
    console.error(`Trello API ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  return res.json() as Promise<TBoard>;
}

function formatBoardBody(board: TBoard): string {
  const lists = [...(board.lists ?? [])].sort((a, b) => a.pos - b.pos);
  const lines: string[] = [];
  for (const list of lists) {
    const cards =
      board.cards?.filter((c) => c.idList === list.id) ?? [];
    cards.sort((a, b) => a.name.localeCompare(b.name));
    lines.push("");
    lines.push(`## ${list.name} (${cards.length})`);
    for (const c of cards) {
      lines.push(`- ${c.name}`);
      if (c.url) lines.push(`  ${c.url}`);
    }
  }
  lines.push("");
  return lines.join("\n").trim();
}

function formatBoardText(board: TBoard, generatedAt: string): string {
  const lists = [...(board.lists ?? [])].sort((a, b) => a.pos - b.pos);
  const header = [
    "BUILT ATHLETICS — TRELLO BOARD (auto-generated)",
    "================================================",
    `Generated (UTC): ${generatedAt}`,
    `Board: ${board.name}`,
    board.shortUrl ? `URL: ${board.shortUrl}` : "",
    "",
    "When you finish work on a card:",
    '  npm run trello:complete -- "unique substring of card title"',
    "",
    "---",
  ].filter(Boolean);
  return [...header, formatBoardBody(board)].join("\n") + "\n";
}

function injectSessionSummary(
  sessionPath: string,
  board: TBoard,
  generatedAt: string
): void {
  const inner = [
    `Last synced (UTC): ${generatedAt}`,
    `Board: ${board.name}`,
    "",
    formatBoardBody(board),
  ].join("\n");

  let body = fs.readFileSync(sessionPath, "utf8");
  if (body.includes(MARK_BEGIN) && body.includes(MARK_END)) {
    const re = new RegExp(
      `${escapeRegExp(MARK_BEGIN)}[\\s\\S]*?${escapeRegExp(MARK_END)}`,
      "m"
    );
    body = body.replace(re, `${MARK_BEGIN}\n${inner}\n${MARK_END}`);
  } else {
    const re8a = /(8a\. TRELLO — CONTEXT SYNC\n-{25}\n)([\s\S]*?)(?=\n\n9\. CREDENTIALS)/;
    if (re8a.test(body)) {
      body = body.replace(
        re8a,
        `$1${MARK_BEGIN}\n${inner}\n${MARK_END}\n\n`
      );
    } else {
      console.error(
        "session-summary.txt: add section 8a or markers manually; skipping injection."
      );
      return;
    }
  }
  fs.writeFileSync(sessionPath, body, "utf8");
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findDoneList(lists: TList[]): TList | undefined {
  const override = process.env.TRELLO_DONE_LIST_NAME?.trim();
  if (override) {
    const hit = lists.find(
      (l) => l.name.trim().toLowerCase() === override.toLowerCase()
    );
    if (hit) return hit;
  }
  return lists.find(
    (l) =>
      /^✅\s*Done\s*$/i.test(l.name.trim()) ||
      (/\bdone\b/i.test(l.name) &&
        !/\bbacklog\b/i.test(l.name) &&
        !/\bundo\b/i.test(l.name))
  );
}

async function cmdList(): Promise<void> {
  const board = await fetchBoard();
  const lists = [...(board.lists ?? [])].sort((a, b) => a.pos - b.pos);

  console.log(`\nBoard: ${board.name}`);
  console.log(board.shortUrl ?? "");
  console.log("---");

  for (const list of lists) {
    const cards =
      board.cards?.filter((c) => c.idList === list.id) ?? [];
    cards.sort((a, b) => a.name.localeCompare(b.name));
    console.log(`\n## ${list.name} (${cards.length})`);
    for (const c of cards) {
      console.log(`  - ${c.name}`);
      if (c.desc?.trim()) {
        const short = c.desc.trim().split("\n")[0].slice(0, 120);
        console.log(
          `    ${short}${c.desc.length > 120 ? "…" : ""}`
        );
      }
    }
  }
}

async function cmdSync(): Promise<void> {
  const board = await fetchBoard();
  const now = new Date().toISOString();
  const fullText = formatBoardText(board, now);

  fs.mkdirSync(DOCS, { recursive: true });
  fs.writeFileSync(CONTEXT_FILE, fullText, "utf8");
  console.error(`Wrote ${CONTEXT_FILE}`);

  if (fs.existsSync(SESSION_FILE)) {
    injectSessionSummary(SESSION_FILE, board, now);
    console.error(`Updated markers in ${SESSION_FILE}`);
  } else {
    console.error(`Skip session-summary: missing ${SESSION_FILE}`);
  }
}

async function cmdComplete(query: string): Promise<void> {
  const { key, token } = requireAuth();
  const board = await fetchBoard();
  const lists = [...(board.lists ?? [])].sort((a, b) => a.pos - b.pos);
  const doneList = findDoneList(lists);
  if (!doneList) {
    console.error(
      "Could not find Done list. Set TRELLO_DONE_LIST_NAME to the exact list name."
    );
    process.exit(1);
  }

  const q = query.trim().toLowerCase();
  if (!q) {
    console.error('Usage: trello complete "<card title substring>"');
    process.exit(1);
  }

  const candidates =
    board.cards?.filter(
      (c) =>
        c.idList !== doneList.id &&
        c.name.toLowerCase().includes(q)
    ) ?? [];

  if (candidates.length === 0) {
    console.error(`No open card matching "${query}" (not already in Done).`);
    process.exit(1);
  }
  if (candidates.length > 1) {
    console.error("Multiple matches — narrow the substring:\n");
    for (const c of candidates) {
      const listName =
        lists.find((l) => l.id === c.idList)?.name ?? c.idList;
      console.error(`  - [${listName}] ${c.name}`);
    }
    process.exit(1);
  }

  const card = candidates[0];
  const params = new URLSearchParams({ key, token, idList: doneList.id });
  const res = await fetch(
    `https://api.trello.com/1/cards/${card.id}?${params}`,
    { method: "PUT" }
  );
  if (!res.ok) {
    console.error(
      `Move failed ${res.status}: ${await res.text()}\n` +
        "Regenerate token with read *and* write scope at trello.com/app-key."
    );
    process.exit(1);
  }

  console.log(`Moved to "${doneList.name}": ${card.name}`);
  await cmdSync();
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const jsonIdx = argv.indexOf("--json");
  if (jsonIdx >= 0) {
    const out = argv[jsonIdx + 1];
    argv.splice(jsonIdx, out ? 2 : 1);
    const board = await fetchBoard();
    fs.writeFileSync(out ?? "trello-board.json", JSON.stringify(board, null, 2));
    console.error(`Wrote ${out ?? "trello-board.json"}`);
    return;
  }

  const sub = argv[0] ?? "list";
  if (sub === "list" || sub === "export") {
    await cmdList();
    return;
  }
  if (sub === "sync") {
    await cmdSync();
    return;
  }
  if (sub === "complete") {
    const rest = argv.slice(1).join(" ").trim();
    await cmdComplete(rest);
    return;
  }

  console.error(`Unknown command: ${sub}
Usage:
  npm run trello -- list              # print board
  npm run trello -- sync              # refresh docs/trello-board-context.txt + session-summary markers
  npm run trello -- complete "text" # move card to Done, then sync
  npm run trello -- --json [path]   # dump JSON`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
