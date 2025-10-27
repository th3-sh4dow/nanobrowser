/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { FaTrash, FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import { t } from '@extension/i18n';

interface Bookmark {
  id: number;
  title: string;
  content: string;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onBookmarkSelect: (content: string) => void;
  onBookmarkUpdateTitle?: (id: number, title: string) => void;
  onBookmarkDelete?: (id: number) => void;
  onBookmarkReorder?: (draggedId: number, targetId: number) => void;
  isDarkMode?: boolean;
}

const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
  onBookmarkSelect,
  onBookmarkUpdateTitle,
  onBookmarkDelete,
  onBookmarkReorder,
  isDarkMode = false,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
  };

  const handleSaveEdit = (id: number) => {
    if (onBookmarkUpdateTitle && editTitle.trim()) {
      onBookmarkUpdateTitle(id, editTitle);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id.toString());
    // Add more transparent effect
    e.currentTarget.classList.add('opacity-25');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-25');
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) return;

    if (onBookmarkReorder) {
      onBookmarkReorder(draggedId, targetId);
    }
  };

  // Focus the input field when entering edit mode
  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  return (
    <div className="p-6">
      <h3 className="mb-6 text-sm font-bold uppercase tracking-wider neon-text">{t('chat_bookmarks_header')}</h3>
      <div className="space-y-3">
        {bookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            draggable={editingId !== bookmark.id}
            onDragStart={e => handleDragStart(e, bookmark.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, bookmark.id)}
            className="group relative glass-surface rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 animate-float"
            style={{ animationDelay: `${bookmark.id * 0.1}s` }}>
            {editingId === bookmark.id ? (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="flex-1 glass-surface rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/50 focus:outline-none focus:shadow-lg focus:shadow-cyan-500/20"
                />
                <button
                  onClick={() => handleSaveEdit(bookmark.id)}
                  className="glass-button flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30"
                  aria-label={t('chat_bookmarks_saveEdit')}
                  type="button">
                  <FaCheck size={12} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="glass-button flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
                  aria-label={t('chat_bookmarks_cancelEdit')}
                  type="button">
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onBookmarkSelect(bookmark.content)}
                  className="w-full text-left pr-12">
                  <div className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white/90' : 'text-slate-800'}`}>
                    {bookmark.title}
                  </div>
                </button>

                {/* Action buttons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleEditClick(bookmark);
                    }}
                    className="glass-button flex items-center justify-center w-7 h-7 rounded-lg text-white/70 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                    aria-label={t('chat_bookmarks_edit')}
                    type="button">
                    <FaPen size={10} />
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (onBookmarkDelete) {
                        onBookmarkDelete(bookmark.id);
                      }
                    }}
                    className="glass-button flex items-center justify-center w-7 h-7 rounded-lg text-white/70 hover:text-red-400 transition-all duration-300 hover:scale-110"
                    aria-label={t('chat_bookmarks_delete')}
                    type="button">
                    <FaTrash size={10} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;
