import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';
import commonStyles from '../styles/common.module.scss';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';

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

export default function Home({ postsPagination }: HomeProps) {

  const [posts, setPosts] = useState<PostPagination>(postsPagination);
  const hasNextPage = !!posts.next_page;

  async function handleLoadMore() {
    const posts = await fetch(postsPagination.next_page, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        return {
          next_page: data.next_page,

          results: data.results.map(result => {
            return {
              uid: result?.uid,
              first_publication_date: format(
                new Date(result.first_publication_date),
                "dd MMM yyyy",
                {
                  locale: ptBR
                }
              ),
              data: {
                title: result.data.title,
                subtitle: result.data.subtitle,
                author: result.data.author
              }
            }
          }),
        }
      });

    setPosts(oldState => {
      return {
        next_page: posts.next_page,
        results: [...oldState.results, ...posts.results]
      }
    });

  }

  return (

    <main className={commonStyles.container}>
      {posts.results.map(post => (
        <PostCard
          key={post.uid}
          author={post.data.author}
          subtitle={post.data.subtitle}
          title={post.data.title}
          time={post.first_publication_date}
          slug={post.uid}
        />
      ))}
      {hasNextPage &&
        <button
          className={styles.button}
          onClick={handleLoadMore}
          type='button'
        >
          Carregar mais posts
        </button>}

    </main>
  )
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const prismic = getPrismicClient(previewData);
  const postsResponse = await prismic.getByType('posts');

  const postsPagination = {
    next_page: postsResponse.next_page,

    results: postsResponse.results.map(result => {
      return {
        uid: result?.uid,
        first_publication_date: format(
          new Date(result.first_publication_date),
          "dd MMM yyyy",
          {
            locale: ptBR
          }
        ),
        data: {
          title: result.data.title,
          subtitle: result.data.subtitle,
          author: result.data.author
        }
      }
    }),
  }

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 60 * 24 * 3 //3 dias
  }
};
