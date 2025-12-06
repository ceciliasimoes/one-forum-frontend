import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPassword(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';

    if (!value) return { required: true };

    const minLength = 6;
    const maxLength = 8;

    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);

    const validLength = value.length >= minLength && value.length <= maxLength;

    const valid =
      hasLower && hasUpper && hasNumber && hasSymbol && validLength;

    return valid
      ? null
      : {
          strongPassword: {
            hasLower,
            hasUpper,
            hasNumber,
            hasSymbol,
            validLength,
          },
        };
  };
}

export function passwordsMatch(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;

    if (password && confirm && password !== confirm) {
      return { passwordsMismatch: true };
    }

    return null;
  };
}
