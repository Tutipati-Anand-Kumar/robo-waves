import { useDispatch, useSelector } from "react-redux";
import { markAllAsRead } from "../redux/slices/notificationSlice";

export default function Notification() {
  const dispatch = useDispatch();

  const notifications = useSelector(
    (state) => state.notifications.items
  );

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="bg-gray-100 p-6 w-[400px] h-[500px] rounded-2xl m-[7px] overflow-y-scroll">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-4 divide-y">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No notifications
          </p>
        ) : (
          notifications.map((note) => (
            <div
              key={note.id}
              className={`py-3 ${
                note.read ? "opacity-70" : "bg-blue-50"
              }`}
            >
              <h2 className="font-semibold text-gray-900">
                {note.title || "Notification"}
              </h2>

              <p className="text-gray-600 text-sm">
                {note.message}
              </p>

              <span className="text-gray-400 text-xs">
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleString()
                  : "Just now"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
