angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',
	'btford.socket-io'
]).config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'Home'
    });
}).factory('mySocket', function (socketFactory) {
	var myIoSocket = io.connect('/webapp');	//Tên namespace webapp

	mySocket = socketFactory({
		ioSocket: myIoSocket
	});
	return mySocket;
	
/////////////////////// Những dòng code ở trên phần này là phần cài đặt, các bạn hãy đọc thêm về angularjs để hiểu, cái này không nhảy cóc được nha!
}).controller('Home', function($scope, mySocket) {
	////Khu 1 -- Khu cài đặt tham số mặc định
    	$scope.gas = "Không có dữ liệu - có thể chưa gắn sensor - ^^";
	$scope.tem = "Không có dữ liệu - có thể chưa gắn sensor - ^^";
	$scope.hum = "Không có dữ liệu - có thể chưa gắn sensor - ^^";
	$scope.Thietbi1  = "FALSE"	
	$scope.Thietbi2  = "FALSE"
	$scope.Thietbi3  = "FALSE"	
	$scope.Thietbi4  = "FALSE"
	$scope.Thietbi5  = "FALSE"
	$scope.Thietbi6  = "FALSE"

	////Khu 2 -- Cài đặt các sự kiện khi tương tác với người dùng
	//các sự kiện ng-click, nhấn nút
	$scope.thietbi1on  = function() {
		mySocket.emit("THIETBI0",0)
		$scope.Thietbi1 = "ON"
	}
	$scope.thietbi1off  = function() {
		mySocket.emit("THIETBI0", 1)
		$scope.Thietbi1 = "OFF"
	}
	$scope.thietbi2on  = function() {
		mySocket.emit("THIETBI1",0)
		$scope.Thietbi2 = "ON"
	}
	$scope.thietbi2off  = function() {
		mySocket.emit("THIETBI1",1)
		$scope.Thietbi2 = "OFF"
	}
	$scope.thietbi3on  = function() {
		mySocket.emit("THIETBI2",0)
		$scope.Thietbi3 = "ON"
	}
	$scope.thietbi3off  = function() {
		mySocket.emit("THIETBI2",1)
		$scope.Thietbi3 = "OFF"
	}
	$scope.thietbi4on  = function() {
		mySocket.emit("THIETBI3",0)
		$scope.Thietbi4 = "ON"
	}
	$scope.thietbi4off  = function() {
		mySocket.emit("THIETBI3",1)
		$scope.Thietbi4 = "OFF"
	}
	$scope.thietbi5on  = function() {
		mySocket.emit("THIETBI4",0)
		$scope.Thietbi5 = "ON"
	}
	$scope.thietbi5off  = function() {
		mySocket.emit("THIETBI4",1)
		$scope.Thietbi5 = "OFF"
	}
	$scope.thietbi6on  = function() {
		mySocket.emit("THIETBI5",0)
		$scope.Thietbi6 = "ON"
	}
	$scope.thietbi6off  = function() {
		mySocket.emit("THIETBI5",1)
		$scope.Thietbi6 = "OFF"
	}
	//Cách gửi tham số 1: dùng biến toàn cục! $scope.<tên biến> là biến toàn cục
		
	////Khu 3 -- Nhận dữ liệu từ Arduno ESP8266
	
	mySocket.on('WEATHER', function(json) {
		$scope.tem = json["TEMP"]
		$scope.hum = json["HUMI"]
	})
	mySocket.on('GAS', function(json) {
		$scope.gas = (json["GAS"] == 0) ? "Normal" : "GAS Leakage"
	})
	
	mySocket.on('THIETBI0', function(json) {
		console.log(json["THIETBI0"])
		$scope.Thietbi1 = (json["THIETBI0"] == 0) ? "ON" : "OFF"
	})
	mySocket.on('THIETBI1', function(json) {
		console.log(json["THIETBI1"])
		$scope.Thietbi2 = (json["THIETBI1"] == 0) ? "ON" : "OFF"
	})
	mySocket.on('THIETBI2', function(json) {
		console.log(json["THIETBI2"])
		$scope.Thietbi3 = (json["THIETBI2"] == 0) ? "ON" : "OFF"
	})
	mySocket.on('THIETBI3', function(json) {
		console.log(json["THIETBI3"])
		$scope.Thietbi4 = (json["THIETBI3"] == 0) ? "ON" : "OFF"
	})	
	mySocket.on('THIETBI4', function(json) {
		console.log(json["THIETBI4"])
		$scope.Thietbi5 = (json["THIETBI4"] == 0) ? "ON" : "OFF"
	})
	mySocket.on('THIETBI5', function(json) {
		console.log(json["THIETBI5"])
		$scope.Thietbi6 = (json["THIETBI5"] == 0) ? "ON" : "OFF"
	})	
	//// Khu 4 -- Những dòng code sẽ được thực thi khi kết nối với Arduino (thông qua socket server)
	mySocket.on('connect', function() {
		console.log("connected")
		mySocket.emit("THIETBI") //Cập nhập trạng thái thiet bi
		mySocket.emit("WEATHER") //Cập nhập trạng thái thiet bi
	})
	
	mySocket.on('THIETBI', function(json) {
		//mySocket.emit("THIETBI") //Cập nhập trạng thái THIET BI
		$scope.Thietbi1 = (json["THIETBI0"] == 0) ? "ON" : "OFF"
		$scope.Thietbi2 = (json["THIETBI1"] == 0) ? "ON" : "OFF"
		$scope.Thietbi3 = (json["THIETBI2"] == 0) ? "ON" : "OFF"
		$scope.Thietbi4 = (json["THIETBI3"] == 0) ? "ON" : "OFF"
		$scope.Thietbi5 = (json["THIETBI4"] == 0) ? "ON" : "OFF"
		$scope.Thietbi6 = (json["THIETBI5"] == 0) ? "ON" : "OFF"
	})
	mySocket.on('connect', function() {
		console.log("connected")
		mySocket.emit("THIETBI") //Cập nhập trạng thái thiết bị
		
	})
	mySocket.on('ANCONNECT', function() {
		mySocket.emit("CONNEXT",{ "CONNEXT": "SUCCESS"} ) // Xác nhận kết nối android
	})		
});
