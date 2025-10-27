import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { notificationsService } from '../../services';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Bell, X, Check, CheckCheck, Trash2, Settings } from 'lucide-react';

const NotificationCenter = () => {
  const { currentUser } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wsConnection, setWsConnection] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
      setupRealtimeConnection();
    }

    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [currentUser]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [allNotifications, unreadNotifications] = await Promise.all([
        notificationsService.getAll(),
        notificationsService.getUnread()
      ]);
      
      setNotifications(allNotifications || []);
      setUnreadCount(unreadNotifications?.length || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeConnection = () => {
    if (!currentUser?.id) return;

    try {
      const ws = notificationsService.realtime.connect(
        currentUser.id,
        (notification) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico',
              tag: notification.id
            });
          }
        }
      );
      
      setWsConnection(ws);
    } catch (error) {
      console.error('Erreur de connexion WebSocket:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage global:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsService.delete(id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      const deletedNotif = notifications.find(n => n.id === id);
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      leave_request: '🏖️',
      task_assigned: '📋',
      payroll: '💰',
      system: '⚙️',
      reminder: '⏰',
      approval: '✅',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-50';
    if (priority === 'medium') return 'text-orange-600 bg-orange-50';
    
    const colors = {
      leave_request: 'text-blue-600 bg-blue-50',
      task_assigned: 'text-purple-600 bg-purple-50',
      payroll: 'text-green-600 bg-green-50',
      system: 'text-gray-600 bg-gray-50',
      approval: 'text-green-600 bg-green-50',
      warning: 'text-orange-600 bg-orange-50'
    };
    
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInMinutes = Math.floor((now - notifDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}j`;
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="danger" 
            className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="info" size="sm">
                  {unreadCount} non lues
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  title="Tout marquer comme lu"
                >
                  <CheckCheck className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Chargement...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 20).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        getNotificationColor(notification.type, notification.priority)
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.created_at)}
                              </span>
                              
                              {notification.priority === 'high' && (
                                <Badge variant="danger" size="sm">
                                  Urgent
                                </Badge>
                              )}
                              
                              {notification.action_url && (
                                <button className="text-xs text-blue-600 hover:text-blue-700">
                                  Voir détails
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                title="Marquer comme lu"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              title="Supprimer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  Voir toutes
                </Button>
                
                <Button variant="outline" size="sm" icon={Settings}>
                  Préférences
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;