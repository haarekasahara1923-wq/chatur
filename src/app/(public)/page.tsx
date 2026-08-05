"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

export default function Home() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const years    = useCountUp(8);
  const students = useCountUp(1200);
  const batches  = useCountUp(30);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={`${styles.heroBadge} animate-fade-in`}>
            🏆 &nbsp; Gwalior ka No.1 English Coaching Center — Thatipur
          </div>
          <h1 className={`${styles.heroTitle} animate-fade-in-2`}>
            <span className={styles.heroTitleHighlight}>English Seekhe</span>
            <br />
            <span className={styles.heroTitleBy}>by</span>{" "}
            <span className={styles.heroTitleAccent}>Chaturvedi Sir</span>
          </h1>
          <p className={`${styles.heroSubtitle} animate-fade-in-3`}>
            Spoken English, Grammar, Academic aur Competitive Exams — sabke liye expert coaching. Apna English future aaj se shuru karein!
          </p>
          <div className={`${styles.ctaGroup} animate-fade-in-3`}>
            <button className="btn-primary" onClick={() => setIsLeadFormOpen(true)}>
              ✨ Free Demo Class Join Karein
            </button>
            <Link href="/about" className="btn-secondary">
              Hamare Baare Mein Jaanein →
            </Link>
          </div>
        </div>
        <div className={styles.heroScrollIndicator}>
          <div className={styles.scrollDot} />
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className={styles.statsBar}>
        <div className={styles.statItem} ref={years.ref}>
          <div className={styles.statNumber}>{years.count}+</div>
          <div className={styles.statLabel}>Years of Excellence</div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem} ref={students.ref}>
          <div className={styles.statNumber}>{students.count}+</div>
          <div className={styles.statLabel}>Students Trained</div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem} ref={batches.ref}>
          <div className={styles.statNumber}>{batches.count}+</div>
          <div className={styles.statLabel}>Batches Completed</div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <div className={styles.statNumber}>100%</div>
          <div className={styles.statLabel}>Success Rate</div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className={styles.aboutSection}>
        <div className={`${styles.aboutText} animate-slide-left`}>
          <span className="section-label">Hamare Baare Mein</span>
          <h2 className={`section-title-display ${styles.aboutHeading}`}>
            English Seekhna Ab <span className="gradient-text">Aasaan Hai</span>
          </h2>
          <p className={styles.aboutPara}>
            English Seekhe By Chaturvedi Sir — Gwalior ke Mayur Vihar, Thatipur mein sthit ek trusted English coaching center hai. Yahan academic English se lekar competitive exams tak, har student ke liye personalized guidance di jaati hai.
          </p>
          <p className={styles.aboutPara}>
            Chaturvedi Sir ke 8+ saalon ke teaching experience aur innovative methods se hazaaron students ne apni English communication skills ko transform kiya hai. Hamara focus hai — sirf grammar nahi, real-world English bolna, likhna aur samajhna.
          </p>
          <div className={styles.aboutActions}>
            <Link href="/about" className="btn-outline">Poori Story Padhein →</Link>
          </div>
        </div>
        <div className={`${styles.aboutImageWrap} animate-slide-right`}>
          <img
            src="/images/school_activities.jpg"
            alt="Students in English coaching class by Chaturvedi Sir"
            className={styles.aboutImg}
          />
          <div className={styles.aboutImageBadge}>
            <span className={styles.badgeIcon}>🎓</span>
            <div>
              <div className={styles.badgeNum}>8+</div>
              <div className={styles.badgeText}>Years of Trust</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES / WHY US ===== */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresSectionHeader}>
          <span className="section-label">Kyun Chunein Hume</span>
          <h2 className="section-title-display">
            Hum Kya <span className="gradient-text">Special</span> Offer Karte Hain
          </h2>
        </div>
        <div className={styles.featuresGrid}>
          {[
            { image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop", title: "Spoken English", desc: "Daily practice sessions aur real-life conversations ke through fluent English bolna seekhein. Confidence build karein." },
            { image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop", title: "Grammar Mastery", desc: "Basic se advanced grammar — tenses, articles, prepositions — sab kuch simple aur effective tarike se sikhaya jaata hai." },
            { image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=600&auto=format&fit=crop", title: "Academic English", desc: "School aur college ke liye English writing, reading comprehension aur board exam preparation." },
            { image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop", title: "Competitive Exam Prep", desc: "SSC, Bank, Railway, UPSC — sabhi competitive exams ke liye English section ki comprehensive preparation." },
            { image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop", title: "Small Batch Size", desc: "Har student ko personal attention mile isliye hum chote batches mein padhaate hain. Individual progress track hota hai." },
            { image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop", title: "Regular Tests & Feedback", desc: "Weekly tests, mock exams aur detailed feedback se progress measure hoti hai aur improvement tezi se hoti hai." },
          ].map((f) => (
            <div key={f.title} className={`${styles.featureCard} card-hover`}>
              <img src={f.image} alt={f.title} className={styles.featureImage} />
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerContent}>
          <h2 className={styles.ctaBannerTitle}>Naya Batch Shuru Ho Raha Hai!</h2>
          <p className={styles.ctaBannerSub}>
            Abhi enroll karein aur apni English journey shuru karein Chaturvedi Sir ke saath. Limited seats available!
          </p>
          <button className={styles.ctaBannerBtn} onClick={() => setIsLeadFormOpen(true)}>
            Free Demo Class Book Karein →
          </button>
        </div>
      </section>

      <LeadForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} />
    </>
  );
}
