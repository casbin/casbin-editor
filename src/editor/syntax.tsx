import React from 'react';
import { Button, Echo } from '../ui';
import { Config } from 'casbin';

interface SyntaxProps {
  model: string;
  onResponse: (com: JSX.Element) => void;
}

const Syntax = (props: SyntaxProps) => {
  return (
    <Button
      style={{ marginRight: 8 }}
      onClick={() => {
        try {
          Config.newConfigFromText(props.model);
          props.onResponse(<Echo>Passed</Echo>);
        } catch (e) {
          props.onResponse(<Echo type={'error'}>{e.message}</Echo>);
        }
      }}
    >
      SYNTAX VALIDATE
    </Button>
  );
};

export default Syntax;
