/* eslint-disable react/prop-types */
import { FaTrash } from 'react-icons/fa';
import { BsBookmark } from 'react-icons/bs';
import { t } from '@extension/i18n';

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
}

interface ChatHistoryListProps {
  sessions: ChatSession[];
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
  onSessionBookmark: (sessionId: string) => void;
  visible: boolean;
  isDarkMode?: boolean;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  sessions,
  onSessionSelect,
  onSessionDelete,
  onSessionBookmark,
  visible,
  isDarkMode = false,
}) => {
  if (!visible) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="mb-6 text-sm font-bold uppercase tracking-wider neon-text">{t('chat_history_title')}</h2>
      {sessions.length === 0 ? (
        <div className="glass-surface rounded-2xl p-6 text-center text-sm text-white/70 animate-float">
          {t('chat_history_empty')}
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className="group relative glass-surface rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 animate-float"
              style={{ animationDelay: `${index * 0.1}s` }}>
              <button onClick={() => onSessionSelect(session.id)} className="w-full text-left pr-16" type="button">
                <h3 className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                  {session.title}
                </h3>
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                  {formatDate(session.createdAt)}
                </p>
              </button>

              {/* Action buttons */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {onSessionBookmark && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSessionBookmark(session.id);
                    }}
                    className="glass-button flex items-center justify-center w-7 h-7 rounded-lg text-white/70 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                    aria-label={t('chat_history_bookmark')}
                    type="button">
                    <BsBookmark size={12} />
                  </button>
                )}

                <button
                  onClick={e => {
                    e.stopPropagation();
                    onSessionDelete(session.id);
                  }}
                  className="glass-button flex items-center justify-center w-7 h-7 rounded-lg text-white/70 hover:text-red-400 transition-all duration-300 hover:scale-110"
                  aria-label={t('chat_history_delete')}
                  type="button">
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryList;
