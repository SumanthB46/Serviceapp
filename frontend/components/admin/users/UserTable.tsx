"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCcw, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import Table from '../common/Table';
import UserRow from './UserRow';
import { User } from '../types';
import UserDetailsModal from './UserDetailsModal';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_USERS: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', status: 'Active', joinedDate: '12 Jan 2025' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', status: 'Active', joinedDate: '18 Feb 2025' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '+91 9876543212', status: 'Blocked', joinedDate: '05 Mar 2025' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+91 9876543213', status: 'Active', joinedDate: '22 Mar 2025' },
  { id: 5, name: 'Michael Brown', email: 'michael@example.com', phone: '+91 9876543214', status: 'Blocked', joinedDate: '01 Apr 2025' },
  { id: 6, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543215', status: 'Active', joinedDate: '10 Apr 2025' },
  { id: 7, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+91 9876543216', status: 'Pending', joinedDate: '12 Apr 2025' },
  { id: 8, name: 'David Miller', email: 'david@example.com', phone: '+91 9876543217', status: 'Active', joinedDate: '15 Apr 2025' },
  { id: 9, name: 'Laura Chen', email: 'laura@example.com', phone: '+91 9876543218', status: 'Active', joinedDate: '18 Apr 2025' },
  { id: 10, name: 'Kevin Park', email: 'kevin@example.com', phone: '+91 9876543219', status: 'Blocked', joinedDate: '20 Apr 2025' },
  { id: 11, name: 'Anna Scott', email: 'anna@example.com', phone: '+91 9876543220', status: 'Active', joinedDate: '22 Apr 2025' },
  { id: 12, name: 'Chris Evans', email: 'chris@example.com', phone: '+91 9876543221', status: 'Active', joinedDate: '25 Apr 2025' },
  { id: 13, name: 'Jessica Alba', email: 'jessica@example.com', phone: '+91 9876543222', status: 'Pending', joinedDate: '28 Apr 2025' },
  { id: 14, name: 'Tony Stark', email: 'tony@example.com', phone: '+91 9876543223', status: 'Active', joinedDate: '01 May 2025' },
  { id: 15, name: 'Bruce Wayne', email: 'bruce@example.com', phone: '+91 9876543224', status: 'Blocked', joinedDate: '05 May 2025' },
];

const UserTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const filtered = DUMMY_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Calculate slices
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentUsers = filtered.slice(indexOfFirstRow, indexOfLastRow);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Registered <span className="text-blue-600">Users</span></h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={Download} className="shadow-sm border-gray-100 bg-white text-[11px]">Export Users</Button>
          <Button variant="primary" size="sm" icon={UserPlus} className="shadow-lg shadow-blue-600/30 text-[11px]">Add New Member</Button>
        </div>
      </div>

      {/* Control Bar - Compact Version */}
      <div className="bg-white/40 backdrop-blur-xl p-3 px-5 rounded-2xl border border-white/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-gray-100 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100/50 rounded-xl text-[11px] font-bold text-gray-800 transition-all duration-300 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-xl border border-gray-100 hover:border-blue-100 transition-all cursor-pointer">
            <Filter size={14} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-600 focus:outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="All">All Roles</option>
              <option value="Active">Operational</option>
              <option value="Blocked">Suspended</option>
              <option value="Pending">Onboarding</option>
            </select>
          </div>

          <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Table Layer - High Density */}
      <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden relative group min-h-[460px] flex flex-col">
        <div className="flex-1">
          <Table
            headers={['Name', 'Email', 'Phone', 'Joined', 'Status', 'Actions']}
            className="relative z-10"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onView={u => setSelectedUser(u)}
                  />
                ))
              ) : (
                <tr key="none">
                  <td colSpan={6} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search size={48} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900 tracking-tight">No match found</p>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Adjust your search parameters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </Table>
        </div>

        {/* Professional Pagination Footer */}
        <div className="p-5 border-t border-white/20 flex flex-col items-center gap-6 bg-white/10">
          <div className="flex flex-col items-center gap-4 w-full">

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm border ${currentPage === page
                      ? "bg-blue-600 text-white border-blue-600 shadow-blue-600/20"
                      : "bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:bg-blue-50"
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </div>

      <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
};

export default UserTable;
