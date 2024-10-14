import React from 'react';
import styled from 'styled-components';

// 둥근 체크박스 스타일
const RoundCheckbox = styled.input`
  appearance: none;
  height: 1.8rem;
  width: 1.8rem;
  margin: 0.25rem; /* space-1 */

  background-color: #fff; /* white */

  border: 2px solid #d1d5db; /* gray-300 */
  border-radius: 50%; /* 둥근 모양 */
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  cursor: pointer;
  
  &:checked {
    background-color: #2563eb; /* blue-600 */
    border-color: transparent;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5); /* focus:ring-blue-500 */
  }
`;

// 네모난 체크박스 스타일
const SquareCheckbox = styled.input`
  appearance: none;
  height: 1.8rem;
  width: 1.8rem;
  margin: 0.25rem; /* space-1 */

  background-color: #fff; /* white */
  border: 2px solid #d1d5db; /* gray-300 */
  border-radius: 0.375rem; /* 네모난 모양 */
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  cursor: pointer;
  
  &:checked {
    background-color: #2563eb; /* blue-600 */
    border-color: transparent;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5); /* focus:ring-blue-500 */
  }
`;

// 스타일이 적용된 라벨
const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* space-x-3 */
  cursor: pointer;
`;

// 스타일이 적용된 텍스트
const CheckboxLabel = styled.span`
  font-size: 1.125rem; /* text-lg */
  font-weight: 500; /* font-medium */
  color: #1f2937; /* gray-800 */
`;

// Checkbox 컴포넌트
const Checkbox = ({ checked, onChange, label, shape }) => {
  const CheckboxComponent = shape === 'round' ? RoundCheckbox : SquareCheckbox;

  return (
    <Label>
      <CheckboxComponent type="checkbox" checked={checked} onChange={onChange} />
      {label && <CheckboxLabel>{label}</CheckboxLabel>}
    </Label>
  );
};

export default Checkbox;
