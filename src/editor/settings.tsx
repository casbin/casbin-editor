import React from "react";

import styled from "styled-components";
import { CustomFunctionEditor } from "./editor";
import { ModelKind } from "./casbin-mode/example";
import { useLocalStorage } from "./use-local-storage";

const Container = styled.div<{ open: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
  background: #ffffff;
  width: ${props => props.open ? "18rem" : "1rem"};
  padding: ${props => props.open ? "1rem" : 0};
`;

const ToggleButtonContainer = styled.div`
  display: block;
  cursor: pointer;
  position: absolute;
  top: 2px;
  border-radius: 50%;
  background: #ffffff;
  right: -0.75rem;
  height: 1.5rem;
  width: 1.5rem;
  color: #000000;
  box-shadow: rgb(9 30 66 / 8%) 0 0 0 1px, rgb(9 30 66 / 8%) 0 2px 4px 1px;

  ${Container}:hover & {
    display: block;
  }
`;

interface SettingsProps {
  modelKind: ModelKind;
  enableABAC: boolean;
  onEnableABAC: (v: boolean) => void;
  onCustomConfigChange: (text: string) => void;
}


export function Settings(props: SettingsProps) {
  const [open, setOpen] = useLocalStorage(true, "SETTINGS_OPEN");

  return (
    <Container open={open}>
      <ToggleButtonContainer onClick={() => setOpen(!open)}>
        <svg style={{ width: "100%", height: "100%", transform: open ? "rotateZ(0deg)" : "rotateZ(180deg)" }}
             viewBox="0 0 24 24">
          <path fill={"currentColor"} d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
        </svg>
      </ToggleButtonContainer>

      <div style={{ display: open ? "flex" : "none", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <span style={{ flex: 1 }}>Enable ABAC</span>
          <input defaultChecked={props.enableABAC} type={"checkbox"} onChange={(e) => {
            props.onEnableABAC(e.target.checked);
          }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ flex: 1, margin: "0.5rem 0" }}>Custom config</span>
          <CustomFunctionEditor modelKind={props.modelKind} onChange={props.onCustomConfigChange} />
        </div>
      </div>
    </Container>
  );
};

