$(document).ready(function(){

    $('.datepicker').datepicker({
        format: "yyyy-mm-dd",
        weekStart: 1,
        endDate: "today",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

});
