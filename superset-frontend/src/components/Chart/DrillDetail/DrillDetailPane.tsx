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
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import {
  BinaryQueryObjectFilterClause,
  css,
  ensureIsArray,
  GenericDataType,
  JsonObject,
  QueryFormData,
  styled,
  t,
  useTheme,
} from '@superset-ui/core';
import { useResizeDetector } from 'react-resize-detector';
import Loading from 'src/components/Loading';
import BooleanCell from 'src/components/Table/cell-renderers/BooleanCell';
import NullCell from 'src/components/Table/cell-renderers/NullCell';
import TimeCell from 'src/components/Table/cell-renderers/TimeCell';
import { EmptyStateMedium } from 'src/components/EmptyState';
import { getDatasourceSamples } from 'src/components/Chart/chartAction';
import Table, { ColumnsType, TableSize } from 'src/components/Table';
import HeaderWithRadioGroup from 'src/components/Table/header-renderers/HeaderWithRadioGroup';
import { ResourceStatus } from 'src/hooks/apiResources/apiResources';
import { useDatasetMetadataBar } from 'src/features/datasets/metadataBar/useDatasetMetadataBar';
import TableControls from './DrillDetailTableControls';
import { getDrillPayload } from './utils';
import { ResultsPage } from './types';

const PAGE_SIZE = 50;

interface DataType {
  [key: string]: any;
}

// Must be outside of the main component due to problems in
// react-resize-detector with conditional rendering
// https://github.com/maslianok/react-resize-detector/issues/178
const StyledResizableTable = styled.div`
  ${({ theme }) => `
    height: 100%;
    overflow: hidden;
    margin-top: ${theme.gridUnit * 2}px;
    .ant-table-container{
      border:0px !important;
    }
      .ant-table-thead{
        .ant-table-cell{
          background-color: ${theme.colors.customBstStyles.tableHeaderbg};
          border-left:0px !important;
          border-right:0px !important;
          border-top:0px !important;
          border-bottom: 1px solid ${theme.colors.customBstStyles.borderColor};
          :hover{
            background-color: ${theme.colors.customBstStyles.tableHeaderbg};
          }
        }
      }
    .ant-table-cell {
      font-weight: ${theme.typography.weights.bold};
      background-color: ${theme.colors.grayscale.light5};
    }
    .virtual-grid{
      .virtual-table-cell {
        background-color: ${theme.colors.grayscale.light5};
        border-bottom: 1px solid ${theme.colors.customBstStyles.borderColor};
        color: ${theme.colors.grayscale.dark2};
        :hover{
          background-color: ${theme.colors.grayscale.light4};
        }
      }
    }
    .ant-table-cell,
    .virtual-table-cell {
      min-width: 0px;
      align-self: center;
      font-size: ${theme.typography.sizes.s}px;
    }

    .even-row {
      background: ${theme.colors.grayscale.light4};
    }

    .odd-row {
      background: ${theme.colors.grayscale.light5};
    }

    .cell-text-for-measuring {
      font-family: ${theme.typography.families.sansSerif};
      font-size: ${theme.typography.sizes.s}px;
    }

    .ant-pagination-item {
      background-color:${theme.colors.customBstStyles.tableHeaderbg};
      border: 1px solid ${theme.colors.customBstStyles.tableHeaderbg};
      color: ${theme.colors.grayscale.dark1};
      margin: 0 ${theme.gridUnit / 2}px;
      &:hover {
        border-color: ${theme.colors.primary.dark1};
      }
    }

    a {
      color: ${theme.colors.grayscale.dark1};
      &:hover {
        color: ${theme.colors.primary.dark1};
      }
    }

    .ant-pagination-options-size-changer .ant-select-selector {
      background-color: ${theme.colors.grayscale.light4};
      color: ${theme.colors.grayscale.dark1};
    }

    .ant-pagination-options-size-changer .ant-select-item {
      background-color: ${theme.colors.grayscale.light4};
      color: ${theme.colors.grayscale.dark1};
    }
  
    .ant-pagination-options-size-changer .ant-select-arrow {
      color: ${theme.colors.grayscale.dark1};
    }

    .ant-pagination-prev .ant-pagination-item-link-icon,
    .ant-pagination-next .ant-pagination-item-link-icon {
      color: ${theme.colors.grayscale.dark1};
    }
`}
`;
function Resizable({ children }: { children: ReactElement }) {
  const { ref, height } = useResizeDetector();

  return (
    <StyledResizableTable ref={ref} css={{ flex: 1 }}>
      {React.cloneElement(children, { height })}
    </StyledResizableTable>
  );
}

enum TimeFormatting {
  Original,
  Formatted,
}

export default function DrillDetailPane({
  formData,
  initialFilters,
}: {
  formData: QueryFormData;
  initialFilters: BinaryQueryObjectFilterClause[];
}) {
  const theme = useTheme();
  const [pageIndex, setPageIndex] = useState(0);
  const lastPageIndex = useRef(pageIndex);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [resultsPages, setResultsPages] = useState<Map<number, ResultsPage>>(
    new Map(),
  );
  const [timeFormatting, setTimeFormatting] = useState({});

  const SAMPLES_ROW_LIMIT = useSelector(
    (state: { common: { conf: JsonObject } }) =>
      state.common.conf.SAMPLES_ROW_LIMIT,
  );

  // Extract datasource ID/type from string ID
  const [datasourceId, datasourceType] = useMemo(
    () => formData.datasource.split('__'),
    [formData.datasource],
  );

  const { metadataBar, status: metadataBarStatus } = useDatasetMetadataBar({
    datasetId: datasourceId,
  });
  // Get page of results
  const resultsPage = useMemo(() => {
    const nextResultsPage = resultsPages.get(pageIndex);
    if (nextResultsPage) {
      lastPageIndex.current = pageIndex;
      return nextResultsPage;
    }

    return resultsPages.get(lastPageIndex.current);
  }, [pageIndex, resultsPages]);

  const mappedColumns: ColumnsType<DataType> = useMemo(
    () =>
      resultsPage?.colNames.map((column, index) => ({
        key: column,
        dataIndex: column,
        title:
          resultsPage?.colTypes[index] === GenericDataType.TEMPORAL ? (
            <HeaderWithRadioGroup
              headerTitle={column}
              groupTitle={t('Formatting')}
              groupOptions={[
                { label: t('Original value'), value: TimeFormatting.Original },
                {
                  label: t('Formatted value'),
                  value: TimeFormatting.Formatted,
                },
              ]}
              value={
                timeFormatting[column] === TimeFormatting.Original
                  ? TimeFormatting.Original
                  : TimeFormatting.Formatted
              }
              onChange={value =>
                setTimeFormatting(state => ({ ...state, [column]: value }))
              }
            />
          ) : (
            column
          ),
        render: value => {
          if (value === true || value === false) {
            return <BooleanCell value={value} />;
          }
          if (value === null) {
            return <NullCell />;
          }
          if (
            resultsPage?.colTypes[index] === GenericDataType.TEMPORAL &&
            timeFormatting[column] !== TimeFormatting.Original &&
            (typeof value === 'number' || value instanceof Date)
          ) {
            return <TimeCell value={value} />;
          }
          return String(value);
        },
        width: 150,
      })) || [],
    [resultsPage?.colNames, resultsPage?.colTypes, timeFormatting],
  );

  const data: DataType[] = useMemo(
    () =>
      resultsPage?.data.map((row, index) =>
        resultsPage?.colNames.reduce(
          (acc, curr) => ({ ...acc, [curr]: row[curr] }),
          {
            key: index,
          },
        ),
      ) || [],
    [resultsPage?.colNames, resultsPage?.data],
  );

  // Clear cache on reload button click
  const handleReload = useCallback(() => {
    setResponseError('');
    setResultsPages(new Map());
    setPageIndex(0);
  }, []);

  // Clear cache and reset page index if filters change
  useEffect(() => {
    setResponseError('');
    setResultsPages(new Map());
    setPageIndex(0);
  }, [filters]);

  // Update cache order if page in cache
  useEffect(() => {
    if (
      resultsPages.has(pageIndex) &&
      [...resultsPages.keys()].at(-1) !== pageIndex
    ) {
      const nextResultsPages = new Map(resultsPages);
      nextResultsPages.delete(pageIndex);
      setResultsPages(
        nextResultsPages.set(
          pageIndex,
          resultsPages.get(pageIndex) as ResultsPage,
        ),
      );
    }
  }, [pageIndex, resultsPages]);

  // Download page of results & trim cache if page not in cache
  useEffect(() => {
    if (!responseError && !isLoading && !resultsPages.has(pageIndex)) {
      setIsLoading(true);
      const jsonPayload = getDrillPayload(formData, filters) ?? {};
      const cachePageLimit = Math.ceil(SAMPLES_ROW_LIMIT / PAGE_SIZE);
      getDatasourceSamples(
        datasourceType,
        datasourceId,
        false,
        jsonPayload,
        PAGE_SIZE,
        pageIndex + 1,
      )
        .then(response => {
          setResultsPages(
            new Map([
              ...[...resultsPages.entries()].slice(-cachePageLimit + 1),
              [
                pageIndex,
                {
                  total: response.total_count,
                  data: response.data,
                  colNames: ensureIsArray(response.colnames),
                  colTypes: ensureIsArray(response.coltypes),
                },
              ],
            ]),
          );
          setResponseError('');
        })
        .catch(error => {
          setResponseError(`${error.name}: ${error.message}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    SAMPLES_ROW_LIMIT,
    datasourceId,
    datasourceType,
    filters,
    formData,
    isLoading,
    pageIndex,
    responseError,
    resultsPages,
  ]);

  const bootstrapping =
    (!responseError && !resultsPages.size) ||
    metadataBarStatus === ResourceStatus.LOADING;

  let tableContent = null;
  if (responseError) {
    // Render error if page download failed
    tableContent = (
      <pre
        css={css`
          margin-top: ${theme.gridUnit * 4}px;
        `}
      >
        {responseError}
      </pre>
    );
  } else if (bootstrapping) {
    // Render loading if first page hasn't loaded
    tableContent = <Loading />;
  } else if (resultsPage?.total === 0) {
    // Render empty state if no results are returned for page
    const title = t('No rows were returned for this dataset');
    tableContent = <EmptyStateMedium image="document.svg" title={title} />;
  } else {
    // Render table if at least one page has successfully loaded
    tableContent = (
      <Resizable>
        <Table
          data={data}
          columns={mappedColumns}
          size={TableSize.SMALL}
          defaultPageSize={PAGE_SIZE}
          recordCount={resultsPage?.total}
          usePagination
          loading={isLoading}
          onChange={pagination =>
            setPageIndex(pagination.current ? pagination.current - 1 : 0)
          }
          resizable
          virtualize
          allowHTML
        />
      </Resizable>
    );
  }

  return (
    <>
      {!bootstrapping && metadataBar}
      {!bootstrapping && (
        <TableControls
          filters={filters}
          setFilters={setFilters}
          totalCount={resultsPage?.total}
          loading={isLoading}
          onReload={handleReload}
        />
      )}
      {tableContent}
    </>
  );
}
