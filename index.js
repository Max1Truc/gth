#!/usr/bin/env node

const prompts = require("prompts")
const fs = require("fs")
const path = require("path")

async function getJSON(filename, callback) {
  //filename = path.join(__dirname, filename)
  return await fs.readFile(filename, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
      data = JSON.parse(data)
      if (callback) callback(data)
      else return data
    } else {
      console.log(err);
    }
  });
}

async function writeJSON(filename, data) {
  //filename = path.join(__dirname, filename);
  data = new Uint8Array(Buffer.from(data));
  fs.writeFile(filename, data, (err) => {
    if (err) throw err;
    console.log('The file has been updated!');
  });
}

(async () => {
  var file1 = await getJSON("english.json")
  var file2 = await getJSON("french.json")
console.log(file1)
  for (i in file1) {
    if (!file2[i]) {
      file2[i] = await prompts({
        type: 'text',
        name: 'translation',
        message: `What is the translation for "${file1[i]}"?`
      }).translation;
    }
  }

  writeJSON("french.json", JSON.stringify(file2))
})();
