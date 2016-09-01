var spiData = [3, 1, 0, 0]; //device 1
var spiData = [0, 0, 3, 1]; //device 2

for (var j = 4; j > 0; j--) {
	matrix.board.shiftOut(2, 3, spiData[j - 1]);
}

matrix.io.digitalWrite(4, 1);

=> MAXIMUM OPTIMIZATION: send(device, row, val);

=> shifout tung byte

	[3, 1, 0, 0]
	[0, 0, 3, 1]

send cho 2 devices
device 1: val 3 row 1
device 2: val 3 row 1

	[3, 2, 0, 0, 0, 0]
	[0, 0, 4, 3, 0, 0]
	[0, 0, 0, 0, 5, 7]

send cho 3 devices
device 1: val 3 row 2
device 2: val 4 row 3
device 3: val 5 row 7

FUCK YEAHHHHHHHHHHHHHH

if i tru to manipulate like this

	[3, 2, 3, 2]

it understand as ONE TIME RUN FOR BOTH DEVICES

//each time shiftout

//tai sao phai for ????
//for co nghia la gi vao tung LED
//ghi cho DU 1 row

//digitalWrite(dataPin) -> chi co 1 chan nay nhan du lieu thoi
//0 hoac 1

Board.prototype.shiftOut = function(dataPin, clockPin, isBigEndian, value) {
	if (arguments.length === 3) {
		value = isBigEndian;
		isBigEndian = true;
	}

	for (var i = 0; i < 8; i++) {
		this.io.digitalWrite(clockPin, 0);
		if (isBigEndian) {
			this.io.digitalWrite(dataPin, !!(value & (1 << (7 - i))) | 0);
		} else {
			this.io.digitalWrite(dataPin, !!(value & (1 << i)) | 0);
		}
		this.io.digitalWrite(clockPin, 1);
	}
};