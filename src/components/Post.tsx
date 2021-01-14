import React, { useState, useEffect } from 'react';
import styles from './Post.module.css';
import { db } from '../util/firebase';
import firebase from 'firebase/app';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MessageIcon from '@material-ui/icons/Message';
import SendIcon from '@material-ui/icons/Send';
import { PostType } from '../types/PostType';
import { CommentType } from '../types/CommentType';

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

const Post: React.FC<PostType> = (props) => {
  const user = useSelector(selectUser);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<CommentType[]>([
    { id: '', avatar: '', text: '', timestamp: null, username: '' },
  ]);
  const [openComments, setOpenComments] = useState(false);
  const classes = useStyles();
  const { postId, avatar, image } = props;

  useEffect(() => {
    const unSub = () => {
      db.collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot(function (querySnapshot) {
          setComments(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              avatar: doc.data().avatar,
              text: doc.data().text,
              timestamp: doc.data().timestamp,
              username: doc.data().username,
            }))
          );
        });
    };
    return () => unSub();
  }, [postId]);

  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection('posts').doc(postId).collection('comments').add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
    });
    setComment('');
  };

  return (
    <div className={styles.post}>
      <div className={styles.post_avatar}>
        <Avatar src={avatar} />
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.post_headerUser}>@{props.username}</span>
              <span className={styles.post_headerTime}>
                {new Date(props.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
        </div>
        <div className={styles.post_tweet}>
          <p>{props.text}</p>
        </div>
        {image && (
          <div className={styles.post_tweetImage}>
            <img src={image} alt="avatar" />
          </div>
        )}
        <MessageIcon
          className={styles.post_commentIcon}
          onClick={() => setOpenComments(!openComments)}
        />
        {openComments && (
          <>
            {comments.map((com) => (
              <div key={com.id} className={styles.post_comment}>
                <Avatar src={com.avatar} className={classes.small} />

                <span className={styles.post_commentUser}>@{com.username}</span>
                <span className={styles.post_commentText}>{com.text} </span>
                <span className={styles.post_headerTime}>
                  {new Date(com.timestamp?.toDate()).toLocaleString()}
                </span>
              </div>
            ))}
            <form action="post" onSubmit={newComment}>
              <div className={styles.post_form}>
                <input
                  type="text"
                  className={styles.post_input}
                  placeholder="Type new Comment..."
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setComment(e.target.value)
                  }
                />
                <button
                  disabled={!comment}
                  className={
                    comment
                      ? styles.post_button
                      : styles.post_post_buttonDisable
                  }
                  type="submit"
                >
                  <SendIcon className={styles.post_commentIcon} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;