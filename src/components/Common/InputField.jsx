import styled, { css } from "styled-components";

const StyledInput = styled.input`

  ${(p) => p.sizestyle}
  ${(p) => p.borderstyle}

  font-size: var(--input-font-size, 16px);
  font-weight: var(--input-font-weight, 600);
  padding: var(--input-padding, 10px 20px);
  outline: var(--input-outline, 1px solid rgb(229 231 235));
  border-radius: var(--input-radius, 5px);
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  &:active, &:hover, &:focus {
    --input-outline: 2px solid rgb(96 165 250);
  }
`;

const BORDER = {
  pill: css`
    --input-radius: 999px;
  `,
}

const SIZES = {
  sm: css`
    --input-font-size: 12px;
    --input-font-weight: 500;
    --input-padding: 7.5px 20px;
  `,
  md: css`
    --input-font-size: 16px;
    --input-font-weight: 600;
    --input-padding: 10px 20px;
  `,
  lg: css`
    --input-font-size: 18px;
    --input-font-weight: 600;
    --input-padding: 15px 20px;
  `
};

function InputField(props) {
  const { size, border, placeholder } = props;

  const sizestyle = SIZES[size];
  const borderstyle = BORDER[border];

  return (
    <StyledInput 
      sizestyle={sizestyle}
      borderstyle={borderstyle}
      placeholder={placeholder}
    />
  );
}

export default InputField;