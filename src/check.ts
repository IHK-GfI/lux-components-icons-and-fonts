'use strict';

import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { LuxIcon } from './lux-icon';

function logGreen(text: string): void {
  console.log(chalk.green(text));
}

function logYellow(text: string): void {
  console.log(chalk.yellow(text));
}

function logRed(text: string): void {
  console.log(chalk.red(text));
}

export class Checker {
  jsonFilePath = './assets/icons/lux-icons.json';
  iconBasePath = '.';

  iconJsonRaw: Buffer;
  iconArr: LuxIcon[];
  errors: string[] = [];

  constructor() {
    this.iconJsonRaw = readFileSync(this.jsonFilePath);
    this.iconArr = JSON.parse(this.iconJsonRaw.toString('utf-8'));
  }

  check(): void {
    logYellow('================================================================================');
    logYellow('=== Icons prüfen');
    logYellow('================================================================================');
    logYellow(`In der Datei "${this.jsonFilePath}" werden ${this.iconArr.length} Icons referenziert.`);
    logYellow(`Referenzen werden geprüft...`);

    let counter = 0;
    this.iconArr.forEach((icon) => {
      if (!existsSync(this.iconBasePath + icon.iconPath)) {
        this.errors.push(`\u{2717} Das Icon "${icon.iconName}" konnte unter dem Pfad "${icon.iconPath}" nicht gefunden werden.`);
      }
      counter++;

      if (counter % 250 === 0) {
        logYellow(`${counter} Referenzen wurden geprüft.`);
      }
    });
    logYellow(`${counter} Referenzen wurden geprüft.`);
    logYellow(`Alle Referenzen wurden geprüft.`);
    logYellow('--------------------------------------------------------------------------------');

    if (this.errors.length === 0) {
      logGreen(`\u{2713} Alle referenzierten Icons existieren unter ihrem Dateipfad.`);
    } else {
      this.errors.forEach((error) => {
        logRed(error);
      });
    }
  }
}

new Checker().check();
