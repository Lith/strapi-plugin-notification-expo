import {Button, Flex, Padded} from '@buffetjs/core';
import {Header, Inputs} from '@buffetjs/custom';
import {faSave} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {memo, useEffect, useMemo, useReducer, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {request} from 'strapi-helper-plugin';
import PreviewAndroid from '../../components/PreviewAndroid';
import PreviewIOS from '../../components/PreviewIOS';

import getForm from '../../components/Utils/getForm';
import pluginId from '../../pluginId';
import getTrad from '../../utils/getTrad';
import init from './init';
import {initialState, reducer} from './reducer';

const EditPage = () => {
  const getDataRef = useRef();

  const form = getForm();
  const {id: notificationId} = useParams();

  const previewEnabled = false;

  const [{entity, isLoading}, dispatch] = useReducer(reducer, initialState, init);

  const handleChange = ({target: {name, value}}) => {
    dispatch({
      type: 'UPDATE_ENTITY',
      name,
      value,
    });
  };

  getDataRef.current = async () => {
    // Show the loading state and reset the state
    dispatch({
      type: 'GET_DATA',
    });

    try {
      const entity = await request(`/notification-expo/exponotifications/${notificationId}`, {
        method: 'GET',
      });

      dispatch({
        type: 'GET_DATA_SUCCEEDED',
        entity,
      });
    } catch (err) {
      strapi.notification.toggle({
        type: 'warning',
        message: {id: 'notification.error'},
      });
    }
  };

  useEffect(() => {
    if (notificationId) {
      getDataRef.current();
    }
  }, [notificationId]);

  /**
   * Verify if notification has already been send
   *
   * @returns {boolean}
   */
  const notificationAlreadySend = useMemo(() => {
    if (entity && entity.published_at && entity.status) {
      if (entity.status !== 'pending') {
        return true;
      }
      const publishedDate = new Date(entity.published_at);
      const todayDate = new Date();

      if (publishedDate.getTime() <= todayDate.getTime()) {
        return true;
      }
    }

    return false;
  });

  /**
   * Save form data
   */

  const saveForm = async (data) => {
    if (!data || isLoading) return;
    dispatch({
      type: 'SET_IS_LOADING',
    });

    try {
      const entity = await request(`/notification-expo/exponotifications/${notificationId}`, {
        method: 'PUT',
        body: data,
      });

      dispatch({
        type: 'SAVE_DATA_SUCCEED',
        entity,
      });

      strapi.notification.toggle({
        type: 'success',
        message: {id: `${pluginId}.notification.success`},
      });
    } catch (err) {
      strapi.notification.toggle({
        type: 'warning',
        message: {id: 'notification.error'},
      });
    }
  };

  return (
    <div className="container-fluid" style={{padding: '30px 18px'}}>
      <div>
        <Header
          title={{label: getTrad('edit.title') + notificationId}}
          content={
            `${pluginId
            } / ${
              getTrad('home.navbar_title')
            }/${
              getTrad('edit.navbar_title')
            }${notificationId}`
          }
          isLoading={isLoading}
        />
      </div>
      <Flex justifyContent="flex-end">
        <div className="col-sm-9" style={{background: 'white', padding: '10px'}}>
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
                    disabled={notificationAlreadySend}
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
                disabled={notificationAlreadySend}
                isLoading={isLoading}
                onClick={() => saveForm(entity)}
              >
                {getTrad('edit.button.save')}
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

export default memo(EditPage);
