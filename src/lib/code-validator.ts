import { ValidationRule } from './database.types';

export interface ValidationResult {
  passed: boolean;
  errors: string[];
}

export function validateCode(code: string, rules: ValidationRule | null): ValidationResult {
  const errors: string[] = [];

  if (!rules) {
    return { passed: true, errors: [] };
  }

  if (rules.mustContain && rules.mustContain.length > 0) {
    for (const required of rules.mustContain) {
      if (!code.includes(required)) {
        errors.push(`Code must contain: ${required}`);
      }
    }
  }

  if (rules.mustNotContain && rules.mustNotContain.length > 0) {
    for (const forbidden of rules.mustNotContain) {
      if (code.includes(forbidden)) {
        errors.push(`Code must not contain: ${forbidden}`);
      }
    }
  }

  if (rules.regexMatch) {
    try {
      const regex = new RegExp(rules.regexMatch, 's');
      if (!regex.test(code)) {
        errors.push('Code does not match the required pattern');
      }
    } catch (err) {
      errors.push('Invalid regex pattern in validation rules');
    }
  }

  if (rules.methodSignatureExists) {
    try {
      const regex = new RegExp(rules.methodSignatureExists, 's');
      if (!regex.test(code)) {
        errors.push('Required method signature not found');
      }
    } catch (err) {
      errors.push('Invalid method signature pattern in validation rules');
    }
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}
