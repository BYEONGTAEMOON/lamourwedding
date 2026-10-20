import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR } from '@/lib/local-store';

const TYPES: Record<string, string> = {
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
};

// Serves images uploaded from the admin in local storage mode (data/uploads/).
export async function GET(_request: Request, ctx: RouteContext<'/uploads/[...path]'>) {
    const { path: segments } = await ctx.params;
    const file = path.resolve(UPLOAD_DIR, ...segments);
    const type = TYPES[path.extname(file).toLowerCase()];
    if (!type || !file.startsWith(UPLOAD_DIR + path.sep)) {
        return new Response('Not found', { status: 404 });
    }
    try {
        return new Response(await readFile(file), {
            headers: {
                'Content-Type': type,
                // File names are random UUIDs and never overwritten.
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch {
        return new Response('Not found', { status: 404 });
    }
}
