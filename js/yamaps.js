$(document).ready(function() {
    $('.modalLink').click(function() {
        $('#modalLink').openModal();
    });
    $('.modalAbout').click(function() {
        $('#modalAbout').openModal();
    });
    $('select').material_select();
    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: true, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

    $('.custom-select .select-dropdown').css({
        'background-image': 'url(../img/lang.png)'
    });

});

function mapWidth() {
    $('#map').css({
        'width': '75%'
    });
    $('.ymaps-map').css({
        'width': '100%'
    });
    $('.list-block').css({
        'width': '25%'
    });
}

function closeListBlock() {
    $('#map').css({
        'width': '105%'
    });
    $('.ymaps-map').css({
        'width': '100%'
    });
    $('.list-block').css({
        'width': '0%'
    });
}

$(document).on('click', '.list-link', function() {
    var index = $(this).parent().parent().index();
    arrPlacemark[index].balloon.open();
    var cX = arrPlacemark[index].geometry._oc[0];
    var cY = arrPlacemark[index].geometry._oc[1];
    myMap.setZoom(15);
    myMap.setCenter([cX, cY]);
});

function openModalPlace() {
    setTimeout(function() {
        $('#modal1').openModal();
    }, 500);
}
$('.lean-overlay').click(function() {
    alert('ddd');
});
