$(function() {

    //E-mail Ajax Send
    //Documentation & Example: https://github.com/agragregra/uniMail
    // $("form").submit(function() { //Change
    //     var th = $(this);
    //     $.ajax({
    //         type: "POST",
    //         url: "mail.php", //Change
    //         data: th.serialize()
    //     }).done(function() {
    //         alert("Thank you!");
    //         setTimeout(function() {
    //             // Done Functions
    //             th.trigger("reset");
    //         }, 1000);
    //     });
    //     return false;
    // });
    // no dragstart img
    $("img, a").on("dragstart", function(event) { event.preventDefault(); });

});


//preloader
$(window).load(function() {
    $(".loader_inner").fadeOut();
    $(".loader").delay(400).fadeOut("slow");

});