import { useState, useEffect } from 'react';
import { FREQUENCY_TYPES, CATEGORIES, CATEGORY_LABELS, FREQUENCY_LABELS } from '@constants';
import { validateHabit } from '@utils/validation';
import { useCreateHabit, useUpdateHabit } from '@hooks/useHabits';
import styles from './HabitForm.module.css';

/**
 * 습관 생성/수정 폼 컴포넌트
 * @param {Object} props
 * @param {Object} props.habit - 수정할 습관 데이터 (없으면 생성 모드)
 * @param {Function} props.onSuccess - 성공 시 콜백
 * @param {Function} props.onCancel - 취소 시 콜백
 */
export function HabitForm({ habit, onSuccess, onCancel }) {
  const isEditMode = !!habit;
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();

  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    target_value: habit?.target_value || '',
    target_unit: habit?.target_unit || '',
    frequency_type: habit?.frequency_type || FREQUENCY_TYPES.DAILY,
    frequency_value: habit?.frequency_value || 1,
    category: habit?.category || CATEGORIES.OTHER,
    reminder_time: habit?.reminder_time || '',
    start_date: habit?.start_date || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'frequency_value' || name === 'target_value' ? Number(value) || '' : value,
    }));
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const validation = validateHabit(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      if (isEditMode) {
        await updateHabit.mutateAsync({ id: habit.id, updates: formData });
      } else {
        await createHabit.mutateAsync(formData);
      }
      onSuccess?.();
    } catch (error) {
      setErrors([error.message || '오류가 발생했습니다.']);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((error, index) => (
            <div key={index} className={styles.error}>
              {error}
            </div>
          ))}
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="name">습관 이름 *</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="예: 매일 운동하기"
          maxLength={50}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="description">설명</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="습관에 대한 설명을 입력하세요"
          rows={3}
          maxLength={200}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="frequency_type">빈도 타입 *</label>
          <select id="frequency_type" name="frequency_type" value={formData.frequency_type} onChange={handleChange}>
            {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="frequency_value">횟수 *</label>
          <input
            id="frequency_value"
            name="frequency_value"
            type="number"
            value={formData.frequency_value}
            onChange={handleChange}
            required
            min={1}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="target_value">목표 수치</label>
          <input
            id="target_value"
            name="target_value"
            type="number"
            value={formData.target_value}
            onChange={handleChange}
            placeholder="예: 30"
            min={0}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="target_unit">단위</label>
          <input
            id="target_unit"
            name="target_unit"
            type="text"
            value={formData.target_unit}
            onChange={handleChange}
            placeholder="예: 분, km, 페이지"
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="category">카테고리</label>
        <select id="category" name="category" value={formData.category} onChange={handleChange}>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="reminder_time">알림 시간</label>
        <input
          id="reminder_time"
          name="reminder_time"
          type="time"
          value={formData.reminder_time}
          onChange={handleChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="start_date">시작일 *</label>
        <input
          id="start_date"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            취소
          </button>
        )}
        <button type="submit" disabled={createHabit.isPending || updateHabit.isPending} className={styles.submitButton}>
          {createHabit.isPending || updateHabit.isPending
            ? '저장 중...'
            : isEditMode
            ? '수정'
            : '생성'}
        </button>
      </div>
    </form>
  );
}
