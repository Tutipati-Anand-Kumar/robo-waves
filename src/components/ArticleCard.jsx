import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeArticle, commentArticle } from '../redux/slices/articleSlice';
import { Heart, MessageCircle, Send, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);

    const handleLike = () => {
        dispatch(likeArticle(article._id));
    };

    const handleComment = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            dispatch(commentArticle({ articleId: article._id, text: commentText }));
            setCommentText('');
        }
    };

    return (
        <div className="bg-white/40 backdrop-blur-md shadow-lg border border-white/40 rounded-2xl mb-6 overflow-hidden hover:shadow-xl transition-all duration-300 hover:bg-white/50">
            <div className="p-5 border-b border-gray-100 flex items-center">
                <Link to={`/profile/${article.user?._id}`} className="flex items-center group">
                    {article.user?.profilePhoto ? (
                        <img
                            src={article.user.profilePhoto}
                            alt={article.user.username}
                            className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200 group-hover:border-purple-400 transition"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600 group-hover:bg-indigo-200 transition">
                            <User size={20} />
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-800 text-sm group-hover:text-purple-600 transition">{article.user?.username || 'Unknown User'}</h3>
                        <span className="text-xs text-gray-500">
                            {new Date(article.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </Link>
            </div>

            <div className="p-5">
                <h2 className="text-xl font-bold mb-3 text-gray-900">{article.title}</h2>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{article.content}</p>
            </div>

            <div className="px-5 py-4 bg-white/20 border-t border-white/30 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 transition ${article.likedByCurrentUser ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                            }`}
                    >
                        <Heart
                            size={20}
                            fill={article.likedByCurrentUser ? 'currentColor' : 'none'}
                            className={article.likedByCurrentUser ? 'drop-shadow-sm' : ''}
                        />
                        <span className="text-sm font-medium">{article.likeCount}</span>
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition"
                    >
                        <MessageCircle size={20} />
                        <span className="text-sm font-medium">{article.comments?.length || 0}</span>
                    </button>
                </div>
            </div>

            {showComments && (
                <div className="p-5 bg-white/20 border-t border-white/30">
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {article.comments?.map((comment) => (
                            <div key={comment._id} className="flex space-x-3">
                                {comment.user?.profilePhoto ? (
                                    <img
                                        src={comment.user.profilePhoto}
                                        alt={comment.user.username}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                        <User size={14} />
                                    </div>
                                )}
                                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex-1">
                                    <p className="font-semibold text-xs text-gray-900 mb-1">
                                        {comment.user?.username || 'Unknown'}
                                    </p>
                                    <p className="text-gray-700 text-sm">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                        {article.comments?.length === 0 && (
                            <p className="text-center text-gray-400 text-sm py-2">No comments yet. Be the first!</p>
                        )}
                    </div>

                    <form onSubmit={handleComment} className="flex gap-2 relative">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="absolute right-1 top-1 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ArticleCard;
