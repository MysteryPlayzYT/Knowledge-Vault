$(document).ready(function() {
    $(".generate_qr").click(function() {
        $(".form").hide();
        $(".qr_code").show();
        var num = $(".number").val();
        console.log(upi);
        $(".get_qr").attr("src", upi);
    });
    $(".download_now").click(function() {
        var name = $(".name").val();
        var num = $(".number").val();
        var email = $(".email").val();
        var id = $(".id").val();
        if (num != "" && name != "" && email != "" && id != "") {
        } else {
            alert("Fill all fields correctly");
        }
    });
});