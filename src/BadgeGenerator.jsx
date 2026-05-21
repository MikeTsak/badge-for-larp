import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';

// [CLAN_OPTIONS and POWER_OPTIONS remain exactly the same logically]
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

const POWER_OPTIONS = {
  none: { name: 'Empty Slot', img: 'https://placehold.co/150x150/18181b/3f3f46?text=Empty', desc: 'No power selected for this slot.' },
  potence: { name: 'Potence / Protean', img: '/portal-assets/img/disciplines/Potence-rombo.png', desc: 'Fist/Close combat: Gives 5 + Discipline Level MPT.' },
  presence: { name: 'Presence / Dominate', img: '/portal-assets/img/disciplines/Presence-rombo.png', desc: 'Social combat / Commanding: Gives 5 + Discipline Level MPT.' },
  celerity: { name: 'Celerity', img: '/portal-assets/img/disciplines/Celerity-rombo.png', desc: 'Improves DA: Default DA + (Celerity Dots / 2 rounded up).' },
  fortitude: { name: 'Fortitude', img: '/portal-assets/img/disciplines/Fortitude-rombo.png', desc: 'Improves HP or WD: Default + (Fortitude Dots / 2 rounded up).' },
  auspex: { name: 'Auspex', img: '/portal-assets/img/disciplines/Auspex-rombo.png', desc: 'Sensory awareness and extrasensory perception.' },
  obfuscate: { name: 'Obfuscate', img: '/portal-assets/img/disciplines/Obfuscate-rombo.png', desc: 'Allows hiding in plain sight and blending into shadows.' },
  occult: { name: 'Occult Skill', img: 'https://cdn.discordapp.com/attachments/430366494325735425/1507010379950198874/occult.png?ex=6a105849&is=6a0f06c9&hm=2be5b54b99c54171cae365a7e9f0b96ff74ff4b010d462319e90671b169e05c2&', desc: 'Access to Occult Plot (3:00-4:00 AM). Requires Occult skill >= 3.' },
  firearms: { name: 'Firearms Skill', img: 'https://cdn.discordapp.com/attachments/430366494325735425/1507010380407247057/firearms.png?ex=6a105849&is=6a0f06c9&hm=f02a17d0ac05595ddb4ffd06b48f6c4d37856562245011afb4cc0965cc05f0ce&', desc: 'Ability to use the Firearms Combat System. Requires Firearms >= 3.' },
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

  const activePower1 = POWER_OPTIONS[character.powerKey1] || POWER_OPTIONS.none;
  const activePower2 = POWER_OPTIONS[character.powerKey2] || POWER_OPTIONS.none;
  const currentClanInfo = CLAN_OPTIONS[character.clan];

  const getPowerImage = (key, slotNum) => {
    if (key === 'custom') {
      return slotNum === 1 ? character.customImgUrl1 : character.customImgUrl2;
    }
    return (POWER_OPTIONS[key] || POWER_OPTIONS.none).img;
  };

  const getPowerName = (key) => {
    return (POWER_OPTIONS[key] || POWER_OPTIONS.none).name;
  };

  const img1 = getPowerImage(character.powerKey1, 1);
  const img2 = getPowerImage(character.powerKey2, 2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
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

  const inputClass = "w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-colors font-medium";
  const selectClass = "w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-colors text-sm font-medium";

  // CHANGE THIS URL TO YOUR ACTUAL LOGO URL
  // If you drop a file named 'logo.png' into your public folder, change this to '/logo.png'
  const LOGO_URL = "https://placehold.co/100x40/18181b/71717a?text=LARP+LOGO&font=serif";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 py-12 px-4 sm:px-6 font-sans selection:bg-red-900 selection:text-white">
      <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto items-start">
        
        {/* LEFT: FORM INPUT CONTROLS */}
        <div className="w-full lg:w-7/12 bg-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
          
          <div className="relative">
            <h2 className="text-2xl font-serif font-bold text-zinc-100 tracking-wide">Storyteller Vault</h2>
            <p className="text-sm text-zinc-400 mt-1 uppercase tracking-widest">Digital Badge Forge</p>
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

            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-cyan-700/80 mb-2">DA (Defense)</label>
                <input type="text" name="da" value={character.da} onChange={handleInputChange} className={`${inputClass} text-center text-cyan-400 text-xl font-bold`} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-cyan-700/80 mb-2">WD (Willpower)</label>
                <input type="text" name="wd" value={character.wd} onChange={handleInputChange} className={`${inputClass} text-center text-cyan-400 text-xl font-bold`} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-rose-700/80 mb-2">HP (Health)</label>
                <input type="text" name="hp" value={character.hp} onChange={handleInputChange} className={`${inputClass} text-center text-rose-500 text-xl font-bold`} />
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

          <button 
            onClick={downloadBadge} 
            className="w-full relative group overflow-hidden bg-zinc-800 text-zinc-100 font-bold py-4 px-4 rounded-xl border border-zinc-700 hover:border-red-900/50 transition-all duration-300 shadow-lg mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-950 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Forge Badge (.PNG)
            </span>
          </button>
        </div>

        {/* RIGHT: LIVE RENDERING BADGE CARD PREVIEW */}
        <div className="w-full lg:w-5/12 flex flex-col items-center justify-center bg-zinc-900/30 p-8 rounded-2xl border border-dashed border-zinc-800 min-h-[500px]">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-6">Live Print Preview</span>
          
          {/* THE PHYSICAL BADGE (Increased height slightly to accommodate the footer) */}
          <div 
            ref={badgeRef} 
            className="w-[300px] h-[450px] bg-gradient-to-b from-zinc-800 to-zinc-950 p-4 flex flex-col rounded-xl shadow-2xl border-2 border-zinc-700/50 relative overflow-hidden"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Inner elegant border styling */}
            <div className="absolute inset-1.5 border border-zinc-600/30 rounded-lg pointer-events-none"></div>

            {/* Badge Header Area */}
            <div className="text-center pb-3 mb-4 mt-2 border-b border-zinc-700 relative z-10">
              <div className="text-2xl font-serif font-bold tracking-wide text-zinc-100">{character.name}</div>
              <div className="text-xs font-serif italic text-zinc-400 mt-1 tracking-widest uppercase">{character.clan}</div>
            </div>

            {/* 4 Boxes Grid Frame */}
            <div className="flex-1 flex flex-col gap-3 relative z-10 px-1">
              
              {/* Top Layer: Combat Stats */}
              <div className="grid grid-cols-2 gap-3 h-24">
                <div className="bg-gradient-to-br from-cyan-950 to-slate-950 p-2 flex flex-col items-center justify-center rounded-lg border border-cyan-900/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                  <span className="text-[9px] font-bold tracking-widest text-cyan-500/80 uppercase mb-0.5">DA / WD</span>
                  <span className="text-3xl font-serif text-cyan-50">{character.da}<span className="text-cyan-700/50 mx-1 font-sans text-2xl">/</span>{character.wd}</span>
                </div>

                <div className="bg-gradient-to-br from-rose-950 to-zinc-950 p-2 flex flex-col items-center justify-center rounded-lg border border-rose-900/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                  <span className="text-[9px] font-bold tracking-widest text-rose-500/80 uppercase mb-0.5">Health</span>
                  <span className="text-4xl font-serif text-rose-50">{character.hp}</span>
                </div>
              </div>

              {/* Bottom Layer: Disciplines */}
              <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
                <div className="bg-zinc-900/80 rounded-lg p-2 flex flex-col items-center justify-between overflow-hidden border border-zinc-700/60 shadow-inner">
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden mb-2">
                    {img1 ? (
                      <img src={img1} alt="Power 1" className="max-w-full max-h-full object-contain drop-shadow-md brightness-110" />
                    ) : (
                      <div className="text-[10px] text-zinc-600 italic">Empty</div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-center truncate w-full uppercase text-zinc-300">
                    {character.powerKey1 === 'custom' ? 'Custom' : POWER_OPTIONS[character.powerKey1].name.split(' / ')[0]}
                  </span>
                </div>

                <div className="bg-zinc-900/80 rounded-lg p-2 flex flex-col items-center justify-between overflow-hidden border border-zinc-700/60 shadow-inner">
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden mb-2">
                    {img2 ? (
                      <img src={img2} alt="Power 2" className="max-w-full max-h-full object-contain drop-shadow-md brightness-110" />
                    ) : (
                      <div className="text-[10px] text-zinc-600 italic">Empty</div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-center truncate w-full uppercase text-zinc-300">
                    {character.powerKey2 === 'custom' ? 'Custom' : POWER_OPTIONS[character.powerKey2].name.split(' / ')[0]}
                  </span>
                </div>
              </div>

            </div>

            {/* OFFICIAL FOOTER: S1F, Logo, Web Address */}
            <div className="mt-3 pt-3 border-t border-zinc-700/60 flex justify-between items-center px-2 relative z-10">
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">S1F</span>
              
              <div className="h-6 flex items-center justify-center">
                {/* Logo Image */}
                <img 
                  src={LOGO_URL} 
                  alt="ATT LARP Logo" 
                  className="max-h-full max-w-[80px] object-contain opacity-80 mix-blend-screen"
                  crossOrigin="anonymous"
                />
              </div>

              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">attlarp.gr</span>
            </div>

          </div>
          <p className="mt-6 text-zinc-500 text-xs italic text-center max-w-[300px]">The downloaded image scales automatically to a crisp, print-ready high resolution format.</p>
        </div>

      </div>
    </div>
  );
};

export default BadgeGenerator;