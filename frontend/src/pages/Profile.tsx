import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import { fetchApi } from '../api/client';
import { Camera, Save, User as UserIcon, BookOpen, Calendar, Mail, Upload } from 'lucide-react';
import { User } from '../types';

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [education, setEducation] = useState(user?.education || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || '');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        body: JSON.stringify({ name, education, dob, profilePictureUrl }),
      });
      updateUser(updatedUser);
      setMessage('Profile updated successfully!');
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
      className="max-w-4xl mx-auto h-full space-y-8 pb-12"
    >
      <header className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Student Profile</h1>
        <p className="text-textMuted">Manage your personal details and identity.</p>
      </header>

      <div className="glass-panel p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-12 relative z-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
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
                  className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-2xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-surface border-4 border-white/10 flex items-center justify-center shadow-2xl">
                  <UserIcon size={48} className="text-textMuted" />
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                <Upload className="text-white mb-1" size={24} />
                <span className="text-white text-xs font-medium">Upload</span>
              </div>
            </div>
            
            <div className="w-full text-center">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <Upload size={16} /> Choose from device
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <UserIcon size={16} /> Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <Mail size={16} /> Email (Read Only)
                </label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-textMuted cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <BookOpen size={16} /> School / Education
                </label>
                <input 
                  type="text" 
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. University of Technology"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                  <Calendar size={16} /> Date of Birth
                </label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all [color-scheme:dark]"
                />
              </div>
              
            </div>

            <div className="pt-6 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-[0_0_20px_rgba(109,40,217,0.3)] disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
