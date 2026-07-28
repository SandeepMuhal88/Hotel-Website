import React, { useState, useEffect } from 'react';
import { Shield, Calendar, Users, Building, MessageSquare, DollarSign, RefreshCw, Search, Edit3 } from 'lucide-react';
import { getAdminData, updateBookingStatus, updateRoom, replyInquiry } from '../services/localApi.js';

export default function AdminDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Editing Room state
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [newRoomPrice, setNewRoomPrice] = useState(0);
  const [newRoomAvailable, setNewRoomAvailable] = useState(0);

  // Inquiry Reply state
  const [replyInquiryId, setReplyInquiryId] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const data = await getAdminData();
      setStats(data.stats);
      setBookings(data.bookings || []);
      setRooms(data.rooms || []);
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      const data = await updateBookingStatus(id, status);
      if (data.success) fetchAdminData();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleSaveRoomUpdate = async (roomId) => {
    try {
      const data = await updateRoom(roomId, { price: newRoomPrice, availableUnits: newRoomAvailable });
      if (data.success) {
        setEditingRoomId(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Room update error:', err);
    }
  };

  const handleReplyInquiry = async (inqId) => {
    try {
      const data = await replyInquiry(inqId, replyText, 'Replied');
      if (data.success) {
        setReplyInquiryId(null);
        setReplyText('');
        fetchAdminData();
      }
    } catch (err) {
      console.error('Inquiry reply error:', err);
    }
  };

  const filteredBookings = bookings.filter(b =>
    b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.guestPhone.includes(searchQuery) ||
    b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex flex-col p-4 sm:p-6 overflow-hidden text-slate-900">
      
      {/* Top Bar */}
      <div className="bg-white border border-amber-300 rounded-2xl p-4 mb-4 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold shadow-sm">
            <Shield className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
              Las Cabanas Resort Management Console
            </h3>
            <p className="text-[11px] text-stone-600 font-medium">
              Live Real-Time Inventory, Guest Bookings & Pricing Engine
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAdminData}
            className="p-2 bg-stone-100 text-stone-800 rounded-xl hover:bg-amber-100/60 border border-stone-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-4 h-4 text-amber-800 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 px-4 bg-amber-700 hover:bg-amber-800 text-white font-extrabold rounded-xl text-xs shadow-md"
          >
            Exit Console
          </button>
        </div>
      </div>

      {/* Admin Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4 shrink-0 text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-stone-500 text-[10px] font-semibold">Total Revenue</p>
              <p className="font-serif text-base font-bold text-emerald-700">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-stone-500 text-[10px] font-semibold">Total Bookings</p>
              <p className="font-serif text-base font-bold text-amber-900">{stats.totalBookings}</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-stone-500 text-[10px] font-semibold">Occupancy Rate</p>
              <p className="font-serif text-base font-bold text-sky-900">{stats.occupancyRate}%</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-stone-500 text-[10px] font-semibold">Check-Ins Today</p>
              <p className="font-serif text-base font-bold text-purple-900">{stats.checkInsToday}</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm col-span-2 lg:col-span-1 flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-stone-500 text-[10px] font-semibold">Pending Inquiries</p>
              <p className="font-serif text-base font-bold text-rose-800">{stats.pendingInquiriesCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-amber-200 pb-2 mb-4 text-xs font-bold shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all shadow-sm ${
            activeTab === 'overview' ? 'bg-amber-700 text-white font-extrabold' : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'
          }`}
        >
          Bookings Manager ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2.5 rounded-xl transition-all shadow-sm ${
            activeTab === 'rooms' ? 'bg-amber-700 text-white font-extrabold' : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'
          }`}
        >
          Room Rates & Inventory ({rooms.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2.5 rounded-xl transition-all shadow-sm ${
            activeTab === 'inquiries' ? 'bg-amber-700 text-white font-extrabold' : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'
          }`}
        >
          Guest Inquiries ({inquiries.length})
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="bg-white border border-amber-300 rounded-3xl p-4 sm:p-6 flex-1 overflow-y-auto shadow-xl">
        
        {/* TAB 1: Bookings Manager */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-serif text-lg font-bold text-slate-900">Guest Bookings Directory</h4>
              
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search guest name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-amber-50/40 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700 font-medium">
                <thead className="bg-amber-50/80 text-amber-900 font-extrabold uppercase tracking-wider text-[10px] border-b border-amber-200">
                  <tr>
                    <th className="p-3">Booking #</th>
                    <th className="p-3">Guest Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Dates</th>
                    <th className="p-3">Cottage</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-3 font-extrabold text-amber-900">{b.bookingNumber}</td>
                      <td className="p-3 font-bold text-slate-900">{b.guestName}</td>
                      <td className="p-3">{b.guestPhone}</td>
                      <td className="p-3">{b.checkIn} → {b.checkOut} ({b.nights}n)</td>
                      <td className="p-3 text-stone-800">{b.roomTypeName}</td>
                      <td className="p-3 font-extrabold text-emerald-700">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm ${
                          b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          b.status === 'Checked-In' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                          b.status === 'Completed' ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'Checked-In')}
                            className="bg-sky-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold hover:bg-sky-800 shadow-sm"
                          >
                            Check-In
                          </button>
                        )}
                        {b.status === 'Checked-In' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'Completed')}
                            className="bg-blue-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold hover:bg-blue-800 shadow-sm"
                          >
                            Check-Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Room Rates & Inventory */}
        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-slate-900">Real-Time Inventory & Price Controls</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map(room => (
                <div key={room.id} className="bg-amber-50/40 p-4 rounded-2xl border border-stone-200 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-serif font-bold text-slate-900 text-sm">{room.name}</h5>
                      <p className="text-stone-600 text-[11px] font-medium">{room.category} • Total Units: {room.totalUnits}</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingRoomId(room.id);
                        setNewRoomPrice(room.price);
                        setNewRoomAvailable(room.availableUnits);
                      }}
                      className="p-1.5 bg-white text-amber-800 border border-stone-200 rounded-lg hover:bg-amber-100 shadow-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {editingRoomId === room.id ? (
                    <div className="p-3.5 bg-white border border-amber-300 rounded-xl space-y-3 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-amber-900 font-bold mb-1">Nightly Price (₹)</label>
                          <input
                            type="number"
                            value={newRoomPrice}
                            onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-xs text-slate-900 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-amber-900 font-bold mb-1">Available Units</label>
                          <input
                            type="number"
                            value={newRoomAvailable}
                            onChange={(e) => setNewRoomAvailable(Number(e.target.value))}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-xs text-slate-900 font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingRoomId(null)}
                          className="px-3 py-1 bg-stone-100 text-stone-700 rounded-lg text-[11px] font-bold border border-stone-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveRoomUpdate(room.id)}
                          className="px-3 py-1 bg-amber-700 text-white font-extrabold rounded-lg text-[11px] shadow-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-2 border-t border-amber-200/80">
                      <span className="font-extrabold text-amber-900 text-sm">₹{room.price} / night</span>
                      <span className="text-emerald-700 font-extrabold">{room.availableUnits} Available Now</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Guest Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-slate-900">Guest Messages & Wedding Enquiries</h4>

            <div className="space-y-3">
              {inquiries.map(inq => (
                <div key={inq.id} className="bg-amber-50/40 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900">{inq.name}</span>
                      <span className="text-stone-500 ml-2 font-medium">({inq.mobile})</span>
                      <span className="ml-2 text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                        {inq.type}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      inq.status === 'New' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {inq.status}
                    </span>
                  </div>

                  <p className="text-stone-800 bg-white p-3 rounded-xl border border-stone-200 font-medium italic">
                    "{inq.message}"
                  </p>

                  {inq.adminReply && (
                    <p className="text-emerald-900 text-[11px] bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">
                      <strong className="text-emerald-950 font-bold">Staff Reply:</strong> {inq.adminReply}
                    </p>
                  )}

                  {replyInquiryId === inq.id ? (
                    <div className="pt-2 space-y-2">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type response notes to guest..."
                        className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyInquiryId(null)}
                          className="px-3 py-1 bg-stone-100 text-stone-700 rounded-lg text-[11px] font-bold border border-stone-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReplyInquiry(inq.id)}
                          className="px-3 py-1 bg-amber-700 text-white font-extrabold rounded-lg text-[11px] shadow-sm"
                        >
                          Send Response
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setReplyInquiryId(inq.id);
                        setReplyText(inq.adminReply || '');
                      }}
                      className="text-amber-800 hover:underline font-extrabold text-[11px]"
                    >
                      Reply to Inquiry
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
