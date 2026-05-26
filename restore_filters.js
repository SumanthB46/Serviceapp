const fs = require('fs');
const path = require('path');

const dashPath = 'frontend/components/admin/dashboard/DashboardOverview.tsx';
let dashCode = fs.readFileSync(dashPath, 'utf8');

const missingJsx = `
                <div className="relative">
                   <div 
                      onClick={() => toggleDropdown('calendar')}
                      className={\`flex items-center gap-2 px-3 py-1.5 backdrop-blur-md border rounded-xl shadow-sm cursor-pointer transition-all \${activeDropdown === 'calendar' ? 'bg-white/80 border-blue-200' : 'bg-white/40 border-white/60 hover:bg-white/60'}\`}
                   >
                      <Calendar size={12} className="text-blue-600" />
                      <span className="text-[10px] font-bold text-gray-600">{selectedDate}</span>
                      <ChevronDown size={12} className={\`text-gray-400 transition-transform duration-200 \${activeDropdown === 'calendar' ? 'rotate-180' : ''}\`} />
                   </div>
                   
                   <AnimatePresence>
                      {activeDropdown === 'calendar' && (
                         <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 5, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-0 lg:left-0 mt-1 w-64 bg-white/80 backdrop-blur-xl border border-white/60 rounded-xl shadow-xl z-50 overflow-hidden"
                         >
                            <div className="p-4 space-y-4">
                               <div className="flex items-center justify-between mb-2">
                                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Period</span>
                               </div>

                               <div className="flex flex-wrap gap-2">
                                  {[
                                     { label: 'Today', days: 0 },
                                     { label: '7 Days', days: 7 },
                                     { label: '30 Days', days: 30 }
                                  ].map(p => (
                                     <button 
                                        key={p.label}
                                        onClick={() => handleQuickSelect(p.days, p.label)}
                                        className="px-2 py-1 bg-blue-50 text-blue-600 text-[8px] font-bold rounded-md hover:bg-blue-600 hover:text-white transition-colors"
                                     >
                                        {p.label}
                                     </button>
                                  ))}
                               </div>
                               
                               <div className="space-y-3 pt-2">
                                  <div className="space-y-1">
                                     <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">From Date</label>
                                     <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">To Date</label>
                                     <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                     />
                                  </div>
                               </div>

                               <button 
                                  onClick={handleApplyCustomDate}
                                  disabled={!startDate || !endDate}
                                  className="w-full py-2 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
                               >
                                  Apply Range
                               </button>
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>

                <div className="relative">
                   <div 
                      onClick={() => toggleDropdown('category')}
                      className={\`flex items-center gap-2 px-3 py-1.5 backdrop-blur-md border rounded-xl shadow-sm cursor-pointer transition-all \${activeDropdown === 'category' ? 'bg-white/80 border-blue-200' : 'bg-white/40 border-white/60 hover:bg-white/60'}\`}
                   >
                      <LayoutGrid size={12} className="text-blue-600" />
                      <span className="text-[10px] font-bold text-gray-600">{selectedCategory}</span>
                      <ChevronDown size={12} className={\`text-gray-400 transition-transform duration-200 \${activeDropdown === 'category' ? 'rotate-180' : ''}\`} />
                   </div>

                   <AnimatePresence>
                      {activeDropdown === 'category' && (
                         <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 5, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-0 lg:left-0 mt-1 w-40 bg-white/80 backdrop-blur-xl border border-white/60 rounded-xl shadow-xl z-50 overflow-hidden"
                         >
                            {categoryOptions.map((option) => (
                               <div 
                                  key={option}
                                  onClick={() => handleSelect(setSelectedCategory, option)}
                                  className="px-4 py-2 text-[10px] font-bold text-gray-600 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors"
                               >
                                  {option}
                               </div>
                            ))}
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>
`;

dashCode = dashCode.replace(
    '<div ref={filterRef} className="flex flex-wrap items-center gap-3">\n                {/* Filters */}\n                \n\n               \n\n               \n            </div>',
    '<div ref={filterRef} className="flex flex-wrap items-center gap-3">\n                {/* Filters */}\n' + missingJsx + '\n            </div>'
);

fs.writeFileSync(dashPath, dashCode);
console.log("Restored filters");
