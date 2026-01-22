import { STRINGS } from './strings';

export const VALIDATION_PATTERNS = {
  TITLE: /^(?=.*[a-zA-Z])[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/,
  AMOUNT: /^(?:0\.(?:[1-9]|[1-9]\d?)|[1-9]\d*(?:\.\d{1,2})?)$/,
} as const;

export const VALIDATION_RULES = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 30,
  },
  AMOUNT: {
    MIN_VALUE: 0.01,
    MAX_VALUE: 9999,
    MAX_DECIMALS: 2,
  },
} as const;

export const VALIDATION_MESSAGES = {
  TITLE: {
    REQUIRED: STRINGS.VALIDATION.TITLE_REQUIRED,
    INVALID: STRINGS.VALIDATION.TITLE_INVALID,
    MIN_LENGTH: STRINGS.VALIDATION.TITLE_MIN_LENGTH,
    MAX_LENGTH: STRINGS.VALIDATION.TITLE_MAX_LENGTH,
    ONLY_NUMBERS: STRINGS.VALIDATION.TITLE_ONLY_NUMBERS,
  },
  AMOUNT: {
    REQUIRED: STRINGS.VALIDATION.AMOUNT_REQUIRED,
    INVALID: STRINGS.VALIDATION.AMOUNT_INVALID,
    MIN_VALUE: STRINGS.VALIDATION.AMOUNT_MIN_VALUE,
    MAX_VALUE: STRINGS.VALIDATION.AMOUNT_MAX_VALUE,
    LEADING_ZEROS: STRINGS.VALIDATION.AMOUNT_LEADING_ZEROS,
    MAX_DECIMALS: 'Amount can have maximum 2 decimal places',
  },
} as const;

export interface ValidationErrors {
  title?: string;
  amount?: string;
}

export const validateTask = (data: { title?: string; amount?: string | number }): ValidationErrors => {
  const errors: ValidationErrors = {};

  const title = (data.title || '').trim();
  if (!title) errors.title = VALIDATION_MESSAGES.TITLE.REQUIRED;
  else if (title.length < VALIDATION_RULES.TITLE.MIN_LENGTH)
    errors.title = VALIDATION_MESSAGES.TITLE.MIN_LENGTH;
  else if (title.length > VALIDATION_RULES.TITLE.MAX_LENGTH)
    errors.title = VALIDATION_MESSAGES.TITLE.MAX_LENGTH;
  else if (!/[a-zA-Z]/.test(title)) errors.title = VALIDATION_MESSAGES.TITLE.ONLY_NUMBERS;
  else if (!VALIDATION_PATTERNS.TITLE.test(title)) errors.title = VALIDATION_MESSAGES.TITLE.INVALID;

  const amountStr = (data.amount ?? '').toString().trim();
  if (!amountStr) errors.amount = VALIDATION_MESSAGES.AMOUNT.REQUIRED;
  else if (isNaN(Number(amountStr))) errors.amount = VALIDATION_MESSAGES.AMOUNT.INVALID;
  else if (/^0$|^0\.0+$/.test(amountStr)) errors.amount = VALIDATION_MESSAGES.AMOUNT.MIN_VALUE;
  else if (/^0\d/.test(amountStr) && !/^0\.\d{1,2}$/.test(amountStr))
    errors.amount = VALIDATION_MESSAGES.AMOUNT.LEADING_ZEROS;
  else if (!VALIDATION_PATTERNS.AMOUNT.test(amountStr)) errors.amount = VALIDATION_MESSAGES.AMOUNT.INVALID;
  else {
    const amount = Number(amountStr);
    if (amount < VALIDATION_RULES.AMOUNT.MIN_VALUE)
      errors.amount = VALIDATION_MESSAGES.AMOUNT.MIN_VALUE;
    else if (amount > VALIDATION_RULES.AMOUNT.MAX_VALUE)
      errors.amount = VALIDATION_MESSAGES.AMOUNT.MAX_VALUE;
  }

  return errors;
};

export const isValidTask = (data: { title?: string; amount?: string | number }): boolean =>
  Object.keys(validateTask(data)).length === 0;

export const formatAmountInput = (value: string): string => {
  if (!value) return '';
  const parts = value.split('.');
  if (parts.length > 2) return value.slice(0, -1);
  if (parts[1] && parts[1].length > 2) {
    return `${parts[0]}.${parts[1].slice(0, 2)}`;
  }
  return value;
};
