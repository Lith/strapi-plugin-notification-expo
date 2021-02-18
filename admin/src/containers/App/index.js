/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from 'strapi-helper-plugin';
// Utils
import pluginId from '../../pluginId';
// Containers
import HomePage from '../HomePage';
import EditPage from '../EditPage';
import AddPage from '../AddPage';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
        <Route path={`/plugins/${pluginId}/add`} component={AddPage} exact />
        <Route path={`/plugins/${pluginId}/edit/:id`} component={EditPage} exact />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;
