function intToByteArray(int, byte_array){
	for(var index = 0; index < byte_array.length; index++){
		var byte = int & 0xff;
		byte_array[index] = byte;
		int = (int - byte) / 256;
	}
}

function byteArrayToInt(byteArray){
	var value = 0;
	
	for(var i = byteArray.length - 1; i >= 0; i--){
		value = (value * 256) + byteArray[i];
	}

	return value;
}

String.prototype.paddingLeft = function (paddingValue) {
    return String(paddingValue + this).slice(-paddingValue.length);
 };
