import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useHRStore } from '../../store/useHRStore';
import Button from './Button';

const DocumentComments = ({ shareId, currentEmployeeId, isOpen, onClose }) => {
  const { sharedDocuments, addShareComment, employees } = useHRStore();
  const [newComment, setNewComment] = useState('');
  
  const share = sharedDocuments.find(s => s.id === shareId);
  const currentEmployee = employees.find(emp => emp.id === currentEmployeeId);
  
  if (!isOpen || !share) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addShareComment(shareId, currentEmployeeId, newComment.trim());
      setNewComment('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Commentaires</h3>
              <p className="text-sm text-gray-600">{share.document?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6">
          {share.comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun commentaire pour le moment</p>
              <p className="text-sm text-gray-400 mt-1">Soyez le premier à commenter ce document</p>
            </div>
          ) : (
            <div className="space-y-4">
              {share.comments.map((comment) => {
                const isMyComment = comment.employeeId === currentEmployeeId;
                const commenter = employees.find(emp => emp.id === comment.employeeId);
                
                return (
                  <div
                    key={comment.id}
                    className={`flex gap-3 ${isMyComment ? 'flex-row-reverse' : ''}`}
                  >
                    <img
                      src={commenter?.avatar}
                      alt={comment.employeeName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className={`flex-1 ${isMyComment ? 'text-right' : ''}`}>
                      <div
                        className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                          isMyComment
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{comment.message}</p>
                      </div>
                      <div className={`mt-1 text-xs text-gray-500 ${isMyComment ? 'text-right' : ''}`}>
                        <span>{comment.employeeName}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDate(comment.date)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Comment Form */}
        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <img
              src={currentEmployee?.avatar}
              alt={currentEmployee?.name}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {newComment.length}/500 caractères
                </span>
                <Button
                  type="submit"
                  size="sm"
                  icon={Send}
                  disabled={!newComment.trim()}
                >
                  Envoyer
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentComments;