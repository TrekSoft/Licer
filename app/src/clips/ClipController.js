(function(){

  angular
       .module('clips')
       .controller('ClipController', [
          '$scope', 'clipService', '$mdSidenav', '$q',
          ClipController
       ]);

  /**
   * Main Controller for the Licer app
   * @param $scope
   * @param $mdSidenav
   * @param clipService
   * @param $q
   * @constructor
   */
  function ClipController( $scope, clipService, $mdSidenav, $q) {

    $scope.selectedClip = null;
    $scope.edit         = false;
    $scope.blankClip    = {title: null, startTime: null, endTime: null, editable: null, deletable: null};
    $scope.newClip      = $scope.blankClip;
    // TO-DO: Pull this from a service to more easily support saved sessions or uploaded videos in the future.
    $scope.src          = "assets/video/Halo.mp4";
    $scope.videoChanged = false;
    $scope.endTimeChanged = false;
    $scope.clips        = [ ];
    $scope.videoPlayer  = document.getElementById("videoPlayer");
    $scope.playClip     = playClip;
    $scope.addClip      = addClip;
    $scope.publishClip  = publishClip;
    $scope.deleteClip   = deleteClip;
    $scope.editClip     = editClip;
    $scope.saveClip     = saveClip;
    $scope.loadSelectedClip = loadSelectedClip;
    $scope.cancel       = cancel;
    $scope.toggleList   = toggleClipsList;
    $scope.formatTime   = formatTime;

    // Watches for the end time field being changed so that it can update the video location 
    // to match. 
    $scope.$watch("newClip.endTime", function(newValue, oldValue) {
        // Checks to see if the end time variable is changing because the video changed.
        // If so, it doesn't change the video to the rounded down value because that 
        // wouldn't make sense and causes stutter.
        if($scope.videoChanged){
          $scope.videoChanged = false;
        }else{
          $scope.endTimeChanged = true;
          $scope.videoPlayer.currentTime = newValue;
        }
    });

    // Watches for the video position being changed so it can update the end time variable
    // to match.
    $scope.videoPlayer.ontimeupdate = function() {
        // Checks if the video location is changing because we just changed the end location
        // variable. If so, it doesn't change the end location variable since that causes a
        // loop and doesn't make sense.
        if($scope.endTimeChanged){
          $scope.endTimeChanged = false;
        }else{
          $scope.videoChanged=true;
          $scope.$apply(function() {
            $scope.newClip.endTime = Math.floor(videoPlayer.currentTime);
          });  
        }  
    };

    // Loads all the clips - for now just the first one.
    // TO-DO: Save created clips in local storage or in a MySQL database so this would load them 
    // back up the next time the user logs on.
    clipService
          .loadAllClips()
          .then( function( clips ) {
            $scope.clips    = [].concat(clips);
            $scope.selectedClip = clips[0];
            $scope.loadSelectedClip();
          });

    // *********************************
    // Internal methods
    // *********************************

    function playClip ( clip ) {
      $scope.selectedClip = clip;
      $scope.toggleList();
      $scope.loadSelectedClip(true);
    }

    function addClip(){
        $scope.videoPlayer.pause();
        var currentTime = Math.floor($scope.videoPlayer.currentTime);

        $scope.newClip = {
            title: "Clip " + ($scope.clips.length + 1),
            startTime: currentTime,
            endTime: currentTime+1,
            editable: true,
            deletable: true
        };

        $scope.endTime = currentTime+1;
        $scope.videoPlayer.currentTime = $scope.newClip.endTime;
    }

    function publishClip(){
        $scope.clips.push($scope.newClip);
        $scope.newClip = $scope.blankClip;
    }

    function deleteClip(clip){
        if(clip == $scope.selectedClip){
          $scope.edit = false;
        }
        
        var index = $scope.clips.indexOf(clip);
        if(index>0){
          $scope.clips.splice(index, 1); 
        }
    }

    function editClip(clip){
        $scope.selectedClip = clip;
        $scope.edit = true;
        $scope.toggleList();
        $scope.loadSelectedClip();
    }

    function saveClip(){
      $scope.edit = false;
    }

    function loadSelectedClip(play){
      $scope.videoPlayer.src=$scope.src+"#t="+$scope.selectedClip.startTime+","+$scope.selectedClip.endTime;
      $scope.videoPlayer.load();
      if(play){
        $scope.videoPlayer.play();
      }
    }

    function cancel(){
        $scope.newClip = $scope.blankClip;  
    }

    function toggleClipsList() {
        $mdSidenav('left').toggle();
    }

    function formatTime(time){
      var minutes = pad(Math.floor(time/60), 2, 0);
      var seconds = pad(time%60, 2, 0);
      return minutes + ":" + seconds;
    }

    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

  }

})();
