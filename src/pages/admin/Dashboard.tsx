import { useStore } from '../../store';
import { Package, ShoppingCart, Users, DollarSign, Eye, Radio, Tv, Sparkles, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  const { products, orders, users, messages, liveSettings, updateLiveSettings, liveStreams, appViews, setAppViews, offersTitle, setOffersTitle } = useStore();
  const [customViews, setCustomViews] = useState(appViews.toString());
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);
  
  const activeStreamsCount = liveStreams.filter(s => s.isActive).length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'App Views', value: appViews.toLocaleString(), icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const handleViewsChange = (newVal: number) => {
    setAppViews(newVal);
    setCustomViews(newVal.toString());
  };

  // Generate Daily Revenue Data for Chart
  const dailySalesData = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = timeRange - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Match orders on this date
      const matchingOrders = orders.filter(o => {
        const orderDateStr = new Date(o.date).toISOString().split('T')[0];
        return orderDateStr === dateStr;
      });

      const revenue = matchingOrders.reduce((sum, o) => sum + o.total, 0);
      const orderCount = matchingOrders.length;

      days.push({
        date: dateStr,
        label,
        revenue: parseFloat(revenue.toFixed(2)),
        ordersCount: orderCount
      });
    }

    return days;
  }, [orders, timeRange]);

  // Performance calculations
  const periodTotalRevenue = useMemo(() => {
    return dailySalesData.reduce((sum, d) => sum + d.revenue, 0);
  }, [dailySalesData]);

  const periodTotalOrders = useMemo(() => {
    return dailySalesData.reduce((sum, d) => sum + d.ordersCount, 0);
  }, [dailySalesData]);

  const avgOrderValue = periodTotalOrders > 0 ? periodTotalRevenue / periodTotalOrders : 0;
  const peakRevenueDay = useMemo(() => {
    return [...dailySalesData].sort((a, b) => b.revenue - a.revenue)[0];
  }, [dailySalesData]);

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <h1 className="text-3xl font-serif font-bold text-amber-950">Dashboard Overview</h1>
      
      {/* Auto-detected Live Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
        activeStreamsCount > 0 
          ? 'bg-red-500/10 border-red-500/30 text-red-950' 
          : 'bg-amber-500/10 border-amber-500/20 text-amber-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${activeStreamsCount > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-900/10 text-amber-900'}`}>
            <Radio size={20} />
          </div>
          <div>
            <div className="font-bold text-sm flex items-center gap-2">
              Auto-Detected Live Streams
              {activeStreamsCount > 0 ? (
                <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                  {activeStreamsCount} Stream{activeStreamsCount > 1 ? 's' : ''} Active
                </span>
              ) : (
                <span className="bg-amber-900/20 text-amber-900 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                  Offline / Idle
                </span>
              )}
            </div>
            <p className="text-xs text-amber-900/70 mt-0.5">
              {activeStreamsCount > 0 
                ? 'Streams are currently being detected and displayed live across the user site.' 
                : 'No active streams detected right now. Streams will automatically display when someone broadcasts.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900/60 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-amber-950">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Revenue Bar Chart Visualization */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-amber-900/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <TrendingUp size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-950">Daily Revenue & Business Performance</h2>
              <p className="text-xs text-amber-900/60">Track daily sales volume and revenue trends over time.</p>
            </div>
          </div>

          {/* Time range toggle tabs */}
          <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-900/10 self-start sm:self-auto">
            {([7, 14, 30] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === range
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-amber-900/70 hover:text-amber-950 hover:bg-amber-100'
                }`}
              >
                Last {range} Days
              </button>
            ))}
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-900/10">
            <div className="text-xs font-bold text-amber-900/60 mb-1">Period Revenue</div>
            <div className="text-xl font-extrabold text-amber-950">${periodTotalRevenue.toFixed(2)}</div>
            <div className="text-[10px] text-green-600 font-semibold mt-1 flex items-center gap-0.5">
              <ArrowUpRight size={12} /> Last {timeRange} days
            </div>
          </div>

          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-900/10">
            <div className="text-xs font-bold text-amber-900/60 mb-1">Orders Count</div>
            <div className="text-xl font-extrabold text-amber-950">{periodTotalOrders} orders</div>
            <div className="text-[10px] text-amber-900/60 font-semibold mt-1">In selected range</div>
          </div>

          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-900/10">
            <div className="text-xs font-bold text-amber-900/60 mb-1">Avg Order Value (AOV)</div>
            <div className="text-xl font-extrabold text-amber-950">${avgOrderValue.toFixed(2)}</div>
            <div className="text-[10px] text-orange-600 font-semibold mt-1">Per transaction</div>
          </div>

          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-900/10">
            <div className="text-xs font-bold text-amber-900/60 mb-1">Daily Peak Revenue</div>
            <div className="text-xl font-extrabold text-amber-950">
              ${peakRevenueDay ? peakRevenueDay.revenue.toFixed(2) : '0.00'}
            </div>
            <div className="text-[10px] text-amber-900/60 font-semibold mt-1">
              {peakRevenueDay ? peakRevenueDay.label : 'N/A'}
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e6da" vertical={false} />
              <XAxis 
                dataKey="label" 
                tick={{ fill: '#78350f', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#e5d5c5' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#78350f', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(234, 88, 12, 0.06)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-amber-950 text-white p-3 rounded-xl shadow-xl text-xs border border-amber-800 space-y-1">
                        <div className="font-bold text-amber-200 border-b border-amber-800/80 pb-1">{data.label}</div>
                        <div className="flex justify-between gap-4">
                          <span className="text-amber-100/70">Daily Revenue:</span>
                          <span className="font-extrabold text-orange-400">${data.revenue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-amber-100/70">Orders:</span>
                          <span className="font-bold text-white">{data.ordersCount} order{data.ordersCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                {dailySalesData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.revenue > 0 ? '#ea580c' : '#fde68a'} 
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* App Views & Display Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
              <Eye size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-950">App Views & Banner Messages</h2>
              <p className="text-xs text-amber-900/60">Set custom total app view count and store offers title.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-amber-950 mb-1 flex justify-between">
                <span>Set App Views Counter</span>
                <span className="text-purple-700 font-extrabold">{appViews.toLocaleString()} views</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="number"
                  min={0}
                  max={5000000}
                  value={customViews}
                  onChange={(e) => {
                    setCustomViews(e.target.value);
                    const val = parseInt(e.target.value) || 0;
                    setAppViews(val);
                  }}
                  className="flex-1 p-2.5 rounded-xl border border-amber-900/20 bg-amber-50/30 text-amber-950 font-bold outline-none focus:border-purple-500"
                  placeholder="e.g. 6000 or 300000"
                />
              </div>

              {/* View Count Presets (from 6,000 to 300,000) */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs font-bold text-amber-900/50 self-center mr-1">Presets:</span>
                {[6000, 25000, 50000, 100000, 300000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleViewsChange(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      appViews === preset 
                        ? 'bg-purple-600 text-white shadow-sm' 
                        : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-amber-900/10">
              <label className="block text-sm font-bold text-amber-950 mb-1">Offers Banner Title</label>
              <input 
                type="text" 
                value={offersTitle}
                onChange={(e) => setOffersTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-amber-900/20 bg-amber-50/30 text-amber-950 font-medium outline-none focus:border-purple-500"
                placeholder="e.g. Special Offers / Deal of the Day"
              />
            </div>
          </div>
        </div>

        {/* Live Stream Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 text-orange-700 rounded-xl">
              <Tv size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-950">Live Stream Controls</h2>
              <p className="text-xs text-amber-900/60">Enable/disable live stream system & set schedule.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-xl border border-amber-900/10">
              <div>
                <h3 className="font-bold text-amber-950 text-sm">Enable Live Streaming</h3>
                <p className="text-xs text-amber-900/60">Allow broadcasting and viewing live streams globally.</p>
              </div>
              <button 
                onClick={() => updateLiveSettings({...liveSettings, isEnabled: !liveSettings.isEnabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${liveSettings.isEnabled ? 'bg-orange-600' : 'bg-amber-900/20'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${liveSettings.isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-xl border border-amber-900/10">
              <div>
                <h3 className="font-bold text-amber-950 text-sm">Schedule Streams</h3>
                <p className="text-xs text-amber-900/60">Restrict live streaming to specific hours and days.</p>
              </div>
              <button 
                onClick={() => updateLiveSettings({...liveSettings, scheduleEnabled: !liveSettings.scheduleEnabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${liveSettings.scheduleEnabled ? 'bg-orange-600' : 'bg-amber-900/20'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${liveSettings.scheduleEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {liveSettings.scheduleEnabled && (
              <div className="p-4 border border-amber-900/20 rounded-xl space-y-4">
                <div>
                  <label className="block text-sm font-bold text-amber-950 mb-2">Allowed Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                      <button
                        key={day}
                        onClick={() => {
                          const days = liveSettings.scheduleDays.includes(idx) 
                            ? liveSettings.scheduleDays.filter(d => d !== idx)
                            : [...liveSettings.scheduleDays, idx];
                          updateLiveSettings({...liveSettings, scheduleDays: days});
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          liveSettings.scheduleDays.includes(idx) 
                            ? 'bg-orange-100 text-orange-700 border-2 border-orange-500' 
                            : 'bg-amber-50 text-amber-900/50 border-2 border-transparent hover:bg-amber-100'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-amber-950 mb-1">Start Time</label>
                    <input 
                      type="time" 
                      value={liveSettings.startTime}
                      onChange={(e) => updateLiveSettings({...liveSettings, startTime: e.target.value})}
                      className="w-full p-2 rounded-lg border border-amber-900/20 bg-white outline-none focus:border-orange-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-amber-950 mb-1">End Time</label>
                    <input 
                      type="time" 
                      value={liveSettings.endTime}
                      onChange={(e) => updateLiveSettings({...liveSettings, endTime: e.target.value})}
                      className="w-full p-2 rounded-lg border border-amber-900/20 bg-white outline-none focus:border-orange-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 p-6">
          <h2 className="text-xl font-bold text-amber-950 mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-900/10 text-amber-900/60 text-sm">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-amber-900/5 last:border-0">
                    <td className="py-4 font-medium text-amber-950">{order.id}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-amber-950 text-right">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-amber-900/50">No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 p-6">
          <h2 className="text-xl font-bold text-amber-950 mb-6">Unread Messages</h2>
          <div className="space-y-4">
            {messages.filter(m => !m.read).slice(0, 5).map(msg => (
              <div key={msg.id} className="p-4 rounded-xl border border-amber-900/10 bg-amber-50/50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-amber-950">{msg.subject}</h3>
                  <span className="text-xs text-amber-900/50">{new Date(msg.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-amber-900/80 mb-2 truncate">{msg.message}</p>
                <div className="text-xs font-medium text-orange-600">From: {msg.name}</div>
              </div>
            ))}
            {messages.filter(m => !m.read).length === 0 && (
              <p className="text-center text-amber-900/50 py-4">No unread messages.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
