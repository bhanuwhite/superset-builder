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
import { styled } from '@superset-ui/core';
import { Input as AntdInput, InputNumber as AntdInputNumber } from 'antd';

export const Input = styled(AntdInput)`
  border-radius: ${({ theme }) => theme.gridUnit}px;
  height: ${({ theme }) => theme.gridUnit * 10}px;
  align-items:center;
  background-color:${({ theme }) => theme.colors.customBstStyles.formInputColor};
  border:0px;
  color:${({ theme }) => theme.colors.customBstStyles.formInputText};
  ::placeholder{
    color:${({ theme }) => theme.colors.customBstStyles.formInputText};
  }
`;

export const InputNumber = styled(AntdInputNumber)`
height: ${({ theme }) => theme.gridUnit * 10}px;
align-items:center;
background-color:${({ theme }) => theme.colors.customBstStyles.formInputColor};
border:0px;
color:${({ theme }) => theme.colors.customBstStyles.formInputText};
::placeholder{
  color:${({ theme }) => theme.colors.customBstStyles.formInputText};
}
`;

export const TextArea = styled(AntdInput.TextArea)`
align-items:center;
background-color:${({ theme }) => theme.colors.customBstStyles.formInputColor};
border:0px;
color:${({ theme }) => theme.colors.customBstStyles.formInputText};
::placeholder{
  color:${({ theme }) => theme.colors.customBstStyles.formInputText};
}
`;
