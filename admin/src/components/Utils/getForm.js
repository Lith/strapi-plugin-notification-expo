import getTrad from '../../utils/getTrad';

const getForm = () => {
  return {
    platform: {
      styleName: 'col-12',
      description: getTrad('form.platform.description'),
      label: getTrad('form.platform.label'),
      type: 'enum',
      options: [
        { value: 'ios', label: getTrad('form.platform.option1') },
        { value: 'android', label: getTrad('form.platform.option2') },
        { value: 'all', label: getTrad('form.platform.option3') },
      ],
      value: 'all',
      validations: {
        required: true,
      },
    },
    title: {
      styleName: 'col-12',
      description: getTrad('form.title.description'),
      label: getTrad('form.title.label'),
      placeholder: getTrad('form.title.placeholder'),
      type: 'text',
      validations: {
        required: true,
        maxLength: 40,
      },
    },
    body: {
      styleName: 'col-12',
      description: getTrad('form.body.description'),
      label: getTrad('form.body.label'),
      placeholder: getTrad('form.body.placeholder'),
      type: 'textarea',
      validations: {
        required: true,
        maxLength: 178,
      },
    },
    published_at: {
      styleName: 'col-12',
      description: getTrad('form.published_at.description'),
      label: getTrad('form.published_at.label'),
      type: 'datetime',
      validations: {
        required: true,
        min: new Date().getTime(), // not working for now
      },
    },
  };
};

export default getForm;
