import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';
import dateFormatter from '../../utils/dateFormatter';
import readingTimeGauge from '../../utils/readingTimeGauge';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const { isFallback } = useRouter();
  if (isFallback) {
    return <p className={commonStyles.container}>Carregando...</p>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>

      <main>
        <div className={styles.banner}>
          <Image
            src={post.data.banner.url}
            layout="intrinsic"
            height="400"
            width="1440"
          />
        </div>
        <article className={`${styles.post} ${commonStyles.container}`}>
          <h1>{post.data.title}</h1>
          <div className={styles.dataPost}>
            <FiCalendar size="1.25rem" color="var(--gray-150)" />
            <time>{dateFormatter(post.first_publication_date)}</time>
            <FiUser size="1.25rem" color="var(--gray-150)" />
            <strong>{post.data.author}</strong>
            <FiClock size="1.25rem" color="var(--gray-150)" />
            <strong>{readingTimeGauge(post.data.content)}</strong>
          </div>
          <div className={styles.postContent}>
            {post.data.content.map(element => (
              <>
                <h1>{element.heading}</h1>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(element.body),
                  }}
                />
              </>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', { pageSize: 1 });

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug));

  const post = {
    first_publication_date: response.first_publication_date,

    uid: response.uid,
    data: {
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content,
      title: response.data.title,
      subtitle: response.data.subtitle,
    },
  };
  return {
    props: {
      post,
    },
  };
};
