'use client';

import { useState, useEffect } from 'react';

type Profile = {
  id: string;
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  hobbies: string;
  freeTime: string;
  musicArtists: string;
  musicGenres: string;
  showsMovies: string;
  favoriteShowsMovies: string;
  systemPrompt: string;
  active: boolean;
};

export default function Home() {
  const [screen, setScreen] = useState<'welcome' | 'settings'>('welcome');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const [ai, setAi] = useState<'grok' | 'chatgpt'>('grok');

  // Форма
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [freeTime, setFreeTime] = useState('');
  const [musicArtists, setMusicArtists] = useState('');
  const [musicGenres, setMusicGenres] = useState('');
  const [showsMovies, setShowsMovies] = useState('');
  const [favoriteShowsMovies, setFavoriteShowsMovies] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState('Пользователь');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Статистика (пока статичная — можно заменить fetch)
  const totalRegistered = profiles.length > 0 ? profiles.length : 12473;
  const messagesSentByUser = 842;

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;
      if (user) {
        setUserName([user.first_name, user.last_name].filter(Boolean).join(' ') || 'Пользователь');
        if (user.photo_url) {
          setAvatarUrl(user.photo_url);
        }
      }
    } else {
      setUserName('Арина');
      setAvatarUrl('https://t.me/i/userpic/320/default_avatar.svg');
    }
  }, []);

  const isFormValid = () => {
    const h = Number(height);
    const w = Number(weight);

    return (
      name.trim() !== '' &&
      age.trim() !== '' &&
      gender.trim() !== '' &&
      weight.trim() !== '' &&
      height.trim() !== '' &&
      hobbies.trim() !== '' &&
      freeTime.trim() !== '' &&
      musicArtists.trim() !== '' &&
      musicGenres.trim() !== '' &&
      showsMovies.trim() !== '' &&
      favoriteShowsMovies.trim() !== '' &&
      systemPrompt.trim() !== '' &&
      !isNaN(h) && h >= 140 &&
      !isNaN(w) && w >= 40
    );
  };

  const saveProfile = async () => {
    if (!isFormValid()) {
      alert('Заполни все поля! Рост ≥ 140 см, вес ≥ 40 кг');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    const profileData = {
      name,
      age,
      gender,
      weight,
      height,
      hobbies,
      freeTime,
      musicArtists,
      musicGenres,
      showsMovies,
      favoriteShowsMovies,
      systemPrompt,
      ai,
    };

    try {
      // Имитация запроса на бэкенд
      await new Promise(resolve => setTimeout(resolve, 1200));

      const newProfile = {
        id: Date.now().toString(),
        ...profileData,
        active: profiles.length === 0,
      };

      setProfiles([...profiles, newProfile]);
      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
        setScreen('welcome');
      }, 2200);
    } catch (err) {
      alert('Ошибка сохранения');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const editProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setName(profile.name);
    setAge(profile.age);
    setGender(profile.gender);
    setWeight(profile.weight);
    setHeight(profile.height);
    setHobbies(profile.hobbies);
    setFreeTime(profile.freeTime);
    setMusicArtists(profile.musicArtists);
    setMusicGenres(profile.musicGenres);
    setShowsMovies(profile.showsMovies);
    setFavoriteShowsMovies(profile.favoriteShowsMovies);
    setSystemPrompt(profile.systemPrompt);
    setScreen('settings');
  };

  const deleteProfile = (id: string) => {
    if (confirm('Удалить этого пользователя?')) {
      const filtered = profiles.filter(p => p.id !== id);
      if (filtered.length > 0 && !filtered.some(p => p.active)) {
        filtered[0].active = true;
      }
      setProfiles(filtered);
    }
  };

  const toggleActive = (id: string) => {
    const activeCount = profiles.filter(p => p.active).length;
    const target = profiles.find(p => p.id === id);
    if (target?.active && activeCount === 1) {
      alert('Нельзя выключить единственного активного пользователя');
      return;
    }

    setProfiles(profiles.map(p =>
      p.id === id ? { ...p, active: !p.active } : p
    ));
  };

  const resetForm = () => {
    setName('');
    setAge('');
    setGender('');
    setWeight('');
    setHeight('');
    setHobbies('');
    setFreeTime('');
    setMusicArtists('');
    setMusicGenres('');
    setShowsMovies('');
    setFavoriteShowsMovies('');
    setSystemPrompt('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white flex flex-col items-center px-6 pt-16 pb-20">

      {screen === 'welcome' ? (
        <>
          {/* Аватар + галочка + приветствие */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Аватар" className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-5xl">👤</div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-4 border-white dark:border-[#0f0f0f]">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="mt-6 text-2xl font-medium text-center">
              Добро пожаловать, {userName}
            </h2>
          </div>

          {/* Название + индикатор */}
          <div className="w-full max-w-md flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Auto Answer Bot</h1>
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-950/40 px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-green-700 dark:text-green-400">
                {totalRegistered.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Выбор ИИ */}
          <div className="w-full max-w-md mb-10">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">Используемый ИИ</p>
            <div className="flex gap-3">
              <button
                onClick={() => setAi('grok')}
                className={`flex-1 py-3.5 rounded-xl font-medium transition-all ${
                  ai === 'grok' ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Grok
              </button>
              <button
                onClick={() => setAi('chatgpt')}
                className={`flex-1 py-3.5 rounded-xl font-medium transition-all ${
                  ai === 'chatgpt' ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                ChatGPT
              </button>
            </div>
          </div>

          {/* Сообщения пользователя */}
          <div className="w-full max-w-md text-center mb-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ты отправил сообщений с помощью бота</p>
            <p className="text-5xl font-bold">{messagesSentByUser.toLocaleString()}</p>
          </div>

          {/* Пользователи */}
          {profiles.length > 0 && (
            <div className="w-full max-w-md mb-12">
              <h3 className="text-xl font-bold mb-4 text-center">Пользователи</h3>
              <div className="space-y-4">
                {profiles.map(profile => (
                  <div key={profile.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="font-medium">{profile.name} ({profile.age} лет)</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {profile.active ? 'Активен' : 'Выключен'}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => editProfile(profile)} className="text-blue-600 dark:text-blue-400 hover:underline text-xl">
                        ⚙️
                      </button>
                      <button onClick={() => deleteProfile(profile.id)} className="text-red-600 dark:text-red-400 hover:underline text-xl">
                        🗑️
                      </button>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.active}
                          onChange={() => toggleActive(profile.id)}
                          disabled={profile.active && profiles.filter(p => p.active).length === 1}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Кнопка Настройка */}
          <button
            onClick={() => {
              resetForm();
              setEditingProfile(null);
              setScreen('settings');
            }}
            className="w-full max-w-md py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-medium text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <span className="text-xl">⚙️</span>
            Настройка
          </button>
        </>
      ) : (
        <>
          {/* Экран настроек */}
          <div className="w-full max-w-md">
            <button
              onClick={() => setScreen('welcome')}
              className="mb-8 text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-2 hover:underline"
            >
              ← Назад
            </button>

            <h2 className="text-2xl font-bold mb-8 text-center">
              {editingProfile ? 'Редактировать профиль' : 'Новый профиль'}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Имя пользователя</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Возраст</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Пол</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none">
                  <option value="">Выбери</option>
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                  <option value="other">Другое / Не хочу указывать</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Рост (см)</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none" />
                {Number(height) < 140 && height.trim() !== '' && (
                  <p className="mt-1 text-sm text-red-500">Рост должен быть не менее 140 см</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Вес (кг)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none" />
                {Number(weight) < 40 && weight.trim() !== '' && (
                  <p className="mt-1 text-sm text-red-500">Вес должен быть не менее 40 кг</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Увлечения</label>
                <input type="text" value={hobbies} onChange={e => setHobbies(e.target.value)} placeholder="аниме, йога, кофе" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Чем занимаешься в свободное время</label>
                <textarea value={freeTime} onChange={e => setFreeTime(e.target.value)} placeholder="гуляю с собакой, читаю, играю в игры..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none min-h-[80px]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Любимые исполнители музыки</label>
                <input type="text" value={musicArtists} onChange={e => setMusicArtists(e.target.value)} placeholder="The Weeknd, Billie Eilish, Oxxxymiron" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Какие жанры музыки слушаешь</label>
                <input type="text" value={musicGenres} onChange={e => setMusicGenres(e.target.value)} placeholder="поп, хип-хоп, инди, рок" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Какие фильмы/сериалы смотришь</label>
                <textarea value={showsMovies} onChange={e => setShowsMovies(e.target.value)} placeholder="Marvel, аниме, корейские дорамы, криминал" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none min-h-[80px]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Любимые фильмы/сериалы</label>
                <input type="text" value={favoriteShowsMovies} onChange={e => setFavoriteShowsMovies(e.target.value)} placeholder="Интерстеллар, Ведьмак, Тетрадь смерти" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">System Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={e => setSystemPrompt(e.target.value)}
                  placeholder="Ты молодая девушка 22 лет, пишешь парню 25 лет, который тебе нравится, хочешь флиртовать легко и игриво..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black focus:ring-0 outline-none min-h-[120px]"
                />
              </div>
            </div>

            <div className="mt-10 relative">
              <button
                disabled={!isFormValid() || isSaving}
                onClick={editingProfile ? updateProfile : saveProfile}
                className={`w-full py-4 rounded-2xl font-medium text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                  isFormValid() && !isSaving
                    ? 'bg-black text-white dark:bg-white dark:text-black hover:shadow-xl'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    Сохраняем...
                  </>
                ) : saveSuccess ? (
                  <span className="flex items-center gap-3 text-xl">
                    ✓ Профиль сохранён!
                  </span>
                ) : (
                  editingProfile ? 'Сохранить изменения' : 'Сохранить профиль'
                )}
              </button>

              {saveSuccess && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5 }}
                    transition={{ duration: 0.6, yoyo: Infinity }}
                    className="text-6xl"
                  >
                    🎉
                  </motion.span>
                </div>
              )}
            </div>

            {!isFormValid() && !isSaving && !saveSuccess && (
              <p className="mt-3 text-center text-sm text-red-500">
                Заполни все поля. Рост ≥ 140 см, вес ≥ 40 кг
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}