(() => {
  "use strict";

  const STORAGE_KEYS = {
    enabled: "projectMonolith.audio.enabled",
    volume: "projectMonolith.audio.volume"
  };

  const DEFAULT_VOLUME = 0.55;

  const SOUND_LIBRARY = {
    monolithAmbience: {
      src: "assets/audio/monolith-ambience.ogg",
      gain: 0.22,
      group: "ambience",
      priority: 5,
      cooldown: 0,
      loop: true
    },
    stoneOpen: {
      src: "assets/audio/stone-open.ogg",
      gain: 0.68,
      group: "stone",
      priority: 70,
      cooldown: 900
    },
    vathkulRiser: {
      src: "assets/audio/vathkul-riser.ogg",
      gain: 0.48,
      group: "cinematic",
      priority: 95,
      cooldown: 7000
    },
    blackholeImpact: {
      src: "assets/audio/blackhole-impact.ogg",
      gain: 0.88,
      group: "final-impact",
      priority: 110,
      cooldown: 5000
    },
    glyphPlace: {
      src: "assets/audio/glyph-place.ogg",
      gain: 0.70,
      group: "impact",
      priority: 40,
      cooldown: 140
    },
    glyphRemove: {
      src: "assets/audio/glyph-remove.ogg",
      gain: 0.45,
      group: "impact",
      priority: 30,
      cooldown: 120
    },
    corruption: {
      src: "assets/audio/corruption.ogg",
      gain: 0.85,
      group: "ritual-major",
      priority: 90,
      cooldown: 900
    },
    purification: {
      src: "assets/audio/purification.ogg",
      gain: 0.65,
      group: "ritual-major",
      priority: 85,
      cooldown: 900
    },
    configurationStart: {
      src: "assets/audio/configuration-start.ogg",
      gain: 0.42,
      group: "drone",
      priority: 55,
      cooldown: 800
    },
    linkReveal: {
      src: "assets/audio/link-reveal.ogg",
      gain: 0.34,
      group: "link",
      priority: 25,
      cooldown: 70,
      maxVoices: 3
    },
    configurationSuccess: {
      src: "assets/audio/configuration-success.ogg",
      gain: 0.72,
      group: "verdict",
      priority: 80,
      cooldown: 900
    },
    configurationFailure: {
      src: "assets/audio/configuration-failure.ogg",
      gain: 0.40,
      group: "verdict",
      priority: 60,
      cooldown: 700
    },
    vathkulMessage: {
      src: "assets/audio/vathkul-message.ogg",
      gain: 0.18,
      group: "vathkul",
      priority: 20,
      cooldown: 180
    },
    finalCharge: {
      src: "assets/audio/final-charge.ogg",
      gain: 0.80,
      group: "final",
      priority: 100,
      cooldown: 1800
    },
    finalPulse: {
      src: "assets/audio/final-pulse.ogg",
      gain: 0.82,
      group: "final",
      priority: 100,
      cooldown: 600
    },
    finalFlash: {
      src: "assets/audio/final-flash.ogg",
      gain: 0.68,
      group: "final",
      priority: 100,
      cooldown: 400
    },
    finalCrack: {
      src: "assets/audio/final-crack.ogg",
      gain: 0.88,
      group: "final",
      priority: 100,
      cooldown: 1000
    },
    finalDestruction: {
      src: "assets/audio/final-destruction.ogg",
      gain: 0.92,
      group: "final",
      priority: 100,
      cooldown: 2200
    }
  };

  const buffers = new Map();
  const availability = new Map();
  const activeByGroup = new Map();
  const lastPlayedAt = new Map();
  const persistentLoops = new Map();

  let enabled = localStorage.getItem(STORAGE_KEYS.enabled) === "true";
  let volume = Number.parseFloat(localStorage.getItem(STORAGE_KEYS.volume));
  let testSequenceRunning = false;

  if (!Number.isFinite(volume)) volume = DEFAULT_VOLUME;
  volume = Math.min(1, Math.max(0, volume));

  function getDefinition(soundName) {
    return SOUND_LIBRARY[soundName] || null;
  }

  function createAudio(soundName) {
    const definition = getDefinition(soundName);
    if (!definition) return null;

    const audio = new Audio(definition.src);
    audio.preload = "auto";
    audio.volume = Math.min(1, volume * definition.gain);

    audio.addEventListener("canplaythrough", () => {
      availability.set(soundName, true);
    }, { once: true });

    audio.addEventListener("error", () => {
      availability.set(soundName, false);
      audio.dataset.unavailable = "true";
      updateMissingSoundStatus();
    }, { once: true });

    return audio;
  }

  function preload() {
    Object.keys(SOUND_LIBRARY).forEach(soundName => {
      if (!buffers.has(soundName)) {
        const audio = createAudio(soundName);
        if (audio) {
          buffers.set(soundName, audio);
          audio.load();
        }
      }
    });
  }

  function pruneGroup(groupName) {
    const voices = activeByGroup.get(groupName) || [];
    const alive = voices.filter(audio => !audio.ended && !audio.paused);
    activeByGroup.set(groupName, alive);
    return alive;
  }

  function stopGroup(groupName, fadeMs = 0) {
    const voices = pruneGroup(groupName);

    voices.forEach(audio => {
      if (fadeMs <= 0) {
        audio.pause();
        audio.currentTime = 0;
        return;
      }

      const startVolume = audio.volume;
      const startedAt = performance.now();

      function fadeFrame(now) {
        const ratio = Math.min(1, (now - startedAt) / fadeMs);
        audio.volume = startVolume * (1 - ratio);

        if (ratio < 1 && !audio.paused) {
          requestAnimationFrame(fadeFrame);
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      }

      requestAnimationFrame(fadeFrame);
    });

    activeByGroup.set(groupName, []);
  }

  function play(soundName, options = {}) {
    if (!enabled) return null;

    const definition = getDefinition(soundName);
    if (!definition) return null;

    const now = performance.now();
    const last = lastPlayedAt.get(soundName) || -Infinity;
    const cooldown = Number.isFinite(options.cooldown)
      ? options.cooldown
      : definition.cooldown || 0;

    if (now - last < cooldown) return null;

    const source = buffers.get(soundName) || createAudio(soundName);
    if (!source || source.dataset.unavailable === "true") return null;

    if (!buffers.has(soundName)) buffers.set(soundName, source);

    const group = definition.group || "default";
    const activeVoices = pruneGroup(group);
    const maxVoices = Number.isFinite(options.maxVoices)
      ? options.maxVoices
      : definition.maxVoices || 1;

    if (activeVoices.length >= maxVoices) {
      const lowerPriorityVoice = activeVoices.find(
        voice => Number(voice.dataset.priority || 0) <= definition.priority
      );

      if (lowerPriorityVoice) {
        lowerPriorityVoice.pause();
        lowerPriorityVoice.currentTime = 0;
      } else {
        return null;
      }
    }

    if (options.stopGroup === true) {
      stopGroup(group, options.fadeOutMs || 0);
    }

    const audio = source.cloneNode(true);
    audio.dataset.priority = String(
      Number.isFinite(options.priority) ? options.priority : definition.priority || 0
    );

    const eventGain = Number.isFinite(options.gain) ? options.gain : 1;
    audio.volume = Math.min(1, Math.max(0, volume * definition.gain * eventGain));

    if (Number.isFinite(options.playbackRate)) {
      audio.playbackRate = options.playbackRate;
    }

    if (Number.isFinite(options.currentTime)) {
      audio.currentTime = options.currentTime;
    }

    if (options.loop === true) {
      audio.loop = true;
    }

    activeVoices.push(audio);
    activeByGroup.set(group, activeVoices);
    lastPlayedAt.set(soundName, now);

    audio.addEventListener("ended", () => pruneGroup(group), { once: true });
    audio.addEventListener("pause", () => pruneGroup(group), { once: true });

    audio.play().catch(() => {
      availability.set(soundName, false);
      updateMissingSoundStatus();
    });

    return audio;
  }

  function startLoop(soundName, options = {}) {
    if (!enabled) return null;

    const existing = persistentLoops.get(soundName);
    if (existing && !existing.paused) return existing;

    const definition = getDefinition(soundName);
    if (!definition) return null;

    const source = buffers.get(soundName) || createAudio(soundName);
    if (!source || source.dataset.unavailable === "true") return null;
    if (!buffers.has(soundName)) buffers.set(soundName, source);

    const audio = source.cloneNode(true);
    audio.loop = true;
    audio.dataset.priority = String(definition.priority || 0);

    const eventGain = Number.isFinite(options.gain) ? options.gain : 1;
    const targetVolume = Math.min(1, Math.max(0, volume * definition.gain * eventGain));
    const fadeInMs = Number.isFinite(options.fadeInMs) ? options.fadeInMs : 0;
    audio.volume = fadeInMs > 0 ? 0 : targetVolume;

    persistentLoops.set(soundName, audio);

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        persistentLoops.delete(soundName);
      });
    }

    if (fadeInMs > 0) {
      const startedAt = performance.now();
      function fadeFrame(now) {
        if (audio.paused) return;
        const ratio = Math.min(1, (now - startedAt) / fadeInMs);
        audio.volume = targetVolume * ratio;
        if (ratio < 1) requestAnimationFrame(fadeFrame);
      }
      requestAnimationFrame(fadeFrame);
    }

    return audio;
  }

  function stopLoop(soundName, fadeOutMs = 0) {
    const audio = persistentLoops.get(soundName);
    if (!audio) return;

    if (fadeOutMs <= 0) {
      audio.pause();
      audio.currentTime = 0;
      persistentLoops.delete(soundName);
      return;
    }

    const startVolume = audio.volume;
    const startedAt = performance.now();

    function fadeFrame(now) {
      const ratio = Math.min(1, (now - startedAt) / fadeOutMs);
      audio.volume = startVolume * (1 - ratio);
      if (ratio < 1 && !audio.paused) {
        requestAnimationFrame(fadeFrame);
      } else {
        audio.pause();
        audio.currentTime = 0;
        persistentLoops.delete(soundName);
      }
    }

    requestAnimationFrame(fadeFrame);
  }

  function startMonolithAmbience() {
    return startLoop("monolithAmbience", { fadeInMs: 2000 });
  }

  function setEnabled(nextEnabled) {
    enabled = Boolean(nextEnabled);
    localStorage.setItem(STORAGE_KEYS.enabled, String(enabled));

    if (enabled) {
      preload();
      startMonolithAmbience();
    } else {
      activeByGroup.forEach((_, groupName) => stopGroup(groupName, 80));
      [...persistentLoops.keys()].forEach(soundName => stopLoop(soundName, 180));
    }

    updateControls();
  }

  function setVolume(nextVolume) {
    volume = Math.min(1, Math.max(0, Number(nextVolume)));
    localStorage.setItem(STORAGE_KEYS.volume, String(volume));
    persistentLoops.forEach((audio, soundName) => {
      const definition = getDefinition(soundName);
      if (definition) audio.volume = Math.min(1, volume * definition.gain);
    });
    updateControls();
  }

  function toggle() {
    const nextEnabled = !enabled;
    setEnabled(nextEnabled);

    if (nextEnabled) {
      playInterfaceConfirmation();
    }
  }

  function playInterfaceConfirmation() {
    if (!enabled) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(174, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(220, context.currentTime + 0.12);

      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, volume * 0.08),
        context.currentTime + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.2);
      oscillator.addEventListener("ended", () => context.close(), { once: true });
    } catch {
      // L'interface reste utilisable si WebAudio n'est pas disponible.
    }
  }

  function updateMissingSoundStatus() {
    const status = document.getElementById("audioTestStatus");
    if (!status) return;

    const missing = Object.keys(SOUND_LIBRARY).filter(
      soundName => availability.get(soundName) === false
    );

    if (missing.length > 0) {
      status.textContent = `${missing.length} fichier(s) audio manquant(s).`;
      status.dataset.state = "warning";
    } else if (!testSequenceRunning) {
      status.textContent = "";
      status.dataset.state = "idle";
    }
  }

  function updateControls() {
    const toggleButton = document.getElementById("audioToggle");
    const volumeInput = document.getElementById("audioVolume");
    const volumeValue = document.getElementById("audioVolumeValue");
    const memoryStatus = document.getElementById("audioMemoryStatus");

    if (toggleButton) {
      toggleButton.setAttribute("aria-pressed", String(enabled));
      toggleButton.classList.toggle("is-enabled", enabled);

      const icon = toggleButton.querySelector(".audio-toggle-icon");
      const label = toggleButton.querySelector(".audio-toggle-label");

      if (icon) icon.textContent = enabled ? "🔊" : "🔇";
      if (label) label.textContent = enabled ? "Son activé" : "Son coupé";
    }

    if (volumeInput) {
      const percentage = Math.round(volume * 100);
      volumeInput.value = String(percentage);
      volumeInput.disabled = !enabled;

      if (volumeValue) {
        volumeValue.textContent = `${percentage} %`;
      }
    }

    if (memoryStatus) {
      memoryStatus.textContent = enabled
        ? `Son activé · volume ${Math.round(volume * 100)} % · préférence mémorisée`
        : "Son coupé · préférence mémorisée";
      memoryStatus.dataset.enabled = String(enabled);
    }
  }

  function wait(ms) {
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }

  async function runTestSequence() {
    if (testSequenceRunning) return;

    const status = document.getElementById("audioTestStatus");
    const button = document.getElementById("testAudioSequence");

    if (!enabled) {
      if (status) {
        status.textContent = "Activez d’abord le son.";
        status.dataset.state = "warning";
      }
      return;
    }

    testSequenceRunning = true;
    if (button) button.disabled = true;

    const sequence = [
      ["glyphPlace", "Pose d’un glyphe", 900],
      ["corruption", "Corruption", 1500],
      ["purification", "Purification", 1500],
      ["linkReveal", "Révélation d’une liaison", 950],
      ["configurationSuccess", "Configuration parfaite", 1500],
      ["finalPulse", "Pulsation finale", 1100]
    ];

    for (const [soundName, label, delay] of sequence) {
      if (!testSequenceRunning) break;

      if (status) {
        status.textContent = label;
        status.dataset.state = "playing";
      }

      const played = play(soundName, {
        stopGroup: true,
        fadeOutMs: 80,
        cooldown: 0
      });

      if (!played && status) {
        status.textContent = `${label} — fichier manquant`;
        status.dataset.state = "warning";
      }

      await wait(delay);
    }

    testSequenceRunning = false;
    if (button) button.disabled = false;

    if (status) {
      status.textContent = "Test terminé.";
      status.dataset.state = "success";
    }

    window.setTimeout(updateMissingSoundStatus, 1400);
  }

  function openAudioSettings() {
    const overlay = document.getElementById("audioSettingsOverlay");
    if (!overlay) return;

    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    updateControls();
    updateMissingSoundStatus();

    window.setTimeout(() => {
      document.getElementById("audioToggle")?.focus();
    }, 20);
  }

  function closeAudioSettings() {
    const overlay = document.getElementById("audioSettingsOverlay");
    if (!overlay) return;

    testSequenceRunning = false;
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    document.getElementById("openAudioSettings")?.focus();
  }

  function initializeControls() {
    const toggleButton = document.getElementById("audioToggle");
    const volumeInput = document.getElementById("audioVolume");
    const openButton = document.getElementById("openAudioSettings");
    const closeButton = document.getElementById("closeAudioSettings");
    const closeBottomButton = document.getElementById("closeAudioSettingsBottom");
    const testButton = document.getElementById("testAudioSequence");
    const overlay = document.getElementById("audioSettingsOverlay");

    toggleButton?.addEventListener("click", toggle);
    volumeInput?.addEventListener("input", event => {
      setVolume(Number(event.target.value) / 100);
    });

    openButton?.addEventListener("click", openAudioSettings);
    closeButton?.addEventListener("click", closeAudioSettings);
    closeBottomButton?.addEventListener("click", closeAudioSettings);
    testButton?.addEventListener("click", runTestSequence);

    overlay?.addEventListener("click", event => {
      if (event.target === overlay) closeAudioSettings();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && overlay?.classList.contains("show")) {
        closeAudioSettings();
      }
    });

    updateControls();
    if (enabled) {
      preload();
      startMonolithAmbience();
      document.addEventListener("pointerdown", () => {
        startMonolithAmbience();
      }, { once: true });
    }
  }

  window.ProjectMonolithAudio = {
    play,
    preload,
    stopGroup,
    startLoop,
    stopLoop,
    startMonolithAmbience,
    toggle,
    setEnabled,
    isEnabled: () => enabled,
    setVolume,
    getVolume: () => volume,
    runTestSequence,
    getStatus: () => ({
      enabled,
      volume,
      available: Object.fromEntries(availability.entries())
    }),
    library: structuredClone
      ? structuredClone(SOUND_LIBRARY)
      : JSON.parse(JSON.stringify(SOUND_LIBRARY))
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeControls, { once: true });
  } else {
    initializeControls();
  }
})();
