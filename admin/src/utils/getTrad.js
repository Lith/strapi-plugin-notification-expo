

import { useGlobalContext } from 'strapi-helper-plugin';
import pluginId from '../pluginId';

const getTrad = (id) => {
  const { formatMessage } = useGlobalContext();
  
return formatMessage({ id: `${pluginId}.${id}` });
};

export default getTrad;
