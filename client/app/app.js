import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import AppConfig from './app.config';
import 'normalize.css';

angular.module('app', [
    uiRouter,
    Common,
    Components
]).config(AppConfig)
  .component('app', AppComponent);
