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

    if (toggleButton) {
      toggleButton.setAttribute("aria-pressed", String(enabled));
      toggleButton.classList.toggle("is-enabled", enabled);

      const icon = toggleButton.querySelector(".audio-toggle-icon");
      const label = toggleButton.querySelector(".audio-toggle-label");

      if (icon) icon.textContent = enabled ? "🔊" : "🔇";
      if (label) label.textContent = enabled ? "Son activé" : "Son coupé";
    }

    if (volumeInput) {
      volumeInput.value = String(Math.round(volume * 100));
      volumeInput.disabled = !enabled;
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
