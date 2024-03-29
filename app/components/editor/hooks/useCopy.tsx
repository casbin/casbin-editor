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

export default function useCopy() {
  function copy(cb: any, data: string): void {
    const listener = (e: ClipboardEvent) => {
      if (!e.clipboardData) {
        throw new Error('Clipboard API unavailable.');
      }
      e.clipboardData.setData('text/plain', data);
      e.preventDefault();
      document.removeEventListener('copy', listener);
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    // props.cb();
    cb();
  }
  return {
    copy,
  };
}
