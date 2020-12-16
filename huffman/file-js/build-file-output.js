function build_file_output(paths, content_bytes, pad_count){
	// Form JSON
	var json = JSON.stringify(paths);
	console.log("json paths : "+json);
	json = json.replace(/"/g, "");
	json = json.substring(1, json.length-1);
	console.log("json paths 2: "+json);

	
	// Form byte array
	var byte_array = new Uint8Array(5 + json.length + content_bytes.length);
	intToByteArray(json.length, byte_array);
	byte_array[4] = pad_count;
	
	for(i = 0; i < json.length; i++){
		byte_array[i+5] = json.charCodeAt(i);
	}
	
	for(i = 0; i < content_bytes.length; i++){
		byte_array[i+5+json.length] = content_bytes[i];
	}
	
	
	// Return
	return byte_array;
}