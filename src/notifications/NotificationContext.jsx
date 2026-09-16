import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { useAuth } from '../auth/AuthContext';

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  subscribeToNotifications,
} from '../services/notificationService';


const NotificationContext = createContext(null);


/* =========================================================
   NOTIFICATION PROVIDER
   ========================================================= */

export function NotificationProvider({ children }) {

  const {
    user,
    loading: authLoading,
  } = useAuth();


  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);


  /* =======================================================
     LOAD NOTIFICATIONS
     ======================================================= */

  const loadNotifications = useCallback(async () => {

    if (!user) {

      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);

      return;
    }


    try {

      setLoading(true);


      const [
        notificationData,
        unreadTotal,
      ] = await Promise.all([

        getNotifications(),

        getUnreadNotificationCount(),

      ]);


      setNotifications(notificationData);

      setUnreadCount(unreadTotal);


    } catch (error) {

      console.error(
        'Failed to load notifications:',
        error
      );

      setNotifications([]);

      setUnreadCount(0);


    } finally {

      setLoading(false);

    }

  }, [user]);


  /* =======================================================
     INITIAL LOAD
     ======================================================= */

  useEffect(() => {

    if (authLoading) {
      return;
    }

    loadNotifications();

  }, [
    authLoading,
    loadNotifications,
  ]);


  /* =======================================================
     REFRESH UNREAD COUNT
     ======================================================= */

  const refreshUnreadCount = useCallback(async () => {

    if (!user) {

      setUnreadCount(0);

      return;
    }


    try {

      const count =
        await getUnreadNotificationCount();

      setUnreadCount(count);

    } catch (error) {

      console.error(
        'Failed to refresh unread notification count:',
        error
      );

    }

  }, [user]);


  /* =======================================================
     REALTIME NOTIFICATIONS
     ======================================================= */

  useEffect(() => {

    if (authLoading || !user) {
      return;
    }


    const unsubscribe =
      subscribeToNotifications(
        user.id,
        async (payload) => {

          console.log(
            'Notification realtime event:',
            payload
          );


          /* ================================================
             INSERT
             ================================================ */

          if (payload.eventType === 'INSERT') {

            const newNotification =
              payload.new;


            setNotifications((current) => {

              const alreadyExists =
                current.some(
                  (notification) =>
                    notification.id ===
                    newNotification.id
                );


              if (alreadyExists) {
                return current;
              }


              return [
                newNotification,
                ...current,
              ];

            });


            await refreshUnreadCount();

          }


          /* ================================================
             UPDATE
             ================================================ */

          if (payload.eventType === 'UPDATE') {

            const updatedNotification =
              payload.new;


            setNotifications((current) => {

              return current.map(
                (notification) =>
                  notification.id ===
                  updatedNotification.id
                    ? updatedNotification
                    : notification
              );

            });


            await refreshUnreadCount();

          }


          /* ================================================
             DELETE
             ================================================ */

          if (payload.eventType === 'DELETE') {

            const deletedNotification =
              payload.old;


            setNotifications((current) => {

              return current.filter(
                (notification) =>
                  notification.id !==
                  deletedNotification.id
              );

            });


            await refreshUnreadCount();

          }

        }
      );


    return () => {

      unsubscribe();

    };

  }, [
    authLoading,
    user,
    refreshUnreadCount,
  ]);


  /* =======================================================
     MARK ONE AS READ
     ======================================================= */

  const markAsRead = useCallback(
    async (notificationId) => {

      const notification =
        notifications.find(
          (item) =>
            item.id === notificationId
        );


      if (!notification) {
        return;
      }


      /* Already read */
      if (notification.is_read) {
        return;
      }


      /* Optimistic UI update */

      setNotifications((current) => {

        return current.map(
          (item) =>
            item.id === notificationId
              ? {
                  ...item,
                  is_read: true,
                }
              : item
        );

      });


      setUnreadCount((count) =>
        Math.max(0, count - 1)
      );


      try {

        await markNotificationAsRead(
          notificationId
        );


        /*
         * Get the authoritative count
         * from Supabase.
         */

        await refreshUnreadCount();


      } catch (error) {

        console.error(
          'Failed to mark notification as read:',
          error
        );


        /*
         * Reload from Supabase if
         * something went wrong.
         */

        await loadNotifications();

      }

    },
    [
      notifications,
      loadNotifications,
      refreshUnreadCount,
    ]
  );


  /* =======================================================
     MARK ALL AS READ
     ======================================================= */

  const markAllRead = useCallback(
    async () => {

      if (unreadCount === 0) {
        return;
      }


      /* Optimistic UI update */

      setNotifications((current) => {

        return current.map(
          (notification) => ({
            ...notification,
            is_read: true,
          })
        );

      });


      setUnreadCount(0);


      try {

        await markAllNotificationsAsRead();


        await refreshUnreadCount();


      } catch (error) {

        console.error(
          'Failed to mark all notifications as read:',
          error
        );


        await loadNotifications();

      }

    },
    [
      unreadCount,
      loadNotifications,
      refreshUnreadCount,
    ]
  );


  /* =======================================================
     DELETE NOTIFICATION
     ======================================================= */

  const removeNotification = useCallback(
    async (notificationId) => {

      const notification =
        notifications.find(
          (item) =>
            item.id === notificationId
        );


      if (!notification) {
        return;
      }


      /* Optimistic UI update */

      setNotifications((current) => {

        return current.filter(
          (item) =>
            item.id !== notificationId
        );

      });


      if (!notification.is_read) {

        setUnreadCount((count) =>
          Math.max(0, count - 1)
        );

      }


      try {

        await deleteNotification(
          notificationId
        );


        await refreshUnreadCount();


      } catch (error) {

        console.error(
          'Failed to delete notification:',
          error
        );


        await loadNotifications();

      }

    },
    [
      notifications,
      loadNotifications,
      refreshUnreadCount,
    ]
  );


  /* =======================================================
     MANUAL REFRESH
     ======================================================= */

  const refreshNotifications =
    useCallback(async () => {

      await loadNotifications();

    }, [loadNotifications]);


  /* =======================================================
     CONTEXT VALUE
     ======================================================= */

  const value = {

    notifications,

    unreadCount,

    loading,

    markAsRead,

    markAllRead,

    removeNotification,

    refreshNotifications,

  };


  return (

    <NotificationContext.Provider
      value={value}
    >

      {children}

    </NotificationContext.Provider>

  );

}


/* =========================================================
   USE NOTIFICATIONS HOOK
   ========================================================= */

export function useNotifications() {

  const context =
    useContext(NotificationContext);


  if (!context) {

    throw new Error(
      'useNotifications must be used inside NotificationProvider'
    );

  }


  return context;

}