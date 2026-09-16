"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

interface Course {
  id: number;
  name: string;
  description: string | null;
  fee: string | null;
  batchTimings: string | null;
  duration: string | null;
  isActive: boolean;
  displayOrder: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => { if (data.success) setCourses(data.courses); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const courseIcons = ["🎓", "📘", "🗣️", "✍️", "📝", "🏆", "💬", "📚"];

  return (
    <>
      <section className={styles.heroBanner}>
        <div className={styles.heroBannerContent}>
          <span className="section-label">Hamare Courses</span>
          <h1 className={`${styles.heroBannerTitle} animate-fade-in`}>
            Apni English Journey <span>Shuru Karein</span>
          </h1>
          <p className={`${styles.heroBannerSub} animate-fade-in-2`}>
            Chaturvedi Sir ke saath — Spoken English se lekar Competitive Exams tak, har level ke liye expert courses available hain.
          </p>
        </div>
      </section>

      <section className={styles.coursesSection}>
        <div className={styles.sectionHeader}>
          <span className="section-label">Sabhi Courses</span>
          <h2>Chuniye <span className="gradient-text">Apna Course</span></h2>
          <p>Har course professionally designed hai — result-oriented teaching, small batches aur personal attention ke saath.</p>
        </div>

        {loading ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>⏳</span>
            <h3>Load ho raha hai...</h3>
          </div>
        ) : courses.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📚</span>
            <h3>Courses Coming Soon!</h3>
            <p>Abhi courses update ho rahe hain. Enquiry ke liye neeche contact karein.</p>
          </div>
        ) : (
          <div className={styles.coursesGrid}>
            {courses.map((course, index) => (
              <div key={course.id} className={`${styles.courseCard} animate-fade-in`}>
                <div className={styles.cardBody}>
                  <span className={styles.courseIcon}>{courseIcons[index % courseIcons.length]}</span>
                  <h3 className={styles.courseName}>{course.name}</h3>
                  {course.description && (
                    <p className={styles.courseDescription}>{course.description}</p>
                  )}
                  <div className={styles.badgesRow}>
                    {course.fee && <span className={styles.feeBadge}>💰 {course.fee}</span>}
                    {course.duration && <span className={styles.durationBadge}>⏱️ {course.duration}</span>}
                  </div>
                  {course.batchTimings && (
                    <div className={styles.batchTimings}>
                      <div className={styles.batchLabel}>⏰ Batch Timings</div>
                      <div className={styles.batchValue}>{course.batchTimings}</div>
                    </div>
                  )}
                </div>
                <div className={styles.cardFooter}>
                  <button className={styles.enquireBtn} onClick={() => setIsLeadFormOpen(true)}>
                    📞 Enquire Now / Enroll Karein
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.ctaSection}>
        <h2>Koi Doubt? Baat Karein Chaturvedi Sir Se!</h2>
        <p>Free demo class ke liye abhi register karein ya seedha call karein. Hamari team tayaar hai.</p>
        <button className={styles.ctaBtn} onClick={() => setIsLeadFormOpen(true)}>
          ✨ Free Demo Class Book Karein
        </button>
      </section>

      <LeadForm isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} />
    </>
  );
}
