#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getPulse() {
  const pulse = {};

  try {
    // Git info
    pulse.lastCommitDate = execSync('git log -1 --format=%cr').toString().trim();
    pulse.lastCommitMsg = execSync('git log -1 --format=%s').toString().trim();
    pulse.contributorCount = execSync('git shortlog -sn --all | wc -l').toString().trim();
    pulse.branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    
    // Most active file (most commits)
    pulse.topFile = execSync('git log --format= --name-only | sort | uniq -c | sort -nr | head -1').toString().trim().split(' ').pop();
  } catch (e) {
    pulse.gitError = "Not a git repository or git not found.";
  }

  // TODO count
  try {
    const todoOutput = execSync('grep -r "TODO[: ]" . --exclude-dir=node_modules --exclude-dir=.git | grep -v "grep -r" | wc -l').toString().trim();
    pulse.todoCount = parseInt(todoOutput, 10);
  } catch (e) {
    pulse.todoCount = 0;
  }

  // Project health check
  const health = calculateHealth(pulse);
  
  displayPulse(pulse, health);
}

function calculateHealth(pulse) {
  if (pulse.gitError) return "Unknown";
  
  const isRecent = pulse.lastCommitDate.includes('second') || 
                   pulse.lastCommitDate.includes('minute') || 
                   pulse.lastCommitDate.includes('hour') || 
                   pulse.lastCommitDate.includes('day');
                   
  if (isRecent && pulse.todoCount < 10) return "Thriving";
  if (isRecent) return "Active (with Debt)";
  if (pulse.lastCommitDate.includes('month')) return "Hibernating";
  return "Stagnant";
}

function displayPulse(pulse, health) {
  console.log(`\n  🗿 \x1b[1mHENRY'S PROJECT PULSE\x1b[0m`);
  console.log(`  -------------------------`);
  
  if (pulse.gitError) {
    console.log(`  \x1b[31mStatus:\x1b[0m ${pulse.gitError}`);
  } else {
    console.log(`  \x1b[34mHealth:\x1b[0m     ${health}`);
    console.log(`  \x1b[34mBranch:\x1b[0m     ${pulse.branch}`);
    console.log(`  \x1b[34mLast Update:\x1b[0m ${pulse.lastCommitDate} ("${pulse.lastCommitMsg}")`);
    console.log(`  \x1b[34mWorkforce:\x1b[0m   ${pulse.contributorCount} contributor(s)`);
    console.log(`  \x1b[34mHotspot:\x1b[0m     ${pulse.topFile || 'N/A'}`);
    console.log(`  \x1b[34mOpen Tasks:\x1b[0m  ${pulse.todoCount} TODOs`);
  }

  console.log(`\n  \x1b[3mHenry says:\x1b[0m "${getHenryQuote(health)}"`);
  console.log('');
}

function getHenryQuote(health) {
  const quotes = {
    "Thriving": [
      "The rhythm of progress is strong here.",
      "A masterpiece in the making, I see.",
      "Stay the course. Greatness awaits."
    ],
    "Active (with Debt)": [
      "The fires are burning, but don't forget to sweep the hearth.",
      "Velocity is good, but so is clarity.",
      "A lot of promises (TODOs) yet to be kept."
    ],
    "Hibernating": [
      "The heart beats slowly. Perhaps it needs a jolt of inspiration?",
      "Silence can be productive, but don't let it become permanent.",
      "A fine vintage, resting."
    ],
    "Stagnant": [
      "Dust has claimed this domain. Shall we clear it?",
      "Legacy is built on action, not just existence.",
      "I miss the sound of your keyboard on this one."
    ],
    "Unknown": [
      "I see files, but I don't see the history. Is this a secret?"
    ]
  };

  const list = quotes[health] || quotes["Unknown"];
  return list[Math.floor(Math.random() * list.length)];
}

getPulse();
