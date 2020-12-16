function setPercentageOnCompressionProgressBar() {
  
  var progressBarDiv = $('#compression-progress-bar');
  var value = progressBarDiv.attr('data-value');
  var left = progressBarDiv.find('.progress-left .progress-bar');
  var right = progressBarDiv.find('.progress-right .progress-bar');

  if (value > 0) {
    if (value <= 50) {
      right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
    } else {
      right.css('transform', 'rotate(180deg)')
      left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
    }
  }
}



function percentageToDegrees(percentage) {

  return percentage / 100 * 360

}
