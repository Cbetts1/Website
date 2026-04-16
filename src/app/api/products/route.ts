import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { shortDesc: { contains: q } },
              { tags: { contains: q } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      slug: true,
      title: true,
      shortDesc: true,
      price: true,
      category: true,
      tags: true,
      fileFormat: true,
      imageUrl: true,
      featured: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ products });
}
