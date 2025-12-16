// import { socket } from "./socket";
// import store from "../redux/store";

// // ✅ Friend / Follow actions
// import {
//   addPendingRequest,
//   removePendingRequest,
// } from "../redux/slices/friendSlice";

// // ✅ Notifications
// import { addNotification } from "../redux/slices/notificationSlice";

// // ✅ Article real-time actions
// import {
//   addNewPost,
//   likeArticleRealtime,
//   addCommentRealtime,
// } from "../redux/slices/articleSlice";

// export const registerSocketListeners = () => {
//   /* 🟢 Follow request received */
//   socket.on("followRequestReceived", (data) => {
//     store.dispatch(addPendingRequest(data));
//     store.dispatch(
//       addNotification({
//         type: "follow",
//         message: `${data.username} sent you a follow request`,
//       })
//     );
//   });

//   /* ✅ Follow request accepted */
//   socket.on("followRequestAccepted", (data) => {
//     store.dispatch(removePendingRequest(data.followerId));
//     store.dispatch(
//       addNotification({
//         type: "follow",
//         message: `${data.username} accepted your follow request`,
//       })
//     );
//   });

//   /* ❌ Follow request rejected */
//   socket.on("followRequestRejected", (data) => {
//     store.dispatch(removePendingRequest(data.followerId));
//     store.dispatch(
//       addNotification({
//         type: "follow",
//         message: `${data.username} rejected your follow request`,
//       })
//     );
//   });

//   /* 📝 New post */
//   socket.on("newPost", (post) => {
//     store.dispatch(addNewPost(post));
//   });

//   /* ❤️ Article liked */
//   socket.on("articleLiked", ({ articleId, likedBy }) => {
//     store.dispatch(likeArticleRealtime({ articleId, likedBy }));
//   });

//   /* 💬 New comment */
//   socket.on("newComment", ({ articleId, comment }) => {
//     store.dispatch(addCommentRealtime({ articleId, comment }));
//   });
// };


// src/sockets/socketListeners.js
import { socket } from "./socket";
import store from "../redux/store";

/* =======================
   FOLLOW / FRIEND EVENTS
   ======================= */
import {
  addPendingRequest,
  removePendingRequest,
} from "../redux/slices/friendSlice";

/* =======================
   NOTIFICATIONS
   ======================= */
import { addNotification } from "../redux/slices/notificationSlice";

/* =======================
   ARTICLE REALTIME
   ======================= */
import {
  addNewPost,
  likeArticleRealtime,
  addCommentRealtime,
} from "../redux/slices/articleSlice";

export const registerSocketListeners = () => {
  /* 🚨 IMPORTANT: avoid duplicate listeners */
  socket.off();

  /* 🟢 FOLLOW REQUEST RECEIVED */
  socket.on("followRequestReceived", (data) => {
    // data = { _id, username, profilePhoto, email }

    store.dispatch(addPendingRequest(data));

    store.dispatch(
      addNotification({
        title: "New Follow Request",
        message: `${data.username} sent you a follow request`,
        type: "follow",
        createdAt: Date.now(),
      })
    );
  });

  /* ✅ FOLLOW REQUEST ACCEPTED */
  socket.on("followRequestAccepted", (data) => {
    // data = { followerId, username }

    store.dispatch(removePendingRequest(data.followerId));

    store.dispatch(
      addNotification({
        title: "Follow Request Accepted",
        message: `${data.username} accepted your follow request`,
        type: "follow",
        createdAt: Date.now(),
      })
    );
  });

  /* ❌ FOLLOW REQUEST REJECTED */
  socket.on("followRequestRejected", (data) => {
    // data = { followerId, username }

    store.dispatch(removePendingRequest(data.followerId));

    store.dispatch(
      addNotification({
        title: "Follow Request Rejected",
        message: `${data.username} rejected your follow request`,
        type: "follow",
        createdAt: Date.now(),
      })
    );
  });

  /* 📝 NEW POST */
  socket.on("newPost", (post) => {
    // post = full article object
    store.dispatch(addNewPost(post));
  });

  /* ❤️ ARTICLE LIKED */
  socket.on("articleLiked", ({ articleId, likedBy }) => {
    store.dispatch(
      likeArticleRealtime({
        articleId,
        likedBy,
      })
    );
  });

  /* 💬 NEW COMMENT */
  socket.on("newComment", ({ articleId, comment }) => {
    store.dispatch(
      addCommentRealtime({
        articleId,
        comment,
      })
    );
  });
};
