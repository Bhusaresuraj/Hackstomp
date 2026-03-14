export const speakText = (text, lang = 'en-US') => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      const voices = window.speechSynthesis.getVoices();
      let voice = voices.find((v) => v.lang === lang || v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase());
      
      // Fallback: If Marathi is requested but missing, use Hindi (shares Devanagari script)
      if (!voice && lang.startsWith('mr')) {
        voice = voices.find((v) => v.lang.startsWith('hi'));
      }

      if (voice) utterance.voice = voice;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve(); // Resolve on error so UI doesn't get stuck

      window.speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};