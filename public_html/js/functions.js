var defaults = {
    exporting: {buttons: {contextButton: {enabled: false}}},
    chart: {
        spacingBottom: 15,
        spacingTop: 10,
        spacingLeft: 0,
        spacingRight: 0,
        width: null,
        height: null,
        backgroundColor: null,
        plotBorderColor: 'white',
        plotBorderWidth: 1,
        animation: false
    },
    plotOptions: {series: {animation: false}},
    title: {text: ''},
    subtitle: {text: ''},
    legend: {enabled: false},
    xAxis: {
        title: {
            enabled: null,
            text: ""
        },
        categories: getXAxis(),
        labels: {
            style: {
                color: "white",
                fontFamily: "System, arial, sans-serif",
                fontSize: '17px',
                fontWeight: 'normal'
            }
        },
        tickInterval: 2
    },
    yAxis: {
        title: {text: ''},
        plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
        labels: {style: {
                color: "white",
                fontFamily: "System, arial, sans-serif",
                fontSize: '17px',
                fontWeight: 'normal'
            }},
        alternateGridColor: '#4bb0e2',
        gridLineDashStyle: 'Dash',
        minorGridLineWidth: 0,
        minorTickColor: 'white',
        minorTickInterval: 'auto',
        minorTickLength: 5,
        minorTickWidth: 1
    },
    colors: ['white'],
    tooltip: {valueSuffix: '°C'},
    series: [{
            name: "--",
            data: [0, 0, 0],
            marker: {
                enabled: true,
                fillColor: '#4297FF',
                lineColor: '#0062DB',
                lineWidth: 3,
                radius: 5
            }
        }]
};

// ########################################################
// I hate javascript ...
var month = new Array("Januar", "Februar", "März", "April", "Mai", "Juni","Juli", "August", "September", "Oktober", "November", "Dezember");
var weekday = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");;
function setClock() {
    var date = new Date();
    $("#clock").text($.format.date(date, "HH:mm"));
    $("#date").text(weekday[date.getDay()]+", "+date.getDate()+". "+month[date.getMonth()]);
}

function min(v, arr) {
    return Math.min(v, Math.min.apply(null, arr));
}
function max(v, arr) {
    return Math.max(v, Math.max.apply(null, arr));
}

function toFixedArray(arr){
    for(var i = 0; i< arr.length; i++){
        arr[i] = arr[i].toFixed(1)*1;
    }
    return arr;
}

function loadSeries() {
    $.getJSON("data/series.json", function (series) {
        // new Array("temp", "humidity", "pressure", "ambient");
        if (showMetric === 0) {
            defaults.tooltip.valueSuffix = ' °C';
            defaults.series[0].name = "Temperatur";
            defaults.series[0].data = toFixedArray(series.temperature);
            defaults.yAxis.min = min(series.temperature[0], series.temperature);
            defaults.yAxis.max = max(series.temperature[0], series.temperature);
            defaults.yAxis.type = 'linear';

        } else if (showMetric === 1) {
            defaults.tooltip.valueSuffix = ' %';
            defaults.series[0].name = "Luftfeuchtigkeit";
            defaults.series[0].data = toFixedArray(series.humidity);
            defaults.yAxis.min = min(50, series.humidity);
            defaults.yAxis.max = max(90, series.humidity);
            defaults.yAxis.type = 'linear';

        } else if (showMetric === 2) {
            defaults.tooltip.valueSuffix = ' mBar';
            defaults.series[0].name = "Luftdruck";
            defaults.series[0].data = toFixedArray(series.airpressure);
            defaults.yAxis.min = min(series.airpressure[0], series.airpressure);
            defaults.yAxis.max = max(series.airpressure[0], series.airpressure);
            defaults.yAxis.type = 'linear';

        } else if (showMetric === 3) {
            defaults.tooltip.valueSuffix = ' Lux';
            defaults.series[0].name = "Umgebungslicht";
            defaults.series[0].data = toFixedArray(series.ambientlight);
            defaults.yAxis.min = min(20, series.airpressure);
            defaults.yAxis.max = 999;
            defaults.yAxis.type = 'logarithmic';

        } else {
        }
        $('#chart').highcharts(defaults);
        $("#diagramHead").text(defaults.series[0].name);
    });
}

function loadTable() {
    $.getJSON("data/table.json", function (data) {
        function noSign(dec, v) {
            return parseFloat(v).toFixed(dec);
        }
        $(".currentTemp").text(noSign(1, data.temperature.current));
        $("#minTemp").text(noSign(1, data.temperature.min));
        $("#maxTemp").text(noSign(1, data.temperature.max));

        $(".currentHumidity").text(noSign(1, data.humidity.current));
        $("#minHumidity").text(noSign(1, data.humidity.min));
        $("#maxHumidity").text(noSign(1, data.humidity.max));

        $(".currentAirpressure").text(noSign(0, data.airpressure.current));
        $("#minAirpressure").text(noSign(0, data.airpressure.min));
        $("#maxAirpressure").text(noSign(0, data.airpressure.max));

        $(".currentAmbient").text(noSign(0, data.ambientlight.current));
        $("#minAmbient").text(noSign(0, data.ambientlight.min));
        $("#maxAmbient").text(noSign(0, data.ambientlight.max));

        // new Array("temp", "humidity", "pressure", "ambient");
        if (showMetric === 0) {
            $("#bigTitle").text("Temperatur");
            $("#bigValue").text(noSign(1, data.temperature.current));
            $("#bigValueMetric").text("°C");

        } else if (showMetric === 1) {
            $("#bigTitle").text("Luftfeuchtigkeit");
            $("#bigValue").text(noSign(1, data.humidity.current));
            $("#bigValueMetric").text("%");

        } else if (showMetric === 2) {
            $("#bigTitle").text("Luftdruck");
            $("#bigValue").text(noSign(0, data.airpressure.current));
            $("#bigValueMetric").text("mBar");

        } else if (showMetric === 3) {
            $("#bigTitle").text("Umgebungslicht");
            $("#bigValue").text(noSign(0, data.ambientlight.current));
            $("#bigValueMetric").text("Lux");

        } else {
        }
	});
}

function getXAxis() {
    var today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);

    var midnight = new Date();
    midnight.setHours(0);
    midnight = midnight.getTime();

    var yesterdayMidnight = new Date(midnight - 86400 * 1000).getTime();
    var xLabels = new Array(48);
    for (var i = 0; i < 48; i++) {
        var x = new Date(today.getTime() - i * 3600 * 1000);
        if (x.getTime() < yesterdayMidnight) {
            xLabels[i] = $.format.date(x, "dd.MM");
        }
        else if (x.getTime() < midnight) {
            xLabels[i] = "gestern";
        }
        else {
            xLabels[i] = "heute";
        }
        xLabels[i] = xLabels[i] + " " + x.getHours() + ":00";
    }
    xLabels.reverse();
    return xLabels;
}





