const fs = require('fs');
const path = require('path');

const dashPath = 'frontend/components/admin/dashboard/DashboardOverview.tsx';
let code = fs.readFileSync(dashPath, 'utf8');

// 1. Update API call to use query params
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

// 2. Update useEffect to watch filters
code = code.replace(
`   React.useEffect(() => {
      fetchDashboardData();
   }, []);`,
`   React.useEffect(() => {
      fetchDashboardData();
   }, [startDate, endDate, selectedCategory]);`
);

// 3. Remove Location State Variables
code = code.replace("const [selectedLocation, setSelectedLocation] = useState('All Locations');\n", "");
code = code.replace("const locationOptions = ['All Locations', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];\n", "");

// 4. Safely remove ONLY the Location Filter JSX block by matching its exact content
const locationBlock = `                <div className="relative">
                   <div 
                      onClick={() => toggleDropdown('location')}
                      className={\`flex items-center gap-2 px-3 py-1.5 backdrop-blur-md border rounded-xl shadow-sm cursor-pointer transition-all \${activeDropdown === 'location' ? 'bg-white/80 border-blue-200' : 'bg-white/40 border-white/60 hover:bg-white/60'}\`}
                   >
                      <MapPin size={12} className="text-blue-600" />
                      <span className="text-[10px] font-bold text-gray-600">{selectedLocation}</span>
                      <ChevronDown size={12} className={\`text-gray-400 transition-transform duration-200 \${activeDropdown === 'location' ? 'rotate-180' : ''}\`} />
                   </div>

                   <AnimatePresence>
                      {activeDropdown === 'location' && (
                         <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 5, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-0 lg:left-0 mt-1 w-40 bg-white/80 backdrop-blur-xl border border-white/60 rounded-xl shadow-xl z-50 overflow-hidden"
                         >
                            {locationOptions.map((option) => (
                               <div 
                                  key={option}
                                  onClick={() => handleSelect(setSelectedLocation, option)}
                                  className="px-4 py-2 text-[10px] font-bold text-gray-600 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors"
                               >
                                  {option}
                               </div>
                            ))}
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>`;
code = code.replace(locationBlock, "");

// 5. Remove Sync Button JSX
const syncButtonBlock = `                <div className="h-6 w-[1px] bg-gray-200 mx-1" />

                <button 
                   onClick={fetchDashboardData}
                   disabled={isSyncing}
                   className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 group"
                >
                   <RefreshCw size={12} className={\`\${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}\`} />
                   <span className="text-[10px] font-bold uppercase tracking-wider">{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
                </button>`;
code = code.replace(syncButtonBlock, "");

fs.writeFileSync(dashPath, code);
console.log("Safely applied filters updates.");
