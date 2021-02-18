

import { Button, Flex, Padded, Table } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';
import { faPencilAlt, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortBy as sort } from 'lodash';
import React, { memo, useEffect, useMemo, useReducer, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { PageFooter, request, useQuery } from 'strapi-helper-plugin';
import pluginId from '../../pluginId';
import getFilters from '../../utils/getFilters';
import getTrad from '../../utils/getTrad';
import init from './init';
import { initialState, reducer } from './reducer';

const HomePage = () => {
  const query = useQuery();
  const { push } = useHistory();
  const { search } = useLocation();
  const filters = useMemo(() => {
    return getFilters(search);
  }, [search]);

  const [
    {
      data,
      isLoading,
      sortBy,
      sortOrder,
      pagination: { total },
    },
    dispatch,
  ] = useReducer(reducer, initialState, init);
  const pageSize = parseInt(query.get('pageSize') || 10, 10);
  const page = parseInt(query.get('page') || 1, 10);
  const _q = decodeURIComponent(query.get('_q') || '');
  const getDataRef = useRef();

  getDataRef.current = async () => {
    // Show the loading state and reset the state
    dispatch({
      type: 'GET_DATA',
    });

    try {
      const {
        data: { results, pagination },
      } = await request(`/notification-expo/exponotifications${search}`, { method: 'GET' });

      dispatch({
        type: 'GET_DATA_SUCCEEDED',
        data: results,
        pagination,
      });
    } catch (err) {
      strapi.notification.toggle({
        type: 'warning',
        message: { id: 'notification.error' },
      });
    }
  };

  useEffect(() => {
    getDataRef.current();
  }, [search]);

  const updateSearchParams = (name, value, shouldDeleteSearch = false) => {
    const currentSearch = new URLSearchParams(search);
    // Update the currentSearch
    currentSearch.set(name, value);

    if (shouldDeleteSearch) {
      currentSearch.delete('_q');
    }

    push({
      search: currentSearch.toString(),
    });
  };

  const handleChangeFooterParams = ({ target: { name, value } }) => {
    let paramName = name.split('.')[1].replace('_', '');

    if (paramName === 'limit') {
      paramName = 'pageSize';
    }

    updateSearchParams(paramName, value);
  };

  const addNotification = () => {
    push({
      pathname: `/plugins/${pluginId}/add`,
    });
  };

  const editNotification = (event, data) => {
    push({
      pathname: `/plugins/${pluginId}/edit/${data.id}`,
    });
  };

  /**
   * @todo - implement todo
   */
  const deleteNotification = (data) => {
    strapi.notification.toggle({
      type: 'warning',
      message: 'Not implemented yet',
    });
  };

  const sortedRowsBy = sort(data, [sortBy]);
  const sortedRows = sortOrder === 'asc' ? sortedRowsBy : sortedRowsBy.reverse();

  const headers = [
    {
      name: getTrad('home.table.row.id'),
      value: 'id',
      isSortEnabled: true,
    },
    {
      name: getTrad('home.table.row.title'),
      value: 'title',
    },
    {
      name: getTrad('home.table.row.body'),
      value: 'body',
    },
    {
      name: getTrad('home.table.row.published_at'),
      value: 'published_at',
      isSortEnabled: true,
    },
    {
      name: getTrad('home.table.row.status'),
      value: 'status',
      isSortEnabled: true,
    },
    {
      name: getTrad('home.table.row.total'),
      value: 'total',
    },
  ];

  return (
    <div className="container-fluid" style={{ padding: '30px 18px' }}>
      <div>
        <Header
          title={{ label: getTrad('home.title') }}
          content={`${pluginId  } / ${  getTrad('home.navbar_title')}`}
          isLoading={isLoading}
        />
      </div>
      <Flex justifyContent="flex-end">
        <Padded top left bottom right size="sm">
          <Button
            color="primary"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={addNotification}
          >
            {getTrad('home.button.add')}
          </Button>
        </Padded>
      </Flex>
      <Table
        headers={headers}
        rows={sortedRows}
        isLoading={isLoading}
        searchParam={_q}
        filters={filters}
        onClickRow={editNotification}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onChangeSort={({ sortBy, firstElementSort, isSortEnabled }) => {
          if (isSortEnabled) {
            dispatch({
              type: 'CHANGE_SORT',
              sortBy,
              nextElement: firstElementSort,
            });
          }
        }}
        rowLinks={[
          {
            icon: <FontAwesomeIcon icon={faPencilAlt} />,
            onClick: (data) => {
              editNotification({}, data);
            },
          },
          {
            icon: <FontAwesomeIcon icon={faTrashAlt} />,
            onClick: (data) => {
              deleteNotification(data);
            },
          },
        ]}
      />
      <div>
        <Padded top left bottom right size="sm">
          <PageFooter
            context={{
              emitEvent: () => {},
            }}
            count={total}
            onChangeParams={handleChangeFooterParams}
            params={{ _limit: pageSize, _page: page }}
          />
        </Padded>
      </div>
    </div>
  );
};

export default memo(HomePage);
