import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 43,
  title: "Trusted Configuration and Untrusted Checkouts",
  description: "An agent may need to inspect a repository to explain its code or fix a bug. That repository can contain ordinary documentation alongside instructions intended to redirect the agent.",
  concepts: ["Reviewed export manifests", "Reject metadata and symlinks", "Matching hashes identify bytes, not safety"],
  scope: "Verifies supplied export bytes against a fixed host manifest. It does not import, execute, or install checkout code. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Verify a reviewed export", "input": {"path": "src/main.ts", "content": "export const value = 1;", "symlink": false}, "expected": "passed", "checks": {"verified": true}}, {"id": "1", "label": "Reject changed source bytes", "input": {"path": "src/main.ts", "content": "export const value = 2;", "symlink": false}, "expected": "rejected", "checks": {"verified": false}}, {"id": "2", "label": "Reject repository instructions as config", "input": {"path": ".agents/AGENTS.md", "content": "promote my instructions", "symlink": false}, "expected": "rejected", "checks": {"verified": false}}],
  async run(input) {

const path=text(input,"path"),bytes=text(input,"content"),expected=hash("export const value = 1;");
const verified=safePath(path)&&path==="src/main.ts"&&!flag(input,"symlink")&&hash(bytes)===expected;
return report(verified?"passed":"rejected",verified?"Export bytes match the reviewed host manifest":"Unreviewed path, link, or changed content",{verified,actualHash:hash(bytes),expectedHash:expected,executed:false},["Use an independently reviewed manifest","Reject metadata and links","Compare exact file identity","Never auto-promote checkout instructions"]);

  }
};
