import React, { useState } from 'react';
import { Input } from '../../../shared/components/Input/Input';
import { Button } from '../../../shared/components/Button/Button';
import styles from './CustomersPage.module.css';

const DUMMY_PROFILE = {
  name: '홍길동',
  company: 'A사',
  role: '구매 담당',
  email: 'hong@company-a.com',
  phone: '02-1234-5678',
};

const DUMMY_ACTIVITY = [
  { id: 1, text: '연락처 수정', date: '2025-01-28' },
  { id: 2, text: '미팅 기록 추가', date: '2025-01-25' },
  { id: 3, text: '견적 요청', date: '2025-01-20' },
];

export function CustomersPage() {
  const [email, setEmail] = useState(DUMMY_PROFILE.email);
  const [phone, setPhone] = useState(DUMMY_PROFILE.phone);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Customers</h1>
      <p className={styles.subtitle}>View and update customer profiles</p>

      <div className={styles.layout}>
        <aside className={styles.profileCard}>
          <div className={styles.avatar}>홍</div>
          <h2 className={styles.profileName}>{DUMMY_PROFILE.name}</h2>
          <p className={styles.profileMeta}>{DUMMY_PROFILE.company} · {DUMMY_PROFILE.role}</p>
          <dl className={styles.profileInfo}>
            <dt>Email</dt>
            <dd>{DUMMY_PROFILE.email}</dd>
            <dt>Phone</dt>
            <dd>{DUMMY_PROFILE.phone}</dd>
          </dl>
        </aside>
        <div className={styles.main}>
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Update contact info</h2>
            <form
              className={styles.form}
              onSubmit={(e) => e.preventDefault()}
            >
              <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button variant="primary" type="submit">Save (dummy)</Button>
            </form>
          </section>
          <section className={styles.activitySection}>
            <h2 className={styles.sectionTitle}>Activity log</h2>
            <ul className={styles.activityList}>
              {DUMMY_ACTIVITY.map((a) => (
                <li key={a.id} className={styles.activityItem}>
                  <span className={styles.activityText}>{a.text}</span>
                  <span className={styles.activityDate}>{a.date}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
