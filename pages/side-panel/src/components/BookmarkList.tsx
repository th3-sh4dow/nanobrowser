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
    <div className="p-4">
      <h3
        className={`mb-4 text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-[#969696]' : 'text-[#586069]'}`}>
        {t('chat_bookmarks_header')}
      </h3>
      <div className="space-y-2">
        {bookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            draggable={editingId !== bookmark.id}
            onDragStart={e => handleDragStart(e, bookmark.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, bookmark.id)}
            className={`group relative rounded-md p-3 transition-colors ${
              isDarkMode
                ? 'bg-[#252526] hover:bg-[#2d2d30] border border-[#3c3c3c]'
                : 'bg-[#f8f8f8] hover:bg-[#f0f0f0] border border-[#e1e4e8]'
            }`}>
            {editingId === bookmark.id ? (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className={`flex-1 rounded px-2 py-1 text-sm border ${
                    isDarkMode
                      ? 'border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc]'
                      : 'border-[#e1e4e8] bg-white text-[#24292e]'
                  }`}
                />
                <button
                  onClick={() => handleSaveEdit(bookmark.id)}
                  className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
                    isDarkMode
                      ? 'bg-[#3c3c3c] text-[#89d185] hover:bg-[#1e1e1e]'
                      : 'bg-[#e1e4e8] text-[#28a745] hover:bg-[#d1d5da]'
                  }`}
                  aria-label={t('chat_bookmarks_saveEdit')}
                  type="button">
                  <FaCheck size={12} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
                    isDarkMode
                      ? 'bg-[#3c3c3c] text-[#f14c4c] hover:bg-[#1e1e1e]'
                      : 'bg-[#e1e4e8] text-[#d73a49] hover:bg-[#d1d5da]'
                  }`}
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
                  <div className={`text-sm font-medium truncate ${isDarkMode ? 'text-[#cccccc]' : 'text-[#24292e]'}`}>
                    {bookmark.title}
                  </div>
                </button>

                {/* Action buttons */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleEditClick(bookmark);
                    }}
                    className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
                      isDarkMode
                        ? 'bg-[#3c3c3c] text-[#969696] hover:bg-[#1e1e1e] hover:text-[#cccccc]'
                        : 'bg-[#e1e4e8] text-[#586069] hover:bg-[#d1d5da] hover:text-[#24292e]'
                    }`}
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
                    className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${
                      isDarkMode
                        ? 'bg-[#3c3c3c] text-[#969696] hover:bg-[#1e1e1e] hover:text-[#f14c4c]'
                        : 'bg-[#e1e4e8] text-[#586069] hover:bg-[#d1d5da] hover:text-[#d73a49]'
                    }`}
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
