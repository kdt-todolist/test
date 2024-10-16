import React from 'react';
import styled from 'styled-components';
import { FaEye } from "react-icons/fa6";

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
    border-color: transparent;
    //background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0 M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: rgb(37 99 235);
    // background-color: rgb(163 230 53);
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
      <CheckboxComponent type="checkbox" checked={checked} onChange={onChange}/>
      {label && <CheckboxLabel>{label}</CheckboxLabel>}
    </Label>
  );
};

export default Checkbox;
