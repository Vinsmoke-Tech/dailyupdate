const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "bot.js"), "utf8");

function loadBot(execute, asEntryPoint = false) {
  const calls = [];
  const logs = [];
  const fileOperations = [];
  const module = { exports: {} };
  const process = { stdout: { write() {} }, exitCode: undefined };
  const random = Object.create(Math);
  random.random = () => 0.25;
  const requireMock = (name) => {
    if (name === "child_process") return {
      execFileSync(command, args, options) {
        calls.push({ command, args: Array.from(args), options });
        return execute(command, args, options);
      }
    };
    if (name === "fs") return new Proxy({}, {
      get: (_, operation) => (...args) => {
        fileOperations.push({ operation, args });
        throw new Error("Unexpected file operation");
      }
    });
    throw new Error(`Unexpected module: ${name}`);
  };
  requireMock.main = asEntryPoint ? module : {};
  vm.runInNewContext(source, {
    require: requireMock, module, process, Math: random,
    console: { log: (...args) => logs.push(args.join(" ")), error: (...args) => logs.push(args.join(" ")) }
  }, { filename: "bot.js" });
  return { bot: module.exports, calls, logs, fileOperations, process };
}

function unauthorized() {
  const error = new Error("Command failed");
  error.status = 1;
  error.stderr = "HTTP 401: Bad credentials";
  throw error;
}

test("authentication failure stops before files and git are changed", async () => {
  const context = loadBot(unauthorized);
  await assert.rejects(context.bot.main(), /Autentikasi GitHub CLI gagal/);
  assert.equal(context.calls.length, 1);
  assert.deepEqual(context.calls[0].args.slice(0, 2), ["api", "graphql"]);
  assert.equal(context.fileOperations.length, 0);
});

test("PR Markdown is passed literally as one argument without a shell", () => {
  const context = loadBot((command, args) => {
    assert.equal(command, "gh");
    if (args[1] === "list") return "[]";
    return "https://github.com/example/repo/pull/12\n";
  });
  assert.equal(context.bot.createPullRequest(), "https://github.com/example/repo/pull/12");
  const creation = context.calls[1];
  const body = creation.args[creation.args.indexOf("--body") + 1];
  assert.match(body, /`daily-bot-update`/);
  assert.match(body, /`main`/);
  assert.match(body, /\n/);
  assert.equal(creation.options.shell, undefined);
});

test("existing PR is reused without attempting creation", () => {
  const context = loadBot(() => '[{"number":42}]');
  assert.equal(context.bot.createPullRequest(), "42");
  assert.equal(context.calls.length, 1);
});

test("PR lookup failure propagates rather than claiming an existing PR", () => {
  const context = loadBot(unauthorized);
  assert.throws(() => context.bot.createPullRequest(), /Autentikasi/);
  assert.equal(context.calls.length, 1);
  assert.equal(context.logs.length, 0);
});

test("merge authentication failure does not retry auto-merge", () => {
  const context = loadBot(unauthorized);
  assert.throws(() => context.bot.mergeAndDeleteBranch("42"), /Autentikasi/);
  assert.equal(context.calls.length, 1);
  assert.equal(context.calls[0].args[2], "42");
  assert.equal(context.logs.length, 0);
});

test("merge fallback targets the same PR explicitly", () => {
  let attempts = 0;
  const context = loadBot(() => {
    if (++attempts === 1) {
      const error = new Error("Merge blocked");
      error.status = 1;
      error.stderr = "Required checks pending";
      throw error;
    }
    return "";
  });
  context.bot.mergeAndDeleteBranch("42");
  assert.equal(context.calls.length, 2);
  assert.equal(context.calls[1].args[2], "42");
  assert.ok(context.calls[1].args.includes("--auto"));
});

test("issue lookup failure is not reported as an empty issue list", () => {
  const context = loadBot(unauthorized);
  assert.throws(() => context.bot.closeOldIssues(), /Autentikasi/);
  assert.equal(context.logs.length, 0);
});

test("entry point reports failure with a nonzero exit code", async () => {
  const context = loadBot(unauthorized, true);
  await new Promise(setImmediate);
  assert.equal(context.process.exitCode, 1);
  assert.equal(context.fileOperations.length, 0);
  assert.match(context.logs[0], /Autentikasi GitHub CLI gagal/);
});
