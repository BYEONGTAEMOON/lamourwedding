import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Local-file backend used while Supabase isn't configured.
// Works with `next dev` / `next start` on one machine; Vercel's filesystem is read-only.

const DATA_DIR = path.join(process.cwd(), 'data');
// Not under public/: `next start` only serves public files that existed at build time,
// so uploads are served by app/uploads/[...path]/route.ts instead.
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

export const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
export const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');
export const RATE_LIMIT_FILE = path.join(DATA_DIR, 'rate-limits.json');
export const BLOCKLIST_FILE = path.join(DATA_DIR, 'blocklist.json');

export async function readJson<T>(file: string, fallback: T): Promise<T> {
    try {
        return JSON.parse(await readFile(file, 'utf8')) as T;
    } catch (e) {
        if ((e as NodeJS.ErrnoException).code === 'ENOENT') return fallback;
        throw e;
    }
}

async function writeJson(file: string, data: unknown) {
    await mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${randomUUID()}.tmp`;
    await writeFile(tmp, JSON.stringify(data, null, 2));
    await rename(tmp, file);
}

// Serializes read-modify-write cycles per file within this server process.
const locks = new Map<string, Promise<unknown>>();

export function updateJson<T>(file: string, fallback: T, fn: (data: T) => T): Promise<T> {
    const run = (locks.get(file) ?? Promise.resolve())
        .catch(() => {})
        .then(async () => {
            const next = fn(await readJson(file, fallback));
            await writeJson(file, next);
            return next;
        });
    locks.set(file, run);
    return run;
}

// Saves into data/uploads/<folder>/ and returns the URL it's served from.
export async function saveUpload(folder: string, file: File, ext: string) {
    const dir = path.join(UPLOAD_DIR, folder);
    await mkdir(dir, { recursive: true });
    const name = `${randomUUID()}.${ext}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    return `/uploads/${folder}/${name}`;
}
