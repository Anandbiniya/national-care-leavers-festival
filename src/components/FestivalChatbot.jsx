import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Mic, Send, Volume2, X } from 'lucide-react';
import locales from './festivalChatbotLocales';

const speechLocales = {
  en: 'en-IN', hi: 'hi-IN', as: 'as-IN', bn: 'bn-IN', brx: 'brx-IN',
  doi: 'doi-IN', gu: 'gu-IN', kn: 'kn-IN', ks: 'ks-IN', kok: 'kok-IN',
  mai: 'mai-IN', ml: 'ml-IN', mni: 'mni-IN', mr: 'mr-IN', ne: 'ne-IN',
  or: 'or-IN', pa: 'pa-IN', sa: 'sa-IN', sat: 'sat-IN', sd: 'sd-IN',
  ta: 'ta-IN', te: 'te-IN', ur: 'ur-IN',
};

const voiceLabels = {
  en: {
    preference: 'Reply voice',
    girl: 'Girl voice',
    boy: 'Boy voice',
    record: 'Record a voice message',
    stop: 'Stop recording',
    play: 'Play voice reply',
    status: 'Girl/boy is a voice preference; actual voices and language support depend on your browser.',
    unsupported: 'Voice input is not supported in this browser. You can still type and play replies.',
    denied: 'Microphone access was denied. Allow microphone access in browser settings and try again.',
    unavailable: 'Speech recognition is unavailable. Please try again or type your question.',
    listening: 'Listening… speak now.',
  },
  hi: {
    preference: 'जवाब की आवाज़',
    girl: 'महिला आवाज़',
    boy: 'पुरुष आवाज़',
    record: 'आवाज़ में सवाल पूछें',
    stop: 'रिकॉर्डिंग रोकें',
    play: 'जवाब सुनें',
    status: 'महिला/पुरुष आवाज़ का चुनाव प्राथमिकता है; असली आवाज़ और भाषा ब्राउज़र पर निर्भर करती है।',
    unsupported: 'इस ब्राउज़र में आवाज़ से सवाल पूछना उपलब्ध नहीं है। आप लिखकर पूछ सकते हैं और जवाब सुन सकते हैं।',
    denied: 'माइक्रोफ़ोन की अनुमति नहीं मिली। ब्राउज़र सेटिंग में अनुमति देकर फिर कोशिश करें।',
    unavailable: 'आवाज़ पहचान उपलब्ध नहीं है। फिर कोशिश करें या सवाल लिखें।',
    listening: 'सुन रहा/रही हूँ… अब बोलें।',
  },
};

const femaleVoiceNames = /female|woman|girl|zira|samantha|karen|susan|heera|swara|veena|lekha|neerja|priya|aditi|kajal|raveena/i;
const maleVoiceNames = /male|man|boy|david|mark|ravi|hemant|madhur|arjun|prabhat|mohan/i;

function getAnswer(question, language, email, whatsappUrl, selectedIntent) {
  const locale = locales[language];
  const normalized = question.toLocaleLowerCase();
  const intent = selectedIntent || Object.entries(locale.keywords)
    .find(([, terms]) => terms.some((term) => normalized.includes(term.toLocaleLowerCase())))?.[0];
  const answers = locale.answers;

  if (intent === 'date' || intent === 'programme') {
    return { text: answers[intent] };
  }
  if (intent === 'join') {
    return {
      text: answers.join,
      href: whatsappUrl,
      linkLabel: answers.whatsappLink,
    };
  }
  if (intent === 'contact') {
    return {
      text: answers.contact,
      href: `mailto:${email}`,
      linkLabel: answers.emailLink,
    };
  }
  return {
    text: answers.fallback,
    href: `mailto:${email}`,
    linkLabel: answers.emailLink,
  };
}

export default function FestivalChatbot({ email, whatsappUrl }) {
  const [language, setLanguage] = useState('en');
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [voicePreference, setVoicePreference] = useState('female');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [voices, setVoices] = useState([]);
  const panelRef = useRef(null);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const toggleRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const recognitionFailedRef = useRef(false);
  const copy = locales[language];
  const voiceCopy = voiceLabels[language] || voiceLabels.en;

  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined;
    const updateVoices = () => setVoices(window.speechSynthesis.getVoices());
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
  }, []);

  useEffect(() => () => {
    recognitionRef.current?.abort();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const speakReply = (text, lang = language) => {
    if (!('speechSynthesis' in window)) {
      setVoiceStatus(voiceCopy.unavailable);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const locale = speechLocales[lang] || 'en-IN';
    const languageVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(locale.split('-')[0]));
    const preferredName = voicePreference === 'female' ? femaleVoiceNames : maleVoiceNames;
    utterance.voice = languageVoices.find((voice) => preferredName.test(voice.name))
      || languageVoices[0]
      || voices.find((voice) => voice.default)
      || null;
    utterance.lang = locale;
    utterance.pitch = voicePreference === 'female' ? 1.08 : 0.88;
    utterance.rate = 0.94;
    utterance.onerror = () => setVoiceStatus(voiceCopy.unavailable);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = (question, intent, shouldSpeak = false, lang = language) => {
    const text = question.trim();
    if (!text) return;
    const reply = getAnswer(text, lang, email, whatsappUrl, intent);

    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-${current.length}`, role: 'user', text },
      { id: `${Date.now()}-${current.length}-reply`, role: 'assistant', ...reply },
    ]);
    setInput('');
    inputRef.current?.focus();
    if (shouldSpeak) speakReply(reply.text, lang);
  };

  const toggleRecording = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus(voiceCopy.unsupported);
      return;
    }

    const recognition = new SpeechRecognition();
    const recognitionLanguage = language;
    recognition.lang = speechLocales[recognitionLanguage] || 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    transcriptRef.current = '';
    recognitionFailedRef.current = false;
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus(voiceCopy.listening);
    };
    recognition.onresult = (event) => {
      let transcript = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      if (event.results[event.results.length - 1].isFinal) {
        transcriptRef.current = transcript.trim();
      }
      setInput(transcript);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      recognitionFailedRef.current = true;
      setVoiceStatus(event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? voiceCopy.denied
        : voiceCopy.unavailable);
    };
    recognition.onend = () => {
      setIsListening(false);
      const transcript = transcriptRef.current;
      transcriptRef.current = '';
      if (transcript) {
        setVoiceStatus('');
        setInput('');
        sendMessage(transcript, undefined, true, recognitionLanguage);
      } else if (!recognitionFailedRef.current) {
        setVoiceStatus(voiceCopy.unavailable);
      }
      recognitionFailedRef.current = false;
    };
    recognitionRef.current = recognition;
    setVoiceStatus('');
    try {
      recognition.start();
    } catch {
      setVoiceStatus(voiceCopy.unavailable);
    }
  };

  return (
    <aside className="festival-chatbot">
      {open && (
        <section
          className="festival-chatbot-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="festival-chatbot-title"
          tabIndex={-1}
          ref={panelRef}
          lang={language}
          dir={copy.dir}
        >
          <header className="festival-chatbot-header">
            <span className="festival-chatbot-avatar" aria-hidden="true"><Bot size={20} /></span>
            <div className="festival-chatbot-heading">
              <h2 id="festival-chatbot-title">{copy.title}</h2>
              <span><i />{copy.status}</span>
            </div>
            <div className="festival-chatbot-header-actions">
              <label className="visually-hidden" htmlFor="festival-chatbot-language">{copy.languageLabel}</label>
              <select
                id="festival-chatbot-language"
                className="festival-chatbot-language-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {Object.entries(locales).map(([code, locale]) => (
                  <option value={code} key={code}>{locale.name}</option>
                ))}
              </select>
              <button
                type="button"
                className="festival-chatbot-close"
                aria-label={copy.close}
                onClick={() => {
                  setOpen(false);
                  toggleRef.current?.focus();
                }}
              >
                <X size={19} />
              </button>
            </div>
          </header>

          <div className="festival-chatbot-voice-controls">
            <label htmlFor="festival-chatbot-voice">{voiceCopy.preference}</label>
            <select
              id="festival-chatbot-voice"
              value={voicePreference}
              onChange={(event) => setVoicePreference(event.target.value)}
            >
              <option value="female">{voiceCopy.girl}</option>
              <option value="male">{voiceCopy.boy}</option>
            </select>
            <span className="festival-chatbot-voice-disclosure">{voiceCopy.status}</span>
          </div>

          <div className="festival-chatbot-messages" ref={messagesRef} role="log" aria-live="polite" aria-relevant="additions">
            <div className="festival-chatbot-message assistant">
              <span className="festival-chatbot-message-avatar" aria-hidden="true"><Bot size={15} /></span>
              <p>{copy.welcome}</p>
            </div>
            {messages.map((message) => (
              <div className={`festival-chatbot-message ${message.role}`} key={message.id}>
                {message.role === 'assistant' && (
                  <span className="festival-chatbot-message-avatar" aria-hidden="true"><Bot size={15} /></span>
                )}
                <div className="festival-chatbot-message-content">
                  <p>{message.text}</p>
                  {message.role === 'assistant' && (
                    <button
                      type="button"
                      className="festival-chatbot-speak"
                      aria-label={voiceCopy.play}
                      onClick={() => speakReply(message.text)}
                    >
                      <Volume2 size={15} />
                      <span>{voiceCopy.play}</span>
                    </button>
                  )}
                  {message.href && (
                    <a
                      href={message.href}
                      target={message.href.startsWith('https://') ? '_blank' : undefined}
                      rel={message.href.startsWith('https://') ? 'noopener noreferrer' : undefined}
                    >
                      {message.linkLabel}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="festival-chatbot-quick-questions" aria-label={copy.languageLabel}>
            {[...copy.quickQuestions, {
              label: copy.answers.emailLink,
              question: copy.answers.emailLink,
              intent: 'contact',
            }].map((item) => (
              <button type="button" key={item.intent} onClick={() => sendMessage(item.question, item.intent)}>
                {item.label}
              </button>
            ))}
          </div>

          <form
            className="festival-chatbot-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <label className="visually-hidden" htmlFor="festival-chatbot-input">{copy.placeholder}</label>
            <input
              id="festival-chatbot-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={copy.placeholder}
              autoComplete="off"
            />
            <button
              type="button"
              className={`festival-chatbot-mic${isListening ? ' is-listening' : ''}`}
              aria-label={isListening ? voiceCopy.stop : voiceCopy.record}
              aria-pressed={isListening}
              onClick={toggleRecording}
            >
              <Mic size={17} />
            </button>
            <button type="submit" aria-label={copy.send} disabled={!input.trim()}>
              <Send size={17} />
            </button>
          </form>
          <p className="festival-chatbot-voice-status" role="status" aria-live="polite">
            {voiceStatus || (!window.SpeechRecognition && !window.webkitSpeechRecognition ? voiceCopy.unsupported : '')}
          </p>
          <p className="festival-chatbot-note">{copy.privacyNote}</p>
        </section>
      )}
      <button
        ref={toggleRef}
        type="button"
        className={`festival-chatbot-toggle${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-label={open ? copy.close : copy.open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {open ? <X size={19} /> : <MessageCircle size={20} />}
        <span>{open ? copy.close : copy.open}</span>
      </button>
    </aside>
  );
}
