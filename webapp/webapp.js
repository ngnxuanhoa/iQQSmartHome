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
	////Khu 1 -- Khu cài đặt tham số 
    //cài đặt một số tham số test chơi
	//dùng để đặt các giá trị mặc định
    $scope.l = "Không có dữ liệu - có thể chưa gắn sensor - ^^";
    $scope.leds_status = [1, 1]
	$scope.Thietbi1 = "ON"
	$scope.Thietbi2 = "ON"
	
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
	
	//Cách gửi tham số 1: dùng biến toàn cục! $scope.<tên biến> là biến toàn cục
	$scope.changeLED = function() {
		console.log("send LED ", $scope.leds_status)
		
		var json = {
			"led": $scope.leds_status
		}
		mySocket.emit("LED", json)
	}
		
	////Khu 3 -- Nhận dữ liệu từ Arduno gửi lên (thông qua ESP8266 rồi socket server truyền tải!)
	//các sự kiện từ Arduino gửi lên (thông qua esp8266, thông qua server)
	mySocket.on('RAIN', function(json) {
		$scope.CamBienMua = (json.digital == 1) ? "Không mưa" : "Có mưa rồi yeah ahihi"
	})
	//Khi nhận được lệnh LED_STATUS
	mySocket.on('LED_STATUS', function(json) {
		//Nhận được thì in ra thôi hihi.
		console.log("recv LED", json)
		$scope.leds_status = json.data
	})
	//khi nhận được lệnh Button
	mySocket.on('THIETBI1', function(json) {
		//Nhận được thì in ra thôi hihi.
		console.log("recv THIETBI1", json)
		$scope.Thietbi1 = json.data
	})
	
		mySocket.on('THIETBI2', function(json) {
		//Nhận được thì in ra thôi hihi.
		console.log("recv THIETBI2", json)
		$scope.Thietbi2 = json.data
	})
	//// Khu 4 -- Những dòng code sẽ được thực thi khi kết nối với Arduino (thông qua socket server)
	mySocket.on('connect', function() {
		console.log("connected")
		mySocket.emit("RAIN") //Cập nhập trạng thái mưa
		
	})
		
});