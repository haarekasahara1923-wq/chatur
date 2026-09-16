import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";
    const items = showAll
      ? await db.select().from(courses).orderBy(asc(courses.displayOrder), asc(courses.createdAt))
      : await db
          .select()
          .from(courses)
          .where(eq(courses.isActive, true))
          .orderBy(asc(courses.displayOrder), asc(courses.createdAt));
    return NextResponse.json({ success: true, courses: items });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, description, fee, batchTimings, duration, isActive, displayOrder } = data;
    if (!name?.trim()) {
      return NextResponse.json({ error: "Course name is required" }, { status: 400 });
    }
    const newItem = await db
      .insert(courses)
      .values({
        name: name.trim(),
        description: description?.trim() || null,
        fee: fee?.trim() || null,
        batchTimings: batchTimings?.trim() || null,
        duration: duration?.trim() || null,
        isActive: isActive ?? true,
        displayOrder: displayOrder ?? 0,
      })
      .returning();
    revalidatePath("/courses");
    revalidatePath("/admin/dashboard/courses");
    return NextResponse.json({ success: true, item: newItem[0] });
  } catch (error) {
    console.error("Failed to create course:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, name, description, fee, batchTimings, duration, isActive, displayOrder } = data;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (fee !== undefined) updateData.fee = fee?.trim() || null;
    if (batchTimings !== undefined) updateData.batchTimings = batchTimings?.trim() || null;
    if (duration !== undefined) updateData.duration = duration?.trim() || null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    const updated = await db
      .update(courses)
      .set(updateData)
      .where(eq(courses.id, id))
      .returning();
    revalidatePath("/courses");
    revalidatePath("/admin/dashboard/courses");
    return NextResponse.json({ success: true, item: updated[0] });
  } catch (error) {
    console.error("Failed to update course:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(courses).where(eq(courses.id, parseInt(id)));
    revalidatePath("/courses");
    revalidatePath("/admin/dashboard/courses");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete course:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
