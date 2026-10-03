import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { parseVoiceQuery } from '../../utils/nlpVoiceSearch';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string, parsedFilters?: any) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [fallbackInput, setFallbackInput] = useState('');
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setFallbackInput('');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Default to Hindi-India with fallback to English

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        setFallbackInput(currentTranscript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

      return () => {
        try {
          recognition.abort();
        } catch {}
      };
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setHasSpeechSupport(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = (queryText: string) => {
    if (!queryText.trim()) return;
    const parsed = parseVoiceQuery(queryText);
    onSearch(queryText, parsed);
    onClose();
  };

  const handleSuggestion = (suggestion: string) => {
    setFallbackInput(suggestion);
    handleApply(suggestion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-[#FCF9F5] border border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden">
        {/* Decorative corner Indian motif */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#721B29]/10 to-transparent rounded-bl-full pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-200/50 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#721B29]">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-xl font-bold font-serif">{t.voice.title}</h3>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 mb-6">{t.voice.prompt}</p>

        {/* Voice Listening Visualizer */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <div className="absolute w-24 h-24 rounded-full bg-[#721B29]/20 animate-ping" />
                <div className="absolute w-20 h-20 rounded-full bg-[#D4AF37]/30 animate-pulse" />
              </>
            )}
            <button
              onClick={() => {
                if (isListening) {
                  setIsListening(false);
                } else {
                  // restart
                  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (SpeechRecognition) {
                    const r = new SpeechRecognition();
                    r.lang = 'hi-IN';
                    r.onresult = (e: any) => {
                      const text = e.results[0][0].transcript;
                      setTranscript(text);
                      setFallbackInput(text);
                    };
                    r.start();
                    setIsListening(true);
                  }
                }
              }}
              className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg transition-transform duration-300 ${
                isListening ? 'bg-[#721B29] scale-110' : 'bg-neutral-800 hover:bg-[#721B29]'
              }`}
            >
              {isListening ? <Mic className="w-8 h-8 text-[#F3E5AB] animate-bounce" /> : <MicOff className="w-7 h-7" />}
            </button>
          </div>

          <p className="mt-4 text-sm font-semibold text-[#721B29]">
            {isListening ? t.voice.listening : transcript ? `"${transcript}"` : t.voice.start}
          </p>
        </div>

        {/* Fallback input & quick search */}
        <div className="mt-4">
          {!hasSpeechSupport && (
            <div className="p-3 mb-3 text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-xl">
              {t.voice.notSupported}
            </div>
          )}

          <div className="relative flex items-center">
            <input
              type="text"
              value={fallbackInput}
              onChange={(e) => setFallbackInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply(fallbackInput)}
              placeholder={t.voice.fallbackPlaceholder}
              className="w-full py-3.5 pl-4 pr-12 text-sm bg-white border border-neutral-300 rounded-2xl focus:outline-none focus:border-[#721B29] focus:ring-2 focus:ring-[#721B29]/15"
            />
            <button
              onClick={() => handleApply(fallbackInput)}
              disabled={!fallbackInput.trim()}
              className="absolute right-2 p-2 bg-[#721B29] text-white rounded-xl disabled:opacity-40 hover:bg-[#56131F] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Popular Natural Voice Suggestions */}
        <div className="mt-6 pt-4 border-t border-neutral-200/80">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            अक्सर पूछे जाने वाले बोल (Quick Searches)
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'लाल बनारसी साड़ी',
              'Under 2000 saree',
              'लड़कों का कुर्ता पजामा',
              'शादी का अनारकली सूट',
              'नवजात शिशु के कपड़े',
            ].map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white border border-neutral-200 hover:border-[#721B29] hover:text-[#721B29] transition-colors text-neutral-700"
              >
                "{s}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
