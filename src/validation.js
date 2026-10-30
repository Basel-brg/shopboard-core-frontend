// Form Validation Rules & Utilities
import { VALID_COUPONS } from './cart.js'

export const VALIDATION_RULES = {
  name: {
    test: (val) => val.trim().length >= 3 && !/^\d+$/.test(val.trim()),
    message: 'يرجى إدخال اسم صحيح لا يقل عن 3 أحرف'
  },
  email: {
    test: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim()),
    message: 'يرجى إدخال عنوان بريد إلكتروني صالح (مثال: name@domain.com)'
  },
  phone: {
    test: (val) => /^(05|5|\+9665|\+?)[0-9]{8,12}$/.test(val.trim().replace(/[\s-]/g, '')),
    message: 'يرجى إدخال رقم جوال صحيح (مثال: 0512345678)'
  },
  password: {
    test: (val) => val.length >= 6,
    message: 'كلمة المرور يجب أن تتكون من 6 خانات على الأقل'
  },
  city: {
    test: (val) => val.trim().length >= 4,
    message: 'يرجى إدخال اسم المدينة والعنوان بالتفصيل (4 أحرف على الأقل)'
  },
  coupon: {
    test: (val) => {
      const code = val.trim().toUpperCase()
      return code.length >= 3 && Boolean(VALID_COUPONS[code])
    },
    message: 'كود الخصم غير صالح — جرب SHOP20 أو WELCOME10'
  },
  search: {
    test: (val) => val.trim().length <= 80 && !/[<>]/.test(val),
    message: 'نص البحث يجب ألا يتجاوز 80 حرفاً أو يحتوي على رموز غير مسموحة'
  },
  priceRange: {
    test: (val) => {
      const num = Number(val)
      return !Number.isNaN(num) && num >= 90 && num <= 600
    },
    message: 'نطاق السعر يجب أن يكون بين 90 و 600 ر.س'
  }
}

/**
 * Validates a single input element and displays or clears an inline error message.
 * @param {HTMLInputElement | HTMLSelectElement} input
 * @param {keyof VALIDATION_RULES} ruleKey
 * @returns {boolean} isValid
 */
export function validateField(input, ruleKey) {
  const rule = VALIDATION_RULES[ruleKey]
  if (!rule || !input) return true

  const value = input.value || ''
  const isValid = rule.test(value)

  const container = input.closest('.form-field') || input.parentElement
  let errorEl = container.querySelector('.field-error')

  if (!isValid) {
    if (!errorEl) {
      errorEl = document.createElement('span')
      errorEl.className = 'field-error'
      errorEl.id = `${input.id}-error`
      errorEl.setAttribute('role', 'alert')
      container.appendChild(errorEl)
    }
    errorEl.textContent = rule.message
    input.classList.add('has-error')
    input.setAttribute('aria-invalid', 'true')
    input.setAttribute('aria-describedby', errorEl.id)
  } else {
    if (errorEl) {
      errorEl.remove()
    }
    input.classList.remove('has-error')
    input.removeAttribute('aria-invalid')
    input.removeAttribute('aria-describedby')
  }

  return isValid
}

/**
 * Clears validation errors on a form or specific input.
 * @param {HTMLElement} root
 */
export function clearValidationErrors(root) {
  if (!root) return
  root.querySelectorAll('.field-error').forEach((el) => el.remove())
  root.querySelectorAll('.has-error').forEach((input) => {
    input.classList.remove('has-error')
    input.removeAttribute('aria-invalid')
    input.removeAttribute('aria-describedby')
  })
}

/**
 * Validates all fields configured in a form.
 * @param {HTMLFormElement} form
 * @param {Array<{ inputId: string, ruleKey: keyof VALIDATION_RULES }>} fieldConfigs
 * @returns {boolean} allValid
 */
export function validateForm(form, fieldConfigs) {
  let isAllValid = true
  let firstInvalidInput = null

  fieldConfigs.forEach(({ inputId, ruleKey }) => {
    const input = form.querySelector(`#${inputId}`)
    if (input) {
      const valid = validateField(input, ruleKey)
      if (!valid) {
        isAllValid = false
        if (!firstInvalidInput) {
          firstInvalidInput = input
        }
      }
    }
  })

  if (firstInvalidInput) {
    firstInvalidInput.focus()
  }

  return isAllValid
}

/**
 * Attaches real-time blur and input listeners to validate fields on the fly.
 * @param {string} inputId
 * @param {keyof VALIDATION_RULES} ruleKey
 * @param {{ validateOnBlur?: boolean }} options
 */
export function attachLiveValidation(inputId, ruleKey, options = { validateOnBlur: true }) {
  const input = document.querySelector(`#${inputId}`)
  if (!input) return

  if (options.validateOnBlur) {
    input.addEventListener('blur', () => {
      if (input.value.trim().length > 0) {
        validateField(input, ruleKey)
      }
    })
  }

  input.addEventListener('input', () => {
    if (input.classList.contains('has-error')) {
      validateField(input, ruleKey)
    }
  })
}
