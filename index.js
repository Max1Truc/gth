#!/usr/bin/env node

if (process.argv.length != 4) {
  console.log(
    "Usage:\n$ gth <Up-to-date translation file> <Translation file to update>"
  );
  process.exit(1);
}

var base = process.argv[2],
  branch = process.argv[3];

process.on("unhandledRejection", function(err) {
  console.log(err);
});

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function readLineAsync(message) {
  return new Promise((resolve, reject) => {
    rl.question(message, answer => {
      resolve(answer);
    });
  });
}

function getJSON(filename) {
  return JSON.parse(fs.readFileSync(filename, { encoding: "utf-8" }));
}

async function writeJSON(filename, data) {
  data = new Uint8Array(Buffer.from(data));
  fs.writeFile(filename, data, err => {
    if (err) throw err;
    console.log("The file has been updated!");
    process.exit();
  });
}

(async () => {
  var file1 = getJSON(base);
  var file2 = getJSON(branch);

  for (i in file1["strings"]) {
    if (!file2["strings"][i]) {
      file2["strings"][i] = await readLineAsync(
        `What is the translation for "${file1["strings"][i]}" (${i})? `
      );
    }
  }

  writeJSON(branch, JSON.stringify(file2, null, "\t"));
})();
