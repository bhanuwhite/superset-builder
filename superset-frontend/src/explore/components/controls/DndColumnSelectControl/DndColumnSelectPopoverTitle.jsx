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
import React, { useCallback, useState } from 'react';
import { t, styled, supersetTheme } from '@superset-ui/core';
import { Input } from 'src/components/Input';
import { Tooltip } from 'src/components/Tooltip';

const TitleLabel = styled.span`
  display: inline-block;
  padding: 2px 0;
  color: ${({ theme }) => theme.colors.grayscale.dark2};
`;

const StyledInput = styled(Input)`
  border-radius: ${({ theme }) => theme.borderRadius};
  height: 26px;
  padding-left: ${({ theme }) => theme.gridUnit * 2.5}px;
`;

export const DndColumnSelectPopoverTitle = ({
  title,
  onChange,
  isEditDisabled,
  hasCustomLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const onMouseOver = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  const onClick = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsEditMode(false);
  }, []);

  const onInputBlur = useCallback(
    e => {
      if (e.target.value === '') {
        onChange(e);
      }
      onBlur();
    },
    [onBlur, onChange],
  );

  const defaultLabel = t('My column');

  if (isEditDisabled) {
    return <TitleLabel>{title || defaultLabel}</TitleLabel>;
  }

  return isEditMode ? (
    <StyledInput
      type="text"
      placeholder={title}
      value={hasCustomLabel ? title : ''}
      autoFocus
      onChange={onChange}
      onBlur={onInputBlur}
    />
  ) : (
    <Tooltip placement="top" title={t('Click to edit label')}>
      <TitleLabel
        className="AdhocMetricEditPopoverTitle inline-editable"
        data-test="AdhocMetricEditTitle#trigger"
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        onBlur={onBlur}
        role="button"
        tabIndex={0}
      >
        {title || defaultLabel}
        &nbsp;
        <i
          className="fa fa-pencil"
          style={{ color: isHovered ? supersetTheme.colors.grayscale.dark2 : 'grey' }}
        />
      </TitleLabel>
    </Tooltip>
  );
};
