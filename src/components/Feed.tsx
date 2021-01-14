import React, { useState, useEffect } from 'react';
import TweetInput from './TweetInput';
import styles from './Feed.module.css';
import { db } from '../util/firebase';
import Post from './Post';
const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: '',
      avatar: '',
      image: '',
      text: '',
      timestamp: null,
      username: '',
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection('posts')
      .orderBy('createAt', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().photoUrl,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().createAt,
            username: doc.data().name,
          }))
        );
      });
    return () => unSub();
  }, []);
  return (
    <div className={styles.feed}>
      <TweetInput />
      {posts[0]?.id && (
        <>
          {posts.map((post, index) => {
            return (
              <Post
                key={index}
                postId={post.id}
                avatar={post.avatar}
                image={post.image}
                text={post.text}
                timestamp={post.timestamp}
                username={post.username}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default Feed;
