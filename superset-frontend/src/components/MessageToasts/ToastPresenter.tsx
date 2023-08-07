/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { styled } from '@superset-ui/core';
import { ToastMeta } from 'src/components/MessageToasts/types';
import Toast from './Toast';

export interface VisualProps {
  position: 'bottom' | 'top';
}

const StyledToastPresenter = styled.div<VisualProps>`
  max-width: 600px;
  position: fixed;
  ${({ position }) => (position === 'bottom' ? 'bottom' : 'top')}: 0px;
  right: 0px;
  margin-right: 50px;
  margin-bottom: 50px;
  z-index: ${({ theme }) => theme.zIndex.max};
  word-break: break-word;

  .toast {
    background: ${({ theme }) => theme.colors.toast.base};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.2), 0 1px 10px 0 rgba(0,0,0,.12), 0 4px 5px 0 rgba(0,0,0,.14);
    color: ${({ theme }) => theme.colors.grayscale.dark2};
    opacity: 0;
    position: relative;
    transform: translateY(-100%);
    white-space: pre-line;
    will-change: transform, opacity;
    transition: transform ${({ theme }) => theme.transitionTiming}s,
      opacity ${({ theme }) => theme.transitionTiming}s;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 100%;
    }
  }

  .toast > button {
    color: ${({ theme }) => theme.colors.grayscale.dark2};
    opacity: 1;
  }

  .toast--visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

type ToastPresenterProps = Partial<VisualProps> & {
  toasts: Array<ToastMeta>;
  removeToast: () => any;
};

export default function ToastPresenter({
  toasts,
  removeToast,
  position = 'bottom',
}: ToastPresenterProps) {
  return (
    <>
      {toasts.length > 0 && (
        <StyledToastPresenter id="toast-presenter" position={position}>
          {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} onCloseToast={removeToast} />
          ))}
        </StyledToastPresenter>
      )}
    </>
  );
}
