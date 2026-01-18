import { useState } from 'react';
import { HabitList } from '@components/habits/HabitList';
import { HabitForm } from '@components/habits/HabitForm';
import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import styles from './Habits.module.css';

function Habits() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>습관 관리</h1>
        <Button onClick={() => setIsFormOpen(true)}>새 습관 만들기</Button>
      </div>

      <HabitList />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="새 습관 만들기">
        <HabitForm
          onSuccess={() => {
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default Habits;
