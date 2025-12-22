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
 * Detects if the current window is running inside an iframe
 * @returns {boolean} true if the window is inside an iframe, false otherwise
 */
export const isInsideIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    // If we get a cross-origin error, we're definitely in an iframe
    return true;
  }
};
