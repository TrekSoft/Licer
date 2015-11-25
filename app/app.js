// TO-DO: Add unit tests using Karma
angular
  .module('licerApp', ['ngMaterial', 'clips'])
  .config(function($mdThemingProvider, $mdIconProvider){

      $mdIconProvider
          .icon("menu", "./assets/svg/menu.svg", 24)
          .icon("add", "./assets/svg/add.svg", 24);

          $mdThemingProvider.theme('default') 
          .primaryPalette('pink', { 'default': '800', 'hue-1': '100', 'hue-2': '600', 'hue-3': 'A100' }) 
          .accentPalette('cyan', { 'default': 'A700' });

  });