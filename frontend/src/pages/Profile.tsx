import { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import { fetchApi } from '../api/client';
import { Save, User as UserIcon, BookOpen, Calendar, Mail, Upload, Phone, MapPin, AlignLeft, ShieldCheck, Activity } from 'lucide-react';
import { User } from '../types';

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [education, setEducation] = useState(user?.education || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate Profile Completion Percentage
  const completionPercentage = useMemo(() => {
    const fields = [name, user?.email, education, dob, profilePictureUrl, bio, phone, location];
    const filledFields = fields.filter(field => field && field.trim().length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [name, user?.email, education, dob, profilePictureUrl, bio, phone, location]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePictureUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const updatedUser = await fetchApi<User>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, education, dob, profilePictureUrl, bio, phone, location }),
      });
      updateUser(updatedUser);
      setMessage('Profile updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto h-full pb-12"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">Identity Center</h1>
          <p className="text-textMuted">Manage your personal OS identity and security credentials.</p>
        </div>
        
        {/* Profile Completion Widget */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-lg min-w-[250px]">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary transition-all duration-1000 ease-out"
                strokeWidth="3"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">{completionPercentage}%</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Profile Strength</h3>
            <p className="text-xs text-textMuted">{completionPercentage === 100 ? 'Fully Optimized' : 'Complete to unlock full potential'}</p>
          </div>
        </div>
      </header>

      <div className="glass-panel p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 backdrop-blur-sm">
            <ShieldCheck size={20} />
            <span className="font-medium">{message}</span>
          </motion.div>
        )}
        
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 backdrop-blur-sm">
            <Activity size={20} />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-6 lg:w-1/3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            
            <div 
              className="relative group/avatar cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {profilePictureUrl ? (
                <img 
                  src={profilePictureUrl} 
                  alt="Profile" 
                  className="w-48 h-48 rounded-full object-cover border-[6px] border-black/40 shadow-[0_0_30px_rgba(var(--color-primary),0.3)] group-hover/avatar:shadow-[0_0_40px_rgba(var(--color-primary),0.5)] transition-all duration-300"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-black/40 border-[6px] border-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover/avatar:border-primary/50 transition-all duration-300">
                  <UserIcon size={64} className="text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm">
                <Upload className="text-white mb-2" size={28} />
                <span className="text-white text-sm font-semibold tracking-wide">Upload Neural Sync</span>
              </div>
            </div>
            
            <div className="w-full text-center space-y-2">
              <h2 className="text-xl font-bold text-white">{user?.name || 'Unknown User'}</h2>
              <p className="text-sm text-primary font-medium flex items-center justify-center gap-1">
                <ShieldCheck size={14} /> {user?.id === 1 ? 'OS Admin' : 'OS Operator'}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <UserIcon size={16} className="text-primary" /> Full Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <Mail size={16} className="text-accent" /> Neural Link (Email)
                </label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3.5 px-4 text-textMuted cursor-not-allowed opacity-70"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <Phone size={16} className="text-green-400" /> Comm Frequency (Phone)
                </label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <MapPin size={16} className="text-red-400" /> Sector (Location)
                </label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-400" /> Training Base (Education)
                </label>
                <input 
                  type="text" 
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="University / Organization"
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <Calendar size={16} className="text-yellow-400" /> Boot Sequence (DOB)
                </label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner [color-scheme:dark]"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <AlignLeft size={16} className="text-purple-400" /> Bio / Objective
                </label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short summary about yourself..."
                  rows={4}
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner resize-none"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] disabled:opacity-50 hover:-translate-y-1"
              >
                <Save size={20} />
                {loading ? 'Syncing...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
