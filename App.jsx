import React, { useState, useEffect } from 'react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, remove } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { Shield, Thermometer, MapPin, Activity, LogOut, AlertTriangle, Clock, Users, CheckCircle } from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyC8uUCfDUIz7u-2xrGuTQmMq5TR_KtnarI",
  authDomain: "studio-8884276633-9c752.firebaseapp.com",
  databaseURL: "https://studio-8884276633-9c752-default-rtdb.firebaseio.com",
  projectId: "studio-8884276633-9c752",
  storageBucket: "studio-8884276633-9c752.appspot.com",
  appId: "1:8884276633:web:9c752"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const auth = getAuth(app);

export default function App() {
  const [view, setView] = useState('login'); // 'login', 'admin', 'user'
  const [user, setUser] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [data, setData] = useState({ temperature: 0, flameSensor: 1, lat: "0.0000", lng: "0.0000" });
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    signInAnonymously(auth).catch(console.error);
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Admin Data Listener
  useEffect(() => {
    if (view === 'admin') {
      const nodesRef = ref(db, 'system/requests');
      return onValue(nodesRef, (snap) => {
        const val = snap.val();
        setNodes(val ? Object.entries(val).map(([id, data]) => ({ id, ...data })) : []);
      });
    }
  }, [view]);

  // User Data Listener
  useEffect(() => {
    if (view === 'user') {
      const dataRef = ref(db, 'sensor_data/current');
      return onValue(dataRef, (snap) => {
        if (snap.exists()) setData(snap.val());
      });
    }
  }, [view]);

  const handleLogin = (e) => {
    e.preventDefault();
    const id = e.target.nodeId.value;
    const key = e.target.accessKey.value;

    if (id === 'admin' && key === 'FlareX@BBJMSV') {
      setView('admin');
    } else {
      // Check authorization in Firebase
      const authRef = ref(db, `system/authorized/${id}`);
      onValue(authRef, (snap) => {
        if (snap.exists() && snap.val().key === key) {
          setView('user');
        } else {
          setLoginError('Invalid Credentials or Unauthorized Node');
        }
      }, { onlyOnce: true });
    }
  };

  const approveNode = (node) => {
    set(ref(db, `system/authorized/${node.id}`), { key: 'LINKED', approvedAt: Date.now() });
    remove(ref(db, `system/requests/${node.id}`));
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
          <div className="bg-blue-600 p-10 text-center text-white">
            <Shield size={48} className="mx-auto mb-4" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">Tactical Matrix</h1>
            <p className="text-[10px] opacity-60 mt-1 tracking-widest">PROJECT: STUDIO-8884276633</p>
          </div>
          <form onSubmit={handleLogin} className="p-10 space-y-6">
            <input name="nodeId" type="text" placeholder="IDENTITY ID" className="w-full bg-slate-900 border-none p-4 rounded-xl text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all" required />
            <input name="accessKey" type="password" placeholder="SECURE KEY" className="w-full bg-slate-900 border-none p-4 rounded-xl text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all" required />
            {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
            <button className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-blue-500 transition-all active:scale-95 uppercase tracking-widest">Authorize Link</button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-slate-900 text-white p-6 flex justify-between items-center px-12">
          <div className="flex items-center gap-3 font-black tracking-tighter uppercase"><Users size={20}/> Command HQ</div>
          <button onClick={() => setView('login')} className="bg-slate-800 p-2 rounded-lg"><LogOut size={20}/></button>
        </nav>
        <div className="max-w-4xl mx-auto p-10">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Pending Authorizations</h2>
          <div className="space-y-4">
            {nodes.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 font-bold">No Pending Requests</div>
            ) : (
              nodes.map(node => (
                <div key={node.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-lg font-black text-slate-800">{node.id}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Requested: {new Date(node.timestamp).toLocaleString()}</p>
                  </div>
                  <button onClick={() => approveNode(node)} className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all">
                    <CheckCircle size={18} /> Approve
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  const isAlert = data.temperature > 45 || data.flameSensor === 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className={`p-6 flex justify-between items-center px-12 text-white shadow-xl ${isAlert ? 'bg-red-600' : 'bg-blue-600'}`}>
        <div className="flex items-center gap-3 font-black tracking-tighter uppercase"><Shield size={20}/> Tactical Matrix</div>
        <button onClick={() => setView('login')} className="bg-black/20 p-2 rounded-lg"><LogOut size={20}/></button>
      </nav>

      <main className="max-w-6xl mx-auto p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-200 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Temperature</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className={`text-8xl font-black tabular-nums tracking-tighter ${isAlert ? 'text-red-600' : 'text-slate-900'}`}>{data.temperature}</span>
              <span className="text-2xl font-bold text-slate-300">°C</span>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-200 md:col-span-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">GPS Tracking</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="bg-slate-50 p-8 rounded-3xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Latitude</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{data.lat}</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Longitude</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{data.lng}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`p-8 rounded-[32px] border flex items-center gap-6 transition-colors ${data.flameSensor === 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
            <div className={`p-5 rounded-2xl ${data.flameSensor === 0 ? 'bg-red-600 text-white animate-bounce' : 'bg-green-100 text-green-600'}`}>
              <Activity size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flame Sensor</p>
              <p className="text-xl font-black">{data.flameSensor === 0 ? 'FIRE DETECTED' : 'SYSTEM CLEAR'}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 flex items-center gap-6">
            <div className="p-5 bg-blue-100 text-blue-600 rounded-2xl">
              <Clock size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Update</p>
              <p className="text-xl font-black uppercase text-green-600">Real-time Linked</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
