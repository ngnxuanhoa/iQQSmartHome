﻿angular.module('myApp', [
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

	//Cách gửi tham số 1: dùng biến toàn cục! $scope.<tên biến> là biến toàn cục
		
	////Khu 3 -- Nhận dữ liệu từ Arduno ESP8266
	
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
	//// Khu 4 -- Những dòng code sẽ được thực thi khi kết nối với Arduino (thông qua socket server)
	mySocket.on('connect', function() {
		console.log("connected")
		mySocket.emit("THIETBI") //Cập nhập trạng thái thiet bi
	})
	
	mySocket.on('THIETBI', function(json) {
		//mySocket.emit("THIETBI") //Cập nhập trạng thái THIET BI
		$scope.Thietbi1 = (json["THIETBI0"] == 0) ? "ON" : "OFF"
		$scope.Thietbi2 = (json["THIETBI1"] == 0) ? "ON" : "OFF"
		$scope.Thietbi3 = (json["THIETBI2"] == 0) ? "ON" : "OFF"
		$scope.Thietbi4 = (json["THIETBI3"] == 0) ? "ON" : "OFF"
		$scope.tem = json["TEMP"]
		$scope.hum = json["HUMI"]
		$scope.gas = (json["GAS"] == 0) ? "Normal" : "GAS Leakage"
		//location.reload();
	})

	mySocket.on('ANCONNECT', function() {
		mySocket.emit("CONNEXT",{ "CONNEXT": "SUCCESS"} ) // Xác nhận kết nối android
	})		
});
