// Get all elements with class="closebtn"
var close = document.getElementsByClassName("buttonAlertClose");
var i;

// Loop through all close buttons
for (i = 0; i < close.length; i++) {
    // When someone clicks on a close button
    close[i].onclick = function () {

        // Get the parent of <span class="closebtn"> (<div class="alert">)
        var div = this.parentElement;

        // Set the opacity of div to 0 (transparent)
        div.style.opacity = "0";
        div.remove();

        // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
        setTimeout(function () {
            div.style.display = "none";
        }, 300);

        if (close.length < 1) {
            document.getElementById("alertContainerID").remove();
        }
    }
}

var data = {
    'cond1': true,
    'cond2': false,
};

document.getElementById('show').addEventListener('click', function () {
    var source = document.getElementById('text-cond').innerHTML;
    var template = Handlebars.compile(source);
    var html = template(data);
    document.getElementById('content').innerHTML = html;
});