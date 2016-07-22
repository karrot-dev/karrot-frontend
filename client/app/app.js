import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import AppRun from './app.run';
import AppConfig from './app.config';
import 'normalize.css';

angular.module('app', [
    uiRouter,
    Common,
    Components
]).config(AppConfig)
  .run(AppRun)
  .component('app', AppComponent);
