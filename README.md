# C43 · Trusted Configuration and Untrusted Checkouts

Verifies supplied export bytes against a fixed host manifest. It does not import, execute, or install checkout code. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Reviewed export manifests
- Reject metadata and symlinks
- Matching hashes identify bytes, not safety

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3043`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3043
```

## How the app was build

### 1. Bind an export to independently reviewed bytes

The approved content hash is derived from a fixed source fixture, rather than instructions found in the untrusted checkout itself.

Source: [src/lesson.ts](src/lesson.ts#L13)

```typescript
const path = text(input, "path"),
  bytes = text(input, "content"),
  expected = hash("export const value = 1;");
```

### 2. Reject changed paths, links and contents

The path, symlink flag and content hash must all satisfy the reviewed manifest. executed:false keeps matching identity separate from permission to execute the code or trust its instructions.

Source: [src/lesson.ts](src/lesson.ts#L14) · selected statements

```typescript
const verified =
  safePath(path) &&
  path === "src/main.ts" &&
  !flag(input, "symlink") &&
  hash(bytes) === expected;

return report(
  verified ? "passed" : "rejected",
  verified
    ? "Export bytes match the reviewed host manifest"
    : "Unreviewed path, link, or changed content",
  { verified, actualHash: hash(bytes), expectedHash: expected, executed: false },
  [
    "Use an independently reviewed manifest",
    "Reject metadata and links",
    "Compare exact file identity",
    "Never auto-promote checkout instructions",
  ],
);
```

### Check your understanding

Run **Verify a reviewed export** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "path": "src/main.ts",
    "content": "export const value = 1;",
    "symlink": false
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "verified": true
  }
}
```

Then try **Reject changed source bytes**. Its expected outcome is `rejected`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
