$(document).ready(function () {
    $('.report-controls button, .report-controls input').attr('disabled', true);

    var codeplug = null;

    function isDigital(channel) {
        return channel.ChannelMode == "Digital";
    }

    function findChannelZones(channelName) {
        return $.map(codeplug.Zones, function (z) {
            var pos = $.inArray(channelName, z.Channel); 
            if (pos !== -1) {
                return z.Name + ' (' + (pos +1) + ')';
            
            }
        });
    }

    function populateChannelList(channels, elem) {
        elem.fadeOut();
        var thead = $('thead', elem);
        var tbody = $('tbody', elem);
        thead.empty();
        tbody.empty();

        var headRow = $('<tr/>').appendTo(thead);
        $('<th/>').text('Name (file position)').appendTo(headRow);
        $('<th/>').text('Rx/Tx Frequency').appendTo(headRow);
        $('<th/>').text('Mode').appendTo(headRow);
        $('<th/>').text('Zone').appendTo(headRow);
        $('<th/>').text('Summary').appendTo(headRow);

        $.each(channels, function (i, ch) {
            var row = $('<tr/>');
            $('<td/>').text(ch.Name + ' (' + ch.Position + ')').appendTo(row);
            $('<td/>').text(ch.RxFrequency + '/' + ch.TxFrequency).appendTo(row);
            $('<td/>').text(ch.ChannelMode).appendTo(row);

            var zones = findChannelZones(ch.Name);
            var zoneCell = $('<td/>').addClass('zones').appendTo(row);
            if (zones && zones.length > 0) {
                zoneCell.text(zones.join(', '));
            }
            else {
                row.addClass('nozones');
                if ($('#hideNoZoneChan').is(':checked')) {
                    row.addClass('hidden');
                }
            }

            var summaryCell = $('<td/>').addClass('summary').appendTo(row);
            if (isDigital(ch)) {
                summaryCell.text('TS: ' + ch.RepeaterSlot + '; Talkk Group: ' + ch.ContactName + '; Rx Group: ' + ch.GroupList);
            }


            row.appendTo(tbody);
        });

        elem.fadeIn();

    }

    function listChannelsByFrequency() {

        var channels = codeplug.Channels.sort(function (a, b) {
            if (a.RxFrequency === b.RxFrequency) {
                return a.Name.localeCompare(b.Name);
            }
            return a.RxFrequency - b.RxFrequency;
        });
        var elem = $('#channelsByFrequency');
        populateChannelList(channels, elem);
    }

    function listChannelsByName() {

        var channels = codeplug.Channels.sort(function (a, b) {
            return a.Name.localeCompare(b.Name);
        });
        var elem = $('#channelsByName');
        populateChannelList(channels, elem);
    }

    function listChannelsByPosition() {

        var channels = codeplug.Channels.sort(function (a, b) {
            return a.Position - b.Position;
        });;
        var elem = $('#channelsByPosition');
        populateChannelList(channels, elem);
    }


    $.getJSON('/js/obx.json', function (data) {

        codeplug = data;
        // massage the data
        var channelPos = 1;
        codeplug.Channels = $.map(codeplug.Channels, function (ch) {
            ch.Position = channelPos++;
            return ch;
        });


        console.log(codeplug);
        // todo: summarize codeplug data

        // enable controls
        $('.report-controls button, .report-controls input').attr('disabled', false);

        // select first button for the user
        $('.report-controls button').first().trigger('click');

    });

    // handlers 
    $('#hideNoZoneChan').change(function () {
        if ($('#hideNoZoneChan').is(':checked')) {
            $('tr.nozones').addClass('hidden');
        }
        else {
            $('tr.nozones').removeClass('hidden');
        }
    });

    $('#btnChanFrequency').click(function (e) {

        $('.report-controls button').removeClass('active');
        $('.channel-display').hide();
        listChannelsByFrequency();
        $(this).addClass('active');
    });
    $('#btnChanName').click(function (e) {

        $('.report-controls button').removeClass('active');
        $('.channel-display').hide();
        listChannelsByName();
        $(this).addClass('active');
    });
    $('#btnChanPosition').click(function (e) {

        $('.report-controls button').removeClass('active');
        $('.channel-display').hide();
        listChannelsByPosition();
        $(this).addClass('active');
    });

});