
var fileContent;  //to contain content of file before compression
var result; 
var debug = true;

var decompressedFileContent; //to contain content of decrompressed file
var decompressedResult; 

function decompressEncryptedFile() {
    var file = $("#inpFileToDecompress").prop('files')[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var byteArray = new Uint8Array(e.target.result.length);

            for (i = 0; i < e.target.result.length; i++) {
                byteArray[i] = (e.target.result.charCodeAt(i));
            }

            decompressedResult = interpret_byte_array(byteArray);

            if (decompressedResult === false) {
                alert('Something went wrong');
                return;
            }

            updateDecompressedDownloadLink();
        }

        reader.onerror = function (evt) {
            alert("error reading file");
        }

        reader.readAsBinaryString(file);
        
    }

}

function viewDecompressedFileContent()
{
    document.getElementById("fileContentModalDecryptedFileContentsText").innerHTML = decompressedResult.text;
    $('#decompressedFileContentsModal').modal();
}

function updateDecompressedDownloadLink()
{
    if (debug) console.log('Setting download link for decompressed file');

    var blob = new Blob([decompressedResult.text], { type: "application/octet-stream" });
    var url = window.URL.createObjectURL(blob);
    $("#decompressed-file-download").attr("href", url);
    $("#decompressed-file-download").attr("download", "DecodedFile.txt");
}

function processFile() {
    var file = $("#inpChosenFile").prop('files')[0]; //take file path   
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            fileContent = evt.target.result; 
            reinitializeAll();
        }
        reader.onerror = function (evt) {
            alert("error reading file");
        }
    }
}

function reinitializeAll() {
    reinitializeChart();
    reinitializeHuffmanTree();
    updateCompressionDetails();
    updateCompressedDownloadLink();
}

function updateCompressedDownloadLink() {
    if (debug) console.log('Setting download link for compressed file');

    var blob = new Blob([result.file_output], { type: "application/octet-stream" });
    var url = window.URL.createObjectURL(blob);
    $("#compressed-file-download").attr("href", url);
    $("#compressed-file-download").attr("download", "EncodedFile");
}

function updateCompressionDetails() {
    updateCompressionRatioProgress();
    updateFileSizes();
}

function updateFileSizes() {
    if (debug) console.log('Setting sizes in div : ' + result.inp_file_length + ', ' + result.output_file_length);
    $('#inpFileSize').html(result.inp_file_length);
    $('#outFileSize').html(result.output_file_length);
}

function updateCompressionRatioProgress() {
    if (result === false) {
        alert('error');
        return;
    }

    $('#compression-progress-bar').attr('data-value', result.compression_percentage);
    $('#compression-progress-bar-text').html(Math.round(result.compression_percentage) + '%');
    setPercentageOnCompressionProgressBar(); //in ui-script.js
}

function reinitializeHuffmanTree() {

    // Call the interpret function
    if (fileContent != "")
        result = interpret_text(fileContent);

    // Verify
    if (result === false) {
        alert('error');
        return;
    }


    if ($("#huffman-tree-canvaswidget"))
        $("#huffman-tree-canvaswidget").remove();

    console.log('Creating huffman tree');

    visualize(result.encoded_tree, false);


    // Animate tree building
    $("#huffman-tree-canvaswidget").fadeTo(0, 0);
    timeout_to_show = setTimeout(function () {
        $("#huffman-tree-canvaswidget").fadeTo(0, 1);
    }, 550);

}

function reinitializeChart() {
    var freq_array = build_character_nodes(fileContent);

    freq_array.sort(function (a, b) { return a.name.charCodeAt(0) - b.name.charCodeAt(0) });

    //console.log(freq_array);

    var labels = [];
    var freqs = [];

    for (i = 0; i < freq_array.length; i++) {
        labels[i] = freq_array[i].name;
        freqs[i] = freq_array[i].frequency;
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: labels, // ['January', 'February', 'March', 'April', 'May', 'June', 'July','as'],
            datasets: [{
                label: 'Character Frequencies',
                backgroundColor: 'rgb(135, 157, 237)',
                borderColor: 'rgb(255, 99, 132)',
                data: freqs,
            }]
        },

        // Configuration options go here
        options: {}
    });
}

function viewFileContent() {
    var file = $("#inpChosenFile").prop('files')[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            document.getElementById("fileContentModalFileContentsText").innerHTML = evt.target.result;
        }
        reader.onerror = function (evt) {
            document.getElementById("fileContentModalFileContentsText").innerHTML = "error reading file";
        }
        $('#fileContentsModal').modal();
    }
}
