(function(){
  'use strict';

  angular.module('clips')
         .service('clipService', ['$q', ClipService]);

  /**
   * Clip DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function ClipService($q){

    // TO-DO: Automatically create first clip object here from the specified src link
    var clips = [
      {
        title: 'Main Video',
        startTime:0,
        endTime:202,
        editable: false,
        deletable: false
      }
    ];

    // Promise-based API
    return {
      loadAllClips : function() {
        // Simulate async nature of real remote calls
        return $q.when(clips);
      }
    };
  }

})();
