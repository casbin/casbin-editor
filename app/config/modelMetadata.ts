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

export interface ModelMetadata {
  key: string;
  name: string;
  description: string;
  category: string;
}

export const modelMetadata: ModelMetadata[] = [
  {
    key: 'basic',
    name: 'ACL',
    description: 'Access Control List (ACL) model for basic permission management.',
    category: 'ACL',
  },
  {
    key: 'basic_with_root',
    name: 'ACL with superuser',
    description: 'ACL model with a superuser role that has access to all resources.',
    category: 'ACL',
  },
  {
    key: 'basic_without_resources',
    name: 'ACL without resources',
    description: 'Simplified ACL model that does not include resource specifications.',
    category: 'ACL',
  },
  {
    key: 'basic_without_users',
    name: 'ACL without users',
    description: 'ACL model that focuses on resources without specific user assignments.',
    category: 'ACL',
  },
  {
    key: 'rbac',
    name: 'RBAC',
    description: 'Role-Based Access Control (RBAC) model for managing permissions through roles.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_resource_roles',
    name: 'RBAC with resource roles',
    description: 'RBAC model that supports roles assigned to specific resources.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_domains',
    name: 'RBAC with domains/tenants',
    description: 'Multi-tenant RBAC model supporting domain-specific role assignments.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_pattern',
    name: 'RBAC with pattern',
    description: 'RBAC model with pattern matching for flexible resource access control.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_all_pattern',
    name: 'RBAC with all pattern',
    description: 'Advanced RBAC with comprehensive pattern matching capabilities.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_deny',
    name: 'RBAC with deny-override',
    description: 'RBAC model supporting explicit deny rules that override allow permissions.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_domains_and_resources',
    name: 'RBAC with domains and resource hierarchy',
    description: 'RBAC with hierarchical resources across multiple domains.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_time',
    name: 'RBAC with time constraints',
    description: 'Time-based RBAC model with temporal access control policies.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_tags',
    name: 'RBAC with tags',
    description: 'RBAC model using tags for flexible resource categorization.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_resource_filter',
    name: 'RBAC with resource filter',
    description: 'RBAC with advanced filtering capabilities for resource access.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_multiple_roles',
    name: 'RBAC with multiple roles',
    description: 'RBAC supporting users with multiple simultaneous role assignments.',
    category: 'RBAC',
  },
  {
    key: 'rbac_with_resource_roles_and_deny',
    name: 'RBAC with resource roles and deny rules',
    description: 'Combined resource roles and deny rules in a single RBAC model.',
    category: 'RBAC',
  },
  {
    key: 'abac',
    name: 'ABAC',
    description: 'Attribute-Based Access Control (ABAC) for policy decisions based on attributes.',
    category: 'ABAC',
  },
  {
    key: 'abac_with_policy_rule',
    name: 'ABAC with policy rule',
    description: 'ABAC model with explicit policy rules for attribute evaluation.',
    category: 'ABAC',
  },
  {
    key: 'rebac',
    name: 'ReBAC',
    description: 'Relationship-Based Access Control (ReBAC) for managing access through relationships.',
    category: 'ReBAC',
  },
  {
    key: 'pbac',
    name: 'PBAC',
    description: 'Policy-Based Access Control (PBAC) for complex policy-driven authorization.',
    category: 'Other',
  },
  {
    key: 'blp',
    name: 'BLP',
    description: 'Bell-LaPadula (BLP) model for multi-level security with confidentiality focus.',
    category: 'Security',
  },
  {
    key: 'biba',
    name: 'BIBA',
    description: 'Biba Integrity Model for maintaining data integrity in security systems.',
    category: 'Security',
  },
  {
    key: 'lbac',
    name: 'LBAC',
    description: 'Lattice-Based Access Control (LBAC) for hierarchical security labels.',
    category: 'Security',
  },
  {
    key: 'keymatch',
    name: 'RESTful (KeyMatch)',
    description: 'RESTful API access control using KeyMatch pattern matching.',
    category: 'RESTful',
  },
  {
    key: 'ipmatch',
    name: 'IP match',
    description: 'Access control based on IP address matching and filtering.',
    category: 'Network',
  },
  {
    key: 'priority',
    name: 'Priority',
    description: 'Priority-based access control with rule precedence handling.',
    category: 'Other',
  },
];

export const categories = [
  'All',
  'ACL',
  'RBAC',
  'ABAC',
  'ReBAC',
  'Security',
  'RESTful',
  'Network',
  'Other',
];
