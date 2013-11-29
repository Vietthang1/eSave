function DeviceController($scope, $http) {
	$scope.devices = [];
	$scope.divisions = [{text:'All',selected:true}];

	$scope.init = function() {	
		$scope.updateData();

		setInterval(function() {
			console.log('running!');			
			$scope.updateData();
		}, 5000);			
	};
	
	$scope.updateData = function() {
		$http.post('/getDevices').success(function(data) {
			$scope.devices = data;			
			var temp = [];
			var selectingDivision = 'All';
			for (var i = 0; i < $scope.divisions.length; ++i) {
				if ($scope.divisions[i].selected) {
					selectingDivision = $scope.divisions.text;
					break;
				}
			}
			var divisions = [{text: 'All', selected: true}];

			for(var i = 0; i < $scope.devices.length;i++) {				
				$scope.devices[i].visible = true;
				if (temp.indexOf($scope.devices[i].location.division) == -1) {
					divisions.push({text:$scope.devices[i].location.division,selected:false});
					temp.push($scope.devices[i].location.division);
				}
			}
			$scope.divisions = divisions;																
		});
	};

	$scope.divisionClick = function(division) {
		for(var i = 0; i < $scope.divisions.length;i++) {
			if($scope.divisions[i].text==division){
				$scope.divisions[i].selected=true;
			}else{
				$scope.divisions[i].selected=false;
			}
		}
		for(var i = 0; i < $scope.devices.length;i++){
			if(division!='All'){
				if($scope.devices[i].location.division==division){
    				$scope.devices[i].visible=true;
    			}else{
    				$scope.devices[i].visible=false;
    			}
			}else{
				$scope.devices[i].visible=true;
			}
		}
	}

	$scope.switchDevice = function(id, status) {
		// alert(id+'-'+status);				
		console.log(id + ' ' + status);
		command(id, status == true ? 'power_on' : 'power_off');
		//TODO: send request to turn device off
		// for(var i = 0; i < $scope.devices.length;i++){
		// 	if(id==$scope.devices[i].id){
		// 		$scope.devices[i].running = status;
		// 		return false;
		// 	}
		// }
	}

	$scope.changeTemp = function(id, change) {
		command(id, change === -1 ? 'decrease_temp' : 'increase_temp');
	}

	function command(id, command) {
		$http.post('/cmd', {'id' : id, 'command': command}).success(function(data) {
			console.log('POST ok!' + data);
		});
	}
}