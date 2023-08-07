/*
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
import { useTheme, css } from '@superset-ui/core';
import { Tooltip as BaseTooltip } from 'antd';
import type { TooltipProps } from 'antd/lib/tooltip';
import { Global } from '@emotion/react';

export type { TooltipProps } from 'antd/lib/tooltip';

export const Tooltip = ({ overlayStyle, color, ...props }: TooltipProps) => {
  const theme = useTheme();
  const defaultColor = `${theme.colors.customBstStyles.tooltipBg}`;

  return (
    <>
      {/* Safari hack to hide browser default tooltips */}
      <Global
        styles={css`
          .ant-tooltip-open {
            display: inline-block;
            &::after {
              content: '';
              display: block;
            }
          }
        `}
      />
      <BaseTooltip
        overlayStyle={{
          fontSize: theme.typography.sizes.s,
          lineHeight: '1.6',
          maxWidth: theme.gridUnit * 62,
          minWidth: theme.gridUnit * 30,
          color: '#FFF !important',
          ...overlayStyle,
        }}
        overlayInnerStyle={{
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitLineClamp: 40,
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          padding: '14px 12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          borderRadius: 6,
        }}
        color={defaultColor}
        trigger="hover"
        placement="bottom"
        // don't allow hovering over the tooltip
        mouseLeaveDelay={0}
        {...props}
      />
    </>
  );
};

export default Tooltip;
