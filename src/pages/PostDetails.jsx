import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase.from('hotTakes').select().eq('id', id).single();
            setPost(data);
        };

        const fetchComments = async () => {
            const { data } = await supabase
                .from('comments')
                .select()
                .eq('post_id', id)
                .order('created_at', { ascending: true });
            setComments(data || []);
        };

        fetchPost();
        fetchComments();
    }, [id]);

    const handleUpvote = async () => {
        const { error } = await supabase
            .from('hotTakes')
            .update({ upvotes: (post.upvotes || 0) + 1 })
            .eq('id', id);

        if (!error) {
            setPost({ ...post, upvotes: (post.upvotes || 0) + 1 });
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        const { data, error } = await supabase
            .from('comments')
            .insert([{ post_id: id, text: newComment }])
            .select();

        if (!error) {
            setComments([...comments, data[0]]);
            setNewComment("");
        }
    };

    const deletePost = async () => {
        const { error } = await supabase.from('hotTakes').delete().eq('id', id);
        if (!error) {
            navigate('/'); 
        }
    };

    if (!post) return <div className="PostDetails-container"><h1>Loading...</h1></div>;

    return (
        <div className="PostDetails-container">
            <div className="detail-card">
                <span className="post-time-stamp">🎬 POSTED {new Date(post.created_at).toLocaleDateString()}</span>
                <h1>{post.title}</h1>
                <p className="post-description">{post.content}</p>
                {post.image_url && <img src={post.image_url} alt="post" className="post-detail-image" />}
                
                <div className="button-group">
                    <button onClick={handleUpvote} className="upvote-btn">🔥 {post.upvotes || 0} Upvotes</button>
                    <Link to={`/edit/${id}`} className="edit-btn">✏️ Edit</Link>
                    <button onClick={deletePost} className="delete-btn">🗑️ Delete</button>
                </div>

                <div className="discussion-section">
                    <h2>Discussion 💬</h2>
                    <div className="comments-list">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className="comment-bubble">
                                    <p>{comment.text}</p>
                                    <span className="comment-date">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">No one has weighed in yet. Be the first!</p>
                        )}
                    </div>
                    
                    <form onSubmit={handleAddComment} className="comment-form">
                        <input 
                            type="text" 
                            placeholder="Leave a comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="comment-submit-btn">Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostDetails;