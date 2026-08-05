import styles from "./about.module.css";
import { db } from "@/db";
import { aboutContent, siteSettings } from "@/db/schema";

export const revalidate = 0;

export default async function AboutPage() {
  const [items, settings] = await Promise.all([
    db.select().from(aboutContent),
    db.select().from(siteSettings)
  ]);

  const settingsMap: Record<string, string> = {};
  settings.forEach(s => {
    if (s.value) settingsMap[s.key] = s.value;
  });

  const director = items.find((i) => i.role === "director");
  const principal = items.find((i) => i.role === "principal");

  const aboutText = settingsMap["about_school_text"] || "English Seekhe By Chaturvedi Sir — Gwalior ke Mayur Vihar, Thatipur mein sthit ek trusted English coaching center. Yahan spoken English se lekar competitive exams tak har student ko expert guidance milti hai.";
  const visionText = settingsMap["vision_text"] || "Hamari vision hai ki Gwalior ka har student fluent English bole aur apne academic aur career goals achieve kare.";
  const missionText = settingsMap["mission_text"] || "Hamari mission hai ki English ko simple, practical aur effective tarike se sikhayein — jisse students real-world mein confident hon.";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>About English Seekhe By Chaturvedi Sir</h1>
        <p className={styles.subtitle} style={{ whiteSpace: "pre-wrap", maxWidth: "800px", margin: "0 auto" }}>{aboutText}</p>
      </div>

      <section className={styles.contentSection}>
        {/* Director */}
        <div className={styles.messageCard}>
          <div className={styles.imagePlaceholder}>
            {director?.photoUrl ? (
              <img
                src={director.photoUrl}
                alt={director.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
              />
            ) : (
              <span>Chaturvedi Sir Photo</span>
            )}
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.roleTitle}>Director&apos;s Message</h2>
            <h3 className={styles.name}>{director?.name || "—"}</h3>
            {director?.designation && (
              <p style={{ color: "#777", marginBottom: "10px", fontStyle: "italic" }}>{director.designation}</p>
            )}
            <p className={styles.message}>
              {director?.message || "Message coming soon..."}
            </p>
          </div>
        </div>

        <div className={`${styles.messageCard} ${styles.reverseCard}`}>
          <div className={styles.imagePlaceholder}>
            {principal?.photoUrl ? (
              <img
                src={principal.photoUrl}
                alt={principal.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
              />
            ) : (
              <span>Principal Photo</span>
            )}
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.roleTitle}>Principal&apos;s Message</h2>
            <h3 className={styles.name}>{principal?.name || "—"}</h3>
            {principal?.designation && (
              <p style={{ color: "#777", marginBottom: "10px", fontStyle: "italic" }}>{principal.designation}</p>
            )}
            <p className={styles.message}>
              {principal?.message || "Message coming soon..."}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.missionVision}>
        <div className={styles.mvCard}>
          <h3>Our Vision</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{visionText}</p>
        </div>
        <div className={styles.mvCard}>
          <h3>Our Mission</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{missionText}</p>
        </div>
      </section>
    </div>
  );
}
