const fs = require('fs');
const path = require('path');

const dashPath = 'frontend/components/admin/dashboard/DashboardOverview.tsx';
let code = fs.readFileSync(dashPath, 'utf8');

// 1. Re-add data props to charts
code = code.replace('<RevenueChart />', '<RevenueChart data={chartData?.revenue} />');
code = code.replace('<OrderDonutChart />', '<OrderDonutChart data={chartData?.orderDonut} />');
code = code.replace('<BookingChart />', '<BookingChart data={chartData?.bookings} />');
code = code.replace('<ServicePieChart />', '<ServicePieChart data={chartData?.servicePie} />');
code = code.replace('<ProviderPerformanceChart />', '<ProviderPerformanceChart data={chartData?.providers} />');
code = code.replace('<PeakTimeHeatmap />', '<PeakTimeHeatmap data={chartData?.heatmap} />');
code = code.replace('<ReviewsSnapshot />', '<ReviewsSnapshot data={chartData?.reviews} />');

// 2. Fix apiBookings
code = code.replace(
`                     {[
                        { id: '#UC-1234', client: 'Aravind K', service: 'AC Installation', status: 'Completed', color: 'green', price: '₹1,499' },
                        { id: '#UC-1235', client: 'Sneha Rao', service: 'House Cleaning', status: 'Pending', color: 'blue', price: '₹899' },
                        { id: '#UC-1236', client: 'John Doe', service: 'Electrician', status: 'Cancelled', color: 'red', price: '₹499' },
                        { id: '#UC-1237', client: 'Manoj S', service: 'Plumbing', status: 'Completed', color: 'green', price: '₹599' },
                        { id: '#UC-1238', client: 'Priya K', service: 'Kitchen Deep Clean', status: 'Pending', color: 'blue', price: '₹2,499' },
                     ].map((booking) => (
                        <tr key={booking.id} className="hover:bg-white/30 transition-colors group">`,
`                     {apiBookings.map((booking: any, index: number) => (
                        <tr key={booking.id || index} className="hover:bg-white/30 transition-colors group">`
);

// 3. Update API to send params
code = code.replace(
`   const fetchDashboardData = async () => {
      try {
         setIsSyncing(true);
         const token = localStorage.getItem('token');
         const res = await axios.get(\`\${API_URL}/reports/dashboard\`, {
            headers: { Authorization: \`Bearer \${token}\` }
         });`,
`   const fetchDashboardData = async () => {
      try {
         setIsSyncing(true);
         const token = localStorage.getItem('token');
         const params = new URLSearchParams();
         if (startDate) params.append('startDate', startDate);
         if (endDate) params.append('endDate', endDate);
         if (selectedCategory && selectedCategory !== 'All Categories') params.append('category', selectedCategory);
         const res = await axios.get(\`\${API_URL}/reports/dashboard?\${params.toString()}\`, {
            headers: { Authorization: \`Bearer \${token}\` }
         });`
);

// 4. Update useEffect dependencies
code = code.replace(
`   React.useEffect(() => {
      fetchDashboardData();
   }, []);`,
`   React.useEffect(() => {
      fetchDashboardData();
   }, [startDate, endDate, selectedCategory]);`
);

// 5. REMOVE the location filter and sync button safely using regex
// Location is the third "relative" div inside filterRef
const locationRegex = /<div className="relative">[\s\S]*?<MapPin[\s\S]*?<\/AnimatePresence>\s*<\/div>/;
code = code.replace(locationRegex, "");

const syncRegex = /<div className="h-6 w-\[1px\] bg-gray-200 mx-1" \/>[\s\S]*?<button className="p-2\.5 bg-blue-600[\s\S]*?<\/button>/;
code = code.replace(syncRegex, "");

// 6. Fix Stats Array to use actual data
code = code.replace(
`   const stats = [
      { title: 'Total Users', value: '1,245', icon: Users, trend: 12.5, trendLabel: 'vs last month' },
      { title: 'Service Providers', value: '320', icon: Briefcase, trend: 4.2, trendLabel: 'vs last month' },
      { title: 'Total Bookings', value: '8,924', icon: CalendarCheck, trend: 18.2, trendLabel: 'vs last month' },
      { title: 'Revenue', value: '₹1.25L', icon: DollarSign, trend: 14.8, trendLabel: 'vs last month' },
      { title: 'Pending Approvals', value: '42', icon: ShieldCheck, trend: 8.4, trendLabel: 'waiting' },
      { title: 'Cancelled Orders', value: '18', icon: XCircle, trend: -12.5, trendLabel: 'this week' },
   ];`,
`   const defaultStats = [
      { title: 'Total Users', value: '0', icon: Users, trend: 0, trendLabel: 'vs last month' },
      { title: 'Service Providers', value: '0', icon: Briefcase, trend: 0, trendLabel: 'vs last month' },
      { title: 'Total Bookings', value: '0', icon: CalendarCheck, trend: 0, trendLabel: 'vs last month' },
      { title: 'Revenue', value: '₹0', icon: DollarSign, trend: 0, trendLabel: 'vs last month' },
      { title: 'Pending Approvals', value: '0', icon: ShieldCheck, trend: 0, trendLabel: 'waiting' },
      { title: 'Cancelled Orders', value: '0', icon: XCircle, trend: 0, trendLabel: 'this week' },
   ];
   const stats = apiStats.length > 0 ? apiStats : defaultStats;`
);

fs.writeFileSync(dashPath, code);
console.log("Rebuilt dashboard successfully");
