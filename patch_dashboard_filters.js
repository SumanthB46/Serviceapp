const fs = require('fs');
const path = require('path');

const dashPath = 'frontend/components/admin/dashboard/DashboardOverview.tsx';
let dashCode = fs.readFileSync(dashPath, 'utf8');

// 1. Remove Location state and options
dashCode = dashCode.replace("const [selectedLocation, setSelectedLocation] = useState('All Locations');\n", "");
dashCode = dashCode.replace("const locationOptions = ['All Locations', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];\n", "");

// 2. Update fetchDashboardData to accept params
dashCode = dashCode.replace(
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

// 3. Update useEffect dependencies
dashCode = dashCode.replace(
`   React.useEffect(() => {
      fetchDashboardData();
   }, []);`,
`   React.useEffect(() => {
      fetchDashboardData();
   }, [startDate, endDate, selectedCategory]);`
);

// 4. Remove Location dropdown JSX
const locationDropdownRegex = /<div className="relative">[\s\S]*?<MapPin[\s\S]*?<\/div>[\s\S]*?<\/AnimatePresence>\s*<\/div>/;
dashCode = dashCode.replace(locationDropdownRegex, "");

// 5. Remove Sync button JSX
const syncButtonRegex = /<button[\s\S]*?onClick=\{fetchDashboardData\}[\s\S]*?<\/button>/;
dashCode = dashCode.replace(syncButtonRegex, "");

// 6. Remove the divider
dashCode = dashCode.replace('<div className="h-6 w-[1px] bg-gray-200 mx-1" />', "");

fs.writeFileSync(dashPath, dashCode);
console.log("Patched DashboardOverview.tsx");
