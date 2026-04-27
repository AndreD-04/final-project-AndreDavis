import { supabase } from './client'
import { useEffect, useState } from 'react'
import { Link, useRoutes } from 'react-router-dom';
import './App.css'

import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import EditPost from './pages/EditPost';

function App() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState('created_at'); 

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('hotTakes')
        .select()
        .order(orderBy, { ascending: false });
      if (data) setPosts(data);
    };
    fetchPosts();
  }, [orderBy]);

  const updateUpvotes = async (id, currentCount, e) => {
    e.preventDefault(); 
    const { error } = await supabase
      .from('hotTakes')
      .update({ upvotes: currentCount + 1 })
      .eq('id', id)
      .select();

    if (!error) {
      setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HomeFeed = (
    <div className="content-wrapper">
      <header className="header-section">
        <h1 className="hero-title">Hot Takes 🎬</h1>
        <p className="subtitle">The spiciest movie & TV opinions on the web.</p>
      </header>

      <section className="controls-panel">
        <input 
          type="text" 
          placeholder="Search takes by title..." 
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-group">
          <button 
            className={orderBy === 'created_at' ? 'btn-sort active' : 'btn-sort'} 
            onClick={() => setOrderBy('created_at')}
          >
            Newest
          </button>
          <button 
            className={orderBy === 'upvotes' ? 'btn-sort active' : 'btn-sort'} 
            onClick={() => setOrderBy('upvotes')}
          >
            Most Popular
          </button>
        </div>
      </section>

      <main className="feed-container">
        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id} className="post-anchor">
              <div className="post-card-aesthetic">
                <div className="card-header">
                  <span className="post-time-stamp">
                    {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <h2 className="post-title-text">{post.title}</h2>
                
                {post.content && <p className="post-excerpt">{post.content.substring(0, 120)}...</p>}

                <div className="post-card-meta">
                  <div className="meta-left">
                    <button className="upvote-pill-button" onClick={(e) => updateUpvotes(post.id, post.upvotes, e)}>
  🔥 {post.upvotes || 0} Upvotes
</button>
                    <span className="read-more">View Discussion →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-feed">
            <h2>No Hot Takes found. Be the first to post!</h2>
          </div>
        )}
      </main>
    </div>
  );

  let element = useRoutes([
    { path: "/", element: HomeFeed },
    { path: "/create", element: <CreatePost /> },
    { path: "/post/:id", element: <PostDetails /> },
    { path: "/edit/:id", element: <EditPost /> }
  ]);

  return (
    <div className="App">
      <nav className="navbar">
        <Link to="/" className="nav-link">Home Feed</Link>
        <Link to="/create" className="nav-link">Create Post</Link>
      </nav>
      <div className="main-viewport-content">
        {element}
      </div>
    </div>
  );
}

export default App;