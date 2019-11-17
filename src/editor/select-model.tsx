import React from 'react';
import { getSelectedModel, setSelectedModel } from './persist';

interface SelectModelProps {
  onChange: (value: string) => void;
}

const SelectModel = (props: SelectModelProps) => {
  return (
    <select
      defaultValue={getSelectedModel()}
      onChange={e => {
        const model = e.target.value;
        setSelectedModel(model);
        props.onChange(model);
      }}
    >
      <option value="" disabled>
        Select your model
      </option>
      <option value="basic">ACL</option>
      <option value="basic_with_root">ACL with superuser</option>
      <option value="basic_without_resources">ACL without resources</option>
      <option value="basic_without_users">ACL without users</option>
      <option value="rbac">RBAC</option>
      <option value="rbac_with_resource_roles">RBAC with resource roles</option>
      <option value="rbac_with_domains">RBAC with domains/tenants</option>
      <option value="rbac_with_deny">RBAC with deny-override</option>
      <option value="abac">ABAC</option>
      <option value="keymatch">RESTful (KeyMatch)</option>
      <option value="keymatch2">RESTful (KeyMatch2)</option>
      <option value="ipmatch">IP match</option>
      <option value="priority">Priority</option>
    </select>
  );
};

SelectModel.defaultProps = {
  onChange: console.log,
  defaultValue: 'basic'
};
export default SelectModel;
