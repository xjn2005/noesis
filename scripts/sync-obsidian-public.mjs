#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import YAML from "yaml"

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const args = process.argv.slice(2)

function arg(name) {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args[i + 1]
}

function truthy(value) {
  return value === true || value === "true"
}

function frontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return match ? (YAML.parse(match[1]) ?? {}) : {}
}

async function exists(file) {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if ([".obsidian", ".trash", "private", "drafts", "node_modules"].includes(entry.name)) {
      continue
    }

    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(file)))
    } else {
      files.push(file)
    }
  }

  return files
}

const vault = arg("--vault") ?? process.env.OBSIDIAN_VAULT
const sourceInput = arg("--source") ?? (vault ? path.join(vault, "public") : undefined)
const dest = path.resolve(arg("--dest") ?? path.join(repo, "content", "public"))

if (!sourceInput) {
  console.error('Usage: npm run sync:obsidian -- --vault "D:\\path\\to\\vault"')
  process.exit(1)
}

const source = path.resolve(sourceInput)

if (!(await exists(source))) {
  console.error(`Source folder not found: ${source}`)
  process.exit(1)
}

if (source === dest) {
  console.error("Source and destination are the same folder.")
  process.exit(1)
}

await fs.mkdir(dest, { recursive: true })

let copied = 0
let skipped = 0

for (const file of await walk(source)) {
  const rel = path.relative(source, file)

  if (path.extname(file).toLowerCase() === ".md") {
    const text = await fs.readFile(file, "utf8")
    const data = frontmatter(text)
    if (!truthy(data.publish) || truthy(data.draft)) {
      skipped++
      continue
    }
  }

  const target = path.join(dest, rel)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.copyFile(file, target)
  copied++
}

console.log(`Synced ${copied} file(s) to ${path.relative(repo, dest)}; skipped ${skipped}.`)
