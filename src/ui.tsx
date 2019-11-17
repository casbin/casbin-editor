import styled from 'styled-components';

export const Button = styled.button`
  border: 1px solid #443d80;
  border-radius: 3px;
  color: #443d80;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2em;
  padding: 10px;
  text-decoration: none !important;
  text-transform: uppercase;
  transition: background 0.3s, color 0.3s;

  :hover {
    background: #443d80;
    color: #fff;
  }
`;

export const HeaderTitle = styled.h4`
  padding: 8px;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const EditorContainer = styled.div`
  flex: 1;
`;

interface EchoProps {
  type?: 'pass' | 'error';
}

const error = '#db4545';
const pass = '#39aa56';

export const Echo = styled.span<EchoProps>`
  color: ${(props: EchoProps) => {
    switch (props.type) {
      case 'error':
        return error;
      case 'pass':
        return pass;
    }
  }};
  font-weight: 600;
  font-size: 14px;
`;

Echo.defaultProps = {
  type: 'pass'
};

export const Footer = styled.div`
  padding: 1em;
  background: #222;
`;
