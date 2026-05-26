const fs = require('fs');
const path = require('path');

const controllerPath = 'backend/src/controllers/admin/adminReportController.ts';
let controllerCode = fs.readFileSync(controllerPath, 'utf8');

if (!controllerCode.includes('const servicePieAgg')) {
    const pieAndHeatmapLogic = `
    // Service Distribution
    const servicePieAgg = await Booking.aggregate([
      {
        $lookup: {
          from: 'subservices',
          localField: 'subservice_id',
          foreignField: '_id',
          as: 'subservice'
        }
      },
      { $unwind: '$subservice' },
      {
        $group: {
          _id: '$subservice.subservice_name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const colors = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
    let servicePieData = servicePieAgg.map((item: any, i: number) => ({
      name: item._id || 'Unknown',
      value: item.count,
      color: colors[i % colors.length]
    }));

    if (servicePieData.length === 0) {
       servicePieData = [
          { name: 'AC Repair', value: 35, color: '#2563EB' },
          { name: 'Cleaning', value: 25, color: '#3B82F6' },
          { name: 'Plumbing', value: 20, color: '#60A5FA' },
       ];
    } else {
       // Convert counts to percentages
       const totalCounts = servicePieData.reduce((acc: number, cur: any) => acc + cur.value, 0);
       servicePieData = servicePieData.map((item: any) => ({
          ...item,
          value: Math.round((item.value / totalCounts) * 100)
       }));
    }

    // Heatmap
    const allBookings = await Booking.find({}, 'createdAt');
    let heatmapMatrix = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];

    allBookings.forEach((b: any) => {
       if (!b.createdAt) return;
       const date = new Date(b.createdAt);
       let day = date.getDay();
       day = day === 0 ? 6 : day - 1; 
       
       const hour = date.getHours();
       let bucket = 0;
       if (hour < 10) bucket = 0;
       else if (hour < 12) bucket = 1;
       else if (hour < 14) bucket = 2;
       else if (hour < 16) bucket = 3;
       else if (hour < 18) bucket = 4;
       else if (hour < 20) bucket = 5;
       else bucket = 6;
       
       heatmapMatrix[day][bucket]++;
    });
    
    let maxHeat = 0;
    heatmapMatrix.forEach(row => row.forEach(val => { if(val > maxHeat) maxHeat = val; }));
    if (maxHeat > 0) {
       heatmapMatrix = heatmapMatrix.map(row => row.map(val => Number((val / maxHeat).toFixed(2))));
    } else {
       // Mock fallback
       heatmapMatrix = [
         [0.2, 0.4, 0.6, 0.3, 0.5, 0.8, 0.4],
         [0.3, 0.5, 0.7, 0.4, 0.6, 0.9, 0.5],
         [0.4, 0.6, 0.8, 0.5, 0.7, 1.0, 0.6],
         [0.3, 0.4, 0.7, 0.4, 0.6, 0.8, 0.4],
         [0.5, 0.7, 0.9, 0.6, 0.8, 0.9, 0.7],
         [0.8, 0.9, 1.0, 0.9, 1.0, 0.7, 0.8],
         [0.7, 0.8, 0.9, 0.8, 0.9, 0.6, 0.7]
       ];
    }
`;

    // Inject before res.json
    controllerCode = controllerCode.replace(
      'res.json({',
      `${pieAndHeatmapLogic}\n    res.json({`
    );

    // Inject into res.json structure
    controllerCode = controllerCode.replace(
      'providers: providerList,',
      'providers: providerList,\n        servicePie: servicePieData,\n        heatmap: heatmapMatrix,'
    );

    fs.writeFileSync(controllerPath, controllerCode);
}

// Update Frontend ServicePieChart
const piePath = 'frontend/components/admin/dashboard/ServicePieChart.tsx';
let pieCode = fs.readFileSync(piePath, 'utf8');
if (!pieCode.includes('data?: any')) {
    pieCode = pieCode.replace('const ServicePieChart: React.FC = () => {', 'const ServicePieChart: React.FC<{data?: any}> = ({data}) => {');
    pieCode = pieCode.replace('const services = [', 'const services = data || [');
    fs.writeFileSync(piePath, pieCode);
}

// Update Frontend PeakTimeHeatmap
const heatmapPath = 'frontend/components/admin/dashboard/PeakTimeHeatmap.tsx';
let heatmapCode = fs.readFileSync(heatmapPath, 'utf8');
if (!heatmapCode.includes('data?: any')) {
    heatmapCode = heatmapCode.replace('const PeakTimeHeatmap: React.FC = () => {', 'const PeakTimeHeatmap: React.FC<{data?: any[][]}> = ({data}) => {');
    heatmapCode = heatmapCode.replace('const data = [', 'const matrix = data || [');
    // Change map refs
    heatmapCode = heatmapCode.replace(/data\[di\]\.map/g, 'matrix[di].map');
    fs.writeFileSync(heatmapPath, heatmapCode);
}

// Update DashboardOverview
const dashPath = 'frontend/components/admin/dashboard/DashboardOverview.tsx';
let dashCode = fs.readFileSync(dashPath, 'utf8');
dashCode = dashCode.replace('<PeakTimeHeatmap />', '<PeakTimeHeatmap data={chartData?.heatmap} />');
fs.writeFileSync(dashPath, dashCode);

console.log("Patched ServicePie and Heatmap");
