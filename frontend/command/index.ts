import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// @ts-ignore
import prompts, { PromptObject } from "prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COMMANDER_CONFIG = {
  base_page_path: "./app",
  base_component_path: "./components",
};

type PageType = "page" | "component";

interface Response {
  pageName: string;
  pageType: PageType;
  dirName?: string;
}

const PageQuestions: PromptObject[] = [
  {
    type: "text",
    name: "pageName",
    message: "Enter a name ...",
    validate: (value: string) =>
      value.length < 3 ? `Page name cannot be less than 3 characters` : true,
  },
  {
    type: "select",
    name: "pageType",
    message: "Select page type:",
    choices: [
      { title: "page", value: "page" },
      { title: "component", value: "component" },
    ],
  },
  {
    type: "text",
    name: "dirName",
    message: "Directory name (optional)",
  },
];

function createDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory created: ${dir}`);
  } else {
    console.log(`Path ${dir} already exists!`);
  }
}

function createFiles(type: PageType, response: Response) {
  const funcName =
    response.pageName[0].toUpperCase() + response.pageName.slice(1);
  let _result = { IndexFile: "", ConfigFile: "", ComponentFile: "" };

  console.log(`Creating files for type: ${type} and name: ${response.pageName}`);

  try {
    const baseExamplePath = path.join(__dirname, `../command/examples/${type}`);

    _result.IndexFile = fs
      .readFileSync(path.join(baseExamplePath, "index.tsx"), "utf-8")
      .replace(/Example/g, funcName)
      .replace(/@components/g, "../../../components")
      .replace(/@layouts/g, "../../../layouts")
      .replace(/@libs/g, "../../../libs");

    _result.ConfigFile = fs.readFileSync(path.join(baseExamplePath, "config.ts"), "utf-8");

    _result.ComponentFile = fs
      .readFileSync(path.join(baseExamplePath, "index.tsx"), "utf-8")
      .replace(/Example/g, funcName);
  } catch (error) {
    console.error(`Error creating files: ${(error as Error).message}`);
    process.exit(1);
  }

  return _result;
}

(async () => {
  const response = (await prompts(PageQuestions)) as Response;

  const { pageName, pageType, dirName } = response;

  if (!pageName || !pageType) {
    console.error("Missing required responses.");
    return;
  }

  let _dir = "";

  switch (pageType) {
    case "page":
      _dir = path.join(COMMANDER_CONFIG.base_page_path, pageName);
      createDir(_dir);
      break;

    case "component":
      _dir = path.join(COMMANDER_CONFIG.base_component_path, pageName);
      createDir(_dir);
      break;

    default:
      throw new Error(`Bad type Exception: ${pageType}`);
  }

  console.log(`Directory path: ${_dir}`);

  const _files = createFiles(pageType, { pageName, pageType, dirName });

  fs.writeFileSync(path.join(_dir, "page.tsx"), _files.IndexFile);
  fs.writeFileSync(path.join(_dir, "style.scss"), _files.ConfigFile);

  const componentDir = path.join(COMMANDER_CONFIG.base_component_path, pageName);
  createDir(componentDir);

  console.log("Files created successfully");
})();
