// inside your PostDetails return statement
<div className="button-group">
    {/* 1. Changed back to plural 'Upvotes' */}
    <button onClick={handleUpvote} className="upvote-btn">
        🔥 {post.upvotes || 0} Upvotes
    </button>
    
    {/* 2. FIX: Ensure this matches the route in App.jsx (e.g., /edit/:id) */}
    <Link to={`/edit/${id}`} className="edit-btn">✏️ Edit</Link>
    
    <button onClick={deletePost} className="delete-btn">🗑️ Delete</button>
</div>
