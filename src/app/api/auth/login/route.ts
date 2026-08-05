import { NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    // Check if any admin exists. If not, create the default one.
    let adminList = await db.select().from(admins).limit(1);
    
    if (adminList.length === 0) {
      const defaultUsername = process.env.ADMIN_USERNAME || "admin";
      const defaultPassword = process.env.ADMIN_PASSWORD || "saraswati@123";
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      
      await db.insert(admins).values({
        username: defaultUsername,
        passwordHash
      });
    }

    const adminUser = await db.query.admins.findFirst({
      where: eq(admins.username, username),
    });

    if (!adminUser) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    const token = await signToken({ id: adminUser.id, username: adminUser.username });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
