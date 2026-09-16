import { supabase } from '../lib/supabase';


/* =========================================================
   GET NOTIFICATIONS
   ========================================================= */

export async function getNotifications(limit = 50) {

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', {
      ascending: false,
    })
    .limit(limit);

  if (error) {
    console.error(
      'Failed to load notifications:',
      error
    );

    throw error;
  }

  return data || [];
}


/* =========================================================
   GET UNREAD COUNT
   ========================================================= */

export async function getUnreadNotificationCount() {

  const { count, error } = await supabase
    .from('notifications')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('is_read', false);

  if (error) {
    console.error(
      'Failed to load unread notification count:',
      error
    );

    throw error;
  }

  return count || 0;
}


/* =========================================================
   MARK SINGLE NOTIFICATION AS READ
   ========================================================= */

export async function markNotificationAsRead(
  notificationId
) {

  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
    })
    .eq('id', notificationId);

  if (error) {

    console.error(
      'Failed to mark notification as read:',
      error
    );

    throw error;
  }
}


/* =========================================================
   MARK ALL NOTIFICATIONS AS READ
   ========================================================= */

export async function markAllNotificationsAsRead() {

  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
    })
    .eq('is_read', false);

  if (error) {

    console.error(
      'Failed to mark all notifications as read:',
      error
    );

    throw error;
  }
}


/* =========================================================
   DELETE NOTIFICATION
   ========================================================= */

export async function deleteNotification(
  notificationId
) {

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) {

    console.error(
      'Failed to delete notification:',
      error
    );

    throw error;
  }
}


/* =========================================================
   REALTIME SUBSCRIPTION
   ========================================================= */

export function subscribeToNotifications(
  userId,
  callback
) {

  const channel = supabase
    .channel(`notifications:${userId}`)

    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {

        console.log(
          'Notification realtime event:',
          payload
        );

        callback(payload);
      }
    )

    .subscribe((status) => {

      console.log(
        'Notification realtime status:',
        status
      );

    });


  return () => {

    supabase.removeChannel(channel);

  };
}