export function ProviderEarnings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Earnings</h1>
        <p className="text-slate-400 mt-1">Track your service income and payouts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-sm text-slate-400">Total Earnings</p>
          <p className="text-3xl font-bold text-slate-100">₹45,200</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-sm text-slate-400">This Month</p>
          <p className="text-3xl font-bold text-slate-100">₹8,450</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-sm text-slate-400">Pending Payout</p>
          <p className="text-3xl font-bold text-slate-100">₹1,200</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
        <h3 className="font-bold text-slate-100 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-slate-800">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Job</th>
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-900/50 transition-colors">
                <td className="py-4 text-sm text-slate-300">Oct 14, 2026</td>
                <td className="py-4 text-sm font-mono text-slate-100">CA-1234</td>
                <td className="py-4 text-sm text-slate-400">Battery Jump Start</td>
                <td className="py-4 text-sm font-medium text-slate-100">₹499</td>
                <td className="py-4"><span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30">Captured</span></td>
              </tr>
              <tr className="hover:bg-slate-900/50 transition-colors">
                <td className="py-4 text-sm text-slate-300">Oct 13, 2026</td>
                <td className="py-4 text-sm font-mono text-slate-100">CA-1233</td>
                <td className="py-4 text-sm text-slate-400">Flat Tire Change</td>
                <td className="py-4 text-sm font-medium text-slate-100">₹799</td>
                <td className="py-4"><span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30">Captured</span></td>
              </tr>
              <tr className="hover:bg-slate-900/50 transition-colors">
                <td className="py-4 text-sm text-slate-300">Oct 12, 2026</td>
                <td className="py-4 text-sm font-mono text-slate-100">CA-1232</td>
                <td className="py-4 text-sm text-slate-400">Fuel Assistance</td>
                <td className="py-4 text-sm font-medium text-slate-100">₹299</td>
                <td className="py-4"><span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30">Captured</span></td>
              </tr>
              <tr className="hover:bg-slate-900/50 transition-colors">
                <td className="py-4 text-sm text-slate-300">Oct 11, 2026</td>
                <td className="py-4 text-sm font-mono text-slate-100">CA-1231</td>
                <td className="py-4 text-sm text-slate-400">Towing Service</td>
                <td className="py-4 text-sm font-medium text-slate-100">₹1,299</td>
                <td className="py-4"><span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/30">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}