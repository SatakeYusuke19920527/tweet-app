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
import { DirectionsBusTwoTone } from '@material-ui/icons';

const Post: React.FC<PostType> = (props) => {
  const { postId, avatar, image, text, timestamp, username } = props;
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
            <img src={image} alt="image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
