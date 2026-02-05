
import React, { useState } from 'react';
import { Globe, Plus, Trash2, Edit2, Check, X, Shield, Search, AlertCircle } from 'lucide-react';

interface DNSRecord {
  id: string;
  type: 'A' | 'CNAME' | 'MX';
  host: string;
  value: string;
  ttl: number;
  priority?: number;
}

const DNSManager: React.FC = () => {
  const [records, setRecords] = useState<DNSRecord[]>([
    { id: '1', type: 'A', host: '@', value: '192.168.10.10', ttl: 3600 },
    { id: '2', type: 'CNAME', host: 'vault', value: 'hosting.raidan.pro', ttl: 300 },
    { id: '3', type: 'MX', host: '@', value: 'mail.raidan.pro', ttl: 3600, priority: 10 },
    { id: '4', type: 'A', host: 'ollama', value: '192.168.10.12', ttl: 3600 },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newRecord, setNewRecord] = useState<Partial<DNSRecord>>({
    type: 'A',
    host: '',
    value: '',
    ttl: 3600,
  });

  const handleAdd = () => {
    if (newRecord.host && newRecord.value) {
      const record: DNSRecord = {
        id: Math.random().toString(36).substr(2, 9),
        type: newRecord.type as any,
        host: newRecord.host,
        value: newRecord.value,
        ttl: newRecord.ttl || 3600,
        priority: newRecord.type === 'MX' ? newRecord.priority || 10 : undefined,
      };
      setRecords([...records, record]);
      setNewRecord({ type: 'A', host: '', value: '', ttl: 3600 });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const filteredRecords = records.filter(r => 
    r.host.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-yemenBlue text-white p-3 rounded-lg shadow-md">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-yemenBlue">إدارة سجلات DNS (Technitium)</h2>
            <p className="text-gray-500 text-sm">إدارة النطاقات المحلية والتحكم في توجيه الشبكة السيادية.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-yemenGold hover:bg-yemenGold-dark text-yemenBlue-dark px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={18} />
          إضافة سجل جديد
        </button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="البحث عن سجل (المضيف أو القيمة)..."
            className="w-full bg-white border border-gray-200 rounded-lg pr-10 pl-4 py-2.5 outline-none focus:ring-2 ring-yemenBlue/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-yemenBlue-dark text-white p-3 rounded-lg flex items-center justify-between">
          <span className="text-xs opacity-70">إجمالي السجلات</span>
          <span className="text-xl font-bold">{records.length}</span>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">النوع</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">المضيف (Host)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">القيمة / الهدف</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">TTL</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">الأولوية</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isAdding && (
                <tr className="bg-blue-50/50">
                  <td className="px-6 py-4">
                    <select 
                      className="bg-white border border-gray-200 rounded p-1 text-sm outline-none"
                      value={newRecord.type}
                      onChange={(e) => setNewRecord({...newRecord, type: e.target.value as any})}
                    >
                      <option value="A">A</option>
                      <option value="CNAME">CNAME</option>
                      <option value="MX">MX</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder="e.g. vault"
                      className="bg-white border border-gray-200 rounded p-1 text-sm w-full outline-none"
                      value={newRecord.host}
                      onChange={(e) => setNewRecord({...newRecord, host: e.target.value})}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder="e.g. 192.168.1.10"
                      className="bg-white border border-gray-200 rounded p-1 text-sm w-full outline-none"
                      value={newRecord.value}
                      onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      className="bg-white border border-gray-200 rounded p-1 text-sm w-20 outline-none"
                      value={newRecord.ttl}
                      onChange={(e) => setNewRecord({...newRecord, ttl: parseInt(e.target.value)})}
                    />
                  </td>
                  <td className="px-6 py-4">
                    {newRecord.type === 'MX' ? (
                      <input 
                        type="number" 
                        className="bg-white border border-gray-200 rounded p-1 text-sm w-20 outline-none"
                        value={newRecord.priority}
                        onChange={(e) => setNewRecord({...newRecord, priority: parseInt(e.target.value)})}
                      />
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={handleAdd} className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setIsAdding(false)} className="p-1.5 bg-gray-400 text-white rounded hover:bg-gray-500">
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      record.type === 'A' ? 'bg-blue-100 text-blue-700' :
                      record.type === 'CNAME' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{record.host}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">{record.value}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.ttl}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.priority || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-yemenBlue hover:bg-blue-50 rounded transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-yemenBlue-dark p-4 rounded-xl text-white flex items-start gap-4 border-l-4 border-yemenGold">
        <Shield size={20} className="text-yemenGold mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-sm mb-1">الخصوصية السيادية (DNS Over HTTPS)</h4>
          <p className="text-xs text-blue-100 leading-relaxed">
            يتم تشفير جميع استعلامات DNS عبر بروتوكول DoH لمنع التجسس أو الحجب من قبل مزودي الخدمة المحليين. سجلات Technitium DNS تعمل في بيئة معزولة تماماً داخل شبكة YemenJPT.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3">
        <AlertCircle className="text-amber-600" size={20} />
        <p className="text-xs text-amber-800">
          تنبيه: التغييرات في سجلات DNS قد تستغرق ما يصل إلى دقيقة واحدة لتظهر عبر الشبكة المحلية بسبب ذاكرة التخزين المؤقت (TTL).
        </p>
      </div>
    </div>
  );
};

export default DNSManager;
