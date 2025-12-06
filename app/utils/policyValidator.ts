// Copyright 2024 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Interface representing the expected structure of a policy type
 */
export interface PolicyDefinition {
  /** The policy type (e.g., 'p', 'g', 'g2') */
  type: string;
  /** Expected number of fields for this policy type */
  fieldCount: number;
  /** Field names extracted from the model definition */
  fieldNames: string[];
}

/**
 * Interface representing a validation error for a policy line
 */
export interface PolicyValidationError {
  /** Line number (1-indexed) */
  line: number;
  /** Error message describing the issue */
  message: string;
  /** The policy type that has an error */
  policyType?: string;
}

/**
 * Parses the model text to extract policy definitions
 * @param modelText - The complete model configuration text
 * @returns Map of policy type to its definition
 */
export function parseModelDefinitions(modelText: string): Map<string, PolicyDefinition> {
  const definitions = new Map<string, PolicyDefinition>();
  
  if (!modelText || modelText.trim() === '') {
    return definitions;
  }

  const lines = modelText.split('\n');
  let inPolicyDefinition = false;
  let inRoleDefinition = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for section headers
    if (trimmedLine === '[policy_definition]') {
      inPolicyDefinition = true;
      inRoleDefinition = false;
      continue;
    } else if (trimmedLine === '[role_definition]') {
      inRoleDefinition = true;
      inPolicyDefinition = false;
      continue;
    } else if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
      // Entering a different section
      inPolicyDefinition = false;
      inRoleDefinition = false;
      continue;
    }

    // Parse policy definitions (e.g., "p = sub, obj, act")
    if (inPolicyDefinition && trimmedLine && !trimmedLine.startsWith('#')) {
      const match = trimmedLine.match(/^(\w+)\s*=\s*(.+)$/);
      if (match) {
        const [, type, fieldsStr] = match;
        const fields = fieldsStr.split(',').map((f) => {
          return f.trim();
        }).filter((f) => {
          return f;
        });
        definitions.set(type, {
          type,
          fieldCount: fields.length,
          fieldNames: fields,
        });
      }
    }

    // Parse role definitions (e.g., "g = _, _" or "g2 = _, _, _")
    if (inRoleDefinition && trimmedLine && !trimmedLine.startsWith('#')) {
      const match = trimmedLine.match(/^(\w+)\s*=\s*(.+)$/);
      if (match) {
        const [, type, fieldsStr] = match;
        const fields = fieldsStr.split(',').map((f) => {
          return f.trim();
        }).filter((f) => {
          return f;
        });
        definitions.set(type, {
          type,
          fieldCount: fields.length,
          fieldNames: fields,
        });
      }
    }
  }

  return definitions;
}

/**
 * Validates a single policy line against the expected policy definition
 * @param policyLine - The policy line to validate (e.g., "p, alice, data1, read")
 * @param definitions - Map of policy type to its definition
 * @returns Validation error if the line is invalid, null otherwise
 */
export function validatePolicyLine(
  policyLine: string,
  definitions: Map<string, PolicyDefinition>,
): string | null {
  const trimmedLine = policyLine.trim();

  // Skip empty lines and comments
  if (!trimmedLine || trimmedLine.startsWith('#')) {
    return null;
  }

  // Parse the policy line
  const parts = trimmedLine.split(',').map((part) => {
    return part.trim();
  });
  
  if (parts.length === 0) {
    return null;
  }

  const policyType = parts[0];
  
  // Check if this policy type is defined in the model
  const definition = definitions.get(policyType);
  
  if (!definition) {
    // If no definitions are available, we can't validate
    // This happens when the model is not yet loaded or is invalid
    if (definitions.size === 0) {
      return null;
    }
    return `Unknown policy type '${policyType}'. Valid types are: ${Array.from(definitions.keys()).join(', ')}`;
  }

  // The first part is the policy type, remaining parts are the values
  const valueCount = parts.length - 1;
  
  // Check if line ends with a comma (incomplete line)
  if (trimmedLine.endsWith(',')) {
    return `Incomplete policy line: missing value after comma. Expected ${definition.fieldCount} fields (${definition.fieldNames.join(', ')})`;
  }

  // Check if the number of values matches the expected field count
  if (valueCount !== definition.fieldCount) {
    if (valueCount < definition.fieldCount) {
      return `Incomplete policy line: expected ${definition.fieldCount} fields (${definition.fieldNames.join(', ')}), but got ${valueCount}`;
    } else {
      return `Too many fields: expected ${definition.fieldCount} fields (${definition.fieldNames.join(', ')}), but got ${valueCount}`;
    }
  }

  // Check for empty values
  for (let i = 1; i < parts.length; i++) {
    if (parts[i] === '') {
      return `Empty value at position ${i}: expected a value for '${definition.fieldNames[i - 1]}'`;
    }
  }

  return null;
}

/**
 * Validates all policy lines against the model definitions
 * @param policyText - The complete policy text
 * @param modelText - The complete model text
 * @returns Array of validation errors
 */
export function validatePolicy(policyText: string, modelText: string): PolicyValidationError[] {
  const errors: PolicyValidationError[] = [];
  
  if (!policyText || policyText.trim() === '') {
    return errors;
  }

  const definitions = parseModelDefinitions(modelText);
  
  // If no definitions found, we can't validate
  if (definitions.size === 0) {
    return errors;
  }

  const lines = policyText.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const error = validatePolicyLine(line, definitions);
    
    if (error) {
      const trimmedLine = line.trim();
      const policyType = trimmedLine.includes(',') ? trimmedLine.split(',')[0] : trimmedLine;
      errors.push({
        line: i + 1, // 1-indexed for user display
        message: error,
        policyType,
      });
    }
  }

  return errors;
}
