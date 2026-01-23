import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Zap, Target, Award, Star, Flame, Crown, Gem, Rocket, Heart, Sparkles, Clock, Edit2, Check, X } from 'lucide-react';

const iconOptions = [
  { name: 'Trophy', component: Trophy },
  { name: 'Star', component: Star },
  { name: 'Flame', component: Flame },
  { name: 'Crown', component: Crown },
  { name: 'Gem', component: Gem },
  { name: 'Rocket', component: Rocket },
  { name: 'Heart', component: Heart },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Award', component: Award },
];

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
};

const AchievementToast = ({ task, onClose }) => {
  const IconComponent = iconOptions.find(i => i.name === task.icon)?.component || Trophy;
  
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50 animate-slide-in max-w-sm w-full px-4">
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 p-1 rounded-lg shadow-2xl">
        <div className="bg-gray-900 px-4 py-3 md:px-6 md:py-4 rounded-lg flex items-center gap-3 md:gap-4">
          <div className="relative flex-shrink-0">
            {task.icon === 'Custom' && task.customIconUrl ? (
              <img src={task.customIconUrl} alt="Achievement" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover animate-bounce" />
            ) : (
              <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 animate-bounce" />
            )}
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="text-yellow-400 font-bold text-xs md:text-sm uppercase tracking-wider">Achievement Unlocked!</div>
            <div className="text-white font-semibold text-base md:text-lg mt-1 truncate">{task.achievementName || task.name}</div>
            <div className="text-gray-300 text-xs md:text-sm">Goal Completed 🎉</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementCard = ({ achievement, onUpdate, onDelete, compact = false, showDelete = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(achievement.achievementName || achievement.name);
  const [editTitle, setEditTitle] = useState(achievement.achievementTitle || 'Master');
  const [selectedIcon, setSelectedIcon] = useState(achievement.icon || 'Trophy');
  const [customIconUrl, setCustomIconUrl] = useState(achievement.customIconUrl || null);

  const IconComponent = iconOptions.find(i => i.name === selectedIcon)?.component || Trophy;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomIconUrl(event.target.result);
        setSelectedIcon('Custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate(achievement.id, {
      achievementName: editName,
      achievementTitle: editTitle,
      icon: selectedIcon,
      customIconUrl: selectedIcon === 'Custom' ? customIconUrl : null
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the achievement "${editName}"? This cannot be undone.`)) {
      onDelete(achievement.id);
      setIsEditing(false);
    }
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5 rounded-lg">
        <div className="bg-gray-800 rounded-lg p-3 h-full">
          <div className="flex items-center gap-2 mb-2">
            {achievement.icon === 'Custom' && achievement.customIconUrl ? (
              <img src={achievement.customIconUrl} alt="Custom icon" className="w-5 h-5 flex-shrink-0 rounded object-cover" />
            ) : (
              <IconComponent className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            )}
            <h4 className="text-white font-bold text-sm truncate">{achievement.achievementName || achievement.name}</h4>
          </div>
          <div className="text-gray-400 text-xs">{getTimeAgo(achievement.completedAt || achievement.updatedAt)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-1 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 h-full">
        {isEditing ? (
          <div className="space-y-3 md:space-y-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg border-2 border-yellow-500 focus:outline-none focus:border-orange-500 text-sm md:text-base"
              placeholder="Achievement name"
            />
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg border-2 border-yellow-500 focus:outline-none focus:border-orange-500 text-sm md:text-base"
              placeholder="Achievement title"
            />
            <div>
              <label className="text-white font-semibold mb-2 block text-sm md:text-base">Choose Icon</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {iconOptions.map((icon) => {
                  const Icon = icon.component;
                  return (
                    <button
                      key={icon.name}
                      onClick={() => {
                        setSelectedIcon(icon.name);
                        setCustomIconUrl(null);
                      }}
                      className={`p-3 rounded-lg transition-all ${
                        selectedIcon === icon.name && !customIconUrl
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto" />
                    </button>
                  );
                })}
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id={`upload-${achievement.id}`}
                />
                <label
                  htmlFor={`upload-${achievement.id}`}
                  className={`block w-full p-3 rounded-lg text-center cursor-pointer transition-all ${
                    selectedIcon === 'Custom' && customIconUrl
                      ? 'bg-yellow-500 text-gray-900 font-bold'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {selectedIcon === 'Custom' && customIconUrl ? (
                    <div className="flex items-center justify-center gap-2">
                      <img src={customIconUrl} alt="Custom" className="w-6 h-6 rounded object-cover" />
                      <span>Custom Icon Selected</span>
                    </div>
                  ) : (
                    '📤 Upload Custom Icon'
                  )}
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSave}
                className="flex-1 min-w-[100px] bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all text-sm md:text-base flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
              {showDelete && (
                <button
                  onClick={handleDelete}
                  className="flex-1 min-w-[100px] bg-red-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold hover:bg-red-600 transition-all text-sm md:text-base"
                  title="Delete Achievement"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 min-w-[100px] bg-gray-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold hover:bg-gray-600 transition-all text-sm md:text-base flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                {achievement.icon === 'Custom' && achievement.customIconUrl ? (
                  <img src={achievement.customIconUrl} alt="Achievement icon" className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover" />
                ) : (
                  <IconComponent className="w-12 h-12 md:w-16 md:h-16 text-yellow-400" />
                )}
                <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-30" />
              </div>
            </div>
            <h3 className="text-white font-bold text-base md:text-lg text-center mb-1">{achievement.achievementName || achievement.name}</h3>
            <p className="text-yellow-400 text-xs md:text-sm text-center font-semibold mb-3">{achievement.achievementTitle || 'Master'}</p>
            <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-4">
              <Clock className="w-3 h-3" />
              <span>{getTimeAgo(achievement.completedAt || achievement.updatedAt)}</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all text-sm md:text-base flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Customize
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, onUpdate, onDelete, compact = false, showEditButton = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [editProgress, setEditProgress] = useState(task.progress);

  const getStatusColor = () => {
    if (task.progress === 0) return 'from-gray-500 to-gray-600';
    if (task.progress === 100) return 'from-green-400 to-emerald-500';
    return 'from-blue-400 to-purple-500';
  };

  const getStatusText = () => {
    if (task.progress === 0) return 'Not Started';
    if (task.progress === 100) return 'Completed';
    return 'In Progress';
  };

  const handleSave = () => {
    if (editName.trim()) {
      onUpdate(task.id, { name: editName, progress: editProgress });
      setIsEditing(false);
    }
  };

  if (compact) {
    return (
      <div className={`bg-gradient-to-br ${getStatusColor()} p-0.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
        <div className="bg-gray-800 rounded-lg p-3 h-full relative">
          {!isEditing && showEditButton && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded transition-all z-10"
              title="Edit"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-gray-700 text-white px-2 py-1 rounded border-2 border-purple-500 focus:outline-none focus:border-pink-500 text-sm"
                placeholder="Task name"
              />
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-white font-semibold text-xs">Progress</label>
                  <span className="text-lg font-bold text-purple-400">{editProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editProgress}
                  onChange={(e) => setEditProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded font-bold hover:from-green-600 hover:to-emerald-700 transition-all text-xs"
                >
                  Save
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded font-bold hover:bg-red-600 transition-all text-xs"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-700 text-white px-2 py-1 rounded font-bold hover:bg-gray-600 transition-all text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1 min-w-0 pr-8">
                  <Zap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <h3 className="text-white font-bold text-sm truncate">{task.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{getTimeAgo(task.updatedAt || task.createdAt)}</span>
              </div>

              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300 text-xs font-semibold">{getStatusText()}</span>
                  <span className="text-xl font-bold text-white">{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getStatusColor()} transition-all duration-500 rounded-full relative overflow-hidden`}
                    style={{ width: `${task.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${getStatusColor()} p-1 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 h-full relative">
        {!isEditing && showEditButton && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-3 right-3 md:top-4 md:right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all z-10"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
        {isEditing ? (
          <div className="space-y-3 md:space-y-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg border-2 border-purple-500 focus:outline-none focus:border-pink-500 text-sm md:text-base"
              placeholder="Task name"
            />
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-semibold text-sm md:text-base">Progress</label>
                <span className="text-xl md:text-2xl font-bold text-purple-400">{editProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editProgress}
                onChange={(e) => setEditProgress(parseInt(e.target.value))}
                className="w-full h-2 md:h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all text-sm md:text-base"
              >
                Save
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="bg-red-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold hover:bg-red-600 transition-all text-sm md:text-base"
              >
                Delete
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold hover:bg-gray-600 transition-all text-sm md:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2 min-w-0 pr-10">
                {task.progress === 100 ? (
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 flex-shrink-0" />
                ) : task.progress > 0 ? (
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-purple-400 flex-shrink-0" />
                ) : (
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                )}
                <h3 className="text-white font-bold text-base md:text-lg truncate">{task.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{getTimeAgo(task.updatedAt || task.createdAt)}</span>
            </div>

            <div className="mb-3 md:mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-xs md:text-sm font-semibold">{getStatusText()}</span>
                <span className="text-2xl md:text-3xl font-bold text-white">{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 md:h-4 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getStatusColor()} transition-all duration-500 rounded-full relative overflow-hidden`}
                  style={{ width: `${task.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function ProgressBoard() {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [achievement, setAchievement] = useState(null);
  const [currentPage, setCurrentPage] = useState('board');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const result = await window.storage.list('task:');
      if (result && result.keys) {
        const loadedTasks = await Promise.all(
          result.keys.map(async (key) => {
            const data = await window.storage.get(key);
            return data ? JSON.parse(data.value) : null;
          })
        );
        setTasks(loadedTasks.filter(Boolean));
      }
    } catch (error) {
      console.log('No existing tasks found');
      setTasks([]);
    }
  };

  const saveTasks = async (updatedTasks) => {
    for (const task of updatedTasks) {
      await window.storage.set(`task:${task.id}`, JSON.stringify(task));
    }
  };

  const addTask = async () => {
    if (newTaskName.trim()) {
      const newTask = {
        id: Date.now().toString(),
        name: newTaskName,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      setNewTaskName('');
      setShowAddForm(false);
    }
  };

  const updateTask = async (id, updates) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    const updatedTask = updatedTasks.find(t => t.id === id);
    if (updatedTask && updatedTask.progress === 100) {
      const wasAlreadyComplete = tasks.find(t => t.id === id)?.progress === 100;
      if (!wasAlreadyComplete) {
        const achievementTask = { 
          ...updatedTask, 
          completedAt: new Date().toISOString(),
          icon: updatedTask.icon || 'Trophy',
          achievementName: updatedTask.achievementName || updatedTask.name,
          achievementTitle: updatedTask.achievementTitle || 'Master'
        };
        setAchievement(achievementTask);
        const taskIndex = updatedTasks.findIndex(t => t.id === id);
        updatedTasks[taskIndex] = achievementTask;
        await saveTasks(updatedTasks);
      }
    }
  };

  const deleteTask = async (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    await window.storage.delete(`task:${id}`);
  };

  const notStarted = tasks.filter(t => t.progress === 0);
  const inProgress = tasks.filter(t => t.progress > 0 && t.progress < 100).sort((a, b) => 
    new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  );
  const recentInProgress = inProgress.slice(0, 2);
  const completed = tasks.filter(t => t.progress === 100).sort((a, b) => 
    new Date(b.completedAt || b.updatedAt) - new Date(a.completedAt || a.updatedAt)
  );
  const recentCompleted = completed.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <style>
        {`
          @keyframes slide-in {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in {
            animation: slide-in 0.5s ease-out;
          }
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #a855f7, #ec4899);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
          }
          @media (min-width: 768px) {
            .slider::-webkit-slider-thumb {
              width: 24px;
              height: 24px;
            }
          }
        `}
      </style>

      {achievement && (
        <AchievementToast
          task={achievement}
          onClose={() => setAchievement(null)}
        />
      )}

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12 max-w-7xl">
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-2 md:mb-4">
            Achievement Board
          </h1>
          <p className="text-gray-300 text-base md:text-xl">Track your goals, unlock achievements, level up! 🚀</p>
        </div>

        <div className="flex justify-center gap-2 md:gap-4 mb-6 md:mb-8 flex-wrap">
          <button
            onClick={() => setCurrentPage('board')}
            className={`px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base transition-all ${
              currentPage === 'board'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Goal Board
          </button>
          <button
            onClick={() => setCurrentPage('inprogress')}
            className={`px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base transition-all flex items-center gap-2 ${
              currentPage === 'inprogress'
                ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
            In Progress ({inProgress.length})
          </button>
          <button
            onClick={() => setCurrentPage('achievements')}
            className={`px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base transition-all flex items-center gap-2 ${
              currentPage === 'achievements'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Trophy className="w-4 h-4 md:w-5 md:h-5" />
            Achievements ({completed.length})
          </button>
        </div>

        {currentPage === 'board' ? (
          <>
            <div className="flex justify-center mb-8 md:mb-12">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg flex items-center gap-2 md:gap-3 hover:scale-110 transition-transform shadow-lg hover:shadow-2xl"
                >
                  <Plus className="w-5 h-5 md:w-6 md:h-6" />
                  Add New Goal
                </button>
              ) : (
                <div className="bg-gray-800 p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-md">
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="What's your next goal?"
                    className="w-full bg-gray-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg border-2 border-purple-500 focus:outline-none focus:border-pink-500 text-base md:text-lg mb-3 md:mb-4"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={addTask}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all text-sm md:text-base"
                    >
                      Create Goal
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewTaskName('');
                      }}
                      className="flex-1 bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-gray-600 transition-all text-sm md:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div>
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Not Started</h2>
                  <span className="bg-gray-700 text-white px-3 py-1 rounded-full font-bold text-sm md:text-base">{notStarted.length}</span>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {notStarted.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                      showEditButton={true}
                    />
                  ))}
                  {notStarted.length === 0 && (
                    <div className="text-gray-500 text-center py-8 italic text-sm md:text-base">No pending goals</div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">In Progress</h2>
                  <span className="bg-purple-700 text-white px-3 py-1 rounded-full font-bold text-sm md:text-base">{recentInProgress.length}</span>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {recentInProgress.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                      showEditButton={true}
                    />
                  ))}
                  {recentInProgress.length === 0 && (
                    <div className="text-gray-500 text-center py-8 italic text-sm md:text-base">Start working on a goal!</div>
                  )}
                  {inProgress.length > 2 && (
                    <button
                      onClick={() => setCurrentPage('inprogress')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all text-sm md:text-base"
                    >
                      View All {inProgress.length} In Progress →
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Recent Wins</h2>
                  <span className="bg-yellow-600 text-white px-3 py-1 rounded-full font-bold text-sm md:text-base">{recentCompleted.length}</span>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {recentCompleted.map(task => (
                    <AchievementCard
                      key={task.id}
                      achievement={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                      compact={true}
                      showDelete={false}
                    />
                  ))}
                  {recentCompleted.length === 0 && (
                    <div className="text-gray-500 text-center py-8 italic text-sm md:text-base">Complete a goal to unlock achievements! 🏆</div>
                  )}
                  {completed.length > 3 && (
                    <button
                      onClick={() => setCurrentPage('achievements')}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-4 py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all text-sm md:text-base"
                    >
                      View All {completed.length} Achievements →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {tasks.length === 0 && (
              <div className="text-center mt-12 md:mt-16">
                <div className="text-5xl md:text-6xl mb-4">🎯</div>
                <p className="text-gray-400 text-lg md:text-xl">Your achievement board is empty. Add your first goal to get started!</p>
              </div>
            )}
          </>
        ) : currentPage === 'inprogress' ? (
          <div>
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-400 to-purple-500 px-6 md:px-8 py-3 md:py-4 rounded-full mb-4">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
                <span className="text-white font-black text-xl md:text-2xl">All In Progress</span>
              </div>
              <p className="text-gray-300 text-sm md:text-base">Keep pushing forward! 💪</p>
            </div>

            {inProgress.length === 0 ? (
              <div className="text-center mt-12 md:mt-16">
                <div className="text-5xl md:text-6xl mb-4">⚡</div>
                <p className="text-gray-400 text-lg md:text-xl">No tasks in progress. Start working on a goal!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {inProgress.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    compact={true}
                    showEditButton={true}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 px-6 md:px-8 py-3 md:py-4 rounded-full mb-4">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-gray-900" />
                <span className="text-gray-900 font-black text-xl md:text-2xl">Achievement Collection</span>
              </div>
              <p className="text-gray-300 text-sm md:text-base">All your completed goals and unlocked achievements!</p>
            </div>

            {completed.length === 0 ? (
              <div className="text-center mt-12 md:mt-16">
                <div className="text-5xl md:text-6xl mb-4">🏆</div>
                <p className="text-gray-400 text-lg md:text-xl">No achievements yet. Complete your first goal to unlock one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {completed.map(task => (
                  <AchievementCard
                    key={task.id}
                    achievement={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    showDelete={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}