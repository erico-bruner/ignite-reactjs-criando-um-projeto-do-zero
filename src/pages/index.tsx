import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useState } from 'react';

import { getPrismicClient } from '../services/prismic';
import dateFormatter from '../utils/dateFormatter';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination: { results, next_page },
}: HomeProps): JSX.Element {
  const [nextPage, setNextPage] = useState(next_page);
  const [posts, setPosts] = useState(results);

  async function handleLoadMorePosts(): Promise<void> {
    await fetch(nextPage)
      .then(function (r) {
        r.json().then(resp => {
          const newPosts = [...posts];
          const morePosts = resp.results.map(post => {
            return {
              uid: post.uid,
              data: {
                title: post.data.title,
                subtitle: post.data.subtitle,
                author: post.data.author,
              },
              first_publication_date: post.first_publication_date,
            };
          });
          newPosts.push(...morePosts);
          setPosts(newPosts);
          setNextPage(resp.next_page);
        });
      })
      .catch(function (erro) {
        console.log(erro);
      });
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={`${styles.container} ${commonStyles.container}`}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a className={styles.post}>
                <h1>{post.data.title}</h1>
                <h2>{post.data.subtitle}</h2>
                <div>
                  <FiCalendar size="1.25rem" />
                  <time>{dateFormatter(post.first_publication_date)}</time>
                  <FiUser size="1.25rem" />
                  <strong>{post.data.author}</strong>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {nextPage ? (
          <button onClick={handleLoadMorePosts} type="button">
            Carregar mais posts
          </button>
        ) : (
          <></>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', { pageSize: 1 });
  const { next_page } = postsResponse;
  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
      first_publication_date: post.first_publication_date,
    };
  });

  return {
    props: {
      postsPagination: {
        results,
        next_page,
      },
    },
  };
};
