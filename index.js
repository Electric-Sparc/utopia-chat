#!/usr/bin/env node

'use strict'

// const signalExit = require('signal-exit');
const yargs = require("yargs");
// const chalk = require("chalk");
// const figlet = require('figlet');
// const repl = require("repl");
const process = require("process")
// const axios = require("axios")
const std = process.stdout

const io = require("socket.io-client");
const readline = require("readline");

const options = yargs
 .usage("Usage: -n <name>")
 .option("n", { alias: "name", describe: "Your name", type: "string", demandOption: true })
 .argv;

const CFonts = require('cfonts');

CFonts.say('Utopia is Real!', {
    font: '3d',              // define the font face
    align: 'center',              // define text alignment
    colors: ['yellowBright','cyan'],         // define all colors
    background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 0.5,           // define letter spacing
    lineHeight: 0.1,              // define the line height
    space: true,                // define if the output text should have empty lines on top and on the bottom
    maxLength: '0',             // define how many character can be on one line
    gradient: false,            // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: false,  // define if this is a transition between colors directly
    env: 'node'                 // define the environment CFonts is being executed in
});

const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout,
 prompt: options.name + "> ",
});

const serverURL = "https://cli-socket-chat-server.herokuapp.com";
const socket = io(serverURL);

socket.on("connect", (data) => {
  console.log("Connected to the server!");
  rl.prompt();
});

socket.on("msgAll", (data) => {
  if (data.user != options.name) {
    readline.moveCursor(std, -1 *(options.name.length) - 2, 0);
    console.log(`${data.user}: ${data.msg}`);
  }
  rl.prompt();
});

rl.on("line", (line) => {
  socket.emit("msg", {
    user: options.name,
    msg: line.trim(),
  });
  rl.prompt();
});

rl.on("close", () => {
  console.log("Bye 👋🏻");
  process.exit(0);
});

// signalExit(() => {
//   process.stderr.write('\u001B[?25l');
// }, {alwaysLast: true});
