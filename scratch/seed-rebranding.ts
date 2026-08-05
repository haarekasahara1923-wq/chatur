import { db } from "../src/db";
import { contactInfo, siteSettings, announcements } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function seedRebranding() {
  console.log("🚀 Starting rebranding DB update...");

  // ── 1. Update / Insert Contact Info ──────────────────────────────
  const existingContact = await db.select().from(contactInfo).limit(1);

  if (existingContact.length > 0) {
    await db
      .update(contactInfo)
      .set({
        phone: "+917987947561",
        whatsapp: "919754510027",
        email: "info@englishseekhe.com",
        address: "Mayur Vihar, Thatipur, Gwalior (MP)",
        mapEmbedUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113917.27804004484!2d78.11637869999999!3d26.248527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c5b41de2d22d%3A0x4ad74c1ce2c24d49!2sThatipur%2C%20Gwalior%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      })
      .where(eq(contactInfo.id, existingContact[0].id));
    console.log("✅ Contact info updated.");
  } else {
    await db.insert(contactInfo).values({
      phone: "+917987947561",
      whatsapp: "919754510027",
      email: "info@englishseekhe.com",
      address: "Mayur Vihar, Thatipur, Gwalior (MP)",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113917.27804004484!2d78.11637869999999!3d26.248527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c5b41de2d22d%3A0x4ad74c1ce2c24d49!2sThatipur%2C%20Gwalior%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    });
    console.log("✅ Contact info inserted.");
  }

  // ── 2. Update Site Settings ───────────────────────────────────────
  const settingsToUpdate: Array<{ key: string; value: string }> = [
    { key: "school_name", value: "English Seekhe By Chaturvedi Sir" },
    {
      key: "school_tagline",
      value:
        "Gwalior mein English sikhne ka sabse trusted naam. Academic aur competitive exams ke liye expert coaching.",
    },
    {
      key: "about_school_text",
      value:
        "English Seekhe By Chaturvedi Sir — Gwalior ke Mayur Vihar, Thatipur mein sthit ek trusted English coaching center. Yahan spoken English se lekar competitive exams tak har student ko expert guidance milti hai. Chaturvedi Sir ke 8+ saalon ke anubhav se hazaaron students ne apni English transform ki hai.",
    },
    {
      key: "vision_text",
      value:
        "Hamari vision hai ki Gwalior ka har student fluent English bole aur apne academic aur career goals achieve kare — bina kisi hesitance ke.",
    },
    {
      key: "mission_text",
      value:
        "Hamari mission hai ki English ko simple, practical aur effective tarike se sikhayein — jisse students real-world mein confident hon aur competitive exams mein top karein.",
    },
  ];

  for (const setting of settingsToUpdate) {
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, setting.key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({ value: setting.value })
        .where(eq(siteSettings.key, setting.key));
      console.log(`✅ Updated setting: ${setting.key}`);
    } else {
      await db.insert(siteSettings).values(setting);
      console.log(`✅ Inserted setting: ${setting.key}`);
    }
  }

  // ── 3. Update Announcements ───────────────────────────────────────
  // Delete old announcements and add coaching-relevant ones
  await db.delete(announcements);
  await db.insert(announcements).values([
    {
      text: "🎉 Naya Batch Shuru Ho Raha Hai! Spoken English & Grammar — Limited Seats. Call: +917987947561",
      isActive: true,
      displayOrder: 1,
    },
    {
      text: "📚 Competitive Exam (SSC/Bank/Railway) English Batch — Join Karein Aaj!",
      isActive: true,
      displayOrder: 2,
    },
    {
      text: "✨ Free Demo Class Available — WhatsApp: +919754510027 pe Contact Karein",
      isActive: true,
      displayOrder: 3,
    },
  ]);
  console.log("✅ Announcements updated.");

  console.log("\n🎊 Rebranding DB update complete!");
  process.exit(0);
}

seedRebranding().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
