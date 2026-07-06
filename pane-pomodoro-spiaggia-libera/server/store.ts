import fs from 'fs';
import path from 'path';
import type { Report } from '../src/types';

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const DATA_FILE = path.join(DATA_DIR, 'reports.json');

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

export function loadReports(): Report[] {
  ensureDataFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as Report[];
  } catch {
    return [];
  }
}

export function saveReports(reports: Report[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2), 'utf-8');
}

export function appendReport(report: Report): Report[] {
  const reports = loadReports();
  reports.push(report);
  saveReports(reports);
  return reports;
}
