
import React, { useState } from 'react';
import { Globe, Plus, Trash2, Edit2, Check, X, Shield, Search, AlertCircle, Save } from 'lucide-react';

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
  
  // State for new/editing records
  const [tempRecord, setTempRecord] = useState<Partial<DNSRecord>>({
    type: 'A',
    host: '',
    value: '',
    ttl: 3600,
  });

  const handleAdd = () => {
    if (tempRecord.host && tempRecord.value) {
      const record: DNSRecord = {
        id: Math.random().toString(36).substr(2, 9),
        type: tempRecord.type as any,
        host: tempRecord.host,
        value: tempRecord.value,
        ttl: tempRecord.ttl || 3600,
        priority: tempRecord.type === 'MX' ? tempRecord.priority || 10 : undefined,
      };
      setRecords([...records, record]);
      setIsAdding(false);
      resetTemp();
    }
  };

  const startEdit = (record: DNSRecord) => {
    setEditingId(record.id);
    setTempRecord(record);
  };

  const handleUpdate = () => {
    if (editingId) {
      setRecords(records.map(r => r.id === editingId ? { ...r, ...tempRecord } as DNSRecord : r));
      setEditingId(null);
      resetTemp();
    }
  };

  const resetTemp = () => {
    setTempRecord({ type: 'A', host: '', value: '', ttl: 3600 });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟ قد يؤثر ذلك على الوصول للخدمات.')) {
      setRecords(records.filter(r => r.id !== id));
    }
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
            <h2 className="text-xl font-bold text-yemenBlue">إدارة سجلات DNS (Technitium/SaaS)</h2>
            <p className="text-gray-500 text-sm">إدارة النطاقات المحلية والتحكم في توجيه الشبكة السيادية للعملاء.</p>
          </div>
        </div>
        <button 
          onClick={() => { setIsAdding(true); resetTemp(); }}
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
          <span className="text-xs opacity-70 font-bold uppercase tracking-wider">السجلات</span>
          <span className="text-xl font-black">{records.length}</span>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">النوع</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">المضيف (Host)</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">القيمة / الهدف</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">TTL</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">الأولوية</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Add New Row */}
              {isAdding && (
                <tr className="bg-yemenGold/5 animate-in slide-in-from-top-2">
                  <td className="px-6 py-4">
                    <select 
                      className="bg-white border border-gray-200 rounded p-1.5 text-xs outline-none focus:border-yemenGold"
                      value={tempRecord.type}
                      onChange={(e) => setTempRecord({...tempRecord, type: e.target.value as any})}
                    >
                      <option value="A">A</option>
                      <option value="CNAME">CNAME</option>
                      <option value="MX">MX</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder="e.g. news"
                      className="bg-white border border-gray-200 rounded p-1.5 text-xs w-full outline-none focus:border-yemenGold"
                      value={tempRecord.host}
                      onChange={(e) => setTempRecord({...tempRecord, host: e.target.value})}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder="e.g. 1.2.3.4"
                      className="bg-white border border-gray-200 rounded p-1.5 text-xs w-full outline-none focus:border-yemenGold"
                      value={tempRecord.value}
                      onChange={(e) => setTempRecord({...tempRecord, value: e.target.value})}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      className="bg-white border border-gray-200 rounded p-1.5 text-xs w-20 outline-none"
                      value={tempRecord.ttl}
                      onChange={(e) => setTempRecord({...tempRecord, ttl: parseInt(e.target.value)})}
                    />
                  </td>
                  <td className="px-6 py-4">
                    {tempRecord.type === 'MX' ? (
                      <input 
                        type="number" 
                        placeholder="10"
                        className="bg-white border border-gray-200 rounded p-1.5 text-xs w-20 outline-none border-yemenGold"
                        value={tempRecord.priority}
                        onChange={(e) => setTempRecord({...tempRecord, priority: parseInt(e.target.value)})}
                      />
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={handleAdd} className="p-2 bg-yemenBlue text-white rounded-lg hover:bg-yemenBlue-dark transition-all">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {filteredRecords.map(record => (
                <tr key={record.id} className={`hover:bg-gray-50 transition-colors ${editingId === record.id ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4">
                    {editingId === record.id ? (
                       <select 
                        className="bg-white border border-gray-200 rounded p-1.5 text-xs outline-none"
                        value={tempRecord.type}
                        onChange={(e) => setTempRecord({...tempRecord, type: e.target.value as any})}
                      >
                        <option value="A">A</option>
                        <option value="CNAME">CNAME</option>
                        <option value="MX">MX</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        record.type === 'A' ? 'bg-blue-100 text-blue-700' :
                        record.type === 'CNAME' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {record.type}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-bold text-yemenBlue">
                    {editingId === record.id ? (
                      <input 
                        type="text" 
                        className="bg-white border border-gray-200 rounded p-1.5 text-xs w-full outline-none"
                        value={tempRecord.host}
                        onChange={(e) => setTempRecord({...tempRecord, host: e.target.value})}
                      />
                    ) : record.host}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">
                    {editingId === record.id ? (
                      <input 
                        type="text" 
                        className="bg-white border border-gray-200 rounded p-1.5 text-xs w-full outline-none"
                        value={tempRecord.value}
                        onChange={(e) => setTempRecord({...tempRecord, value: e.target.value})}
                      />
                    ) : record.value}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">
                    {editingId === record.id ? (
                      <input 
                        type="number" 
                        className="bg-white border border-gray-200 rounded p-1.5 text-xs w-20 outline-none"
                        value={tempRecord.ttl}
                        onChange={(e) => setTempRecord({...tempRecord, ttl: parseInt(e.target.value)})}
                      />
                    ) : record.ttl}
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-yemenGold">
                    {editingId === record.id && tempRecord.type === 'MX' ? (
                      <input 
                        type="number" 
                        className="bg-white border border-gray-200 rounded p-1.5 text-xs w-20 outline-none"
                        value={tempRecord.priority}
                        onChange={(e) => setTempRecord({...tempRecord, priority: parseInt(e.target.value)})}
                      />
                    ) : (record.priority || '-')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === record.id ? (
                        <>
                          <button onClick={handleUpdate} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(record)}
                            className="p-2 text-gray-400 hover:text-yemenBlue hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-yemenBlue-dark p-5 rounded-xl text-white flex items-start gap-4 border-l-4 border-yemenGold shadow-lg">
          <Shield size={24} className="text-yemenGold mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-black text-sm mb-1 uppercase tracking-tight">الخصوصية السيادية (DoH/DoT)</h4>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              جميع استعلامات DNS للعملاء مشفرة. سجلات Technitium DNS تعمل في بيئة معزولة تماماً داخل شبكة YemenJPT السيادية لمنع أي تسريب للبيانات الجغرافية للمحققين.
            </p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl flex items-start gap-4 shadow-sm">
          <AlertCircle className="text-amber-600 mt-1 flex-shrink-0" size={24} />
          <div>
             <h4 className="font-black text-sm mb-1 text-amber-900 uppercase tracking-tight">تحذير إدارة السجلات</h4>
             <p className="text-[11px] text-amber-800 leading-relaxed">
              تغيير سجلات MX أو A قد يؤدي لتوقف فوري لخدمات البريد (Mailu) أو واجهة التقارير. تأكد من صحة القيم قبل الحفظ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNSManager;
