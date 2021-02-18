

import { Button, Flex, Padded } from '@buffetjs/core';
import { Header, Inputs } from '@buffetjs/custom';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import { request } from 'strapi-helper-plugin';
import PreviewAndroid from '../../components/PreviewAndroid';
import PreviewIOS from '../../components/PreviewIOS';

import getForm from '../../components/Utils/getForm';
import pluginId from '../../pluginId';
import getTrad from '../../utils/getTrad';
import init from './init';
import { initialState, reducer } from './reducer';

const AddPage = () => {
  const form = getForm();
  const { push } = useHistory();

  const previewEnabled = false;

  const [{ entity, isLoading }, dispatch] = useReducer(reducer, initialState, init);

  const handleChange = ({ target: { name, value } }) => {
    dispatch({
      type: 'UPDATE_ENTITY',
      name,
      value,
    });
  };

  useEffect(() => {
    dispatch({
      type: 'UNSET_IS_LOADING',
    });
  }, []);

  /**
   * Save form data
   */

  const saveForm = async (data) => {
    if (!data || isLoading) return;
    dispatch({
      type: 'SET_IS_LOADING',
    });

    try {
      const entity = await request('/notification-expo/exponotifications', {
        method: 'POST',
        body: data,
      });

      dispatch({
        type: 'SAVE_DATA_SUCCEED',
        entity,
      });

      if (entity.id) {
        push({
          pathname: `/plugins/${pluginId}/edit/${entity.id}`,
        });
      }

      strapi.notification.toggle({
        type: 'success',
        message: { id: `${pluginId}.notification.success` },
      });
    } catch (err) {
      strapi.notification.toggle({
        type: 'warning',
        message: { id: 'notification.error' },
      });
    }
  };

  return (
    <div className="container-fluid" style={{ padding: '30px 18px' }}>
      <div>
        <Header
          title={{ label: getTrad('add.title') }}
          content={
            `${pluginId  } / ${  getTrad('home.navbar_title')  }/${  getTrad('add.navbar_title')}`
          }
          isLoading={isLoading}
        />
      </div>
      <Flex justifyContent="flex-end">
        <div className="col-sm-9" style={{ background: 'white', padding: '10px' }}>
          <form>
            <div className="row">
              {Object.keys(form).map((input) => (
                <div className={form[input].styleName} key={input}>
                  <Inputs
                    name={input}
                    {...form[input]}
                    onChange={handleChange}
                    translatedErrors={{
                      date: getTrad('form.error.date'),
                      email: getTrad('form.error.email'),
                      string: getTrad('form.error.string'),
                      number: getTrad('form.error.number'),
                      json: getTrad('form.error.json'),
                      max: getTrad('form.error.max'),
                      maxLength: getTrad('form.error.maxLength'),
                      min: getTrad('form.error.min'),
                      minLength: getTrad('form.error.minLength'),
                      required: getTrad('form.error.required'),
                      regex: getTrad('form.error.regex'),
                      uppercase: getTrad('form.error.uppercase'),
                    }}
                    value={entity[input] || form[input].value}
                  />
                </div>
              ))}
            </div>
          </form>
          <Flex justifyContent="flex-end">
            <Padded top left bottom right size="sm">
              <Button
                type="submit"
                color="primary"
                icon={<FontAwesomeIcon icon={faSave} />}
                isLoading={isLoading}
                onClick={() => saveForm(entity)}
              >
                {getTrad('add.button.save')}
              </Button>
            </Padded>
          </Flex>
        </div>
        {previewEnabled ? (
          <div className="col-sm-3">
            <Padded top left bottom right size="sm">
              <PreviewIOS />
            </Padded>
            <Padded top left bottom right size="sm">
              <PreviewAndroid />
            </Padded>
          </div>
        ) : (
          <div className="col-sm-3">{/* empty */}</div>
        )}
      </Flex>
    </div>
  );
};

export default memo(AddPage);
