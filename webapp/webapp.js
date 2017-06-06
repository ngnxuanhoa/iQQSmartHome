angular.module('myApp', [
    'ngRoute',
    'mobile-angular-ui',
	'btford.socket-io',
	'toggle-switch'
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
	////Khu 1 -- Khu cài đặt tham số 
    //cài đặt một số tham số test chơi
	//dùng để đặt các giá trị mặc định
    $scope.l = "Không có dữ liệu - có thể chưa gắn sensor - ^^";
	$scope.Nhietdo = "Normal"
	$scope.Doam = "Normal"
	$scope.Thietbi1  = "FALSE"	
	$scope.Thietbi2  = "FALSE"
	$scope.Thietbi3  = "FALSE"	
	$scope.Thietbi4  = "FALSE"
	////Khu 2 -- Cài đặt các sự kiện khi tương tác với người dùng
	//các sự kiện ng-click, nhấn nút
	$scope.updateSensor  = function() {
		mySocket.emit("RAIN")
	}
	$scope.thietbi1on  = function() {
		mySocket.emit("THIETBI1ON")
		$scope.Thietbi1 = "ON"
	}
	$scope.thietbi1off  = function() {
		mySocket.emit("THIETBI1OFF")
		$scope.Thietbi1 = "OFF"
	}
	$scope.thietbi2on  = function() {
		mySocket.emit("THIETBI2ON")
		$scope.Thietbi2 = "ON"
	}
	$scope.thietbi2off  = function() {
		mySocket.emit("THIETBI2OFF")
		$scope.Thietbi2 = "OFF"
	}
	$scope.thietbi3on  = function() {
		mySocket.emit("THIETBI3ON")
		$scope.Thietbi3 = "ON"
	}
	$scope.thietbi3off  = function() {
		mySocket.emit("THIETBI3OFF")
		$scope.Thietbi3 = "OFF"
	}
	$scope.thietbi4on  = function() {
		mySocket.emit("THIETBI4ON")
		$scope.Thietbi4 = "ON"
	}
	$scope.thietbi4off  = function() {
		mySocket.emit("THIETBI4OFF")
		$scope.Thietbi4 = "OFF"
	}
	//Cách gửi tham số 1: dùng biến toàn cục! $scope.<tên biến> là biến toàn cục
		
	////Khu 3 -- Nhận dữ liệu từ Arduno gửi lên (thông qua ESP8266 rồi socket server truyền tải!)
	//các sự kiện từ Arduino gửi lên (thông qua esp8266, thông qua server)
	mySocket.on('RAIN', function(json) {
	$scope.CamBienMua = (json["RAIN"] == 1) ? "Không mưa" : "Có mưa rồi yeah ahihi"
	})
	
	/// THời tiết Nhiệt độ
	mySocket.on('NHIETDO', function(json) {
		//Nhận được thì in ra thôi hihi.
		console.log("recv LED", json)
		$scope.Nhietdo = json[NHIETDO]
		
	})
	/// THời tiết độ ẩm
	mySocket.on('DOAM', function(json) {
		//Nhận được thì in ra thôi hihi.
		console.log("recv LED", json)
		$scope.Doam = json["DOAM"]
		
	})
	//khi nhận được lệnh Button
	mySocket.on('THIETBI1', function(json) {
		//Nhận được thì in ra thôi hihi.
		$scope.Thietbi1 = (json["THIETBI1"] == 1) ? "ON" : "OFF"
		mySocket.emit("DEVICE1-ANDROID", { DEVICE: "1" + json["THIETBI1"] })
	})
	mySocket.on('THIETBI2', function(json) {
		//Nhận được thì in ra thôi hihi.
		$scope.Thietbi2 = (json["THIETBI2"] == 1) ? "ON" : "OFF"
		mySocket.emit("DEVICE2-ANDROID", { DEVICE: "2" + json["THIETBI2"] })
	})
	mySocket.on('THIETBI3', function(json) {
		//Nhận được thì in ra thôi hihi.
		$scope.Thietbi3 = (json["THIETBI3"] == 1) ? "ON" : "OFF"
		mySocket.emit("DEVICE3-ANDROID", { DEVICE: "3" + json["THIETBI3"] })
	})
	mySocket.on('THIETBI4', function(json) {
		//Nhận được thì in ra thôi hihi.
		$scope.Thietbi4 = (json["THIETBI4"] == 1) ? "ON" : "OFF"
		mySocket.emit("DEVICE4-ANDROID", { DEVICE: "4" + json["THIETBI4"] })
	})	
	///Khu nhận tín hiệu từ Android
	mySocket.on('DEVICE1', function(json) {
		//Nhận được thì in ra thôi hihi.
		if (json == "ON"){mySocket.emit("THIETBI1ON")}
		else if (json == "OFF"){mySocket.emit("THIETBI1OFF")}		
	})

	mySocket.on('DEVICE2', function(json) {
		//Nhận được thì in ra thôi hihi.
		if (json == "ON"){mySocket.emit("THIETBI2ON")}
		else if (json == "OFF"){mySocket.emit("THIETBI2OFF")}
		
	})
		mySocket.on('DEVICE3', function(json) {
		//Nhận được thì in ra thôi hihi.
		if (json == "ON"){mySocket.emit("THIETBI3ON")}
		else if (json == "OFF"){mySocket.emit("THIETBI3OFF")}		
	})

	mySocket.on('DEVICE4', function(json) {
		//Nhận được thì in ra thôi hihi.
		if (json == "ON"){mySocket.emit("THIETBI4ON")}
		else if (json == "OFF"){mySocket.emit("THIETBI4OFF")}
		
	})
	//// Khu 4 -- Những dòng code sẽ được thực thi khi kết nối với Arduino (thông qua socket server)
	mySocket.on('connect', function() {
		console.log("connected")
		mySocket.emit("RAIN") //Cập nhập trạng thái mưa
		mySocket.emit("THIETBI") //Cập nhập trạng thái thiet bi
	})
	
	mySocket.on('THIETBI', function() {
		mySocket.emit("THIETBI") //Cập nhập trạng thái THIET BI
	})
	mySocket.on('ANCONNECT', function() {
		mySocket.emit("CONNEXT",{ "CONNEXT": "SUCCESS"} ) // Xác nhận kết nối android
	})		
});