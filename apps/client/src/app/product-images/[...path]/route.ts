import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

function getMediaRoot() {
  const candidates = [
    path.resolve(process.cwd(), "shared/product-images"),
    path.resolve(process.cwd(), "../../shared/product-images"),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}
const mimeTypes: Record<string, string> = {
  ".avif": "image/avif", ".gif": "image/gif", ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
};

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  if (!parts.length || parts.some((part) => !/^[a-zA-Z0-9 .,_()-]+$/.test(part))) return new NextResponse(null, { status: 404 });

  const mediaRoot = getMediaRoot();
  const filePath = path.resolve(mediaRoot, ...parts);
  if (!filePath.startsWith(`${mediaRoot}${path.sep}`) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(readFileSync(filePath), {
    headers: { "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream", "Cache-Control": "public, max-age=3600" },
  });
}
