import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'
import { useRouter } from 'next/router';
import { asHTML } from '@prismicio/helpers'
import * as RichText from '@prismicio/richtext'
import { useMemo } from 'react';


interface Post {
  first_publication_date: string | null;
  uid: string,
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: [];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>
  }

  const readTime = useMemo(() => {
    if (router.isFallback) {
      return 0;
    }

    const wordsPerMinute = 200;

    // Faz um reduce que pega todo o texto do post, desde o título até o body
    const contentWords = post.data.content.reduce(
      (summedContents, currentContent) => {

        const headingWords = currentContent.heading.split(/\s/g).length;


        const bodyText = RichText.asText(currentContent.body);
        const bodyWords = bodyText.split(/\s/g).length;

        return summedContents + headingWords + bodyWords;
      },
      0
    );

    const minutes = contentWords / wordsPerMinute;
    const totalReadTime = Math.ceil(minutes);

    return totalReadTime;
  }, [post, router.isFallback]);


  return (
    <article >

      <div className={styles.imageContainer}>
        <Image
          src={post.data.banner.url}
          layout='fill'
          className={styles.image}
        />
      </div>

      <div className={commonStyles.container}>
        <div className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={styles.info}>
            <time>
              <FiCalendar size={20} />
              {format(
                new Date(post.first_publication_date),
                "dd MMM yyyy",
                {
                  locale: ptBR
                }
              )}
            </time>
            <span><FiUser size={20} />{post.data.author}</span>
            <span><FiClock size={20} />{readTime} min</span>
          </div>

          <div className={styles.content}>
            {post.data.content.map(({ heading, body }) => {
              return (
                <div key={heading}>
                  <h2>{heading}</h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: asHTML(body) }}
                  />
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </article>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid
      }
    }
  })

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(params.slug), {});


  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body
        }
      }),
    }
  }

  return {
    props: {
      post,
    }
  }
};
