export const validateLength = (input, maxLength, fieldName) => {
    if (input.length > maxLength) {
      window.alert(`${fieldName}은 ${maxLength}자 이내로 입력해주세요.`);
      return false;
    }
    return true;
  };