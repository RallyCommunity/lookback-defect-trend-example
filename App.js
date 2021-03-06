Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        this.createTrendChart();
    },
    createTrendChart: function() {
        var projectOid = this.getContext().getProject().ObjectID;
        var startDate = new Date(new Date() - 86400000*30); //milliseconds in a day * 30 days
        var startDateUTC = startDate.toISOString();
        console.log(startDateUTC);
        Ext.define('My.TrendCalc', {
            extend: 'Rally.data.lookback.calculator.TimeSeriesCalculator',
            getMetrics: function() {
                return [
                  {
                    as: 'Defects',
                    display: 'line',
                    f: 'count'
                  }
                ];
            }
        });
        this.myTrendChart = Ext.create('Rally.ui.chart.Chart', {
            storeType: 'Rally.data.lookback.SnapshotStore',
            storeConfig: {
                find: {
                    _TypeHierarchy: "Defect",
                    State: { $lt: "Closed"},
                    _ProjectHierarchy: projectOid,
                    _ValidFrom: {$gte: startDateUTC}
                }
            },
            calculatorType: 'My.TrendCalc',
            calculatorConfig: {},
            chartConfig: {
                chart: {
                    zoomType: 'x',
                    type: 'line'
                },
                title: {
                    text: 'Defects in the last 30 days'
                },
                xAxis: {
                    type: 'datetime',
                    minTickInterval: 3
                },
                yAxis: {
                    title: {
                    text: 'Number of Defects'
                    }
                }
            }
        });
        return this.add(this.myTrendChart);
    }
});
