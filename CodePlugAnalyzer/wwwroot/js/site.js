$(document).ready(function () {
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
            return a.RxFrequency - b.RxFrequency
        });
        var elem = $('#channelsByFrequency');
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

        // todo: enable controls


        listChannelsByFrequency();

    });

});