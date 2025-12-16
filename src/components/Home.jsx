import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllArticles } from "../redux/slices/articleSlice";
import { toast } from "react-toastify";
import Notification from "./Notification";
import ArticleCard from "./ArticleCard";

function Home() {
  const dispatch = useDispatch();
  const { articles, status, error } = useSelector((state) => state.articles);

  const [showNotification, setShowNotification] = useState(false);

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

  const articleList = Array.isArray(articles) ? articles : [];

  return (
    <div className="relative min-h-screen text-gray-800 font-sans pt-15">
      <div>
        {/* ARTICLES */}
        <div className="max-w-5xl mx-auto mt-8 space-y-6 px-4">
          {status === "loading" && (
            <p className="text-center text-lg animate-pulse text-white font-semibold">
              Loading articles...
            </p>
          )}

          {articleList
            .filter((article) => !!article && !!article._id)
            .map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}

          {status === "succeeded" && articleList.length === 0 && (
            <p className="text-center text-white/70 mt-10 text-xl">No articles found. Be the first to create one!</p>
          )}
        </div>
      </div>

      {showNotification && (
        <div className="absolute right-20 top-18 z-50">
          <Notification onClose={toggleNotifications} />
        </div>
      )}
    </div>
  );
}

export default Home;
