import {
  FaUser,
  FaHeart,
  FaCommentAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllArticles,
  likeArticle,
  commentArticle,
} from "../redux/slices/articleSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';


function Home() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { articles, status, error } = useSelector((state) => state.articles);

  const [showNotification, setShowNotification] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [showCount, setShowCount] = useState({});
  const [showComments, setShowComments] = useState({});

  // Toggle notifications
  const toggleNotifications = () => setShowNotification(!showNotification);

  // useEffect(() => {
  //   dispatch(getAllArticles());
  // }, [dispatch]);

  const isAuthenticated = useSelector(
  (state) => state.auth.isAuthenticated
);

if (!isAuthenticated) return null;


  const { profilePhoto } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const openCommentBox = (articleId) => {
    setShowCommentInput((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  const handleCommentChange = (articleId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [articleId]: value,
    }));
  };

  // const handlePostComment = (articleId) => {
  //   const text = commentInputs[articleId];
  //   if (!text?.trim()) return;

  //   dispatch(commentArticle({ articleId, text }))
  //       setShowComments((prev) => ({
  //         ...prev,
  //         [articleId]: true,
  //       }));
  //   setCommentInputs((prev) => ({ ...prev, [articleId]: "" }));
  // };
const handlePostComment = (articleId) => {
  const text = commentInputs[articleId];
  if (!text?.trim()) return;

  dispatch(commentArticle({ articleId, text }))
    .unwrap()
    .then(() => {
      setShowComments((prev) => ({
        ...prev,
        [articleId]: true,
      }));
      setCommentInputs((prev) => ({
        ...prev,
        [articleId]: "",
      }));
    })
    .catch((err) => {
      toast.error(err || "Failed to post comment");
    });
};

  const articleList = Array.isArray(articles) ? articles : [];

  return (
    <div
      className="relative min-h-screen text-gray-800 font-sans 
      bg-[url('./image1.png')] bg-cover bg-center bg-fixed"
    >

      {/* NAVBAR  */}
      <Navbar />

      {/* ARTICLES LIST */}
      <div className="max-w-5xl mx-auto mt-8 space-y-6 px-4">

        {status === "loading" && (
          <p className="text-center text-lg animate-pulse">Loading articles...</p>
        )}

        {articleList
          .filter((article) => !!article && !!article._id)
          .map((article) => {
            // const comments = Array.isArray(article.comments)
            //   ? [...article.comments].sort(
            //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            //     )
            //   : [];
            const comments = article.comments || [];


            const totalComments = comments.length;
            const visibleCount = showCount[article._id] || 5;
            const commentsToShow = comments.slice(0, visibleCount);

            const handleShowLess = (articleId, totalComments) => {
              const currentVisible = showCount[articleId] || 5;

              if (totalComments <= 5 || currentVisible <= 5) {
                setShowComments((prev) => ({
                  ...prev,
                  [articleId]: false,
                }));
                setShowCount((prev) => ({
                  ...prev,
                  [articleId]: 5,
                }));
              } else {
                setShowCount((prev) => ({
                  ...prev,
                  [articleId]: currentVisible - 5,
                }));
              }
            };

            return (
              <div
                key={article._id}
                className="flex flex-col border rounded-2xl p-5 bg-white shadow-md hover:shadow-xl transition-shadow"
              >

                {/* USER & DATE */}
                <div className="flex flex-row gap-155 mb-5">
                  <div className="flex flex-row gap-3">

                    {/* USER PROFILE */}
                    <div
                      onClick={() => navigate("/profile")}
                      className="w-9 h-9 rounded-full cursor-pointer overflow-hidden border border-gray-300"
                    >
                      {article.user?.profilePhoto ? (
                        <img
                          src={`data:image/jpeg;base64,${article.user?.profilePhoto}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <FaUser className="text-gray-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center ">
                      {article.user?.email || "Unknown User"} •{" "}
                    </div>
                  </div>

                  <div className="mb-3 text-sm text-gray-500 flex items-center">
                    {formatDate(article.createdAt)}
                  </div>
                </div>

                {/* TITLE + CONTENT */}
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p className="mt-2 text-gray-600">{article.content}</p>

                {/* LIKE + COMMENT */}
                <div className="flex items-center justify-between mt-4 text-gray-600 text-sm">

                  {/* COMMENTS TOGGLE */}
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setShowComments((prev) => ({
                        ...prev,
                        [article._id]: !prev[article._id],
                      }));
                      openCommentBox(article._id);
                    }}
                  >
                    <FaCommentAlt className="text-purple-500 text-xl" />
                    <span>{totalComments} Comments</span>
                  </div>

                  {/* LIKE */}
                  <div
                    className="flex items-center gap-3 cursor-pointer text-xl"
                    onClick={() =>
                      dispatch(likeArticle(article._id))                                            
                    }
                  >
                    <FaHeart
                      className={`text-xl transition ${
                        article.likedByCurrentUser
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>{article.likeCount}</span>
                  </div>
                </div>

                {/* COMMENT INPUT */}
                {showCommentInput[article._id] && (
                  <div className="flex gap-3 mt-4">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 p-2 border rounded-lg bg-gray-100"
                      value={commentInputs[article._id] || ""}
                      onChange={(e) =>
                        handleCommentChange(article._id, e.target.value)
                      }
                    />
                    <button
                      onClick={() => handlePostComment(article._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
                    >
                      Post
                    </button>
                  </div>
                )}

                {/* COMMENTS LIST */}
                {showComments[article._id] && (
                  <div className="mt-4 space-y-3">
                    {commentsToShow
                      .filter((c) => c && c.text)
                      .map((c) => (
                        <div
                          key={c._id}
                          className="p-3  bg-gray-100 rounded-lg border flex items-center gap-4 "
                        >
                          <div> 
                            <img
                          src={`data:image/jpeg;base64,${c?.user?.profilePhoto}`}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                          </div>
                          <div>
                            <p>{c.text}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(c.createdAt)}
                          </p>
                          </div>
                        </div>
                      ))}

                    {/* READ MORE */}
                    {visibleCount < totalComments && (
                      <button
                        onClick={() =>
                          setShowCount((prev) => ({
                            ...prev,
                            [article._id]: (prev[article._id] || 5) + 5,
                          }))
                        }
                        className="text-blue-600 mt-1 cursor-pointer"
                      >
                        Read More
                      </button>
                    )}

                    {/* SHOW LESS */}
                    {totalComments > 0 && (
                      <button
                        onClick={() => handleShowLess(article._id, totalComments)}
                        className="text-red-500 mt-1 block cursor-pointer"
                      >
                        Read Less
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Home;
