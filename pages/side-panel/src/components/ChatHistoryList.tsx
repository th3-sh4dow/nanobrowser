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
    <div className="h-full overflow-y-auto p-4">
      <h2
        className={`mb-4 text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
        {t('chat_history_title')}
      </h2>
      {sessions.length === 0 ? (
        <div
          className={`rounded-md p-4 text-center text-sm ${isDarkMode ? 'bg-[#252526] text-[#969696] border border-[#3c3c3c]' : 'bg-[#f8f8f8] text-[#586069] border border-[#e1e4e8]'}`}>
          {t('chat_history_empty')}
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`group relative rounded-md p-3 transition-colors ${
                isDarkMode
                  ? 'bg-[#252526] hover:bg-[#2d2d30] border border-[#3c3c3c]'
                  : 'bg-[#f8f8f8] hover:bg-[#f0f0f0] border border-[#e1e4e8]'
              }`}>
              <button onClick={() => onSessionSelect(session.id)} className="w-full text-left pr-12" type="button">
                <h3 className={`text-sm font-medium truncate ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
                  {session.title}
                </h3>
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
                  {formatDate(session.createdAt)}
                </p>
              </button>

              {/* Action buttons */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onSessionBookmark && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSessionBookmark(session.id);
                    }}
                    className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
                      isDarkMode
                        ? 'bg-[#3c3c3c] text-[#969696] hover:bg-[#1e1e1e] hover:text-[#007acc]'
                        : 'bg-[#e1e4e8] text-[#586069] hover:bg-[#d1d5da] hover:text-[#0366d6]'
                    }`}
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
                  className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
                    isDarkMode
                      ? 'bg-[#3c3c3c] text-[#969696] hover:bg-[#1e1e1e] hover:text-[#f14c4c]'
                      : 'bg-[#e1e4e8] text-[#586069] hover:bg-[#d1d5da] hover:text-[#d73a49]'
                  }`}
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
