import { describe, it, expect } from 'vitest';
import { createTaskSchema, updateTaskSchema } from '../tasks/tasks.schema.js';

describe('Tasks Schema - Unit Tests (Zod)', () => {
  describe('CreateTaskSchema', () => {
    it('should validate a correct task object', () => {
      const validTask = {
        title: 'Acheter du pain',
        description: 'Aller à la boulangerie artisanale',
        priority: 'HIGH',
      };

      const result = createTaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should fail if title is too short (min 1 chars)', () => {
      const invalidTask = { title: '' };
      const result = createTaskSchema.safeParse(invalidTask);

      expect(result.success).toBe(false);
      if (!result.success) {
        const errorField = result.error.issues[0]?.path[0];
        expect(errorField).toBe('title');
      }
    });

    it('should fail if priority is not a valid enum value', () => {
      const invalidTask = {
        title: 'Test Priority',
        priority: 'ULTRA_URGENT',
      };
      const result = createTaskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateTaskSchema', () => {
    it('should allow partial updates (all fields optional)', () => {
      const partialUpdate = { status: 'DONE' };
      const result = updateTaskSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should reject extra fields not defined in the schema', () => {
      const invalidUpdate = {
        status: 'DONE',
        hackerField: 'injection',
      };
      const result = updateTaskSchema.safeParse(invalidUpdate);

      expect(result.success).toBe(false);
    });
  });
});
