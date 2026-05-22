import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';

// Pre-configured Clan data
const CLAN_OPTIONS = {
  'Banu Haqim': { category: 'Lineage', desc: 'Judges of transgression, intellectuals and lawyers, assassins and blood sorcerers...' },
  'Brujah': { category: 'Lineage', desc: 'Fighters against the system, rebels against injustice, petty criminals, raging rabble...' },
  'Gangrel': { category: 'Lineage', desc: 'The clan closest to their inner Beast, from feral soldiers to folkloric travelers...' },
  'Hecata': { category: 'Lineage', desc: 'Necromancers, Graverobbers, Lazarenes. The Hecata are as much a Family as they are a Clan...' },
  'Lasombra': { category: 'Lineage', desc: 'Winners at life, religious figures, manipulative shadow masters, social climbers...' },
  'Malkavian': { category: 'Lineage', desc: 'Seers and jesters affected by supernatural madness, psychological masters...' },
  'The Ministry': { category: 'Lineage', desc: 'The rebranded Followers of Set, both liars and liberators, seekers of freedom...' },
  'Nosferatu': { category: 'Lineage', desc: 'Permanently afflicted by supernatural hideousness, they hide in the dark as gatherers of secrets...' },
  'Ravnos': { category: 'Lineage', desc: 'A nomadic clan of masters of misdirection, these rogues and illusionists prefer subtler methods...' },
  'Salubri': { category: 'Lineage', desc: 'Few exist in the modern nights; carefully chosen by their sire to complete a task...' },
  'Toreador': { category: 'Lineage', desc: 'Seekers of emotion, romance, cruelty, beauty… anything that can remind them of lost humanity.' },
  'Tremere': { category: 'Lineage', desc: 'Scholars and counsellors of the occult; the warlocks guard their secrets of sorcery.' },
  'Tzimisce': { category: 'Lineage', desc: 'The Dragons of Kindred, this clan embraces to own. They aim simply to control.' },
  'Ventrue': { category: 'Lineage', desc: 'Vampiric aristocracy, guardians of the Traditions and a pillar of the Camarilla.' },
  'Caitiff': { category: 'Clanless', desc: 'Clanless and curse-less, outcast by Kindred belonging to any true lineage.' },
  'Thin-blood': { category: 'Clanless', desc: 'With the thickness of vitae dwindling, the Duskborn are too far removed from Caine to share his curse.' }
};

// Powered by local proxy for portal assets, and local direct files for Discord/Logo assets
const POWER_OPTIONS = {
  none: { name: 'Empty Slot', img: 'https://placehold.co/150x150/18181b/3f3f46?text=Empty', desc: 'No power selected for this slot.' },
  potence: { name: 'Potence / Protean', img: '/portal-assets/img/disciplines/Potence-rombo.png', desc: 'Fist/Close combat: Gives 5 + Discipline Level MPT.' },
  presence: { name: 'Presence / Dominate', img: '/portal-assets/img/disciplines/Presence-rombo.png', desc: 'Social combat / Commanding: Gives 5 + Discipline Level MPT.' },
  celerity: { name: 'Celerity', img: '/portal-assets/img/disciplines/Celerity-rombo.png', desc: 'Improves DA: Default DA + (Celerity Dots / 2 rounded up).' },
  fortitude: { name: 'Fortitude', img: '/portal-assets/img/disciplines/Fortitude-rombo.png', desc: 'Improves HP or WD: Default + (Fortitude Dots / 2 rounded up).' },
  auspex: { name: 'Auspex', img: '/portal-assets/img/disciplines/Auspex-rombo.png', desc: 'Sensory awareness and extrasensory perception.' },
  obfuscate: { name: 'Obfuscate', img: '/portal-assets/img/disciplines/Obfuscate-rombo.png', desc: 'Allows hiding in plain sight and blending into shadows.' },
  
  // Using Local Native Images!
  occult: { name: 'Occult Skill', img: '/img/occult.png', desc: 'Access to Occult Plot (3:00-4:00 AM). Requires Occult skill >= 3.' },
  firearms: { name: 'Firearms Skill', img: '/img/firearms.png', desc: 'Ability to use the Firearms Combat System. Requires Firearms >= 3.' },
  
  custom: { name: '★ Custom Upload / URL...', img: '', desc: 'Upload a file directly from your machine or paste a direct link address.' }
};

const BadgeGenerator = () => {
  const badgeRef = useRef(null);

  const [character, setCharacter] = useState({
    name: 'Γιαννάκης',
    clan: 'Nosferatu',
    da: '5',
    wd: '6',
    hp: '2',
    powerKey1: 'potence',
    powerKey2: 'obfuscate',
    customImgUrl1: '',
    customImgUrl2: '',
    customType1: 'upload', 
    customType2: 'upload'
  });

  const [badgeTheme, setBadgeTheme] = useState('dark');

  const activePower1 = POWER_OPTIONS[character.powerKey1] || POWER_OPTIONS.none;
  const activePower2 = POWER_OPTIONS[character.powerKey2] || POWER_OPTIONS.none;
  const currentClanInfo = CLAN_OPTIONS[character.clan];

  const getPowerImage = (key, slotNum) => {
    if (key === 'custom') {
      return slotNum === 1 ? character.customImgUrl1 : character.customImgUrl2;
    }
    return (POWER_OPTIONS[key] || POWER_OPTIONS.none).img;
  };

  const img1 = getPowerImage(character.powerKey1, 1);
  const img2 = getPowerImage(character.powerKey2, 2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to handle the +/- buttons
  const adjustStat = (statName, delta) => {
    setCharacter((prev) => {
      const currentVal = parseInt(prev[statName], 10) || 0;
      return { ...prev, [statName]: String(currentVal + delta) };
    });
  };

  const handleFileUpload = (e, slotNum) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const fieldName = slotNum === 1 ? 'customImgUrl1' : 'customImgUrl2';
      setCharacter((prev) => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const downloadBadge = useCallback(() => {
    if (badgeRef.current === null) return;
    toPng(badgeRef.current, { 
      cacheBust: true,
      style: { transform: 'scale(1)' },
      pixelRatio: 2 // High-res export
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${character.name || 'badge'}_badge.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Error generating image:', err));
  }, [badgeRef, character.name]);

  // UI Form Classes
  const inputClass = "w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-colors font-medium";
  const selectClass = "w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-colors text-sm font-medium";

  // Official ATT LARP Logo from local files!
  const LOGO_URL = "/img/att-logo2.png";

  // Dynamic Theme Variables for the Output Badge
  const isDark = badgeTheme === 'dark';
  const tBg = isDark ? 'bg-gradient-to-b from-zinc-800 to-zinc-950 border-zinc-700/50' : 'bg-white border-gray-300';
  const tInnerBorder = isDark ? 'border-zinc-600/30' : 'border-gray-200';
  const tHeaderBorder = isDark ? 'border-zinc-700' : 'border-gray-300';
  const tTextMain = isDark ? 'text-zinc-100' : 'text-gray-900';
  const tTextSub = isDark ? 'text-zinc-400' : 'text-gray-500';
  
  const tDaBlock = isDark ? 'bg-gradient-to-br from-cyan-950 to-slate-950 border-cyan-900/50 text-cyan-50' : 'bg-blue-600 border-blue-700 text-white shadow-inner';
  const tDaTextSub = isDark ? 'text-cyan-500/80' : 'text-blue-200';
  const tHpBlock = isDark ? 'bg-gradient-to-br from-rose-950 to-zinc-950 border-rose-900/50 text-rose-50' : 'bg-red-600 border-red-700 text-white shadow-inner';
  const tHpTextSub = isDark ? 'text-rose-500/80' : 'text-red-200';

  const tPowerBlock = isDark ? 'bg-zinc-900/80 border-zinc-700/60 shadow-inner' : 'bg-gray-50 border-gray-300 shadow-sm';
  const tPowerImgWrap = isDark ? '' : 'bg-white border border-gray-200 rounded p-1 shadow-sm';
  const tPowerText = isDark ? 'text-zinc-300' : 'text-gray-800';
  
  const tFooterBorder = isDark ? 'border-zinc-700/60' : 'border-gray-300';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 py-12 px-4 sm:px-6 font-sans selection:bg-red-900 selection:text-white flex flex-col justify-between">
      <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto items-start w-full">
        
        {/* LEFT: FORM INPUT CONTROLS */}
        <div className="w-full lg:w-7/12 bg-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
          
          <div className="relative flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-serif font-bold text-zinc-100 tracking-wide">Storyteller Vault</h2>
              <p className="text-sm text-zinc-400 mt-1 uppercase tracking-widest">Digital Badge Forge</p>
            </div>
          </div>
          
          <div className="space-y-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Kindred Name</label>
                <input type="text" name="name" value={character.name} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Lineage</label>
                <select name="clan" value={character.clan} onChange={handleInputChange} className={selectClass}>
                  <optgroup label="True Lineages" className="bg-zinc-900 text-zinc-300">
                    {Object.keys(CLAN_OPTIONS).filter(k => CLAN_OPTIONS[k].category === 'Lineage').map(clan => (
                      <option key={clan} value={clan}>{clan}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Clanless / Duskborn" className="bg-zinc-900 text-zinc-400 italic">
                    {Object.keys(CLAN_OPTIONS).filter(k => CLAN_OPTIONS[k].category === 'Clanless').map(clan => (
                      <option key={clan} value={clan}>{clan}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {currentClanInfo && (
              <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/80 border-l-4 border-l-red-900 text-sm leading-relaxed shadow-inner">
                <strong className="text-zinc-300 block uppercase font-bold tracking-widest text-[10px] mb-1.5">{character.clan}</strong>
                <span className="text-zinc-400 italic">{currentClanInfo.desc}</span>
              </div>
            )}

            {/* COMBAT STATS - NOW WITH +/- ARROWS */}
            <div className="grid grid-cols-3 gap-5">
              
              {/* DA Controls */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-cyan-700/80 mb-2">DA (Defense)</label>
                <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg focus-within:border-red-900 focus-within:ring-1 focus-within:ring-red-900 transition-colors overflow-hidden">
                  <button type="button" onClick={() => adjustStat('da', -1)} className="px-3 py-2 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 transition text-xl font-black select-none leading-none outline-none">&minus;</button>
                  <input type="text" name="da" value={character.da} onChange={handleInputChange} className="w-full p-2 bg-transparent text-center text-cyan-400 text-xl font-bold focus:outline-none" />
                  <button type="button" onClick={() => adjustStat('da', 1)} className="px-3 py-2 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 transition text-xl font-black select-none leading-none outline-none">&#43;</button>
                </div>
              </div>

              {/* WD Controls */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-cyan-700/80 mb-2">WD (Willpower)</label>
                <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg focus-within:border-red-900 focus-within:ring-1 focus-within:ring-red-900 transition-colors overflow-hidden">
                  <button type="button" onClick={() => adjustStat('wd', -1)} className="px-3 py-2 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 transition text-xl font-black select-none leading-none outline-none">&minus;</button>
                  <input type="text" name="wd" value={character.wd} onChange={handleInputChange} className="w-full p-2 bg-transparent text-center text-cyan-400 text-xl font-bold focus:outline-none" />
                  <button type="button" onClick={() => adjustStat('wd', 1)} className="px-3 py-2 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 transition text-xl font-black select-none leading-none outline-none">&#43;</button>
                </div>
              </div>

              {/* HP Controls */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-rose-700/80 mb-2">HP (Health)</label>
                <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg focus-within:border-red-900 focus-within:ring-1 focus-within:ring-red-900 transition-colors overflow-hidden">
                  <button type="button" onClick={() => adjustStat('hp', -1)} className="px-3 py-2 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 transition text-xl font-black select-none leading-none outline-none">&minus;</button>
                  <input type="text" name="hp" value={character.hp} onChange={handleInputChange} className="w-full p-2 bg-transparent text-center text-rose-500 text-xl font-bold focus:outline-none" />
                  <button type="button" onClick={() => adjustStat('hp', 1)} className="px-3 py-2 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 transition text-xl font-black select-none leading-none outline-none">&#43;</button>
                </div>
              </div>

            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* BOX 3 POWER PANEL */}
              <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 shadow-inner flex flex-col justify-between space-y-3">
                <div>
                  <span className="block text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2">Primary Discipline</span>
                  <select name="powerKey1" value={character.powerKey1} onChange={handleInputChange} className={selectClass}>
                    {Object.keys(POWER_OPTIONS).map((key) => (
                      <option key={key} value={key} className="bg-zinc-900">{POWER_OPTIONS[key].name}</option>
                    ))}
                  </select>

                  {character.powerKey1 === 'custom' && (
                    <div className="space-y-3 mt-3 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                      <div className="flex gap-4 items-center text-xs text-zinc-400">
                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200 transition">
                          <input type="radio" name="customType1" value="upload" checked={character.customType1 === 'upload'} onChange={handleInputChange} className="accent-red-800" /> Upload
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200 transition">
                          <input type="radio" name="customType1" value="url" checked={character.customType1 === 'url'} onChange={handleInputChange} className="accent-red-800" /> URL
                        </label>
                      </div>
                      {character.customType1 === 'upload' ? (
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 1)} className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 transition" />
                      ) : (
                        <input type="text" name="customImgUrl1" value={character.customImgUrl1} onChange={handleInputChange} placeholder="https://..." className={`${inputClass} !p-1.5 !text-xs`} />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 italic leading-relaxed pt-2 border-t border-zinc-800/60">{activePower1.desc}</p>
              </div>

              {/* BOX 4 POWER PANEL */}
              <div className="p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 shadow-inner flex flex-col justify-between space-y-3">
                <div>
                  <span className="block text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2">Secondary Discipline</span>
                  <select name="powerKey2" value={character.powerKey2} onChange={handleInputChange} className={selectClass}>
                    {Object.keys(POWER_OPTIONS).map((key) => (
                      <option key={key} value={key} className="bg-zinc-900">{POWER_OPTIONS[key].name}</option>
                    ))}
                  </select>

                  {character.powerKey2 === 'custom' && (
                    <div className="space-y-3 mt-3 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                      <div className="flex gap-4 items-center text-xs text-zinc-400">
                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200 transition">
                          <input type="radio" name="customType2" value="upload" checked={character.customType2 === 'upload'} onChange={handleInputChange} className="accent-red-800" /> Upload
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200 transition">
                          <input type="radio" name="customType2" value="url" checked={character.customType2 === 'url'} onChange={handleInputChange} className="accent-red-800" /> URL
                        </label>
                      </div>
                      {character.customType2 === 'upload' ? (
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 2)} className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 transition" />
                      ) : (
                        <input type="text" name="customImgUrl2" value={character.customImgUrl2} onChange={handleInputChange} placeholder="https://..." className={`${inputClass} !p-1.5 !text-xs`} />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 italic leading-relaxed pt-2 border-t border-zinc-800/60">{activePower2.desc}</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: LIVE RENDERING BADGE CARD PREVIEW */}
        <div className="w-full lg:w-5/12 flex flex-col items-center justify-start bg-zinc-900/30 p-8 rounded-2xl border border-dashed border-zinc-800 min-h-[500px]">
          
          {/* THEME TOGGLER */}
          <div className="flex gap-3 items-center mb-6 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
            <button 
              onClick={() => setBadgeTheme('dark')} 
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition ${isDark ? 'bg-zinc-800 text-zinc-100 shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Dark Print
            </button>
            <button 
              onClick={() => setBadgeTheme('light')} 
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition ${!isDark ? 'bg-zinc-200 text-zinc-900 shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Light Print
            </button>
          </div>
          
          {/* THE PHYSICAL BADGE OUTPUT CONTAINER */}
          <div 
            ref={badgeRef} 
            className={`w-[300px] h-[450px] ${tBg} p-4 flex flex-col rounded-xl shadow-2xl border-2 relative overflow-hidden transition-colors duration-300`}
            style={{ boxSizing: 'border-box' }}
          >
            <div className={`absolute inset-1.5 border ${tInnerBorder} rounded-lg pointer-events-none`}></div>

            {/* Header */}
            <div className={`text-center pb-3 mb-4 mt-2 border-b ${tHeaderBorder} relative z-10`}>
              <div className={`text-2xl font-serif font-bold tracking-wide ${tTextMain}`}>{character.name}</div>
              <div className={`text-xs font-serif italic ${tTextSub} mt-1 tracking-widest uppercase`}>{character.clan}</div>
            </div>

            {/* Grid Frame */}
            <div className="flex-1 flex flex-col gap-3 relative z-10 px-1">
              
              {/* Combat Stats */}
              <div className="grid grid-cols-2 gap-3 h-24">
                <div className={`${tDaBlock} p-2 flex flex-col items-center justify-center rounded-lg border`}>
                  <span className={`text-[9px] font-bold tracking-widest ${tDaTextSub} uppercase mb-0.5`}>DA / WD</span>
                  <span className="text-3xl font-serif">{character.da}<span className="opacity-50 mx-1 font-sans text-2xl">/</span>{character.wd}</span>
                </div>

                <div className={`${tHpBlock} p-2 flex flex-col items-center justify-center rounded-lg border`}>
                  <span className={`text-[9px] font-bold tracking-widest ${tHpTextSub} uppercase mb-0.5`}>Health</span>
                  <span className="text-4xl font-serif">{character.hp}</span>
                </div>
              </div>

              {/* Disciplines */}
              <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
                <div className={`${tPowerBlock} rounded-lg p-2 flex flex-col items-center justify-between overflow-hidden border`}>
                  <div className={`w-full flex-1 flex items-center justify-center overflow-hidden mb-2 ${tPowerImgWrap}`}>
                    {img1 ? (
                      <img src={img1} alt="Power 1" className="max-w-full max-h-full object-contain drop-shadow-sm" crossOrigin="anonymous" />
                    ) : (
                      <div className="text-[10px] text-zinc-400 italic">Empty</div>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest text-center truncate w-full uppercase ${tPowerText}`}>
                    {character.powerKey1 === 'custom' ? 'Custom' : POWER_OPTIONS[character.powerKey1].name.split(' / ')[0]}
                  </span>
                </div>

                <div className={`${tPowerBlock} rounded-lg p-2 flex flex-col items-center justify-between overflow-hidden border`}>
                  <div className={`w-full flex-1 flex items-center justify-center overflow-hidden mb-2 ${tPowerImgWrap}`}>
                    {img2 ? (
                      <img src={img2} alt="Power 2" className="max-w-full max-h-full object-contain drop-shadow-sm" crossOrigin="anonymous" />
                    ) : (
                      <div className="text-[10px] text-zinc-400 italic">Empty</div>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest text-center truncate w-full uppercase ${tPowerText}`}>
                    {character.powerKey2 === 'custom' ? 'Custom' : POWER_OPTIONS[character.powerKey2].name.split(' / ')[0]}
                  </span>
                </div>
              </div>

            </div>

            {/* Footer Row */}
            <div className={`mt-3 pt-3 border-t ${tFooterBorder} flex justify-between items-center px-2 relative z-10`}>
              <span className={`text-[10px] font-bold tracking-widest ${tTextSub} uppercase`}>S1F</span>
              
              <div className="h-6 flex items-center justify-center">
                <img 
                  src={LOGO_URL} 
                  alt="ATT LARP Logo" 
                  className={`max-h-full max-w-[100px] object-contain ${isDark ? 'opacity-90 drop-shadow-lg' : 'opacity-100'}`}
                  crossOrigin="anonymous"
                />
              </div>

              <span className={`text-[10px] font-bold tracking-wider ${tTextSub} uppercase`}>attlarp.gr</span>
            </div>
          </div>

          <button 
            onClick={downloadBadge} 
            className="w-full max-w-[300px] mt-6 relative group overflow-hidden bg-zinc-800 text-zinc-100 font-bold py-4 px-4 rounded-xl border border-zinc-700 hover:border-red-900/50 transition-all duration-300 shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-950 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Forge Badge (.PNG)
            </span>
          </button>
        </div>

      </div>

      {/* Global Page Footer */}
      <footer className="mt-16 text-center w-full">
        <p className="text-xs font-bold tracking-widest uppercase text-zinc-600">
          Engineered & Crafted by <a href="https://miketsak.gr" target="_blank" rel="noopener noreferrer" className="text-red-800 hover:text-red-500 transition-colors ml-1">miketsak.gr</a>
        </p>
      </footer>
    </div>
  );
};

export default BadgeGenerator;