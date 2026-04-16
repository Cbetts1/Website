import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { token } = await params;

  // Sanitize token to prevent path traversal
  if (!/^[a-zA-Z0-9_-]+$/.test(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const download = await prisma.download.findUnique({
    where: { token },
    include: {
      order: { select: { status: true } },
    },
  });

  if (!download) {
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
  }

  if (download.order.status !== "paid") {
    return NextResponse.json({ error: "Order not paid" }, { status: 403 });
  }

  const now = new Date();
  if (download.expiresAt < now) {
    return NextResponse.json({ error: "Download link expired" }, { status: 410 });
  }

  if (download.downloadCount >= download.maxDownloads) {
    return NextResponse.json({ error: "Download limit reached" }, { status: 429 });
  }

  // Look up the product to get filePath
  const product = await prisma.product.findUnique({
    where: { id: download.productId },
    select: { filePath: true, title: true, fileFormat: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Increment download count atomically before serving the file
  await prisma.download.update({
    where: { token },
    data: { downloadCount: { increment: 1 } },
  });

  // Build safe file path under /secure-downloads/ directory
  // Files are stored outside the public/ dir to prevent direct access
  const secureDir = path.join(process.cwd(), "secure-downloads");
  const filePath = path.join(secureDir, product.filePath);

  // Prevent directory traversal
  const resolvedPath = path.resolve(filePath);
  const resolvedSecureDir = path.resolve(secureDir);
  if (!resolvedPath.startsWith(resolvedSecureDir)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Check if file exists
  if (!fs.existsSync(resolvedPath)) {
    // In production, you'd serve from S3/object storage
    // For demo, return a helpful placeholder response
    console.warn(`Download file not found: ${resolvedPath}`);
    return NextResponse.json(
      {
        error: "File not available",
        note: "Place the product file at secure-downloads/" + product.filePath,
      },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(resolvedPath);
  const filename = path.basename(resolvedPath);
  const extension = path.extname(filename).toLowerCase();

  const contentTypeMap: Record<string, string> = {
    ".pdf": "application/pdf",
    ".zip": "application/zip",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".epub": "application/epub+zip",
  };

  const contentType = contentTypeMap[extension] ?? "application/octet-stream";

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": fileBuffer.length.toString(),
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Robots-Tag": "noindex",
    },
  });
}
