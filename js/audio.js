(() => {
  "use strict";

  const STORAGE_KEYS = {
    enabled: "projectMonolith.audio.enabled",
    volume: "projectMonolith.audio.volume"
  };

  const DEFAULT_VOLUME = 0.55;

  const SOUND_LIBRARY = {
    glyphPlace: "assets/audio/glyph-place.ogg",
    glyphRemove: "assets/audio/glyph-remove.ogg",
    corruption: "assets/audio/corruption.ogg",
    purification: "assets/audio/purification.ogg",
    configurationStart: "assets/audio/configuration-start.ogg",
    linkReveal: "assets/audio/link-reveal.ogg",
    configurationSuccess: "assets/audio/configuration-success.ogg",
    configurationFailure: "assets/audio/configuration-failure.ogg",
    vathkulMessage: "assets/audio/vathkul-message.ogg",
    finalCharge: "assets/audio/final-charge.ogg",
    finalPulse: "assets/audio/final-pulse.ogg",
    finalFlash: "assets/audio/final-flash.ogg",
    finalCrack: "assets/audio/final-crack.ogg",
    finalDestruction: "assets/audio/final-destruction.ogg"
  };

  const audioCache = new Map();
  let enabled = localStorage.getItem(STORAGE_KEYS.enabled) === "true";
  let volume = Number.parseFloat(localStorage.getItem(STORAGE_KEYS.volume));

  if (!Number.isFinite(volume)) volume = DEFAULT_VOLUME;
  volume = Math.min(1, Math.max(0, volume));

  function createAudio(soundName) {
    const src = SOUND_LIBRARY[soundName];
    if (!src) return null;

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;
    audio.addEventListener("error", () => {
      audio.dataset.unavailable = "true";
    }, { once: true });

    return audio;
  }

  function preload() {
    Object.keys(SOUND_LIBRARY).forEach(soundName => {
      if (!audioCache.has(soundName)) {
        audioCache.set(soundName, createAudio(soundName));
      }
    });
  }

  function play(soundName, options = {}) {
    if (!enabled) return;

    const source = audioCache.get(soundName) || createAudio(soundName);
    if (!source || source.dataset.unavailable === "true") return;

    if (!audioCache.has(soundName)) audioCache.set(soundName, source);

    const audio = source.cloneNode(true);
    audio.volume = Math.min(
      1,
      Math.max(0, volume * (Number.isFinite(options.gain) ? options.gain : 1))
    );

    if (Number.isFinite(options.playbackRate)) {
      audio.playbackRate = options.playbackRate;
    }

    audio.play().catch(() => {
      // Les navigateurs peuvent bloquer l'audio avant une interaction utilisateur.
    });
  }

  function setEnabled(nextEnabled) {
    enabled = Boolean(nextEnabled);
    localStorage.setItem(STORAGE_KEYS.enabled, String(enabled));
    updateControls();

    if (enabled) preload();
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
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.08), context.currentTime + 0.02);
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

function toggle() {
    setEnabled(!enabled);
  }

  function setVolume(nextVolume) {
    const normalized = Math.min(1, Math.max(0, Number(nextVolume)));
    volume = normalized;
    localStorage.setItem(STORAGE_KEYS.volume, String(volume));

    audioCache.forEach(audio => {
      if (audio) audio.volume = volume;
    });

    updateControls();
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
      if (volumeValue) volumeValue.textContent = `${percentage} %`;
    }

    if (memoryStatus) {
      memoryStatus.textContent = enabled
        ? `Son activé · volume ${Math.round(volume * 100)} % · préférence mémorisée`
        : "Son coupé · préférence mémorisée";
      memoryStatus.dataset.enabled = String(enabled);
    }
  }

  function initializeControls() {
    const toggleButton = document.getElementById("audioToggle");
    const volumeInput = document.getElementById("audioVolume");

    toggleButton?.addEventListener("click", toggle);
    volumeInput?.addEventListener("input", event => {
      setVolume(Number(event.target.value) / 100);
    });

    updateControls();
    if (enabled) preload();
  }

  window.ProjectMonolithAudio = {
    play,
    preload,
    toggle,
    setEnabled,
    isEnabled: () => enabled,
    setVolume,
    getVolume: () => volume,
    library: { ...SOUND_LIBRARY }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeControls, { once: true });
  } else {
    initializeControls();
  }
})();
