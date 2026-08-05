"use client";
import { useState } from "react";
import styles from "./LeadForm.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LeadForm({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    purpose: "Admission Inquiry",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919754510027";
    
    const message = `Hello! English Seekhe By Chaturvedi Sir,
Mujhe aapke coaching center ke baare mein jaankari chahiye.

*Naam:* ${formData.name}
*Contact:* ${formData.contact}
*Address:* ${formData.address}
*Inquiry:* ${formData.purpose}

Please contact me. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.headerIcon}>📚</div>
        <h2 className={styles.title}>Course / Batch Inquiry</h2>
        <p className={styles.subtitle}>Apni details bharo aur Chaturvedi Sir WhatsApp pe sampark karenge</p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name *</label>
            <div className={styles.inputWrap}>
              <input 
                type="text" 
                required 
                placeholder="e.g. Ramesh Kumar"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Number *</label>
            <div className={styles.inputWrap}>
              <input 
                type="tel" 
                required 
                placeholder="+91 98765 43210"
                value={formData.contact} 
                onChange={e => setFormData({...formData, contact: e.target.value})} 
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Address *</label>
            <div className={styles.inputWrap}>
              <input 
                type="text" 
                required 
                placeholder="Your city / area"
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Purpose *</label>
            <div className={styles.inputWrap}>
              <select 
                value={formData.purpose} 
                onChange={e => setFormData({...formData, purpose: e.target.value})}
              >
                <option value="Spoken English Course">Spoken English Course</option>
                <option value="Grammar Batch">Grammar Batch</option>
                <option value="Competitive Exam Prep">Competitive Exam Prep (SSC/Bank/Railway)</option>
                <option value="Academic English">Academic English (School/College)</option>
                <option value="Demo Class">Free Demo Class</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className={styles.submitBtn}>
            📱 Send via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
