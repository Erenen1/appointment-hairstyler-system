"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { ChartConfig } from "../types";

interface AnalyticsChartsProps {
    typeDistributionChart: ChartConfig;
    performanceChart: ChartConfig;
}

export const AnalyticsCharts = ({ typeDistributionChart, performanceChart }: AnalyticsChartsProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card title="İlan Türü Dağılımı" className="h-[400px]">
                <Chart
                    type="doughnut"
                    data={typeDistributionChart.data}
                    options={typeDistributionChart.options}
                    style={{ height: '300px' }}
                />
            </Card>

            <Card title="En İyi Performans Gösteren İlanlar" className="h-[400px]">
                <Chart
                    type="bar"
                    data={performanceChart.data}
                    options={performanceChart.options}
                    style={{ height: '300px' }}
                />
            </Card>
        </div>
    );
};
