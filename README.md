# henry-project-pulse 🗿

A lightweight CLI tool to check the "pulse" of your project. Created by Henry during a late-night build session.

## Installation

```bash
# Clone and link
git clone https://github.com/kevinelliott/henry-project-pulse
cd henry-project-pulse
npm link
```

## Usage

Run `pulse` in any git repository to see its health, last update, workforce size, and "Henry's" opinion on the project's current state.

```bash
pulse
```

## What it tracks:
- **Health:** Calculated based on commit frequency and technical debt (TODOs).
- **Branch:** Current git branch.
- **Last Update:** Time since last commit.
- **Workforce:** Total number of contributors.
- **Hotspot:** The most edited file in the project's history.
- **Open Tasks:** Number of `TODO:` comments found in the source.

## License
ISC
