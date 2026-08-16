import { pbkdf2Sync, randomBytes } from "node:crypto";

function readHidden(prompt) {
  if (!process.stdin.isTTY) {
    return new Promise((resolve) => {
      let input = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => { input += chunk; });
      process.stdin.on("end", () => resolve(input.trim()));
    });
  }
  return new Promise((resolve, reject) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    let value = "";
    const onData = (character) => {
      if (character === "\u0003") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        reject(new Error("Cancelled"));
        return;
      }
      if (character === "\r" || character === "\n") {
        process.stdin.off("data", onData);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write("\n");
        resolve(value);
        return;
      }
      if (character === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      value += character;
    };
    process.stdin.on("data", onData);
  });
}

if (process.argv.includes("--session-secret")) {
  console.log(randomBytes(48).toString("base64url"));
  process.exit(0);
}

try {
  const password = await readHidden("New administrator password: ");
  if (password.length < 12) throw new Error("Password must contain at least 12 characters.");
  const salt = randomBytes(24);
  const iterations = 210_000;
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  console.log(`pbkdf2_sha256$${iterations}$${salt.toString("base64")}$${hash.toString("base64")}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Could not generate hash.");
  process.exit(1);
}
