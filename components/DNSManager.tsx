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
      <div className="bg-panel p-6 rounded-xl border border-border-subtle shadow-elevation flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-brand-primary text-white p-3 rounded-lg shadow-md">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-primary">إدارة سجلات DNS (Technitium/SaaS)</h2>
            <p className="text-text-subtle text-sm">إدارة النطاقات المحلية والتحكم في توجيه الشبكة السيادية للعملاء.</p>
          </div>
        </div>
        <button 
          onClick={() => { setIsAdding(true); resetTemp(); }}
          className="bg-brand-accent hover:shadow-glow-accent text-canvas px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={18} />
          إضافة سجل جديد
        </button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle" size={18} />
          <input 
            type="text" 
            placeholder="البحث عن سجل (المضيف أو القيمة)..."
            className="w-full bg-panel border border-border-subtle rounded-lg pr-10 pl-4 py-2.5 outline-none focus:ring-2 ring-brand-primary/10 text-text-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-panel text-white p-3 rounded-lg flex items-center justify-between border border-border-subtle">
          <span className="text-xs opacity-70 font-bold uppercase tracking-wider">السجلات</span>
          <span className="text-xl font-black">{records.length}</span>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-panel rounded-xl border border-border-subtle shadow-elevation overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-canvas border-b border-border-subtle">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-text-subtle uppercase tracking-widest">النوع</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-subtle uppercase tracking-widest">المضيف (Host)</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-subtle uppercase tracking-widest">القيمة / الهدف</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-subtle uppercase tracking-widest">TTL</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-subtle uppercase tracking-widest">الأولوية</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-subtle uppercase tracking-widest text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {/* Add New Row */}
              {isAdding && (
                <tr className="bg-brand-accent/5 animate-in slide-in-from-top-2">
                  <td className="px-6 py-4">
                    <select 
                      className="bg-panel border border-border-subtle rounded p-1.5 text-xs outline-none focus:border-brand-accent text-text-primary"
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
                      className="bg-panel border border-border-subtle rounded p-1.5 text-xs w-full outline-none focus:border-brand-accent text-text-primary"
                      value={tempRecord.host}
                      onChange={(e) => setTempRecord({...tempRecord, host: e.target.value})}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder="e.g. 1.2.3.4"
                      className="bg-panel border border-border-subtle rounded p-1.5 text-xs w-full outline-none focus:border-brand-accent text-text-primary"
                      value={tempRecord.value}
                      onChange={(e) => setTempRecord({...tempRecord, value: e.target.value})}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      className="bg-panel border border-border-subtle rounded p-1.5 text-xs w-20 outline-none text-text-primary"
                      value={tempRecord.ttl}
                      onChange={(e) => setTempRecord({...tempRecord, ttl: parseInt(e.target.value)})}
                    />
                  </td>
                  <td className="px-6 py-4">
                    {tempRecord.type === 'MX' ? (
                      <input 
                        type="number" 
                        placeholder="10"
                        className="bg-panel border border-border-subtle rounded p-1.5 text-xs w-20 outline-none border-brand-accent text-text-primary"
                        value={tempRecord.priority}
                        onChange={(e) => setTempRecord({...tempRecord, priority: parseInt(e.target.value)})}
                      />
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={handleAdd} className="p-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-all">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setIsAdding(false)} className="p-2 bg-border-subtle text-text-secondary rounded-lg hover:bg-text-subtle">
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {filteredRecords.map(record => (
                <tr key={record.id} className={`hover:bg-canvas transition-colors ${editingId === record.id ? 'bg-brand-primary/5' : ''}`}>
                  <td className="px-6 py-4">
                    {editingId === record.id ? (
                       <select 
                        className="bg-panel border border-border-subtle rounded p-1.5 text-xs outline-none text-text-primary"
                        value={tempRecord.type}
                        onChange={(e) => setTempRecord({...tempRecord, type: e.target.value as any})}
                      >
                        <option value="A">A</option>
                        <option value="CNAME">CNAME</option>
                        <option value="MX">MX</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        record.type === 'A' ? 'bg-blue-500/10 text-blue-400' :
                        record.type === 'CNAME' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {record.type}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-bold text-brand-primary">
                    {editingId === record.id ? (
                      <input 
                        type="text" 
                        className="bg-panel border border-border-subtle rounded p-1.5 text-xs w-full outline-none text-text-primary"
                        value={tempRecord.host}
                        onChange={(e) => setTempRecord({...tempRecord, host: e.target.value})}
                      />
                    ) : record.host}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                    {editingId === record.id ? (
                      <input 
                        type="text" 
                        className="bg-panel border border-border-subtle rounded p-1.5 text-xs w-full outline-none text-text-primary"
                        value={tempRecord.value}
                        onChange={(e) => setTempRecord({...tempRecord, value: e.target.value})}
                      />
                    ) : record.value}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-text-subtle">
                    {editingId === record.id ? (
                      <input 
                        type="number" 
                        className="bg-panel border border-border-subtle rounded p-1.5 text-xs w-20 outline-none text-text-primary"
                        value={tempRecord.ttl}
                        onChange={(e) => setTempRecord({...tempRecord, ttl: parseInt(e.target.value)})}
                      />
                    ) : record.ttl}
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-brand-accent">
                    {editingId === record.id && tempRecord.type === 'MX' ? (
                      <input 
                        type="number" 
                        className="bg-panel border border-border-subtle rounded p-1.5 text-xs w-20 outline-none text-text-primary"
                        value={tempRecord.priority}
                        onChange={(e) => setTempRecord({...tempRecord, priority: parseInt(e.target.value)})}
                      />
                    ) : (record.priority || '-')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {editingId === record.id ? (
                        <>
                          <button onClick={handleUpdate} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(record)}
                            className="p-2 text-text-subtle hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)}
                            className="p-2 text-text-subtle hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
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
        <div className="bg-panel p-5 rounded-xl text-white flex items-start gap-4 border-l-4 border-brand-accent shadow-lg">
          <Shield size={24} className="text-brand-accent mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-black text-sm mb-1 uppercase tracking-tight">الخصوصية السيادية (DoH/DoT)</h4>
            <p className="text-[11px] text-text-subtle leading-relaxed">
              جميع استعلامات DNS للعملاء مشفرة. سجلات Technitium DNS تعمل في بيئة معزولة تماماً داخل شبكة YemenJPT السيادية لمنع أي تسريب للبيانات الجغرافية للمحققين.
            </p>
          </div>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl flex items-start gap-4 shadow-sm">
          <AlertCircle className="text-amber-500 mt-1 flex-shrink-0" size={24} />
          <div>
             <h4 className="font-black text-sm mb-1 text-amber-400 uppercase tracking-tight">تحذير إدارة السجلات</h4>
             <p className="text-[11px] text-amber-500 opacity-80 leading-relaxed">
              تغيير سجلات MX أو A قد يؤدي لتوقف فوري لخدمات البريد (Mailu) أو واجهة التقارير. تأكد من صحة القيم قبل الحفظ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNSManager;