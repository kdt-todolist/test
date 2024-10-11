import styled, { css } from "styled-components";

const BORDER = {
  pill: css`
    border-radius: 9999px;
  `,
}

const VARIANTS = {
  success: css`
    --button-bg-color: #28a745;
    --button-hover-bg-color: #218838;
  `,
  danger: css`
    --button-bg-color: #dc3545;
    --button-hover-bg-color: #c82333;
  `,
  warning: css`
    --button-bg-color: #ffc107;
    --button-hover-bg-color: #e0a800;
  `,
  light: css`
    --button-bg-color: #e2e6ea;
    --button-hover-bg-color: #d3d9df;
    --button-color: #212529;
  `,
};

const SIZES = {
  sm: css`
    --button-font-size: 0.875rem;
    --button-padding: 8px 12px;
  `,
  md: css`
    --button-font-size: 1rem;
    --button-padding: 12px 24px;
  `,
  lg: css`
    --button-font-size: 1.25rem;
    --button-padding: 16px 20px;
  `
};


function Button({ label, size, border, variant, onClick }) {
  
  const sizeStyle = SIZES[size];
  const borderStyle = BORDER[border];
  const variantStyle = VARIANTS[variant];

  return (
    <CustomButton 
      className="text-white rounded"
      sizeStyle={sizeStyle}
      borderStyle={borderStyle}
      variantStyle={variantStyle}
      onClick={onClick}
    >
      {label}
    </CustomButton>
  );
}

const CustomButton = styled.button
`
  ${(p) => p.sizeStyle}
  ${(p) => p.borderStyle}
  ${(p) => p.variantStyle}

  margin: 0;
  border: none;
  cursor: pointer;
  font-family: "Noto Sans KR", sans-serif;
  padding: var(--button-padding, 12px 16px);
  background: var(--button-bg-color, #0d6efd);

  &:active, &:hover, &:focus {
    background: var(--button-hover-bg-color, #025ce2);
  }
`;

export default Button;