#!/usr/bin/env node

'use strict'

// const signalExit = require('signal-exit');
// const yargs = require("yargs");
// const chalk = require("chalk");
// const figlet = require('figlet');
// const repl = require("repl");
const process = require("process")
// const axios = require("axios")
const std = process.stdout

const io = require("socket.io-client");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

const serverURL = "https://cli-socket-chat-server.herokuapp.com";
const socket = io(serverURL);

socket.on("connect", (data) => {
  console.log("Connected to the server!");
  rl.prompt();
});

socket.on("msgAll", (data) => {
  if (data.user != socket.id) {
    rl.pause();
    console.log(`[${data.user}]: ${data.msg}`);
  }
  rl.prompt();
});

rl.on("line", (line) => {
  socket.emit("msg", {
    user: socket.id,
    msg: line.trim(),
  });
  rl.prompt();
});

rl.on("close", () => {
  console.log("Bye 👋🏻");
  process.exit(0);
});

class Spinner {
  spin() {
    process.stdout.write("\x1B[?25h")

    const spinnerFrames = [
			".  ",
			".. ",
			"...",
			" ..",
			"  .",
			"   "
		]
    const spinnerTimeInterval = 200
    let index = 0

    this.timer = setInterval(() => {
      let now = spinnerFrames[index]
      if (now == undefined) {
        index = 0
        now = spinnerFrames[index]
      }
      std.write(now)
      readline.moveCursor(std, -3, 0)

      index = index >= spinnerFrames.length ? 0 : index + 1
    }, spinnerTimeInterval)
  }
}
new Spinner().spin()

// signalExit(() => {
//   process.stderr.write('\u001B[?25l');
// }, {alwaysLast: true});
