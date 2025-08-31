import chalk from "chalk";

export class Logger {
  static info(...args: any[]) {
    console.log(chalk.cyan("[INFO]", ...args));
  }

  static warn(...args: any[]) {
    console.log(chalk.yellow("[WARN]", ...args));
  }

  static error(...args: any[]) {
    console.log(chalk.red("[ERROR]", ...args));
  }

  static todo(...args: any[]) {
    console.log(chalk.magenta("[TODO]", ...args));
  }
}
