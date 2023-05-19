//! Card Code
(function($angular){
	var app= angular.module("appspaceCard",[]);
	app.controller("cardController",["$scope","$timeout","$interval",function($scope,$timeout,$interval){
		
		//initialize scope variables
	  	$scope.myStyle = {};

	  	//update card variables from the card model and apply custom styles
	  	var updateModel=function(){
	  		$timeout(function(){
		  		
		  		//get Model Values
		  		$scope.text = $cardApi.getModelProperty("text").value||"";
					$scope.background=$cardApi.getModelProperty("background").value||undefined;
		  		
		  		//now that we have the model values we can apply our styling customizations
		  		applyBackgroundStyle($scope.background);

		    });
		};
		
		//apply background to main style object	  	
	  	var applyBackgroundStyle = function(background){
	  		if (background){
	  			//Add/Remove background Image/color to style
				$scope.myStyle.backgroundColor= background.bgColor||"#FFF",
				$scope.myStyle.margin=0;
				if (angular.isDefined(background.bgImage) && (background.bgImage !== null && background.bgImage !==""))
				{
				    $scope.myStyle.background='url(' + background.bgImage +') no-repeat center center fixed';
				    $scope.myStyle.backgroundSize='cover';
				}
				else
				{
					
				    if (angular.isDefined($scope.myStyle.background))
				    {
				    	delete $scope.myStyle.background;  
				    }
				}
    			}
	  	};

	  	//check if background image is loaded then call a callback function
	  	var checkBackgroundLoadStatus = function(background,callback){
	  		var callCallback=function(){
	  			refreshDimensionData();
	  			if (callback && typeof callback === "function")
    				callback();
	  		};
	  		if (background && background.bgImage && background.bgImage !== "")
	  		{
	  			var url=background.bgImage;
		  		var img = new Image();
				img.onload = function() {
	    			img=undefined;
	    			callCallback();
				};
				img.src = url;
			}
			else
				callCallback();
	  	};
	  	
	  	//get Window size and orientation
	  	var getWindowSize = function(){
			var width=window.innerWidth;
			var height=window.innerHeight;
			var orientation=width>=height?"landscape":"portrait";
	        return {"width":width,"height":height,"orientation":orientation};
    	};

	  	//subscribe and initialize cardapi, create thread to refresh every set duration, assign watcher for scope variables that need an update from the API
	  	var init = function(){
	  		//Card Api subscribe and init to allow card model access
	  		$cardApi.subscribeModelUpdate (updateModel);
	    	$cardApi.init();
	    	
	    };

	    //Generate CSS from model style variable
	    var generateStyle = function(style) {
	        var rtnStyle = {};
	        if (!style) 
	            return rtnStyle;
	        if (style.decorations) {
	            if (style.decorations.indexOf('bold') > -1) {
	                rtnStyle['font-weight'] = 'bold';
	            } else {
	                rtnStyle['font-weight'] = 'normal';
	            }
	            if (style.decorations.indexOf('italic') > -1) {
	                rtnStyle['font-style'] = 'italic';
	            } else {
	                rtnStyle['font-style'] = 'normal';
	            }
	            if (style.decorations.indexOf('underline') > -1) {
	                rtnStyle['text-decoration'] = 'underline';
	            } else {
	                rtnStyle['text-decoration'] = 'none';
	            }
	        }
	        if (style.color) 
	            rtnStyle['color'] = style.color;
	        if (style.backgroundcolor) 
	            rtnStyle['background-color'] = style.backgroundcolor;
	        if (style.size) 
	            rtnStyle['font-size'] = style.size;
	        if (style.fontfamily) 
	            rtnStyle['font-family'] = style.fontfamily;
	        return rtnStyle;
	    };

	    //call init to initialize card
	    init();

	}]);
})(window.angular);