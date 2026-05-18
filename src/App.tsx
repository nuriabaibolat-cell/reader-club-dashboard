import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Coins, 
  BrainCircuit, 
  MessageSquare, 
  ShieldCheck, 
  Smartphone,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ChevronRight,
  Send,
  Sparkles,
  Search,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import { kemelAI } from './lib/aiService';

// --- Types ---
type Role = 'student' | 'teacher' | 'director' | 'parent';

interface Message {
  role: 'user' | 'model';
  content: string;
}

// --- Components ---

const Sidebar = ({ currentRole, setRole }: { currentRole: Role, setRole: (r: Role) => void }) => {
  const roles: { id: Role, label: string, icon: any }[] = [
    { id: 'student', label: 'Оқушы', icon: GraduationCap },
    { id: 'teacher', label: 'Педагог', icon: Users },
    { id: 'director', label: 'Директор', icon: LayoutDashboard },
    { id: 'parent', label: 'Ата-ана', icon: ShieldCheck },
  ];

  return (
    <div className="w-64 h-screen bg-brand-navy text-white p-6 sticky top-0">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-terracotta rounded-lg flex items-center justify-center">K</div>
          KEMEL
        </h1>
        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Perfect School Project</p>
      </div>

      <nav className="space-y-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setRole(role.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              currentRole === role.id 
                ? 'bg-brand-terracotta text-white shadow-lg shadow-brand-terracotta/20' 
                : 'hover:bg-white/10 text-white/70'
            }`}
          >
            <role.icon size={20} />
            <span className="font-medium">{role.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-10 left-6 right-6 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3 grayscale opacity-50">
          <BookOpen size={20} />
          <span className="text-sm font-medium">Астана, 2026</span>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, goal, color }: { label: string, value: number, goal: number, color: string }) => {
  return (
    <div className="glass-card p-5">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-sm text-brand-navy/60 font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold">{value}%</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-brand-navy/40">Мақсат</p>
          <p className="font-bold text-brand-terracotta">{goal}%</p>
        </div>
      </div>
      <div className="h-2 w-full bg-brand-navy/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value / goal) * 100}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};

const AICoach = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Сәлем! Бүгін қандай кітап туралы сөйлесеміз? Мен сенің КЕМЕЛ ЖИ-коучыңмын.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await kemelAI.discussBook("Көшпенділер", userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Кешіріңіз, қате пайда болды. Қайталап көріңізші." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-[500px]">
      <div className="p-4 border-b border-brand-navy/5 flex items-center justify-between bg-brand-navy text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-terracotta rounded-full flex items-center justify-center animate-pulse">
            <BrainCircuit size={18} />
          </div>
          <div>
            <p className="text-sm font-bold">ЖИ-Коуч (Кемел-Бот)</p>
            <p className="text-[10px] text-white/60 uppercase tracking-widest">Белсенді оқырман үшін</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
              m.role === 'user' ? 'bg-brand-navy text-white rounded-tr-none' : 'bg-brand-cream text-brand-navy border border-brand-navy/10 rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-brand-navy/40 italic">ЖИ ойлануда...</div>}
      </div>

      <div className="p-4 border-t border-brand-navy/5 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ойларыңызды жазыңыз..."
          className="flex-1 bg-brand-cream px-4 py-2 rounded-full text-sm outline-none border border-brand-navy/5 focus:border-brand-terracotta"
        />
        <button onClick={handleSend} className="bg-brand-terracotta text-white p-2 rounded-full hover:scale-110 transition-transform">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

const StudentDashboard = ({ setMessages }: { setMessages: any }) => {
  const [sprintActive, setSprintActive] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Main Programs */}
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kemel Sprint */}
          <div className="glass-card p-6 border-l-4 border-l-brand-terracotta relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-brand-terracotta/10 rounded-lg text-brand-terracotta">
                  <BrainCircuit size={20} />
                </div>
                <h4 className="font-bold">Кемел Спринт (5-6 сынып)</h4>
              </div>
              <p className="text-xs text-brand-navy/60 mb-4">Сабақ алдындағы 5 минуттық пәнаралық ЖИ-жаттығулар.</p>
              <button 
                onClick={() => setSprintActive(true)}
                className="w-full py-2 bg-brand-navy text-white rounded-xl text-xs font-bold hover:bg-brand-terracotta transition-colors flex items-center justify-center gap-2"
              >
                Жаттығуды бастау <ChevronRight size={14} />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <BrainCircuit size={100} />
            </div>
          </div>

          {/* future Teacher */}
          <div className="glass-card p-6 border-l-4 border-l-brand-sage relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-brand-sage/10 rounded-lg text-brand-sage">
                  <GraduationCap size={20} />
                </div>
                <h4 className="font-bold">Болашақ Ұстаз</h4>
              </div>
              <p className="text-xs text-brand-navy/60 mb-4">"Zerde" байқауына ғылыми жобалар дайындау орталығы.</p>
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-brand-sage">Жоба статусы: Дайындық</span>
                <span className="text-brand-navy/40">75%</span>
              </div>
              <div className="mt-2 h-1 w-full bg-brand-navy/5 rounded-full">
                <div className="h-full w-3/4 bg-brand-sage rounded-full" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <GraduationCap size={100} />
            </div>
          </div>
        </div>

        {/* My Library - KEPT as requested */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Менің Кітапханам</h3>
            <button className="text-sm text-brand-terracotta font-bold flex items-center gap-1 hover:underline">
              Жаңа кітап қосу <PlusCircle size={14} />
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[
              { title: "Көшпенділер", author: "Ілияс Есенберлин", coins: 500, img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200", status: "Оқылуда" },
              { title: "Абай жолы", author: "Мұхтар Әуезов", coins: 750, img: "https://images.unsplash.com/photo-1512820790803-73c772ff376f?auto=format&fit=crop&q=80&w=200", status: "Аяқталды" },
              { title: "Қара сөздер", author: "Абай Құнанбайұлы", coins: 300, img: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=200", status: "Жоспарда" },
            ].map((book, i) => (
              <div key={i} className="min-w-[160px] group cursor-pointer">
                <div className="h-48 bg-brand-navy/10 rounded-xl overflow-hidden mb-3 relative">
                  <img src={book.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-brand-navy">
                    +{book.coins} c
                  </div>
                  <div className="absolute inset-x-2 bottom-2 bg-brand-navy/80 backdrop-blur-sm text-white py-1 rounded text-[10px] text-center font-bold">
                    {book.status}
                  </div>
                </div>
                <p className="text-sm font-bold truncate">{book.title}</p>
                <p className="text-[10px] text-brand-navy/50">{book.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reader Club Leaderboard */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp size={20} className="text-brand-terracotta" />
                Кемел Оқырман Клубы (7-11 сынып)
              </h3>
              <p className="text-[10px] text-brand-navy/60 mt-1 leading-tight">Оқу белсенділігін арттыруға арналған арнайы рейтинг жүйесі мен айлық марапаттарды қамтитын оқу клубы.</p>
            </div>
            <span className="text-[10px] font-extrabold px-3 py-1 bg-brand-terracotta/10 text-brand-terracotta rounded-full">МАМЫР АЙЫНЫҢ РЕЙТИНГІ</span>
          </div>
          <div className="space-y-4">
            {[
              { 
                rank: 1, 
                name: "Альдибек Ризасұлтан", 
                points: 4500, 
                label: "Golden Reader",
                school: "№69 мектеп гимназиясы",
                grade: "5е",
                photo: "https://drive.google.com/uc?export=view&id=1G8VBOnQEv252PvTVRih9XVr0bi36nTUh" // Image of a happy student with a trophy/award
              },
              { rank: 2, name: "Елдос Дастан", points: 4100, label: "Active Mind" },
              { rank: 3, name: "Санжар Б.", points: 3800, label: "Explorer" },
            ].map((lead, i) => (
              <div 
                key={i} 
                onClick={() => lead.name === "Альдибек Ризасұлтан" && setSelectedStudent(lead)}
                className={`flex items-center justify-between p-3 bg-brand-cream rounded-xl transition-all ${
                  lead.name === "Альдибек Ризасұлтан" ? 'cursor-pointer hover:bg-brand-navy/5 border border-transparent hover:border-brand-navy/10' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-yellow-400 text-white' : 'bg-brand-navy/10'}`}>{lead.rank}</span>
                  <div>
                    <p className="text-sm font-bold">{lead.name}</p>
                    <p className="text-[10px] text-brand-navy/40 uppercase">{lead.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 font-bold text-brand-navy">
                    <Coins size={14} className="text-brand-terracotta" />
                    {lead.points}
                  </div>
                  {lead.name === "Альдибек Ризасұлтан" && <ChevronRight size={14} className="text-brand-navy/20" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: EQ & Shop */}
      <div className="space-y-8">
        {/* EQ School */}
        <div className="glass-card p-6 bg-white">
          <h4 className="font-bold flex items-center gap-2 mb-4">
            <MessageSquare size={18} className="text-brand-terracotta" /> 
            EQ School: Көңіл-күй күнделігі
          </h4>
          <p className="text-xs text-brand-navy/60 mb-4">Бүгін өзіңді қалай сезінесің? Эмоцияңды таңда:</p>
          <div className="flex justify-between mb-6">
            {['😊', '🤔', '😴', '😤', '🤩'].map((emoji) => (
              <button 
                key={emoji}
                onClick={() => setMood(emoji)}
                className={`text-2xl p-2 rounded-xl transition-all ${mood === emoji ? 'bg-brand-terracotta/20 scale-125' : 'hover:bg-brand-cream'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="p-4 bg-brand-cream rounded-xl">
            <p className="text-[10px] font-bold text-brand-navy/40 uppercase mb-2">Рефлексия сұрағы:</p>
            <p className="text-xs italic">"Бүгін мені не қуантты?"</p>
            <input 
              className="w-full mt-2 bg-transparent border-b border-brand-navy/20 outline-none text-xs py-1" 
              placeholder="Жауап жазу..."
            />
          </div>
        </div>

        {/* AI Coach (Existing) */}
        <AICoach />

        {/* Kemel Shop (Updated) */}
        <div className="glass-card p-6 bg-brand-navy text-white relative overflow-hidden">
          <h4 className="font-bold flex items-center gap-2 mb-4 relative z-10">
            <Sparkles size={18} className="text-brand-terracotta" /> 
            Kemel Shop
          </h4>
          <div className="space-y-3 relative z-10">
            {[
              { item: "Киноға билет", price: 1000 },
              { item: "Кітап сыйлығы", price: 500 },
              { item: "Автобус саяхаты", price: 1500 },
              { item: "VIP Оқырман Бэйджі", price: 2000 },
            ].map((p, i) => (
              <div key={i} className="flex justify-between items-center bg-white/10 p-3 rounded-lg hover:bg-white/20 cursor-pointer">
                <span className="text-xs">{p.item}</span>
                <span className="text-xs font-bold text-brand-terracotta">{p.price} c</span>
              </div>
            ))}
          </div>
          <div className="absolute -right-10 -bottom-10 text-white/5 rotate-12">
            <Coins size={150} />
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-navy/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-brand-cream w-full max-w-lg rounded-3xl overflow-hidden relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <PlusCircle size={24} className="rotate-45" />
              </button>
              
              <div className="h-64 relative">
                <img 
                  src={selectedStudent.photo} 
                  className="w-full h-full object-cover" 
                  alt={selectedStudent.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy to-transparent" />
                <div className="absolute bottom-6 left-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-400 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">RANK #1</span>
                    <span className="text-[10px] font-bold opacity-70">GOLDEN READER OF THE MONTH</span>
                  </div>
                  <h2 className="text-3xl font-bold font-display">{selectedStudent.name}</h2>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-brand-navy/5 shadow-sm">
                    <p className="text-[10px] font-black text-brand-navy/30 uppercase tracking-widest mb-1">Мектеп</p>
                    <p className="text-sm font-bold text-brand-navy">{selectedStudent.school}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-brand-navy/5 shadow-sm">
                    <p className="text-[10px] font-black text-brand-navy/30 uppercase tracking-widest mb-1">Сынып</p>
                    <p className="text-sm font-bold text-brand-navy">{selectedStudent.grade}</p>
                  </div>
                </div>

                <div className="bg-brand-navy p-6 rounded-2xl text-white flex justify-between items-center relative overflow-hidden">
                   <div className="relative z-10">
                     <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Общий баланс</p>
                     <p className="text-3xl font-black">{selectedStudent.points} <span className="text-sm font-normal text-brand-terracotta">Book-Coins</span></p>
                   </div>
                   <Coins size={48} className="text-white/5 -mr-4" />
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-brand-navy/30 uppercase tracking-widest">Соңғы жетістіктері</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-brand-sage/10 text-brand-sage text-[10px] font-bold rounded-full border border-brand-sage/20">Үздік талдау</span>
                    <span className="px-3 py-1 bg-brand-terracotta/10 text-brand-terracotta text-[10px] font-bold rounded-full border border-brand-terracotta/20">30 күн оқу</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kemel Sprint Modal Mockup */}
      <AnimatePresence>
        {sprintActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-navy/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-brand-cream w-full max-w-xl rounded-3xl p-8 relative"
            >
              <button 
                onClick={() => setSprintActive(false)}
                className="absolute top-4 right-4 text-brand-navy/40 hover:text-brand-navy"
              >
                <PlusCircle size={24} className="rotate-45" />
              </button>
              <h2 className="text-2xl font-bold font-display text-brand-navy mb-2">Кемел Спринт</h2>
              <p className="text-sm text-brand-navy/60 mb-8">Математика + Логика + Тілдер. Уақыт: 05:00</p>
              
              <div className="bg-white p-6 rounded-2xl border border-brand-navy/10 mb-6">
                <p className="font-bold text-lg mb-4">Логика сұрағы:</p>
                <p className="text-brand-navy/80">"Егер 3 оқушы 3 кітапты 3 күнде оқыса, 9 оқушы 9 кітапты неше күнде оқиды?"</p>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {['3 күн', '9 күн', '1 күн', '27 күн'].map((opt) => (
                    <button key={opt} className="p-3 border border-brand-navy/10 rounded-xl hover:bg-brand-terracotta hover:text-white transition-all text-sm font-medium">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold text-brand-navy/40 uppercase">
                <span>Пән: Логика</span>
                <span>Сынып: 5-6</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [role, setRole] = useState<Role>('student');

  return (
    <div className="flex min-h-screen">
      <Sidebar currentRole={role} setRole={setRole} />
      
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <motion.h2 
              key={role}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold font-display"
            >
              {role === 'student' && 'Оқушы Панелі'}
              {role === 'teacher' && 'Педагог Хабы'}
              {role === 'director' && 'Стратегиялық Дашборд'}
              {role === 'parent' && 'Ата-ана Серіктестігі'}
            </motion.h2>
            <p className="text-brand-navy/50 mt-2">Қош келдіңіз, Kemel Mektep жүйесіне!</p>
          </div>
          
          <div className="flex items-center gap-4">
            {role === 'student' && (
              <div className="flex items-center gap-2 bg-brand-terracotta/10 text-brand-terracotta px-4 py-2 rounded-full border border-brand-terracotta/20">
                <Coins size={18} />
                <span className="font-bold underline text-sm">1,240 Book-Coins</span>
              </div>
            )}
            <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold">
              {role.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content sections based on role */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {role === 'student' && <StudentDashboard setMessages={() => {}} />}

            {role === 'teacher' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-card p-6 group hover:border-brand-terracotta transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-brand-terracotta/10 rounded-xl flex items-center justify-center text-brand-terracotta mb-4">
                      <PlusCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold">Quiz Maker</h3>
                    <p className="text-xs text-brand-navy/60 mt-1">Оқу мақсаттарына сай ЖИ сұрақтарын генерациялау</p>
                  </div>
                  <div className="glass-card p-6 group hover:border-brand-sage transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-brand-sage/10 rounded-xl flex items-center justify-center text-brand-sage mb-4">
                      <MessageSquare size={24} />
                    </div>
                    <h3 className="text-lg font-bold">SpeakUp Hub</h3>
                    <p className="text-xs text-brand-navy/60 mt-1">Коммуникация және көшбасшылық дағдылары</p>
                  </div>
                  <div 
                    onClick={() => {
                      const el = document.getElementById('kemel-ustaz-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="glass-card p-6 group hover:border-brand-navy transition-colors cursor-pointer bg-brand-navy text-white"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-4">
                      <Users size={24} />
                    </div>
                    <h3 className="text-lg font-bold">Кемел Ұстаз</h3>
                    <p className="text-xs text-white/60 mt-1">Мұғалімдердің кәсіби дамуы және іс-шаралар</p>
                  </div>
                  <div className="glass-card p-6 group hover:border-brand-terracotta transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-brand-terracotta/10 rounded-xl flex items-center justify-center text-brand-terracotta mb-4">
                      <TrendingUp size={24} />
                    </div>
                    <h3 className="text-lg font-bold">Рейтинг</h3>
                    <p className="text-xs text-brand-navy/60 mt-1">Үздік педагогтер мен жетістіктер</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-6">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 size={20} className="text-brand-navy" />
                        Сынып прогресі (9-А)
                      </h3>
                      <div className="space-y-6">
                        {[
                          { student: "Арман Ә.", coins: 2450, read: 12, quality: 88 },
                          { student: "Динара Қ.", coins: 1820, read: 8, quality: 95 },
                          { student: "Мұрат С.", coins: 1560, read: 7, quality: 72 },
                        ].map((s, i) => (
                          <div key={i} className="flex items-center justify-between border-b border-brand-navy/5 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-navy/10 flex items-center justify-center text-xs font-bold">
                                {s.student.split(' ')[0][0]}
                              </div>
                              <span className="text-sm font-medium">{s.student}</span>
                            </div>
                            <div className="flex gap-10 items-center">
                              <div className="text-center">
                                <p className="text-[10px] text-brand-navy/40 uppercase">Кітап</p>
                                <p className="text-sm font-bold">{s.read}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[10px] text-brand-navy/40 uppercase">Мәтін сапасы</p>
                                <p className="text-sm font-bold text-brand-sage">{s.quality}%</p>
                              </div>
                              <div className="flex items-center gap-2 text-brand-terracotta">
                                <Coins size={14} />
                                <span className="text-sm font-bold">{s.coins}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="glass-card p-6">
                      <h4 className="font-bold flex items-center gap-2 mb-4">
                        Digital Pedagogue
                      </h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-brand-cream rounded-xl">
                          <p className="text-xs font-bold">Training Course: Generative AI</p>
                          <div className="mt-2 h-1 w-full bg-brand-navy/5 rounded-full">
                            <div className="h-full w-3/4 bg-brand-terracotta rounded-full" />
                          </div>
                          <p className="text-[10px] mt-1 text-right">75% Complete</p>
                        </div>
                        <div className="p-4 bg-brand-cream rounded-xl opacity-60">
                          <p className="text-xs font-bold">Strategic Coaching</p>
                          <p className="text-[10px] mt-1 italic">Starts next week</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card p-6 bg-brand-sage text-white">
                      <h4 className="font-bold flex items-center gap-2 mb-2">
                        Hobby Coffee
                      </h4>
                      <p className="text-xs opacity-80 mb-4">Жұма сайынғы бейресми кездесу. Талқылау тақырыбы: "Қазіргі қазақ прозасы".</p>
                      <button className="w-full py-2 bg-white/20 rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">
                        Тіркелу
                      </button>
                    </div>
                  </div>
                </div>

                {/* Kemel Ustaz Gallery Section */}
                <div id="kemel-ustaz-section" className="glass-card p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-3 font-display">
                        <div className="p-2 bg-brand-navy text-white rounded-lg">
                          <Users size={24} />
                        </div>
                        Кемел Ұстаз: Мұғалімдердің Жұмысы
                      </h3>
                      <p className="text-sm text-brand-navy/50 mt-1">Педагогтер білім берушіден заманауи оқырман және цифрлық коучқа айналады.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="h-[400px] bg-brand-navy/5 rounded-2xl overflow-hidden border border-brand-navy/10 relative group">
                        <img 
                          src=""/Kemel.jpeg"
                          alt="Kemel Talks Teachers"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = ""/Kemel.jpeg"";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div>
                            <h4 className="text-white font-bold text-lg">Kemel Talks</h4>
                            <p className="text-white/70 text-xs italic">Халықаралық білімге апарар жол: тәжірибе және кеңестер</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-brand-navy">Kemel Talks: Тәжірибе алмасу алаңы</p>
                    </div>

                    <div className="space-y-4">
                      <div className="h-[400px] bg-brand-navy/5 rounded-2xl overflow-hidden border border-brand-navy/10 relative group">
                        <img 
                          src="https://ais-pre-7jdyphqtafvn45f3onvccy-224759101651.asia-southeast1.run.app/api/artifacts/teachers_outdoor_event" 
                          alt="Teachers outdoor event"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1577896851231-70ef1460011e?auto=format&fit=crop&q=80&w=800";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div>
                            <h4 className="text-white font-bold text-lg">Оқу - трендте!</h4>
                            <p className="text-white/70 text-xs italic">Мұғалімдердің қалалық оқу фестиваліне қатысу сәті</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-brand-navy">Педагогикалық шеберлік: Ашық аспан астында</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {role === 'director' && (
              <div className="space-y-8 text-brand-navy">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <MetricCard label="Мәтінді терең түсіну" value={55} goal={90} color="bg-brand-navy" />
                   <MetricCard label="Мұғалім-оқырмандар" value={30} goal={100} color="bg-brand-terracotta" />
                   <MetricCard label="ЖИ қолданатын педагогтер" value={5} goal={80} color="bg-brand-sage" />
                   <MetricCard label="Функционалдық сауаттылық" value={45} goal={85} color="bg-brand-navy" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Жоба Кезеңдері</h3>
                    <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-brand-navy/10">
                      {[
                        { title: "Дайындық (Қаңтар 2026)", status: "done", desc: "100% бастапқы диагностика / Book-Coin каталогын бекіту" },
                        { title: "Негізгі (Ақпан - Сәуір 2026)", status: "active", desc: "Кемел Мектеп қосымшасының бета-нұсқасы / 7 'Кемел' бағдарламасы" },
                        { title: "Қорытынды (Мамыр 2026)", status: "pending", desc: "Саттылық мақсаттарын өлшеу / Кемел Форум" },
                      ].map((k, i) => (
                        <div key={i} className="relative">
                          <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-4 border-brand-cream flex items-center justify-center ${
                            k.status === 'done' ? 'bg-brand-sage' : k.status === 'active' ? 'bg-brand-terracotta animate-pulse' : 'bg-brand-navy/20'
                          }`}>
                            {k.status === 'done' && <ShieldCheck size={12} className="text-white" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">{k.title}</h4>
                            <p className="text-xs text-brand-navy/60 mt-1">{k.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Long-Term Scaling (2026-2028)</h3>
                    <div className="space-y-4">
                       <div className="p-4 rounded-xl bg-brand-navy text-white">
                         <p className="text-sm font-bold">Астана қаласы (3 мектеп)</p>
                         <p className="text-xs opacity-60">Тәжірибені масштабтау кезеңі</p>
                       </div>
                       <div className="p-4 rounded-xl border border-brand-navy/10">
                         <p className="text-sm font-bold">Білім беру стратегиясына ұсыну</p>
                         <p className="text-[10px] text-brand-navy/40 uppercase">Мақсат: ТОП-10 мектеп тізімі</p>
                       </div>
                       <div className="p-4 rounded-xl border border-brand-navy/10 bg-brand-terracotta/5 border-brand-terracotta/20">
                         <p className="text-sm font-bold">KEMEL App Мобильді нарық</p>
                         <p className="text-xs text-brand-terracotta/80">Коммерциялық нұсқа және басқа аймақтар</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {role === 'parent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                   <div className="glass-card p-8 bg-brand-terracotta text-white flex gap-6 items-center">
                     <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <Users size={40} />
                     </div>
                     <div>
                       <h3 className="text-2xl font-bold">Ата-анаға хат</h3>
                       <p className="text-sm opacity-80 mt-1 italic">"Бала оқыса — ел оқиды. Ел оқыса — ел ойлайды."</p>
                     </div>
                   </div>

                   <div className="glass-card p-8">
                     <h4 className="font-bold mb-6">Балаңыздың апталық есебі</h4>
                     <div className="space-y-4">
                       <div className="flex justify-between items-center p-4 bg-brand-cream rounded-xl">
                         <span className="text-sm font-medium">Оқылған кітаптар</span>
                         <span className="font-bold underline text-brand-navy">3 кітап</span>
                       </div>
                       <div className="flex justify-between items-center p-4 bg-brand-cream rounded-xl">
                         <span className="text-sm font-medium">Белсенділік деңгейі</span>
                         <span className="px-3 py-1 bg-brand-sage text-white text-[10px] font-bold rounded-full">ЖОҒАРЫ</span>
                       </div>
                       <div className="flex justify-between items-center p-4 bg-brand-cream rounded-xl">
                         <span className="text-sm font-medium">Ойлау коэффиценті</span>
                         <span className="font-extrabold text-brand-terracotta">7.8 / 10</span>
                       </div>
                     </div>
                   </div>
                </div>

                <div className="space-y-8">
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4">Жоба Жаңалықтары</h3>
                    <div className="space-y-4">
                       <div className="flex gap-4">
                         <div className="w-12 h-12 bg-brand-navy/5 rounded flex items-center justify-center text-brand-navy">
                           <MessageSquare size={20} />
                         </div>
                         <div>
                           <p className="text-sm font-bold">Кемел TALKS: Астана қ. әкімімен кездесу</p>
                           <p className="text-[10px] text-brand-navy/40">21 Мамыр, 15:00</p>
                         </div>
                       </div>
                       <div className="flex gap-4">
                         <div className="w-12 h-12 bg-brand-navy/5 rounded flex items-center justify-center text-brand-navy">
                           <ShieldCheck size={20} />
                         </div>
                         <div>
                           <p className="text-sm font-bold">Автобус кітапханасы: Жаңа бағыт</p>
                           <p className="text-[10px] text-brand-navy/40">Оқушылар қалалық кітапханаға саяхаты</p>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="glass-card p-8 border-2 border-dashed border-brand-navy/10 flex flex-col items-center justify-center text-center">
                    <Search size={32} className="text-brand-navy/20 mb-4" />
                    <p className="text-sm font-bold">Баланы бақылау емес,</p>
                    <p className="text-sm text-brand-navy/60 italic">Кітап арқылы жүрекке жол табу.</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

